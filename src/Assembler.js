var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var R = require('ramda');

var FileCache = require('./Cache');
var Resolver = require('./Resolver');
var Graph = require('./Graph');
var {findRequires, findSassImports} = require('./ImportFinders');
var inlineSourceMapComment = require('inline-source-map-comment');


var fileWriters = {
  '.css': require('./CSSWriter'),
  '.js': require('./CachingWriter')
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

    var writer = new fileWriters[path.extname(target)](targetPath);
    writer.loadCacheInfoFromFs();

    var {code, map} = writer.writeModules(componentModules, depModules, this.depGraph);
    depModules.forEach(mod => this.targetGraph.addEdge(mod.module.path, target));

    fs.writeFileSync(targetPath, code + '\n' + inlineSourceMapComment(map, {sourcesContent: true}));
    return {
      target: target,
      time: new Date().getTime() - time
      // built: targetCode
    };
  }

  // Return an inorder array of modules required to assemble target files.
  depsForModules(componentModules) {
    componentModules.forEach(target => this.walkRequires(target));
    var inorderPaths = this.depGraph.inorder(R.map(R.prop('path'), componentModules));
    var inorderModules = R.props(inorderPaths, this.depGraph.verts);
    console.log(inorderPaths);
    return inorderModules;
  }

  // Recursively walks require decorations found in modules, building the dependency graph.
  walkRequires(rootModule) {
    console.log('walking from', rootModule.path);
    var depStrs = [];
    if (rootModule.path.indexOf(this.resolver.opts.noRequires) === -1) {
      if (path.extname(rootModule.path) === '.scss') {
        depStrs = findSassImports(rootModule.code);
      } else {
        depStrs = findRequires(rootModule.code);
      }
    }
    console.log('deps of', rootModule.path, depStrs);
    var deps = depStrs.map(R.prop('group')).map(this.resolver.resolve.bind(this.resolver, rootModule.path));
    // Filter out unresolved modules.... (should throw error in the future.)
    deps = deps.filter(x => x);
    deps.forEach(dep => this.depGraph.addEdge(rootModule.path, dep.path));
    this.depGraph.verts[rootModule.path] = {
      module: rootModule,
      requires: R.zip(depStrs, R.map(R.prop('path'), deps))
    };
    deps.forEach(dep => this.walkRequires(dep));
  }

  rebuildAfterChange(changedModule) {
    var parentTargets = this.targetGraph.edges[changedModule.path];
    if (parentTargets) {
      console.log(parentTargets.map(target => this.buildTarget(target)));
    }
  }
}


module.exports = Assembler;
