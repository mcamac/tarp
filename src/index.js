function buildTarget(target, components) {
  var time = new Date().getTime();
  var componentModules = R.map(resolver.resolve.bind(resolver, confPath), components);
  var modules = Assembler.assemble(componentModules, resolver);
  var CachingWriter = require('./CachingWriter');
  var CSSWriter = require('./CSSWriter');
  var writer = path.extname(target) === '.js' ? new CachingWriter('dist/' + target) : new CSSWriter('dist/' + target);
  writer.loadCacheInfoFromFs();
  var targetCode = writer.writeModules(componentModules, modules);
  fs.writeFileSync('dist/' + target, targetCode);
  return {
    target: target,
    built: targetCode,
    time: new Date().getTime() - time
  };
}

module.exports = {
  buildTarget: buildTarget
};
