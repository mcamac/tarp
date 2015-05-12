/* TARP-HEADER 
2
0 /Users/martin/kensho/sarp/examples/basic/src/A1.js 3337180632
1 /Users/martin/kensho/sarp/examples/basic/src/A2.js 1433769883
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
      
      console.log('A1');
      /*- tarp-cache-$END 0 -*/
    }),
    
    (function (module) {
      /*- tarp-cache-$START 1 -*/
      'use strict';
      
      console.log('A2');
      /*- tarp-cache-$END 1 -*/
    })
  ];
  __tarp_require(0);
  __tarp_require(1);
}());
