"use strict";

var fs = require("fs");
var R = require("ramda");
var path = require("path");

var FileCache = require("./Cache");

var Resolver = function Resolver(opts) {
  this.opts = opts;
};

/**
 * Resolve local module according to relative path or path from config root directory.
 */
Resolver.prototype.resolve = function (parentPath, modulePath) {
  // Relative paths.
  if (modulePath.slice(0, 3) === "../" || modulePath.slice(0, 2) == "./") {
    for (var i = 0; i < this.opts.ext.length; i++) {
      var pathToTry = path.resolve(path.dirname(parentPath), modulePath + this.opts.ext[i]);
      if (fs.existsSync(pathToTry)) {
        return FileCache.getModule(pathToTry);
      }
    }
  }
  // Local modules - search from this.opts.root
  for (var i = 0; i < this.opts.ext.length; i++) {
    var pathToTry = path.resolve(this.opts.root, modulePath + this.opts.ext[i]);
    if (fs.existsSync(pathToTry)) {
      return FileCache.getModule(pathToTry);
    }
  }

  // TODO: Node modules.
};

/**
 * Helper method for resolving many paths from the same parent path.
 */
Resolver.prototype.resolveMany = function (parentPath, modulePaths) {
  var _this = this;

  return modulePaths.map(function (modulePath) {
    return _this.resolve(parentPath, modulePath);
  });
};

module.exports = Resolver;