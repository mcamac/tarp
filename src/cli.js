#! /usr/bin/env node

var path = require('path');
var R = require('ramda');
var fs = require('fs');
require('colors');

var Assembler = require('./Assembler');

console.log(process.cwd());
var confPath = path.join(process.cwd(), 'tarp.conf.js');
var config = require(path.join(process.cwd(), 'tarp.conf.js'));
var assembler = new Assembler(config);

console.log(config.targets);
var r = assembler.buildAllTargets();
console.log(R.sortBy(R.prop('time'), R.map(R.pick(['target', 'time']), R.values(r))));
console.log(R.sum(R.pluck('time', R.values(r))));
// console.log(assembler.depGraph);


var cache = require('./Cache');
var sane = require('sane');
var watcher = sane(config.resolve.root, {glob: ['**/*.js', '**/*.es6', '**/*.jade'], watchman: true});
watcher.on('change', function (filepath, root, stat) {
  console.log(filepath.green, root);
  var absolutePath = path.resolve(root, filepath);
  cache.invalidate(absolutePath);
  console.log(assembler.rebuildAfterChange(cache.getModule(absolutePath)));
});
