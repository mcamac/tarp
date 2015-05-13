var R = require('ramda');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var {indent, unindent} = require('./utils/StringUtils');
var CachingWriter = require('./CachingWriter');

var CSSWriter = function (path) {
  this.path = path;
  this.groups = {};
}

var cacheRegex = /\/\*- tarp-cache-\$START (\d+) -\*\/\n([\s\S]*)\n *\/\*- tarp-cache-\$END \1 -\*\//g;

function getCacheLines(lines) {
  var totalChunks = parseInt(lines[1], 10);
  var cacheLines = lines.slice(2, 2 + totalChunks)
    .map(function (line) { return line.split(' '); })
    .map(function (line) { return [line[0], {path: line[1], hash: line[2]}]; });
  return R.fromPairs(cacheLines);
}

CSSWriter.prototype.loadCacheInfoFromFs = function () {
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


function wrap(code, pos) {
  return '\/*- tarp-cache-$START ' + pos +
          ' -*/\n' + code + '\n/*- tarp-cache-$END ' + pos + ' -*/';
}

CSSWriter.prototype.writeModules = function (targets, modules) {
  // No caching right now.
  var cacheHeader = '/* TARP-HEADER\n' + targets.length + '\n' + R.mapIndexed(function (target, i) {
    return [i, target.path, target.hash].join(' ');
  }, targets).join('\n') + '\n*/\n';
  var me = this;
  var concatCode = R.mapIndexed(function (target, pos) {
    var code = me.groups[target.path] && (me.groups[target.path].hash == target.hash) ? me.groups[target.path].code : target.transform();
    return wrap(code, pos);
  }, targets).join('\n');
  return cacheHeader + concatCode;
};

module.exports = CSSWriter;
