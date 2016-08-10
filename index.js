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
      if (toString.call(filter) === "[object RegExp]") {
        var match = file.match(filter);
        if (!match) return;
        modules[map(match[1], filepath)] = resolve(require(filepath));
      } else {
        var match = typeof filter === 'function' ? FunctionFilterHandler(file, filter) :
          Array.isArray(filter) ? ArrayFilterHandler(file, filter) : defaultError();
        if (match) return;
        var fileName = file.replace(/\.[^/.]+$/, "");
        modules[map(fileName, filepath)] = resolve(require(filepath))
      }
    }
  });

  return modules;
};

function identity(val) {
  return val;
}

function FunctionFilterHandler(file, filter) {
  return filter(file);
}

function ArrayFilterHandler(file, filter) {
  if (filter.indexOf(file) !== -1) return true;
  return false;
}

function defaultError() {
  throw new TypeError('Supplied filter not a valid Function or Array type.');
}