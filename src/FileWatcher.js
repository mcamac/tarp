var sane = require('sane');
var path = require('path');
var R = require('ramda');

var cache = require('./Cache');
var Assembler = require('./Assembler');

/**
 * Return file watcher (using the 'sane' library) which rebuilds targets when dependencies change.
 * @param {[type]}
 * @param {[type]}
 */
function TarpWatcher(config, saneOpts) {
  var assembler = new Assembler(config);
  var r = assembler.buildAllTargets();
  console.log(R.sortBy(R.prop('time'), R.map(R.pick(['target', 'time']), R.values(r))));
  console.log(R.sum(R.pluck('time', R.values(r))));
  var watcher = sane(config.resolve.root, saneOpts);
  watcher.on('change', function (filepath, root, stat) {
    console.log('Changed:', filepath.bold.green, root);
    var absolutePath = path.resolve(root, filepath);
    cache.invalidate(absolutePath);
    console.log(assembler.rebuildAfterChange(cache.getModule(absolutePath)));
  });
  return watcher;
}

module.exports = TarpWatcher;
