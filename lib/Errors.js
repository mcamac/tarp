"use strict";

function ModuleResolutionError(parent, path) {
  Error.call(this);
  Error.captureStackTrace(this, ModuleResolutionError);
  this.name = "ModuleResolutionError";
  this.message = "Could not find module " + path + " in " + parent;
};

ModuleResolutionError.prototype = Object.create(Error.prototype);

module.exports = {
  ModuleResolutionError: ModuleResolutionError
};