function __require(moduleStr) {
  if (loadedModules[moduleStr]) {
    return loadedModules[moduleStr];
  }


}
