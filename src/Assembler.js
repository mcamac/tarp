var FileCache = require('./Cache');
var Resolver = require('./Resolver');
var R = require('ramda');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');

var Graph = require('./Graph');

// TODO: add lookbehind.
var requireRegex = /require\(['"]([\w\.\-\/_]*)['"]\)/g;

// Finds all require statements within src.
function findRequires(src) {
  var groups = [];
  var currentMatch;
  while ((currentMatch = requireRegex.exec(src)) !== null) {
    groups.push({
      complete: currentMatch[0],
      group: currentMatch[1]
    });
  }
  return groups;
}

var CachingWriter = require('./CachingWriter');
var CSSWriter = require('./CSSWriter');

var writers = {
  '.css': CSSWriter,
  '.js': CachingWriter
};


class Assembler {
  constructor(config) {
    this.resolver = new Resolver(config.resolve);
    this.depGraph = new Graph();
    this.targetGraph = new Graph();
    this.config = config;
  }

  // Build target, writing result to filesystem and returning
  buildTarget(target) {
  	if (!this.config.targets[target]) {
  		return {};
  	}
  	var components = this.config.targets[target];
    var time = new Date().getTime();
    var componentModules = components.map(comp => this.resolver.resolve(process.cwd(), comp));
    var depModules = this.depsForModules(componentModules);

    var targetPath = path.resolve(process.cwd(), this.config.compile.outputDir, target);

    var writer = new writers[path.extname(target)](targetPath);
    writer.loadCacheInfoFromFs();

    var targetCode = writer.writeModules(componentModules, depModules);
    depModules.forEach(mod => this.targetGraph.addEdge(mod.module.path, target));

    fs.writeFileSync(targetPath, targetCode);
    return {
      target: target,
      // built: targetCode,
      time: new Date().getTime() - time
    };
  }

  // Return an inorder array of modules required to assemble target files.
  depsForModules(componentModules) {
    componentModules.forEach(target => this.walkRequires(target));
    var inorderPaths = this.depGraph.inorder(R.map(R.prop('path'), componentModules));
    var inorderModules = R.props(inorderPaths, this.depGraph.verts);
    return inorderModules;
  }

  // Recursively walks require decorations found in modules, building the dependency graph.
  walkRequires(rootModule) {
    var depStrs = rootModule.path.indexOf(this.resolver.opts.noRequires) >= 0 ? [] : findRequires(rootModule.code);
    // console.log('deps of', rootModule.path, depStrs);
    var deps = depStrs.map(R.prop('group')).map(this.resolver.resolve.bind(this.resolver, rootModule.path));
    deps.forEach(dep => this.depGraph.addEdge(rootModule.path, dep.path));
    this.depGraph.verts[rootModule.path] = {
      module: rootModule,
      requires: R.zip(depStrs, R.map(R.prop('path'), deps))
    };
    deps.forEach(dep => this.walkRequires(dep));
    return this.depGraph.verts[rootModule.path];
  }

  rebuildAfterChange(changedModule) {
  	var parentTargets = this.targetGraph.edges[changedModule.path];
  	console.log(parentTargets.map(target => this.buildTarget(target)));
  }
}


module.exports = Assembler;
