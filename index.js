require = require("esm")(module/*, options*/);
console.time('mostly-plugins-common import');
module.exports.stats = require('./src/stats').default;
console.timeEnd('mostly-plugins-common import');
