var Graph = function () {
  this.edges = {};
  this.adjList = {};
  this.verts = [];
};

Graph.prototype.addEdge = function (from, to) {
  if (!this.edges[from]) {
    this.edges[from] = [];
    this.adjList[from] = {};
  }
  if (!this.adjList[from][to]) {
    this.edges[from].push(to);
  }
};

Graph.prototype.inorder = function (roots) {
  var visitedHash = {};
  var visitedList = [];

  var graph = this;

  function search(root) {
    if (visitedHash[root]) return;
    visitedHash[root] = true;
    visitedList.push(root);
    var neighbors = graph.edges[root] || [];
    neighbors.forEach(search);
  }

  roots.forEach(search);
  return visitedList;
};

module.exports = Graph;
