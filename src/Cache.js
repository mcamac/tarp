var fs = require('fs');
var path = require('path');
var babel = require('babel-core');

var ModuleStruct = require('./ModuleStruct');

var FileCache = function (opts) {
  this.cache = {};
};

function babelTransform(codeStr) {
  return babel.transform(codeStr).code;
}

FileCache.prototype.getModule = function (path) {
  if (!this.cache[path]) {
    var codeStr = fs.readFileSync(path).toString();
    this.cache[path] = new ModuleStruct(path, babelTransform(codeStr));
  }
  return this.cache[path];
};

FileCache.prototype.invalidate = function (path) {
  if (this.cache[path]) {
    delete this.cache[path];
  }
};

var fileCache = new FileCache();

fileCache.loaderCode = fs.readFileSync(path.resolve(__dirname, 'Loader.js')).toString();

module.exports = fileCache;
