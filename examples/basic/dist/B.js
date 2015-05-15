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
/*- tarp-cache-$START /Users/martin/kensho/sarp/examples/basic/src/B-entry.js -*/
// {"version":3,"sources":["/Users/martin/kensho/sarp/examples/basic/src/B-entry.js"],"names":[],"mappings":"AAAA;AACA;AACA;AACA;AACA","sourcesContent":["var sixthPower = require('B-req1');\nvar req2 = require('./B-req2');\n\nconsole.log((sixthPower)(2));\n"]} */
var sixthPower = __tarp_require(1);
var req2 = __tarp_require(4);

console.log((sixthPower)(2));


/*- tarp-cache-$END /Users/martin/kensho/sarp/examples/basic/src/B-entry.js -*/
}).bind(__this),

(function (module) {
/*- tarp-cache-$START /Users/martin/kensho/sarp/examples/basic/src/B-req1.es6 -*/
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
/*- tarp-cache-$END /Users/martin/kensho/sarp/examples/basic/src/B-req1.es6 -*/
}).bind(__this),

(function (module) {
/*- tarp-cache-$START /Users/martin/kensho/sarp/examples/basic/src/B-req1-1.es6 -*/
// {"version":3,"sources":["/Users/martin/kensho/sarp/examples/basic/src/B-req1-1.es6"],"names":[],"mappings":";;AAAA,IAAI,IAAI,GAAG,SAAP,IAAI,CAAG,CAAC;SAAI,CAAC,GAAG,CAAC,GAAG,CAAC;CAAA,CAAC;AAC1B,MAAM,CAAC,OAAO,GAAG,IAAI","sourcesContent":["var cube = x => x * x * x;\nmodule.exports = cube;\n"]} */
"use strict";

var cube = function cube(x) {
  return x * x * x;
};
module.exports = cube;
/*- tarp-cache-$END /Users/martin/kensho/sarp/examples/basic/src/B-req1-1.es6 -*/
}).bind(__this),

(function (module) {
/*- tarp-cache-$START /Users/martin/kensho/sarp/examples/basic/src/C/C1.js -*/
// {"version":3,"sources":["/Users/martin/kensho/sarp/examples/basic/src/C/C1.js"],"names":[],"mappings":"AAAA;AACA","sourcesContent":["require('../B-req1-1');\n"]} */
__tarp_require(2);


/*- tarp-cache-$END /Users/martin/kensho/sarp/examples/basic/src/C/C1.js -*/
}).bind(__this),

