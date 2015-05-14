var fs = require('fs');
var path = require('path');
var stringHash = require('string-hash');

var ModuleStruct = require('./ModuleStruct');

var FileCache = function () {
  this.cache = {};
};

/**
 * Load module from cache, falling back to filesystem if not found.
 * @param  string path
 */
FileCache.prototype.getModule = function (path) {
  if (!this.cache[path]) {
    var codeStr = fs.readFileSync(path).toString();
    this.cache[path] = new ModuleStruct(path, codeStr, stringHash(codeStr));
  }
  return this.cache[path];
};

/**
 * Invalidate a path within the file cache.
 * @param  string path
 */
FileCache.prototype.invalidate = function (path) {
  if (this.cache[path]) {
    delete this.cache[path];
  }
};

var fileCache = new FileCache();

fileCache.loaderCode = fs.readFileSync(path.resolve(__dirname, 'Loader.js')).toString();

module.exports = fileCache;
