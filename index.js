if (!global._babelPolyfill) { require('babel-polyfill'); }

module.exports.stats = require('./lib/stats');
console.log(module.exports.stats);