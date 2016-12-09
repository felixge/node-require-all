var fs = require('fs'), path = require('path');

var DEFAULT_EXCLUDE_DIR = /^\./;
var DEFAULT_FILTER = /^([^\.].*)\.js(on)?$/;
var DEFAULT_RECURSIVE = true;

/**
 * Gets the path of the file the requireAll function was called from
 * This is used to make relative paths work
 * @return {string} Path of the file
 */
function getCaller() {
  var origPrepareStackTrace = Error.prepareStackTrace

  Error.prepareStackTrace = function(_, stack) { return stack }

  var stack = new Error().stack;
  Error.prepareStackTrace = origPrepareStackTrace // Restore original function
  
  return stack[2].getFileName();
}

/**
 * Checks if the given path is absolute or not
 **/
function isPathAbsolute(path) {
  return /^(?:\/|[a-z]+:\/\/)/.test(path);
}

module.exports = function requireAll(options) {
  // Initialize options
  var dirname = typeof options === 'string' ? options : options.dirname;
  var excludeDirs = options.excludeDirs === undefined ? DEFAULT_EXCLUDE_DIR : options.excludeDirs;
  var filter = options.filter === undefined ? DEFAULT_FILTER : options.filter;
  var modules = {};
  var recursive = options.recursive === undefined ? DEFAULT_RECURSIVE : options.recursive;
  var resolve = options.resolve || function(a) {return a};
  var map = options.map || function(a) {return a};

  var callerDir = path.dirname(getCaller());

  function excludeDirectory(dirname) {
    return !recursive || (excludeDirs && dirname.match(excludeDirs));
  }

  var dirPath = isPathAbsolute(dirname) ? dirname : callerDir + '/' + dirname;

  var files = fs.readdirSync(dirPath);
  files.forEach(function(file) {
    var filePath = dirPath + '/' + file;

    if(fs.statSync(filePath).isDirectory()) {
      if(excludeDirectory(file)) return;

      modules[map(file, filePath)] = requireAll({
        dirname: filePath,
        filter: filter,
        excludeDirs: excludeDirs,
        map: map,
        resolve: resolve
      });
    } else {
      var match = file.match(filter);
      if(!match) return;

      var name = map(match[1], filePath);

      modules[name] = resolve(require(filePath), name, filePath);
    }
  });

  return modules;
};