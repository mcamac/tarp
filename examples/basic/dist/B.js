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
var __tarp_code = [(function (module) { /*- 0 /Users/martin/kensho/sarp/examples/basic/src/B-entry.js -*/
'use strict';

var sixthPower = __tarp_require(1);
var req2 = __tarp_require(3);

console.log(sixthPower(2));
}),

(function (module) { /*- 1 /Users/martin/kensho/sarp/examples/basic/src/B-req1.js -*/
'use strict';

var square = function square(d) {
  return d * d;
};
var cube = __tarp_require(2);

module.exports = function (d) {
  return square(cube(d));
};
}),

(function (module) { /*- 2 /Users/martin/kensho/sarp/examples/basic/src/B-req1-1.js -*/
"use strict";

var cube = function cube(d) {
  return d * d * d;
};
module.exports = cube;
}),

(function (module) { /*- 3 /Users/martin/kensho/sarp/examples/basic/src/B-req2.js -*/
'use strict';

var req1_1 = __tarp_require(2);
})];
__tarp_require(0);
}());