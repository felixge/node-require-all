var fs    = require('fs');

module.exports = function requireAll(options) {
  var files = fs.readdirSync(options.dirname);
  var modules = {};

  files.forEach(function(file) {
    var match = file.match(options.filter);
    if (!match) return;

    var moduleName      = match[1];
    modules[moduleName] = require(options.dirname + '/' + moduleName);
  });

  return modules;
};

