
var RequireAll = function() {
  fs = require('fs'),

  function excludeDirectory(dirname) {
    console.log('************ ' + dirname);
    return options.excludeDirs && dirname.match(options.excludeDirs);
  },

  loadAllModules = function (options) {
    var files   = fs.readdirSync(options.dirname);
    var modules = {};

    files.forEach(function(file) {
      var filepath = options.dirname + '/' + file;
      if (fs.statSync(filepath).isDirectory()) {

        if (excludeDirectory(file)) {
          return;
        }

        modules[file] = requireAll({
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