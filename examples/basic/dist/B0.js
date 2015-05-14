/* TARP-HEADER
5
0 /Users/martin/kensho/sarp/examples/basic/src/B-entry.js 948627046 2015-05-13T22:38:16.000Z
1 /Users/martin/kensho/sarp/examples/basic/src/B-req1.es6 79237125 2015-05-12T20:38:29.000Z
2 /Users/martin/kensho/sarp/examples/basic/src/B-req1-1.es6 258751488 2015-05-14T00:25:44.000Z
3 /Users/martin/kensho/sarp/examples/basic/src/C/C1.js 1957065107 2015-05-13T00:29:29.000Z
4 /Users/martin/kensho/sarp/examples/basic/src/B-req2.es6 3424463177 2015-05-14T00:26:03.000Z
TARP-HEADER */
(function (__this) {
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
// {"version":3,"sources":["/Users/martin/kensho/sarp/examples/basic/src/B-entry.js"],"names":[],"mappings":"AAAA;AACA;AACA;AACA;AACA","sourcesContent":["var sixthPower = require('B-req1');\nvar req2 = require('./B-req2');\n\nconsole.log((sixthPower)(2));\n"]} */
var sixthPower = __tarp_require(1);
var req2 = __tarp_require(4);

console.log((sixthPower)(2));


/*- tarp-cache-$END 0 -*/
}).bind(__this),

(function (module) {
/*- tarp-cache-$START 1 -*/
// {"version":3,"sources":["/Users/martin/kensho/sarp/examples/basic/src/B-req1.es6"],"names":[],"mappings":";;AAAA,IAAI,MAAM,GAAG,SAAT,MAAM,CAAG,CAAC;SAAI,CAAC,GAAG,CAAC;CAAA,CAAC;AACxB,IAAI,IAAI,GAAG,OAAO,CAAC,UAAY;AAC/B,OAAO,CAAC,MAAM,CAAC,CAAC;;AAEhB,MAAM,CAAC,OAAO,GAAG,WAAC;SAAI,MAAM,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;CAAA","sourcesContent":["var square = d => d * d;\nvar cube = require('B-req1-1');\nrequire('C/C1');\n\nmodule.exports = d => square(cube(d));\n"]} */
'use strict';

var square = function square(d) {
  return d * d;
};
var cube = __tarp_require(2);
__tarp_require(3);

module.exports = function (d) {
  return square(cube(d));
};
/*- tarp-cache-$END 1 -*/
}).bind(__this),

(function (module) {
/*- tarp-cache-$START 2 -*/
// {"version":3,"sources":["/Users/martin/kensho/sarp/examples/basic/src/B-req1-1.es6"],"names":[],"mappings":";;AAAA,IAAI,IAAI,GAAG,SAAP,IAAI,CAAG,CAAC;SAAI,CAAC,GAAG,CAAC,GAAG,CAAC;CAAA,CAAC;AAC1B,MAAM,CAAC,OAAO,GAAG,IAAI","sourcesContent":["var cube = d => d * d * d;\nmodule.exports = cube;\n"]} */
"use strict";

var cube = function cube(d) {
  return d * d * d;
};
module.exports = cube;
/*- tarp-cache-$END 2 -*/
}).bind(__this),

(function (module) {
/*- tarp-cache-$START 3 -*/
// {"version":3,"sources":["/Users/martin/kensho/sarp/examples/basic/src/C/C1.js"],"names":[],"mappings":"AAAA;AACA","sourcesContent":["require('../B-req1-1');\n"]} */
__tarp_require(2);


/*- tarp-cache-$END 3 -*/
}).bind(__this),

