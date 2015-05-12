var R = require('ramda');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var StringUtils = require('./utils/StringUtils');
var indent = StringUtils.indent, unindent = StringUtils.unindent;

var CSSWriter = function (path) {
  this.path = path;
  this.groups = {};
}

CSSWriter.prototype.loadCacheInfoFromFs = function () {};

CSSWriter.prototype.writeModules = function (targets, modules) {
  // No caching right now.
  return R.map(function (target) { return target.transform(); }, targets).join('\n');
};

module.exports = CSSWriter;
