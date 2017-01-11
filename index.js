var fs = require('fs');

var DEFAULT_EXCLUDE_DIR = /^\./;
var DEFAULT_FILTER = /^([^\.].*)\.js(on)?$/;
var DEFAULT_MERGE = false;
var DEFAULT_RECURSIVE = true;

module.exports = function requireAll(options) {
  var dirname = typeof options === 'string' ? options : options.dirname;
  var excludeDirs = options.excludeDirs === undefined ? DEFAULT_EXCLUDE_DIR : options.excludeDirs;
  var filter = options.filter === undefined ? DEFAULT_FILTER : options.filter;
  var modules = {};
  var merge = options.merge === undefined ? DEFAULT_MERGE : options.merge;
  var recursive = options.recursive === undefined ? DEFAULT_RECURSIVE : options.recursive;
  var resolve = options.resolve || identity;
  var map = options.map || identity;

  function excludeDirectory(dirname) {
    return !recursive ||
      (excludeDirs && dirname.match(excludeDirs));
  }

  function filterFile(filename) {
    if (typeof filter === 'function') {
      return filter(filename);
    }

    var match = filename.match(filter);
    if (!match) return;

    return match[1] || match[0];
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
        merge: merge,
        resolve: resolve
      });

    } else {
      var name = filterFile(file);
      if (!name) return;

      var module = resolve(require(filepath));

      if (merge) {
        if (isObject(module)) {
          for (var key in module) {
            modules[key] = module[key];
          }
        } else {
          modules[map(name, filepath)] = module; //use "name" for module that is not a Object
        }
      } else {
        modules[map(name, filepath)] = module;
      }
    }
  });

  return modules;
};

function identity(val) {
  return val;
}

function isObject(arg) { return Object.prototype.toString.call(arg) === '[object Object]'; }
