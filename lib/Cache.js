"use strict";

var fs = require("fs");
var path = require("path");

var ModuleStruct = require("./ModuleStruct");

var FileCache = function FileCache() {
  this.cache = {};
};

/**
 * Load module from cache, falling back to filesystem if not found.
 * @param  string path
 */
FileCache.prototype.getModule = function (path) {
  if (!this.cache[path]) {
    var mtime = fs.statSync(path).mtime;
    this.cache[path] = new ModuleStruct(path, mtime);
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

fileCache.loaderCode = fs.readFileSync(path.resolve(__dirname, "Loader.js.tpl")).toString();

module.exports = fileCache;