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

function buildTarget(target, components) {
  var time = new Date().getTime();
  var componentModules = R.map(resolver.resolve.bind(resolver, confPath), components);
  var modules = Assembler.assemble(componentModules, resolver);
  var CachingWriter = require('./CachingWriter');
  var CSSWriter = require('./CSSWriter');
  var writer = path.extname(target) === '.js' ? new CachingWriter('dist/' + target) : new CSSWriter();
  writer.loadCacheInfoFromFs();
  var targetCode = writer.writeModules(componentModules, modules);
  fs.writeFileSync('dist/' + target, targetCode);
  return {
    target: target,
    built: targetCode,
    time: new Date().getTime() - time
  };
}

R.range(1, 2).forEach(function () {

  console.log(config.targets);
  var r = R.mapObjIndexed(R.flip(buildTarget), config.targets);
  console.log(R.map(R.pick(['target', 'time']), R.values(r)));
});


var sane = require('sane');
var watcher = sane(process.cwd(), {glob: ['**/*.js', '**/*.es6', '**/*.css', '**/*.scss'], watchman: true});
watcher.on('change', function (filepath, root, stat) {
  console.log(filepath, root, stat);
});
