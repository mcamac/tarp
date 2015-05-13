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

var Graph = require('./Graph');

var targetGraph = new Graph();

function buildTarget(target, components) {
  var time = new Date().getTime();
  var componentModules = R.map(resolver.resolve.bind(resolver, confPath), components);
  var modules = Assembler.assemble(componentModules, resolver);
  var CachingWriter = require('./CachingWriter');
  var CSSWriter = require('./CSSWriter');
  var targetPath = path.resolve(process.cwd(), config.compile.outputDir, target);
  var writer = path.extname(target) === '.js' ? new CachingWriter(targetPath) : new CSSWriter(targetPath);
  writer.loadCacheInfoFromFs();
  var targetCode = writer.writeModules(componentModules, modules);
  modules.forEach(function (mod) {
    targetGraph.addEdge(mod.module.path, target);
  });
  fs.writeFileSync(targetPath, targetCode);

  return {
    target: target,
    built: targetCode,
    time: new Date().getTime() - time
  };
}


console.log(config.targets);
var r = R.mapObjIndexed(R.flip(buildTarget), config.targets);
console.log(R.map(R.pick(['target', 'time']), R.values(r)));
console.log(targetGraph.edges);

var sane = require('sane');
var watcher = sane(config.resolve.root, {glob: ['**/*.js', '**/*.es6', '**/*.css', '**/*.scss'], watchman: true});
watcher.on('change', function (filepath, root, stat) {
  console.log(filepath, root, stat, targetGraph.edges[filepath]);
  var cache = require('./Cache');
  cache.invalidate(path.resolve(root, filepath));
  var r = R.mapObjIndexed(R.flip(buildTarget), config.targets);
  console.log(R.map(R.pick(['target', 'time']), R.values(r)));
  // Need to do a dep graph search, rebuild, then update dep graph.
});
