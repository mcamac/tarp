var Graph = function () {
  this.edges = {};
  this.adjSet = {};
  this.verts = [];
};

Graph.prototype.addEdge = function (from, to) {
  if (!this.edges[from]) {
    this.edges[from] = [];
    this.adjSet[from] = {};
  }
  if (!this.adjSet[from][to]) {
    this.edges[from].push(to);
    this.adjSet[from][to] = true;
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
