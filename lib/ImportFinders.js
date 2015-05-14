"use strict";

// TODO: add lookbehind.
var requireRegex = /require\(['"]([\w\.\-\/_]*)['"]\)/g;

// Finds all require statements within src.
/**
 * Finds all require statements within given code.
 */
function findRequires(sourceCode) {
  var groups = [];
  var currentMatch;
  while ((currentMatch = requireRegex.exec(sourceCode)) !== null) {
    groups.push({
      complete: currentMatch[0],
      group: currentMatch[1]
    });
  }
  return groups;
}

module.exports = {
  findRequires: findRequires
};