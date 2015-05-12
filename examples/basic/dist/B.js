/* TARP-HEADER 
4
0 /Users/martin/kensho/sarp/examples/basic/src/B-entry.js 948627046
1 /Users/martin/kensho/sarp/examples/basic/src/B-req1.js 1564734662
2 /Users/martin/kensho/sarp/examples/basic/src/B-req1-1.js 258751488
3 /Users/martin/kensho/sarp/examples/basic/src/B-req2.js 2445677781
TARP-HEADER */
(function () {
  var loadedModules = {};
  function __tarp_require(modulePos) {
    if (loadedModules[modulePos]) {
      return loadedModules[modulePos];
    }
    var newModule = {};
    __tarp_code[modulePos](newModule);
    loadedModules[modulePos] = newModule.exports;
    return loadedModules[modulePos];
  }

  var __tarp_code = [
    (function (module) {
      /*- tarp-cache-$START 0 -*/
      'use strict';
      
      var sixthPower = __tarp_require(1);
      var req2 = __tarp_require(3);
      
      console.log(sixthPower(2));
      /*- tarp-cache-$END 0 -*/
    }),
    
    (function (module) {
      /*- tarp-cache-$START 1 -*/
      'use strict';
      
      var square = function square(d) {
        return d * d;
      };
      var cube = __tarp_require(2);
      
      module.exports = function (d) {
        return square(cube(d));
      };
      /*- tarp-cache-$END 1 -*/
    }),
    
    (function (module) {
      /*- tarp-cache-$START 2 -*/
      "use strict";
      
      var cube = function cube(d) {
        return d * d * d;
      };
      module.exports = cube;
      /*- tarp-cache-$END 2 -*/
    }),
    
    (function (module) {
      /*- tarp-cache-$START 3 -*/
      'use strict';
      
      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
      
      var req1_1 = __tarp_require(2);
      
      var Graph = function Graph() {
        _classCallCheck(this, Graph);
      
        this.edges = {};
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
      /*- tarp-cache-$END 3 -*/
    })
  ];
  __tarp_require(0);
}());