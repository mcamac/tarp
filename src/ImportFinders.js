// TODO: add lookbehind.
var requireRegex = /require\(['"]([\w\.\-\/_]*)['"]\)/g;

// Finds all require statements within src.
function findRequires(src) {
  var groups = [];
  var currentMatch;
  while ((currentMatch = requireRegex.exec(src)) !== null) {
    groups.push({
      complete: currentMatch[0],
      group: currentMatch[1]
    });
  }
  return groups;
}

var sassImportRegex = /@import "([\w\.\-\/_]*)";/g;

// Finds all require statements within src.
function findSassImports(src) {
  var groups = [];
  var currentMatch;
  while ((currentMatch = sassImportRegex.exec(src)) !== null) {
    groups.push({
      complete: currentMatch[0],
      group: currentMatch[1]
    });
  }
  return groups;
}

module.exports = {
  findRequires,
  findSassImports
};
