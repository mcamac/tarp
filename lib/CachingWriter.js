"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var R = require("ramda");
var fs = require("fs");
var path = require("path");
var _ = require("lodash");

var _require = require("source-map");

var SourceNode = _require.SourceNode;
var SourceMapConsumer = _require.SourceMapConsumer;
var SourceMapGenerator = _require.SourceMapGenerator;

var FileCache = require("./Cache");

var CachingWriter = function CachingWriter(target) {
  this.target = target;
  this.groups = {};
  this.loadCacheInfoFromFs();
};

var cacheRegex = /\/\*- tarp-cache-\$START ([^ ]+) -\*\/\n([\s\S]*)\n *\/\*- tarp-cache-\$END \1 -\*\//g;
var requireRegex = /require\(['"]([\w\.\-\/_]*)['"]\)/g;

function getCacheLines(lines, totalChunks) {
  var cacheLines = lines.slice(2, 2 + totalChunks).map(function (line) {
    return line.split(" ");
  }).map(function (line) {
    return [line[0], { path: line[1], hash: line[2], mtime: line[3] }];
  });
  return R.fromPairs(cacheLines);
}

CachingWriter.prototype.loadCacheInfoFromFs = function () {
  if (!fs.existsSync(this.target.filePath) || !fs.existsSync(this.target.cachePath)) {
    return this.groups;
  }

  var src = fs.readFileSync(this.target.filePath).toString();
  var cacheJson = JSON.parse(fs.readFileSync(this.target.cachePath).toString());
  this.groups = cacheJson.modules;

  // Gather existing module code from rest of source.
  var currentMatch;
  while ((currentMatch = cacheRegex.exec(src)) !== null) {
    // Match object: 1 - module path, 2 - module code

    var _currentMatch = _slicedToArray(currentMatch, 3);

    var modulePath = _currentMatch[1];
    var moduleCode = _currentMatch[2];

    var codeLines = moduleCode.split("\n");
    var firstLine = codeLines[0];
    _.assign(this.groups[modulePath], {
      map: JSON.parse(firstLine.trim().slice(3, -3)),
      code: codeLines.slice(1).join("\n")
    });
  }

  return this.groups;
};

CachingWriter.prototype.writeModules = function (entryModules, modules) {
  var _this = this;

  var inorderPositionMap = R.invertObj(R.pluck("path", modules));
  var cacheHeaderRows = [];

  var cacheInfo = {};

  var orderedSourceNodes = modules.map(function (depModule, inorderPos) {
    cacheHeaderRows.push([inorderPos, depModule.path, depModule.hash, depModule.mtime].join(" "));
    cacheInfo[depModule.path] = {
      mtime: depModule.mtime,
      index: inorderPos
    };
    if (_this.groups[depModule.path] && _this.groups[depModule.path].mtime == depModule.mtime) {
      var cachedModule = _this.groups[depModule.path];
      return SourceNode.fromStringWithSourceMap(cachedModule.code, new SourceMapConsumer(cachedModule.map));
    }

    var time = new Date().getTime();
    var transformedModule = depModule.transform();
    // console.log('comp time'.red, new Date().getTime() - time, depModule.path);
    var codeWithTarpRequires = transformedModule.code;
    if (depModule.requires.length > 0) {
      codeWithTarpRequires = transformedModule.code.replace(requireRegex, function (match, capture) {
        var matchingRequire = R.find(function (nr) {
          return nr[0].group === capture;
        }, depModule.requires);
        if (matchingRequire) {
          var depInorderPosition = inorderPositionMap[matchingRequire[1]];
          return "__tarp_require(" + depInorderPosition + ")";
        }
        // TODO: throw error here - module was not found.
        return "undefined";
      });
    }

    if (transformedModule.map) {
      return SourceNode.fromStringWithSourceMap(codeWithTarpRequires, new SourceMapConsumer(transformedModule.map));
    } else {
      var sn = new SourceNode(null, null, depModule.path);
      codeWithTarpRequires.split("\n").forEach(function (line, i) {
        return sn.add(new SourceNode(i + 1, 0, depModule.path, line + "\n"));
      });
      sn.setSourceContent(depModule.path, depModule.code);
      return sn;
    }
  }).map(function (node, inorderPos) {
    // Wrap module code in comments with sourcemap and module boundary.
    var sourceMap = node.toStringWithSourceMap().map.toString();
    // TODO: Make this a regex.
    var moduleArgs = modules[inorderPos].path.indexOf("vendor") >= 0 ? "" : "module";
    node.prepend("// " + sourceMap + " */\n");
    node.prepend("(function (" + moduleArgs + ") {\n" + "/*- tarp-cache-$START " + modules[inorderPos].path + " -*/\n");
    node.add("\n/*- tarp-cache-$END " + modules[inorderPos].path + " -*/\n}).bind(__this)");
    return node;
  });

  // Join each module closure.
  var joinedModulesNode = new SourceNode();
  orderedSourceNodes.forEach(function (node) {
    return joinedModulesNode.add(node);
  });
  joinedModulesNode.join(",\n\n");

  // Build output source node.
  var outputNode = new SourceNode();
  var cacheHeaderCommentStr = ["/* TARP-HEADER", cacheHeaderRows.length, cacheHeaderRows.join("\n"), "TARP-HEADER */\n"].join("\n");
  outputNode.add(FileCache.loaderCode);
  outputNode.add("var __tarp_code = [\n");
  outputNode.add(joinedModulesNode);
  outputNode.add("\n];\n");
  // Add top-level require statements for target modules.
  R.pluck("path", entryModules).forEach(function (path) {
    return outputNode.add("__tarp_require(" + inorderPositionMap[path] + ");\n");
  });
  outputNode.add("\n}(this));");

  return {
    rebuild: true,
    code: outputNode.toString(),
    map: outputNode.toStringWithSourceMap().map.toString(),
    cacheInfo: {
      entryModules: R.pluck("path", entryModules),
      modules: cacheInfo
    }
  };
};

var writers = {};

module.exports = CachingWriter;