#! /usr/bin/env node

var path = require('path');
var R = require('ramda');
var fs = require('fs');

var Assembler = require('./Assembler');

console.log(process.cwd());
var confPath = path.join(process.cwd(), 'tarp.conf.js');
var config = require(path.join(process.cwd(), 'tarp.conf.js'));
var ass = new Assembler(config);

console.log(config.targets);
var r = R.mapObjIndexed((components, target) => ass.buildTarget(target, components), config.targets);
console.log(R.map(R.pick(['target', 'time']), R.values(r)));


var cache = require('./Cache');
var sane = require('sane');
var watcher = sane(config.resolve.root, {glob: ['**/*.js', '**/*.es6', '**/*.jade'], watchman: true});
watcher.on('change', function (filepath, root, stat) {
  console.log(filepath, root);
  cache.invalidate(path.resolve(root, filepath));
  ass.rebuildAfterChange(cache.getModule(path.resolve(root, filepath)));
  // Need to do a dep graph search, rebuild, then update dep graph.
});
