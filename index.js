var fs = require('fs'), path = require('path');

var DEFAULT_EXCLUDE_DIR = /^\./;
var DEFAULT_FILTER = /^([^\.].*)\.js(on)?$/;
var DEFAULT_RECURSIVE = true;

/**
 * Gets the path of the file the requireAll function was called from
 * @return {string} Path of the file
 */
function getCaller() {
  var origPrepareStackTrace = Error.prepareStackTrace;
  var origStackTraceLimit = Error.stackTraceLimit;
  
  Error.stackTraceLimit = Infinity;
  Error.prepareStackTrace = function(_, stack) { return stack }

  var stack = new Error().stack;

  Error.prepareStackTrace = origPrepareStackTrace; // Restore original function
  Error.stackTraceLimit = origStackTraceLimit;

  return stack[2].getFileName();
}

/**
 * Checks if the given path is absolute or not
 * @return {boolean} true if path is absolute, otherwise false
 **/
function isAbsolutePath(p) {
  return path.resolve(p) == path.normalize(p);
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

  function filterFile(filename) {
    if (typeof filter === 'function') {
      return filter(filename);
    }

    var match = filename.match(filter);
    if (!match) return;

    return match[1];
  }
  
  var callerDir = path.dirname(getCaller());
  var dirPath = isAbsolutePath(dirname) ? dirname : callerDir + '/' + dirname;
  
  var files = fs.readdirSync(dirPath);
  files.forEach(function(file) {
    var filePath = dirPath + '/' + file;

    if(fs.statSync(filePath).isDirectory()) {
      if(!recursive || (excludeDirs && file.match(excludeDirs))) return;

      modules[map(file, filePath)] = requireAll({
        dirname: filePath,
        filter: filter,
        excludeDirs: excludeDirs,
        map: map,
        resolve: resolve
      });
    } else {
      var name = filterFile(file);
      if (!name) return;
      
      name = map(name, filePath);

      modules[name] = resolve(require(filePath), name, filePath);
    }
  });

  return modules;
};