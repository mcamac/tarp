#! /usr/bin/env node

var path = require('path');
var R = require('ramda');
var fs = require('fs');

var Resolver = require('./Resolver');
var Assembler = require('./Assembler');

console.log(process.cwd());




var config = require(path.join(process.cwd(), 'tarp.conf.js'));
var resolver = new Resolver(config.resolve);
R.mapObjIndexed(function (components, target) {
  fs.writeFileSync('dist/' + target, Assembler.assemble(R.map(resolver.resolve.bind(resolver), components), resolver));
}, config.targets);
