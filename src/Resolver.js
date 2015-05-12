var fs = require('fs');
var R = require('ramda');
var path = require('path');

var FileCache = require('./Cache');

var Resolver = function (opts) {
  this.opts = opts;
};

Resolver.prototype.resolve = function (parentPath, modulePath) {
  // Relative paths.
  if (modulePath.slice(0, 3) === '../' || modulePath.slice(0, 2) == './') {

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
    // console.log('resolve', modulePath, parentPath)
    if (fs.existsSync(pathToTry)) {
      return FileCache.getModule(pathToTry);
    }
  }

  // Node modules.

};

module.exports = Resolver;
