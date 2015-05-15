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

    var outputDir = path.resolve(this.config.resolve.root, this.config.compile.outputDir);
    this.targets = R.mapObjIndexed(
      (entryModules, target) => new Target(target, entryModules, outputDir),
      config.targets);
  }

  /**
   * Build all targets.
   */
  buildAllTargets() {
    return R.mapObjIndexed(target => this.buildTarget(target), this.targets);
  }

  /**
   * Check if target needs rebuilding. Two heuristics are used:
   *   1. The mtimes of every module used to previously compile the target are unchanged.
   *   2. The list of entry modules for the target is unchanged (including their order).
   */
  checkIfNeedsRebuild(target) {
    if (fs.existsSync(target.cachePath)) {
      var targetCacheInfo = JSON.parse(fs.readFileSync(target.cachePath));

      var modifiedDependencies = R.mapObjIndexed(
        ({mtime}, modulePath) => FileCache.getModule(modulePath).mtime === mtime,
        targetCacheInfo.modules);

      R.keys(targetCacheInfo.modules).forEach(
        modulePath => this.targetGraph.addEdge(modulePath, target.target));

      R.keys(targetCacheInfo.depGraph).forEach(
        parent => targetCacheInfo.depGraph[parent].forEach(
          child => this.depGraph.addEdge(parent, child)));

      var noModifiedDependencies = R.all(x => x, R.values(modifiedDependencies));
      var sameEntryModuleList = R.eqDeep(
        targetCacheInfo.entryModules,
        R.pluck('path', this.resolver.resolveMany(this.config.resolve.root, target.entryModules)));

      // console.log('mod'.green, modifiedDependencies, noModifiedDependencies, sameEntryModuleList,
      //   targetCacheInfo.entryModules);
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
      // console.log(target.target.green, 'no rebuild');
      return {
        target: target.target,
        time: new Date().getTime() - time
      };
    }

    var componentModules = target.entryModules.map(comp => this.resolver.resolve(process.cwd(), comp));
    var depModules = this.depsForModules(componentModules);

    var writer = new fileWriters[path.extname(target.target)](target);
    var {rebuild, code, map, cacheInfo} = writer.writeModules(componentModules, depModules, this.depGraph);

    // Update dependency graph and save to cache file.
    depModules.forEach(_module => this.targetGraph.addEdge(_module.path, target.target));
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

  /**
   * Return an inorder array of modules required to assemble target files.
   */
  depsForModules(componentModules) {
    componentModules.forEach(target => this.walkRequires(target));
    var inorderPaths = this.depGraph.inorder(R.map(R.prop('path'), componentModules));
    var inorderModules = inorderPaths.map(modulePath => FileCache.getModule(modulePath));
    return inorderModules;
  }

  /**
   * Recursively walks require decorations found in modules, building the dependency graph.
   */
  walkRequires(rootModule) {
    rootModule.loadCodeFromFs();
    var depMatches = [];
    if (rootModule.path.indexOf(this.resolver.opts.noRequires) === -1) {
        depMatches = findRequires(rootModule.code);
    }
    // console.log('deps of'.green, rootModule, depMatches);
    var deps = depMatches.map(R.prop('group')).map(depModule => this.resolver.resolve(rootModule.path, depModule));

    // Filter out unresolved modules.... (should throw error in the future.)
    deps = deps.filter(x => x);

    // Update dependency graph
    deps.forEach(dep => this.depGraph.addEdge(rootModule.path, dep.path));
    rootModule.requires = R.zip(depMatches, R.map(R.prop('path'), deps));
    this.depGraph.verts[rootModule.path] = rootModule;

    deps.forEach(dep => this.walkRequires(dep));
  }

  rebuildAfterChange(changedModule) {
    var parentTargets = this.targetGraph.edges[changedModule.path];
    if (parentTargets) {
      return parentTargets.map(targetPath => this.buildTarget(this.targets[targetPath]));
    }
    return [];
  }
}


module.exports = Assembler;
