var fs = require('fs');

var DEFAULT_EXCLUDE_DIR = /^\./;
var DEFAULT_FILTER = /^([^\.].*)\.js(on)?$/;
var DEFAULT_RECURSIVE = true;

module.exports = function requireAll(options) {
  var dirname = typeof options === 'string' ? options : options.dirname;
  var excludeDirs = options.excludeDirs === undefined ? DEFAULT_EXCLUDE_DIR : options.excludeDirs;
  var filter = options.filter === undefined ? DEFAULT_FILTER : options.filter;
  var modules = {};
  var recursive = options.recursive === undefined ? DEFAULT_RECURSIVE : options.recursive;
  var resolve = options.resolve || identity;
  var map = options.map || identity;

  function excludeDirectory(dirname) {
    return !recursive ||
      (excludeDirs && dirname.match(excludeDirs));
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
      // Support old regex filters or array of filenames filter
      if((Array.isArray(filter) && filter.indexOf(file) === -1) || file.match(filter)) return;
      modules[map(file, filepath)] = resolve(require(filepath));
    }
  });

  return modules;
};

function identity(val) {
  return val;
}
