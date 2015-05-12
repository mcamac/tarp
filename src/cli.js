#! /usr/bin/env node

var path = require('path');
var R = require('ramda');
var fs = require('fs');

var Resolver = require('./Resolver');
var Assembler = require('./Assembler');

console.log(process.cwd());



var confPath = path.join(process.cwd(), 'tarp.conf.js');
var config = require(path.join(process.cwd(), 'tarp.conf.js'));
var resolver = new Resolver(config.resolve);
R.range(1, 2).forEach(function () {
  var time = new Date().getTime();
  console.log(config.targets);
  R.mapObjIndexed(function (components, target) {
    var componentModules = R.map(resolver.resolve.bind(resolver, confPath), components);
    var modules = Assembler.assemble(componentModules, resolver);
    var CachingWriter = require('./CachingWriter');
    var writer = new CachingWriter('dist/' + target);
    writer.loadCacheInfoFromFs();
    fs.writeFileSync('dist/' + target, writer.writeModules(componentModules, modules));
  }, config.targets);
  console.log(new Date().getTime() - time);
});