(function (module) {
/*- tarp-cache-$START 4 -*/
// {"version":3,"sources":["/Users/martin/kensho/sarp/examples/basic/src/B-req2.es6"],"names":[],"mappings":";;;;AAAA,IAAI,MAAM,GAAG,OAAO,CAAC,UAAY;;IAE3B,KAAK,GACE,SADP,KAAK,GACK;wBADV,KAAK;;AAEP,MAAI,CAAC,KAAK,GAAG,EAAE;AACf,MAAI,CAAC,KAAK,GAAG,EAAE,CAAC;AAChB,MAAI,CAAC,QAAQ,GAAG,EAAE,CAAC;CACpB;;AAGH,KAAK,CAAC,SAAS,CAAC,OAAO,GAAG,UAAU,IAAI,EAAE,EAAE,EAAE;AAC5C,MAAI,CAAC,IAAI,CAAC,KAAK,CAAC,IAAI,CAAC,EAAE;AACrB,QAAI,CAAC,KAAK,CAAC,IAAI,CAAC,GAAG,EAAE,CAAC;GACvB;AACD,MAAI,CAAC,KAAK,CAAC,IAAI,CAAC,CAAC,EAAE,CAAC,GAAG,IAAI,CAAC;CAC7B,CAAC;;AAEF,KAAK,CAAC,SAAS,CAAC,OAAO,GAAG,UAAU,KAAK,EAAE;AACzC,MAAI,WAAW,GAAG,EAAE,CAAC;AACrB,MAAI,WAAW,GAAG,EAAE,CAAC;;AAErB,MAAI,KAAK,GAAG,IAAI,CAAC;;AAEjB,WAAS,MAAM,CAAC,IAAI,EAAE;AACpB,QAAI,WAAW,CAAC,IAAI,CAAC,EAAE,OAAO;AAC9B,eAAW,CAAC,IAAI,CAAC,GAAG,IAAI,CAAC;AACzB,eAAW,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC;AACvB,QAAI,SAAS,GAAG,CAAC,CAAC,IAAI,CAAC,KAAK,CAAC,KAAK,CAAC,IAAI,CAAC,IAAI,EAAE,CAAC,CAAC;AAChD,aAAS,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC;GAC3B;;AAED,OAAK,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC;AACtB,SAAO,WAAW,CAAC;CACpB","sourcesContent":["var req1_1 = require('B-req1-1');\n\nclass Graph {\n  constructor() {\n    this.edges = {}\n    this.verts = [];\n    this.outEdges = [];\n  }\n}\n\nGraph.prototype.addEdge = function (from, to) {\n  if (!this.edges[from]) {\n    this.edges[from] = {};\n  }\n  this.edges[from][to] = true;\n};\n\nGraph.prototype.inorder = function (roots) {\n  var visitedHash = {};\n  var visitedList = [];\n\n  var graph = this;\n\n  function search(root) {\n    if (visitedHash[root]) return;\n    visitedHash[root] = true;\n    visitedList.push(root);\n    var neighbors = R.keys(graph.edges[root] || {});\n    neighbors.forEach(search);\n  }\n\n  roots.forEach(search);\n  return visitedList;\n};\n"]} */
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var req1_1 = __tarp_require(2);

var Graph = function Graph() {
  _classCallCheck(this, Graph);

  this.edges = {};
  this.verts = [];
  this.outEdges = [];
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
/*- tarp-cache-$END 4 -*/
}).bind(__this)
];
__tarp_require(0);

}(this));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXJ0aW4va2Vuc2hvL3NhcnAvZXhhbXBsZXMvYmFzaWMvc3JjL0ItZW50cnkuanMiLCIvVXNlcnMvbWFydGluL2tlbnNoby9zYXJwL2V4YW1wbGVzL2Jhc2ljL3NyYy9CLXJlcTEuZXM2IiwiL1VzZXJzL21hcnRpbi9rZW5zaG8vc2FycC9leGFtcGxlcy9iYXNpYy9zcmMvQi1yZXExLTEuZXM2IiwiL1VzZXJzL21hcnRpbi9rZW5zaG8vc2FycC9leGFtcGxlcy9iYXNpYy9zcmMvQy9DMS5qcyIsIi9Vc2Vycy9tYXJ0aW4va2Vuc2hvL3NhcnAvZXhhbXBsZXMvYmFzaWMvc3JjL0ItcmVxMi5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDSkEsSUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUcsQ0FBQztTQUFJLENBQUMsR0FBRyxDQUFDO0NBQUEsQ0FBQztBQUN4QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsVUFBWTtBQUMvQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWhCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBQztTQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FBQSxDOzs7Ozs7Ozs7QUNKckMsSUFBSSxJQUFJLEdBQUcsU0FBUCxJQUFJLENBQUcsQ0FBQztTQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztDQUFBLENBQUM7QUFDMUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLEM7Ozs7Ozs7QUNEckI7QUFDQTs7Ozs7Ozs7Ozs7O0FDREEsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVk7O0lBRTNCLEtBQUssR0FDRSxTQURQLEtBQUssR0FDSzt3QkFEVixLQUFLOztBQUVQLE1BQUksQ0FBQyxLQUFLLEdBQUcsRUFBRTtBQUNmLE1BQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLE1BQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0NBQ3BCOztBQUdILEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVUsSUFBSSxFQUFFLEVBQUUsRUFBRTtBQUM1QyxNQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNyQixRQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztHQUN2QjtBQUNELE1BQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0NBQzdCLENBQUM7O0FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxLQUFLLEVBQUU7QUFDekMsTUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLE1BQUksV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsTUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVqQixXQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDcEIsUUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTztBQUM5QixlQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLGVBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsUUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2hELGFBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDM0I7O0FBRUQsT0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QixTQUFPLFdBQVcsQ0FBQztDQUNwQixDIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHNpeHRoUG93ZXIgPSByZXF1aXJlKCdCLXJlcTEnKTtcbnZhciByZXEyID0gcmVxdWlyZSgnLi9CLXJlcTInKTtcblxuY29uc29sZS5sb2coKHNpeHRoUG93ZXIpKDIpKTtcbiIsInZhciBzcXVhcmUgPSBkID0+IGQgKiBkO1xudmFyIGN1YmUgPSByZXF1aXJlKCdCLXJlcTEtMScpO1xucmVxdWlyZSgnQy9DMScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGQgPT4gc3F1YXJlKGN1YmUoZCkpO1xuIiwidmFyIGN1YmUgPSBkID0+IGQgKiBkICogZDtcbm1vZHVsZS5leHBvcnRzID0gY3ViZTtcbiIsInJlcXVpcmUoJy4uL0ItcmVxMS0xJyk7XG4iLCJ2YXIgcmVxMV8xID0gcmVxdWlyZSgnQi1yZXExLTEnKTtcblxuY2xhc3MgR3JhcGgge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVkZ2VzID0ge31cbiAgICB0aGlzLnZlcnRzID0gW107XG4gICAgdGhpcy5vdXRFZGdlcyA9IFtdO1xuICB9XG59XG5cbkdyYXBoLnByb3RvdHlwZS5hZGRFZGdlID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gIGlmICghdGhpcy5lZGdlc1tmcm9tXSkge1xuICAgIHRoaXMuZWRnZXNbZnJvbV0gPSB7fTtcbiAgfVxuICB0aGlzLmVkZ2VzW2Zyb21dW3RvXSA9IHRydWU7XG59O1xuXG5HcmFwaC5wcm90b3R5cGUuaW5vcmRlciA9IGZ1bmN0aW9uIChyb290cykge1xuICB2YXIgdmlzaXRlZEhhc2ggPSB7fTtcbiAgdmFyIHZpc2l0ZWRMaXN0ID0gW107XG5cbiAgdmFyIGdyYXBoID0gdGhpcztcblxuICBmdW5jdGlvbiBzZWFyY2gocm9vdCkge1xuICAgIGlmICh2aXNpdGVkSGFzaFtyb290XSkgcmV0dXJuO1xuICAgIHZpc2l0ZWRIYXNoW3Jvb3RdID0gdHJ1ZTtcbiAgICB2aXNpdGVkTGlzdC5wdXNoKHJvb3QpO1xuICAgIHZhciBuZWlnaGJvcnMgPSBSLmtleXMoZ3JhcGguZWRnZXNbcm9vdF0gfHwge30pO1xuICAgIG5laWdoYm9ycy5mb3JFYWNoKHNlYXJjaCk7XG4gIH1cblxuICByb290cy5mb3JFYWNoKHNlYXJjaCk7XG4gIHJldHVybiB2aXNpdGVkTGlzdDtcbn07XG4iXX0=