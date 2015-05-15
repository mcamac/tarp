var Assembler = require('./Assembler');
var Watcher = require('./FileWatcher');


function build(config) {
  require('colors');
  var assembler = new Assembler(config);
  return assembler.buildAllTargets();
}

function watch(config) {
  var watcher = new Watcher(
    config,
    {glob: ['**/*.js', '**/*.es6', '**/*.jade'], watchman: true});
}

module.exports = {
  build,
  Assembler,
  watch
};
