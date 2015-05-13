var FileCache = require('./Cache');
var Resolver = require('./Resolver');
var R = require('ramda');
var _ = require('lodash');

var Graph = require('./Graph');

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

// Return an inorder array of modules required to assemble target files.
function assemble(targets, resolver) {
  var graph = new Graph();
  targets.forEach(R.partial(walkRequires, resolver, graph));
  var inorderPaths = graph.inorder(R.map(R.prop('path'), targets));
  var inorderModules = R.props(inorderPaths, graph.verts);
  return inorderModules;
}

function walkRequires(resolver, depGraph, rootModule) {
  var depStrs = rootModule.path.indexOf(resolver.opts.noRequires) >= 0 ? [] : findRequires(rootModule.code);
  // console.log('deps of', rootModule.path, depStrs);
  var deps = depStrs.map(R.prop('group')).map(resolver.resolve.bind(resolver, rootModule.path));
  deps.forEach(function (dep) {
    depGraph.addEdge(rootModule.path, dep.path);
  });
  depGraph.verts[rootModule.path] = {
    module: rootModule,
    requires: R.zip(depStrs, R.map(R.prop('path'), deps))
  };
  deps.forEach(R.partial(walkRequires, resolver, depGraph))
  return depGraph.verts[rootModule.path];
}

module.exports = {
  findRequires: findRequires,
  assemble: assemble
};
