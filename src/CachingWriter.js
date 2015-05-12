var R = require('ramda');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var FileCache = require('./Cache');
var StringUtils = require('./utils/StringUtils');
var indent = StringUtils.indent, unindent = StringUtils.unindent;

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
    groups[cacheLines[currentMatch[1]].path] = {
      hash: cacheLines[currentMatch[1]].hash,
      index: currentMatch[1],
      code: currentMatch[2]
    };
  }

  this.groups = groups;
  return groups;
};



CachingWriter.prototype.writeModules = function (targets, modules) {
  // console.log(targets, R.keys(this.groups));
  var me = this;
  var inorderPositionMap = R.invertObj(R.map(R.path(['module', 'path']), modules));

  var cacheInfo = [];
  var totalCode = '';
  var orderedCode = modules.map(function (node, inorderPos) {
    cacheInfo.push(inorderPos + ' ' + node.module.path + ' ' + node.module.hash);
    if (me.groups[node.module.path] && (me.groups[node.module.path].hash == node.module.hash)) {
      return unindent(me.groups[node.module.path].code, 4);
    }
    var matchNum = 0;
    var transformed = node.module.transform();
    var replaced = node.requires.length > 0 ? transformed.replace(requireRegex, function (match, capture) {
      // console.log(match, capture);
      var depInorderPosition = inorderPositionMap[node.requires[matchNum][1]];
      matchNum += 1;
      return '__tarp_require(' + depInorderPosition + ')';
    }) : transformed;
    return indent(replaced, 2);
  }).map(function (code, inorderPos) {
    var noRequires = modules[inorderPos].module.path.indexOf('vendor') >= 0 ? '' : 'module';
    return '(function (' + noRequires + ') {\n  \/*- tarp-cache-$START ' + inorderPos +
          ' -*/\n' + code + '\n  /*- tarp-cache-$END ' + inorderPos + ' -*/\n}).bind(__this)';
  }).join(',\n\n');
  var loaderTemplate = _.template(FileCache.loaderCode);
  var finalCode =  'var __tarp_code = [\n' + indent(orderedCode, 2) + '\n];\n';
  finalCode += R.pluck('path', targets).map(function (path) { return '__tarp_require(' + inorderPositionMap[path] + ');';}).join('\n');
  var cacheHeaderComment = '/* TARP-HEADER \n' + cacheInfo.length + '\n' + cacheInfo.join('\n') + '\nTARP-HEADER */\n';
  return cacheHeaderComment + loaderTemplate({code: indent(finalCode, 2)});
};

var writers = {};


module.exports = CachingWriter;
