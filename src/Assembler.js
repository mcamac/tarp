var FileCache = require('./Cache');
var Resolver = require('./Resolver');
var R = require('ramda');

// TODO: add lookbehind.
var requireRegex = /require\(['"]([\w\.\-\/_]*)['"]\)/g;

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


var Graph = function () {
  this.edges = {}
  this.verts = [];
};

Graph.prototype.addEdge = function (from, to) {
  if (!this.edges[from]) {
    this.edges[from] = {};
  }
  this.edges[from][to] = true;
};

Graph.prototype.inorder = function (roots) {
  var visitedHash = {};
  var visitedList = [];

  var graph = this;

  function search(root) {
    if (visitedHash[root]) return;
    visitedHash[root] = true;
    visitedList.push(root);
    var neighbors = R.keys(graph.edges[root] || {});
    neighbors.forEach(search);
  }

  roots.forEach(search);
  return visitedList;
};


function assemble(targets, resolver) {
  console.log(targets);
  var graph = new Graph();
  var trees = targets.map(R.partial(walkRequires, resolver, graph));
  console.log(graph);
  var inorder = graph.inorder(R.map(R.prop('path'), targets));
  var inorderPositionMap = R.invertObj(inorder);

  var totalCode = '';
  var orderedCode = inorder.map(function (path, inorderPos) {
    var node = graph.verts[path];
    var matchNum = 0;
    var replaced = node.module.code.replace(requireRegex, function (match, capture) {
      var depInorderPosition = inorderPositionMap[node.requires[matchNum][1]];
      matchNum += 1;
      return '__tarp_require(' + depInorderPosition + ')';
    })
    if (true) {
      replaced = '(function (module) { \/*- ' + inorderPos + ' ' + path + ' -*/\n' + replaced + '\n})';
    }
    // console.log(path, inorderPos, replaced);
    return replaced;
  }).join(',\n\n');
  var finalCode = FileCache.loaderCode + 'var __tarp_code = [' + orderedCode + '];\n';
  finalCode += R.pluck('path', targets).map(function (path) { return '__tarp_require(' + inorderPositionMap[path] + ');';}).join('\n');
  finalCode += '\n}());'
  return finalCode;
}

function walkRequires(resolver, depGraph, rootModule) {
  var depStrs = findRequires(rootModule.code);
  console.log('deps of', rootModule.path, depStrs);
  var deps = depStrs.map(R.prop('group')).map(resolver.resolve.bind(resolver));
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
