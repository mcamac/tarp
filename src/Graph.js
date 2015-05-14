var Graph = function () {
  this.edges = {};
  this.outEdges = {};
  this.adjSet = {};
  this.verts = [];
};

Graph.prototype.addEdge = function (from, to) {
  if (!this.edges[from]) {
    this.edges[from] = [];
    this.adjSet[from] = {};
  }
  if (!this.outEdges[to]) {
    this.outEdges[to] = [];
  }
  if (!this.adjSet[from][to]) {
    this.edges[from].push(to);
    this.outEdges[to].push(from);
    this.adjSet[from][to] = true;
  }
};

Graph.prototype.inorder = function (roots, fn, backwards) {
  var visitedHash = {};
  var visitedList = [];

  var graph = this;
  var i = 0;
  function search(root) {
    if (visitedHash[root]) return;
    visitedHash[root] = true;
    visitedList.push(root);
    var neighbors = [];
    if (!backwards) {
      neighbors = graph.edges[root] || [];
    } else {
      neighbors = graph.outEdges[root] || [];
    }
    if (fn) {
      fn(graph, root, i);
      i++;
    }
    neighbors.forEach(search);
  }

  roots.forEach(search);
  return visitedList;
};

Graph.prototype.subgraph = function (roots) {
  var subgraph = new Graph();
  this.inorder(roots, (graph, root) => {
    (this.edges[root] || []).forEach(next => subgraph.addEdge(root, next))
  });
  return subgraph;
};

function removeOutgoing(graph, root) {
  var outgoing = graph.adjSet[root] || [];
  outgoing.forEach(neighbor => {
    if (graph.outEdges[neighbor] && graph.outEdges[neighbor][root]) {
      delete graph.outEdges[neighbor][root];
    }
  });
  graph.edges[root] = {};
  graph.adjSet[root] = [];
}

module.exports = Graph;
