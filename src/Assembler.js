var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var R = require('ramda');


var FileCache = require('./Cache');
var Resolver = require('./Resolver');
var Graph = require('./Graph');
var Target = require('./Target');
var {findRequires, findSassImports} = require('./ImportFinders');
var inlineSourceMapComment = require('inline-source-map-comment');


var fileWriters = {
  '.js': require('./CachingWriter')
};

class Assembler {
  constructor(config) {
    this.resolver = new Resolver(config.resolve);
    this.depGraph = new Graph();
    this.targetGraph = new Graph();
    this.config = config;
    this.targets = R.mapObjIndexed(
      (entryModules, targets) => new Target(targets, entryModules, path.resolve(process.cwd(), this.config.compile.outputDir)),
      config.targets);
  }

  /**
   * Build all targets.
   */
  buildAllTargets() {
    return R.mapObjIndexed(target => this.buildTarget(target), this.targets);
  }

  checkIfNeedsRebuild(target) {
    if (fs.existsSync(target.cachePath)) {
      var targetCacheInfo = JSON.parse(fs.readFileSync(target.cachePath));

      var modifiedDependencies = R.mapObjIndexed(
        ({mtime}, modulePath) => FileCache.getModule(modulePath).mtime === mtime,
        targetCacheInfo.modules);

      R.forEach(modulePath => this.targetGraph.addEdge(modulePath, target.target), R.keys(targetCacheInfo.modules));
      // R.forEach(modulePath => this.depGraph.addEdge(target.target, modulePath), R.keys(targetCacheInfo.modules));
      R.keys(targetCacheInfo.depGraph).forEach(
        parent => targetCacheInfo.depGraph[parent].forEach(child => this.depGraph.addEdge(parent, child)));
      var noModifiedDependencies = R.all(x => x, R.values(modifiedDependencies));
      var sameEntryModuleList = R.eqDeep(targetCacheInfo.entryModules, target.entryModules);

      console.log('mod'.green, modifiedDependencies, noModifiedDependencies);
      if (noModifiedDependencies && sameEntryModuleList) {
        return false;
      }
    }
    return true;
  }

  /**
   * Build specific target, writing result to filesystem and returning target and completion time.
   */
  buildTarget(target) {
    if (!target) {
      return {};
    }

    var time = new Date().getTime();

    if (!this.checkIfNeedsRebuild(target)) {
      console.log(target.target.green, 'no rebuild');
      return {
        target: target.target,
        time: new Date().getTime() - time
      };
    }

    var componentModules = target.entryModules.map(comp => this.resolver.resolve(process.cwd(), comp));
    var depModules = this.depsForModules(componentModules);

    var writer = new fileWriters[path.extname(target.target)](target.filePath);
    writer.loadCacheInfoFromFs();

    var {rebuild, code, map, cacheInfo} = writer.writeModules(componentModules, depModules, this.depGraph);
    console.log('asdfasd'.cyan, cacheInfo);
    depModules.forEach(mod => this.targetGraph.addEdge(mod.module.path, target.target));
    cacheInfo.depGraph = this.depGraph.subgraph(R.pluck('path', componentModules)).edges;
    if (rebuild) {
      fs.writeFileSync(target.filePath,
        code + '\n' + inlineSourceMapComment(map, {sourcesContent: true}));
      fs.writeFileSync(target.cachePath, JSON.stringify(cacheInfo, 2));
    }

    return {
      target: target.target,
      time: new Date().getTime() - time
    };
  }

  // Return an inorder array of modules required to assemble target files.
  depsForModules(componentModules) {
    componentModules.forEach(target => this.walkRequires(target));
    var inorderPaths = this.depGraph.inorder(R.map(R.prop('path'), componentModules));
    var inorderModules = R.props(inorderPaths, this.depGraph.verts);
    console.log('foo'.red, inorderPaths, inorderModules);
    return inorderModules;
  }

  // Recursively walks require decorations found in modules, building the dependency graph.
  walkRequires(rootModule) {
    rootModule.loadCodeFromFs();
    var depStrs = [];
    if (rootModule.path.indexOf(this.resolver.opts.noRequires) === -1) {
        depStrs = findRequires(rootModule.code);
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
      console.log(parentTargets.map(targetPath => this.buildTarget(this.targets[targetPath])));
    }
  }
}


module.exports = Assembler;
