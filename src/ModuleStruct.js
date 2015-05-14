var babel = require('babel-core');
var jade = require('jade');
var path = require('path');
var sass = require('node-sass');
var R = require('ramda');
var {SourceNode, SourceMapConsumer} = require('source-map');

function babelTransform(_module) {
  var transformed = babel.transform(_module.code, {
    sourceMaps: true,
    sourceFileName: _module.path
  });
  return transformed;
}

var transforms = {
  js: function (_module) { return {
    code: _module.code
  }},
  es6: babelTransform,
  jade: function (_module) {
    return {
      code: 'module.exports = \'' + jade.render(_module.code, {}).split('\n').join('\\n').replace(/'/g, "\\'") + '\';'
    };
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
