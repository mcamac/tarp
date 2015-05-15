#! /usr/bin/env node

var path = require('path');
var R = require('ramda');
var fs = require('fs');
require('colors');

console.log(process.cwd());
var confPath = path.join(process.cwd(), 'tarp.conf.js');
var config = require(path.join(process.cwd(), 'tarp.conf.js'));

var Watcher = require('./FileWatcher');
var watcher = new Watcher(
  config,
  {glob: ['**/*.js', '**/*.es6', '**/*.jade'], watchman: true});