(function (module) {
/*- tarp-cache-$START /Users/martin/kensho/sarp/examples/basic/src/B-req2.es6 -*/
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
/*- tarp-cache-$END /Users/martin/kensho/sarp/examples/basic/src/B-req2.es6 -*/
}).bind(__this)
];
__tarp_require(0);

}(this));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXJ0aW4va2Vuc2hvL3NhcnAvZXhhbXBsZXMvYmFzaWMvc3JjL0ItZW50cnkuanMiLCIvVXNlcnMvbWFydGluL2tlbnNoby9zYXJwL2V4YW1wbGVzL2Jhc2ljL3NyYy9CLXJlcTEuZXM2IiwiL1VzZXJzL21hcnRpbi9rZW5zaG8vc2FycC9leGFtcGxlcy9iYXNpYy9zcmMvQi1yZXExLTEuZXM2IiwiL1VzZXJzL21hcnRpbi9rZW5zaG8vc2FycC9leGFtcGxlcy9iYXNpYy9zcmMvQy9DMS5qcyIsIi9Vc2Vycy9tYXJ0aW4va2Vuc2hvL3NhcnAvZXhhbXBsZXMvYmFzaWMvc3JjL0ItcmVxMi5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ0pBLElBQUksTUFBTSxHQUFHLFNBQVQsTUFBTSxDQUFHLENBQUM7U0FBSSxDQUFDLEdBQUcsQ0FBQztDQUFBLENBQUM7QUFDeEIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFVBQVk7QUFDL0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVoQixNQUFNLENBQUMsT0FBTyxHQUFHLFdBQUM7U0FBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQUEsQzs7Ozs7Ozs7O0FDSnJDLElBQUksSUFBSSxHQUFHLFNBQVAsSUFBSSxDQUFHLENBQUM7U0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Q0FBQSxDQUFDO0FBQzFCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDOzs7Ozs7O0FDRHJCO0FBQ0E7Ozs7Ozs7Ozs7OztBQ0RBLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFZOztJQUUzQixLQUFLLEdBQ0UsU0FEUCxLQUFLLEdBQ0s7d0JBRFYsS0FBSzs7QUFFUCxNQUFJLENBQUMsS0FBSyxHQUFHLEVBQUU7QUFDZixNQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNoQixNQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztDQUNwQjs7QUFHSCxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxVQUFVLElBQUksRUFBRSxFQUFFLEVBQUU7QUFDNUMsTUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDckIsUUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7R0FDdkI7QUFDRCxNQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztDQUM3QixDQUFDOztBQUVGLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVUsS0FBSyxFQUFFO0FBQ3pDLE1BQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUNyQixNQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7O0FBRXJCLE1BQUksS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFakIsV0FBUyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ3BCLFFBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU87QUFDOUIsZUFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN6QixlQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLFFBQUksU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNoRCxhQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQzNCOztBQUVELE9BQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsU0FBTyxXQUFXLENBQUM7Q0FDcEIsQyIsInNvdXJjZXNDb250ZW50IjpbInZhciBzaXh0aFBvd2VyID0gcmVxdWlyZSgnQi1yZXExJyk7XG52YXIgcmVxMiA9IHJlcXVpcmUoJy4vQi1yZXEyJyk7XG5cbmNvbnNvbGUubG9nKChzaXh0aFBvd2VyKSgyKSk7XG4iLCJ2YXIgc3F1YXJlID0gZCA9PiBkICogZDtcbnZhciBjdWJlID0gcmVxdWlyZSgnQi1yZXExLTEnKTtcbnJlcXVpcmUoJ0MvQzEnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkID0+IHNxdWFyZShjdWJlKGQpKTtcbiIsInZhciBjdWJlID0geCA9PiB4ICogeCAqIHg7XG5tb2R1bGUuZXhwb3J0cyA9IGN1YmU7XG4iLCJyZXF1aXJlKCcuLi9CLXJlcTEtMScpO1xuIiwidmFyIHJlcTFfMSA9IHJlcXVpcmUoJ0ItcmVxMS0xJyk7XG5cbmNsYXNzIEdyYXBoIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lZGdlcyA9IHt9XG4gICAgdGhpcy52ZXJ0cyA9IFtdO1xuICAgIHRoaXMub3V0RWRnZXMgPSBbXTtcbiAgfVxufVxuXG5HcmFwaC5wcm90b3R5cGUuYWRkRWRnZSA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICBpZiAoIXRoaXMuZWRnZXNbZnJvbV0pIHtcbiAgICB0aGlzLmVkZ2VzW2Zyb21dID0ge307XG4gIH1cbiAgdGhpcy5lZGdlc1tmcm9tXVt0b10gPSB0cnVlO1xufTtcblxuR3JhcGgucHJvdG90eXBlLmlub3JkZXIgPSBmdW5jdGlvbiAocm9vdHMpIHtcbiAgdmFyIHZpc2l0ZWRIYXNoID0ge307XG4gIHZhciB2aXNpdGVkTGlzdCA9IFtdO1xuXG4gIHZhciBncmFwaCA9IHRoaXM7XG5cbiAgZnVuY3Rpb24gc2VhcmNoKHJvb3QpIHtcbiAgICBpZiAodmlzaXRlZEhhc2hbcm9vdF0pIHJldHVybjtcbiAgICB2aXNpdGVkSGFzaFtyb290XSA9IHRydWU7XG4gICAgdmlzaXRlZExpc3QucHVzaChyb290KTtcbiAgICB2YXIgbmVpZ2hib3JzID0gUi5rZXlzKGdyYXBoLmVkZ2VzW3Jvb3RdIHx8IHt9KTtcbiAgICBuZWlnaGJvcnMuZm9yRWFjaChzZWFyY2gpO1xuICB9XG5cbiAgcm9vdHMuZm9yRWFjaChzZWFyY2gpO1xuICByZXR1cm4gdmlzaXRlZExpc3Q7XG59O1xuIl19