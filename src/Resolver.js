var fs = require('fs');
var R = require('ramda');
var path = require('path');

var FileCache = require('Cache');

var Resolver = function (opts) {
  this.opts = opts;
};

Resolver.prototype.resolve = function (modulePath) {
  // Local modules - search from this.opts.root
  for (var i = 0; i < this.opts.ext.length; i++) {
    var pathToTry = path.resolve(this.opts.root, modulePath + this.opts.ext[i]);
    if (fs.existsSync(pathToTry)) {
      return new FileCache.getModule(pathToTry));
    }
  }

  // Node modules.

};
