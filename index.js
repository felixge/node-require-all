
var RequireAll = function() {
  fs = require('fs'),

  excludeDirectory = function (excludeDirs, dirname) {
    return excludeDirs && dirname.match(excludeDirs);
  },

  loadAllModules = function (options) {
    var files   = fs.readdirSync(options.dirname);
    var modules = {};

    files.forEach(function(file) {
      var filepath = options.dirname + '/' + file;
      if (fs.statSync(filepath).isDirectory()) {

        if (excludeDirectory(options.excludeDirs, file)) {
          return;
        }

        modules[file] = loadAllModules({
          dirname     :  filepath,
          filter      :  options.filter,
          excludeDirs :  options.excludeDirs,
          dependencies : options.dependencies
        });

      } else {
        var match = file.match(options.filter);
        if (match) {
          modules[file.split('.')[0]] = require(filepath).apply(this, options.dependencies);
        }
      }
    });
  };

  return {
    loadAllModules : loadAllModules
  };
}();

module.exports = RequireAll;