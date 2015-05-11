var square = d => d * d;
var cube = require('B-req1-1');

module.exports = d => square(cube(d));
