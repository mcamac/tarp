"use strict";

var babel = require("babel-core");
var jade = require("jade");
var path = require("path");
var sass = require("node-sass");
var R = require("ramda");
var fs = require("fs");
var stringHash = require("string-hash");

var _require = require("source-map");

var SourceNode = _require.SourceNode;
var SourceMapConsumer = _require.SourceMapConsumer;

var isparta = require("isparta");
var instrumenter = new isparta.Instrumenter({
  embedSource: true,
  noAutoWrap: true
});

/**
 * JS transform - noop.
 */
function jsTransform(_module) {
  return {
    code: _module.code
  };
}

/**
 * Use the Babel transformer with sourcemaps.
 */
function babelTransform(_module) {
  var time = new Date().getTime();
  var transformed = babel.transform(_module.code, {
    sourceMaps: true,
    sourceFileName: _module.path
  });
  console.log("babel time".red, new Date().getTime() - time, _module.path);
  return transformed;
}

/**
 * Compile jade and escape newlines so that output remains on a single line.
 */
function jadeTransform(_module) {
  return {
    code: "module.exports = '" + jade.render(_module.code, {}).split("\n").join("\\n").replace(/'/g, "\\'") + "';"
  };
}

var transformForExtension = {
  js: jsTransform,
  es6: babelTransform,
  jade: jadeTransform
};

/** Storage mechanism for code modules, containing contents, path, and hash metadata. */
function ModuleStruct(mpath, mtime, code, hash) {
  this.path = mpath;
  this.ext = path.extname(mpath).slice(1);
  this.code = code;
  this.hash = hash;
  this.mtime = new Date(mtime).toISOString();
};

/**
 * Loads module code from filesystem and computes string hash.
 */
ModuleStruct.prototype.loadCodeFromFs = function () {
  if (!this.code || !this.hash) {
    console.log("loading code", this.path.blue);
    this.code = fs.readFileSync(this.path).toString();
    this.hash = stringHash(this.code);
  }
};

/**
 * Applies transforms to module code according to file extension.
 */
ModuleStruct.prototype.transform = function () {
  if (this.transformed && this.hash === this.transformed.hash) {
    return this.transformed.codeAndMap;
  }

  this.transformed = {
    hash: this.hash,
    codeAndMap: transformForExtension[this.ext](this)
  };
  return this.transformed.codeAndMap;
};

module.exports = ModuleStruct;