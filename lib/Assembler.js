"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _ = require("lodash");
var fs = require("fs");
var path = require("path");
var R = require("ramda");

var FileCache = require("./Cache");
var Resolver = require("./Resolver");
var Graph = require("./Graph");
var Target = require("./Target");

var _require = require("./ImportFinders");

var findRequires = _require.findRequires;
var findSassImports = _require.findSassImports;

var inlineSourceMapComment = require("inline-source-map-comment");

var fileWriters = {
  ".js": require("./CachingWriter")
};

var Assembler = (function () {
  function Assembler(config) {
    var _this = this;

    _classCallCheck(this, Assembler);

    this.resolver = new Resolver(config.resolve);
    this.depGraph = new Graph();
    this.targetGraph = new Graph();
    this.config = config;
    this.targets = R.mapObjIndexed(function (entryModules, targets) {
      return new Target(targets, entryModules, path.resolve(process.cwd(), _this.config.compile.outputDir));
    }, config.targets);
  }

  _createClass(Assembler, {
    buildAllTargets: {

      /**
       * Build all targets.
       */

      value: function buildAllTargets() {
        var _this = this;

        return R.mapObjIndexed(function (target) {
          return _this.buildTarget(target);
        }, this.targets);
      }
    },
    checkIfNeedsRebuild: {
      value: function checkIfNeedsRebuild(target) {
        var _this = this;

        if (fs.existsSync(target.cachePath)) {
          var targetCacheInfo = JSON.parse(fs.readFileSync(target.cachePath));

          var modifiedDependencies = R.mapObjIndexed(function (_ref, modulePath) {
            var mtime = _ref.mtime;
            return FileCache.getModule(modulePath).mtime === mtime;
          }, targetCacheInfo.modules);

          R.forEach(function (modulePath) {
            return _this.targetGraph.addEdge(modulePath, target.target);
          }, R.keys(targetCacheInfo.modules));
          // R.forEach(modulePath => this.depGraph.addEdge(target.target, modulePath), R.keys(targetCacheInfo.modules));
          R.keys(targetCacheInfo.depGraph).forEach(function (parent) {
            return targetCacheInfo.depGraph[parent].forEach(function (child) {
              return _this.depGraph.addEdge(parent, child);
            });
          });
          var noModifiedDependencies = R.all(function (x) {
            return x;
          }, R.values(modifiedDependencies));
          var sameEntryModuleList = R.eqDeep(targetCacheInfo.entryModules, target.entryModules);

          console.log("mod".green, modifiedDependencies, noModifiedDependencies);
          if (noModifiedDependencies && sameEntryModuleList) {
            return false;
          }
        }
        return true;
      }
    },
    buildTarget: {

      /**
       * Build specific target, writing result to filesystem and returning target and completion time.
       */

      value: function buildTarget(target) {
        var _this = this;

        if (!target) {
          return {};
        }

        var time = new Date().getTime();

        if (!this.checkIfNeedsRebuild(target)) {
          console.log(target.target.green, "no rebuild");
          return {
            target: target.target,
            time: new Date().getTime() - time
          };
        }

        var componentModules = target.entryModules.map(function (comp) {
          return _this.resolver.resolve(process.cwd(), comp);
        });
        var depModules = this.depsForModules(componentModules);

        var writer = new (fileWriters[path.extname(target.target)])(target.filePath);
        writer.loadCacheInfoFromFs();

        var _writer$writeModules = writer.writeModules(componentModules, depModules, this.depGraph);

        var rebuild = _writer$writeModules.rebuild;
        var code = _writer$writeModules.code;
        var map = _writer$writeModules.map;
        var cacheInfo = _writer$writeModules.cacheInfo;

        console.log("asdfasd".cyan, cacheInfo);
        depModules.forEach(function (mod) {
          return _this.targetGraph.addEdge(mod.module.path, target.target);
        });
        cacheInfo.depGraph = this.depGraph.subgraph(R.pluck("path", componentModules)).edges;
        if (rebuild) {
          fs.writeFileSync(target.filePath, code + "\n" + inlineSourceMapComment(map, { sourcesContent: true }));
          fs.writeFileSync(target.cachePath, JSON.stringify(cacheInfo, 2));
        }

        return {
          target: target.target,
          time: new Date().getTime() - time
        };
      }
    },
    depsForModules: {

      // Return an inorder array of modules required to assemble target files.

      value: function depsForModules(componentModules) {
        var _this = this;

        componentModules.forEach(function (target) {
          return _this.walkRequires(target);
        });
        var inorderPaths = this.depGraph.inorder(R.map(R.prop("path"), componentModules));
        var inorderModules = R.props(inorderPaths, this.depGraph.verts);
        console.log("foo".red, inorderPaths, inorderModules);
        return inorderModules;
      }
    },
    walkRequires: {

      // Recursively walks require decorations found in modules, building the dependency graph.

      value: function walkRequires(rootModule) {
        var _this = this;

        rootModule.loadCodeFromFs();
        var depStrs = [];
        if (rootModule.path.indexOf(this.resolver.opts.noRequires) === -1) {
          depStrs = findRequires(rootModule.code);
        }
        console.log("deps of", rootModule.path, depStrs);
        var deps = depStrs.map(R.prop("group")).map(this.resolver.resolve.bind(this.resolver, rootModule.path));
        // Filter out unresolved modules.... (should throw error in the future.)
        deps = deps.filter(function (x) {
          return x;
        });

        deps.forEach(function (dep) {
          return _this.depGraph.addEdge(rootModule.path, dep.path);
        });
        this.depGraph.verts[rootModule.path] = {
          module: rootModule,
          requires: R.zip(depStrs, R.map(R.prop("path"), deps))
        };
        deps.forEach(function (dep) {
          return _this.walkRequires(dep);
        });
      }
    },
    rebuildAfterChange: {
      value: function rebuildAfterChange(changedModule) {
        var _this = this;

        var parentTargets = this.targetGraph.edges[changedModule.path];
        if (parentTargets) {
          console.log(parentTargets.map(function (targetPath) {
            return _this.buildTarget(_this.targets[targetPath]);
          }));
        }
      }
    }
  });

  return Assembler;
})();

module.exports = Assembler;