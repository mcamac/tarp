"use strict";

var path = require("path");

function Target(target, entryModules, outputPath) {
  this.target = target;
  this.entryModules = entryModules;
  this.filePath = path.resolve(outputPath, target);
  this.cachePath = this.filePath + ".tarp";
}

module.exports = Target;