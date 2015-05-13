/* TARP-HEADER 
2
0 /Users/martin/kensho/sarp/examples/basic/src/A1.js 3337180632
1 /Users/martin/kensho/sarp/examples/basic/src/A2.js 3773558332
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
    ole.log('A1');
    
      /*- tarp-cache-$END 0 -*/
    }).bind(__this),
    
    (function (module) {
      /*- tarp-cache-$START 1 -*/
      console.log('A234');
      
      /*- tarp-cache-$END 1 -*/
    }).bind(__this)
  ];
  __tarp_require(0);
  __tarp_require(1);
}(this));
