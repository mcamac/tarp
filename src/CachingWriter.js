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
}

var cacheRegex = /\/\*- tarp-cache-\$START (\d+) -\*\/\n([\s\S]*)\n *\/\*- tarp-cache-\$END \1 -\*\//g;
var requireRegex = /require\(['"]([\w\.\-\/_]*)['"]\)/g;

function getCacheLines(lines) {
  var totalChunks = parseInt(lines[1], 10);
  var cacheLines = lines.slice(2, 2 + totalChunks)
    .map(function (line) { return line.split(' '); })
    .map(function (line) { return [line[0], {path: line[1], hash: line[2]}]; });
  return R.fromPairs(cacheLines);
}

CachingWriter.prototype.loadCacheInfoFromFs = function () {
  if (!fs.existsSync(this.path)) {
    return this.groups;
  }

  var src = fs.readFileSync(this.path).toString();
  var srcLines = src.split('\n');

  var cacheLines = getCacheLines(srcLines);

  var groups = {};
  var currentMatch;
  while ((currentMatch = cacheRegex.exec(src)) !== null) {
    // console.log('adfasdfdas', JSON.parse(currentMatch[2].split('\n')[0].trim().slice(3, -3)));
    groups[cacheLines[currentMatch[1]].path] = {
      hash: cacheLines[currentMatch[1]].hash,
      index: currentMatch[1],
      map: JSON.parse(currentMatch[2].split('\n')[0].trim().slice(3, -3)),
      code: currentMatch[2].split('\n').slice(1).join('\n')
    };
  }

  this.groups = groups;
  return groups;
};

CachingWriter.prototype.writeModules = function (targets, modules) {
  var me = this;
  var inorderPositionMap = R.invertObj(R.map(R.path(['module', 'path']), modules));
  var cacheInfo = [];
  var totalCode = '';

  var orderedCode = modules.map(function (node, inorderPos) {
    cacheInfo.push(inorderPos + ' ' + node.module.path + ' ' + node.module.hash);
    if (me.groups[node.module.path] && (me.groups[node.module.path].hash == node.module.hash)) {
      return SourceNode.fromStringWithSourceMap(
        me.groups[node.module.path].code, new SourceMapConsumer(me.groups[node.module.path].map));
    }

    var transformed = node.module.transform();
    var replaced = node.requires.length > 0 ? transformed.code.replace(requireRegex, function (match, capture) {
      // console.log(match, capture, node.requires);
      var matchingRequire = R.find(nr => nr[0].group === capture, node.requires);
      if (matchingRequire) {
        var depInorderPosition = inorderPositionMap[matchingRequire[1]];
        return '__tarp_require(' + depInorderPosition + ')';
      }
      return 'undefined';
    }) : transformed.code;
    if (transformed.map) {
      return SourceNode.fromStringWithSourceMap(replaced, new SourceMapConsumer(transformed.map));
    } else {
      var sn = new SourceNode(null, null, node.module.path);
      replaced.split('\n').forEach((line, i) => sn.add(new SourceNode(i + 1, 0, node.module.path, line + '\n')));
      sn.setSourceContent(node.module.path, node.module.code);
      return sn;
    }
  }).map(function (node, inorderPos) {
    var sourceMap = node.toStringWithSourceMap().map.toString();

    var noRequires = modules[inorderPos].module.path.indexOf('vendor') >= 0 ? '' : 'module';
    node.prepend('// ' + sourceMap + ' */\n');
    node.prepend('(function (' + noRequires + ') {\n\/*- tarp-cache-$START ' + inorderPos +
          ' -*/\n');
    node.add('\n/*- tarp-cache-$END ' + inorderPos + ' -*/\n}).bind(__this)');
    return node;
  });

  var codeNode = new SourceNode();
  orderedCode.forEach(node => codeNode.add(node));
  codeNode.join(',\n\n');

  var outputNode = new SourceNode();
  var cacheHeaderComment = '/* TARP-HEADER \n' + cacheInfo.length + '\n' + cacheInfo.join('\n') + '\nTARP-HEADER */\n';
  outputNode.add(cacheHeaderComment);
  outputNode.add(FileCache.loaderCode);
  outputNode.add('var __tarp_code = [\n')
  outputNode.add(codeNode);
  outputNode.add('\n];\n');
  R.pluck('path', targets).forEach((path) => outputNode.add('__tarp_require(' + inorderPositionMap[path] + ');\n'));
  outputNode.add('\n}(this));');

  return {
    code: outputNode.toString(),
    map: outputNode.toStringWithSourceMap().map.toString()
  };
  // var finalCode =  'var __tarp_code = [\n' + indent(orderedCode, 2) + '\n];\n';
  // return cacheHeaderComment + loaderTemplate({code: indent(finalCode, 2)});
};

var writers = {};


module.exports = CachingWriter;
