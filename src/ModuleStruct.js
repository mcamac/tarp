var babel = require('babel-core');
var jade = require('jade');
var path = require('path');
var sass = require('node-sass');
var R = require('ramda');

function babelTransform(_module) {
  return babel.transform(_module.code).code;
}

var BASE_DIR = '/Users/martin/code/zentreefish';
var SASS_INCLUDES = [
  path.resolve(BASE_DIR, 'assets/vendor/compass-mixins'),
  path.resolve(BASE_DIR, 'assets/core/css/kui')];
console.log(SASS_INCLUDES);

var transforms = {
  js: function (_module) { return _module.code; },
  css: function (_module) { return _module.code; },
  es6: babelTransform,
  jade: function (_module) {
    return 'module.exports = \'' + jade.render(_module.code, {}) + '\';';
  },
  scss: function(_module) {
    // var relevantSassIncludes = R.filter(function (includePath) { return _module.path.indexOf(includePath) === -1; }, SASS_INCLUDES);
    return sass.renderSync({ file: _module.path, includePaths: SASS_INCLUDES }).css.toString();
  }
}


var ModuleStruct = function (mpath, code, hash) {
  this.path = mpath;
  this.ext = path.extname(mpath).slice(1);
  this.code = code;
  this.hash = hash;
};

ModuleStruct.prototype.transform = function () {
  if (this.transformed && this.hash === this.transformed.hash) {
    return this.transformed.code;
  }
  this.transformed = {
    hash: this.hash,
    code: transforms[this.ext](this)
  };
  return this.transformed.code;
};

module.exports = ModuleStruct;
