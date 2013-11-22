var fs = require('fs');

module.exports = function requireAll(options) {
  if (typeof options === 'string') {
    options = {
      dirname: options,
      filter: /(.+)\.js(on)?$/,
      excludeDirs: /^\.(git|svn)$/,
      dependencies : options.dependencies
    };
  }

  var files = fs.readdirSync(options.dirname);
  var modules = {};

  function excludeDirectory(dirname) {
    return options.excludeDirs && dirname.match(options.excludeDirs);
  }

  files.forEach(function (file) {
    var filepath = options.dirname + '/' + file;
    if (fs.statSync(filepath).isDirectory()) {

      if (excludeDirectory(file)) return;

      modules[file] = requireAll({
        dirname: filepath,
        filter: options.filter,
        excludeDirs: options.excludeDirs
      });

    } else {
      var match = file.match(options.filter);
      if (!match) return;

      modules[file.split('.')[0]] = require(filepath).apply(this, options.dependencies);
    }
  });

  return modules;
};
