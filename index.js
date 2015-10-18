var fs = require('fs');

var DEFAULT_EXCLUDE_DIR = /^\./;
var DEFAULT_FILTER = /^([^\.].*)\.js(on)?$/;

module.exports = function requireAll(options) {
  var dirname = typeof options === 'string' ? options : options.dirname;
  var excludeDirs = options.excludeDirs === undefined ? DEFAULT_EXCLUDE_DIR : options.excludeDirs;
  var filter = options.filter === undefined ? DEFAULT_FILTER : options.filter;
  var modules = {};
  var resolve = options.resolve || identity;
  var map = options.map || identity;

  function excludeDirectory(dirname) {
    return excludeDirs && dirname.match(excludeDirs);
  }

  var files = fs.readdirSync(dirname);

  files.forEach(function (file) {
    var filepath = dirname + '/' + file;
    if (fs.statSync(filepath).isDirectory()) {

      if (excludeDirectory(file)) return;

      modules[map(file, filepath)] = requireAll({
        dirname: filepath,
        filter: filter,
        excludeDirs: excludeDirs,
        map: map,
        resolve: resolve
      });

    } else {
      var match = file.match(filter);
      if (!match) return;

      modules[map(match[1], filepath)] = resolve(require(filepath));
    }
  });

  return modules;
};

function identity(val) {
  return val;
}
