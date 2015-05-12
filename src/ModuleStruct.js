var babel = require('babel-core');
var jade = require('jade');
var path = require('path');

function babelTransform(codeStr) {
  return babel.transform(codeStr).code;
}

var transforms = {
  js: function (code) { return code; },
  es6: babelTransform,
  jade: function (jadeStr) {
    return 'module.exports = \'' + jade.render(jadeStr, {}) + '\';';
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
    code: transforms[this.ext](this.code)
  };
  return this.transformed.code;
};

module.exports = ModuleStruct;
