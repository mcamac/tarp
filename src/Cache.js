var fs = require('fs');

var ModuleStruct = require('./ModuleStruct');

var FileCache = function (opts) {
  this.cache = {};
};

FileCache.prototype.getSync = function (path) {
  if (!this.cache[path]) {
    this.cache[path] = fs.readFileSync(path);
  }
  return ModuleStruct(path, this.cache[path]);
};

FileCache.prototype.invalidate = function (path) {
  if (this.cache[path]) {
    delete this.cache[path];
  }
};

var fileCache = new FileCache();

module.exports = fileCache;
