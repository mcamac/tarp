var R = require('ramda');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var {SourceNode, SourceMapConsumer, SourceMapGenerator} = require('source-map');

var FileCache = require('./Cache');
var {indent, unindent} = require('./utils/StringUtils');

var CachingWriter = function (path) {
  this.path = path;
  this.groups = {};
  this.loadCacheInfoFromFs();
}

var cacheRegex = /\/\*- tarp-cache-\$START (\d+) -\*\/\n([\s\S]*)\n *\/\*- tarp-cache-\$END \1 -\*\//g;
var requireRegex = /require\(['"]([\w\.\-\/_]*)['"]\)/g;

function getCacheLines(lines, totalChunks) {
  var cacheLines = lines.slice(2, 2 + totalChunks)
    .map(function (line) { return line.split(' '); })
    .map(function (line) { return [line[0], {path: line[1], hash: line[2], mtime: line[3]}]; });
  return R.fromPairs(cacheLines);
}

CachingWriter.prototype.loadCacheInfoFromFs = function () {
  if (!fs.existsSync(this.path)) {
    return this.groups;
  }

  var src = fs.readFileSync(this.path).toString();

  // Extract cache information (module paths and hashes) from header comment/
  var totalChunks = parseInt(src.split('\n', 2)[1], 10);
  var cacheCommentLines = src.split('\n', totalChunks + 2);
  var cacheData = getCacheLines(cacheCommentLines, totalChunks);

  // Gather existing module code from rest of source.
  this.groups = {};
  var currentMatch;
  while ((currentMatch = cacheRegex.exec(src)) !== null) {
    // Match object: 1 - module index, 2 - module code
    var codeLines = currentMatch[2].split('\n');
    var firstLine = codeLines[0];
    this.groups[cacheData[currentMatch[1]].path] = {
      hash: cacheData[currentMatch[1]].hash,
      mtime: cacheData[currentMatch[1]].mtime,
      index: currentMatch[1],
      map: JSON.parse(firstLine.trim().slice(3, -3)),
      code: codeLines.slice(1).join('\n')
    };
  }

  return this.groups;
};

CachingWriter.prototype.writeModules = function (entryModules, modules) {
  var inorderPositionMap = R.invertObj(R.map(R.path(['module', 'path']), modules));
  var cacheHeaderRows = [];

  var cacheInfo = {};

  var orderedSourceNodes = modules.map((node, inorderPos) => {
    cacheHeaderRows.push([inorderPos, node.module.path, node.module.hash, node.module.mtime].join(' '));
    cacheInfo[node.module.path] = {
      mtime: node.module.mtime,
      index: inorderPos
    };
    if (this.groups[node.module.path] && (this.groups[node.module.path].mtime == node.module.mtime)) {
      var cachedModule = this.groups[node.module.path];
      return SourceNode.fromStringWithSourceMap(
        cachedModule.code, new SourceMapConsumer(cachedModule.map));
    }

    console.log('changed'.red)
    var time = new Date().getTime();
    var transformedModule = node.module.transform();
    console.log('comp time'.red, new Date().getTime() - time, node.module.path);
    var codeWithTarpRequires = transformedModule.code;
    if (node.requires.length > 0) {
      codeWithTarpRequires = transformedModule.code.replace(requireRegex, (match, capture) => {
        var matchingRequire = R.find(nr => nr[0].group === capture, node.requires);
        if (matchingRequire) {
          var depInorderPosition = inorderPositionMap[matchingRequire[1]];
          return `__tarp_require(${depInorderPosition})`;
        }
        // TODO: throw error here - module was not found.
        return 'undefined';
      })
    }

    if (transformedModule.map) {
      return SourceNode.fromStringWithSourceMap(
        codeWithTarpRequires, new SourceMapConsumer(transformedModule.map));
    } else {
      var sn = new SourceNode(null, null, node.module.path);
      codeWithTarpRequires.split('\n')
        .forEach((line, i) => sn.add(new SourceNode(i + 1, 0, node.module.path, line + '\n')));
      sn.setSourceContent(node.module.path, node.module.code);
      return sn;
    }
  }).map(function (node, inorderPos) {
    // Wrap module code in comments with sourcemap and module boundary.
    var sourceMap = node.toStringWithSourceMap().map.toString();
    // TODO: Make this a regex.
    var moduleArgs = modules[inorderPos].module.path.indexOf('vendor') >= 0 ? '' : 'module';
    node.prepend(`\/\/ ${sourceMap} */\n`);
    node.prepend(
      `(function (${moduleArgs}) {\n` +
      '\/*- tarp-cache-$START ' + inorderPos + ' -*/\n');
    node.add('\n/*- tarp-cache-$END ' + inorderPos + ' -*/\n}).bind(__this)');
    return node;
  });

  // Join each module closure.
  var joinedModulesNode = new SourceNode();
  orderedSourceNodes.forEach(node => joinedModulesNode.add(node));
  joinedModulesNode.join(',\n\n');

  // Build output file.
  var outputNode = new SourceNode();
  var cacheHeaderCommentStr = [
    '/* TARP-HEADER',
    cacheHeaderRows.length,
    cacheHeaderRows.join('\n'),
    'TARP-HEADER */\n'].join('\n');
  outputNode.add(cacheHeaderCommentStr);
  outputNode.add(FileCache.loaderCode);
  outputNode.add('var __tarp_code = [\n')
  outputNode.add(joinedModulesNode);
  outputNode.add('\n];\n');
  // Add top-level require statements for target modules.
  R.pluck('path', entryModules).forEach((path) => outputNode.add(`__tarp_require(${inorderPositionMap[path]});\n`));
  outputNode.add('\n}(this));');

  return {
    rebuild: true,
    code: outputNode.toString(),
    map: outputNode.toStringWithSourceMap().map.toString(),
    cacheInfo: {
      entryModules: R.pluck('path', entryModules),
      modules: cacheInfo
    }
  };
};

var writers = {};


module.exports = CachingWriter;
