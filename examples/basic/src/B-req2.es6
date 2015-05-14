var req1_1 = require('B-req1-1');

class Graph {
  constructor() {
    this.edges = {}
    this.verts = [];
    this.outEdges = [];
  }
}

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
