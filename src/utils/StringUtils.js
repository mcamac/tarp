var _ = require('lodash');

function indent(s, n) {
  // Indents each line of a string by n spaces.
  var spaces = _.times(n, function () { return ' '; }).join('');
  return s.split('\n').map(function (line) { return spaces + line; }).join('\n');
}

function unindent(s, n) {
  // Indents each line of a string by n spaces.
  var spaces = _.times(n, function () { return ' '; }).join('');
  return s.split('\n').map(function (line) { return line.slice(n); }).join('\n');
}

module.exports = {
  indent: indent,
  unindent: unindent
};
