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
var __tarp_code = [(function (module) { /*- 0 /Users/martin/kensho/sarp/examples/basic/src/A1.js -*/
'use strict';

console.log('A1');
}),

(function (module) { /*- 1 /Users/martin/kensho/sarp/examples/basic/src/A2.js -*/
'use strict';

console.log('A2');
})];
__tarp_require(0);
__tarp_require(1);
}());