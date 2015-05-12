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

<%= code %>
}());
