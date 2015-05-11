var path = require('path');

var SRC_DIR = path.resolve(__dirname, 'src');

module.exports = {
  targets: {
    'A.js': ['A1.js', 'A2.js'],
    'B.js': ['B-entry.js']
  },
  resolve: {
    root: SRC_DIR,
    ext: ['', 'js'],
    alias: {}
  },
  compile: {
    mode: 'concat'
  },
  dev: {
    watch: [SRC_DIR],
    server: {
      port: 4446
    }
  }
};
