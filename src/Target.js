var path = require('path');

/**
 * Represents a build target consisting of an output filename and a list of entry modules.
 */
function Target(target, entryModules, outputPath) {
  this.target = target;
  this.entryModules = entryModules;
  this.filePath = path.resolve(outputPath, target);
  this.cachePath = this.filePath + '.tarp';
}

module.exports = Target;
