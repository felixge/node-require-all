var fs = require('fs'), path = require('path'); // Directory of the module from which requireAll is called from

var DEFAULT_EXCLUDE_DIR = /^\./;
var DEFAULT_FILTER = /^([^\.].*)\.js(on)?$/;
var DEFAULT_RECURSIVE = true;

/**
 * Gets the path of the file the requireAll function was called from
 * This is used to make relative paths work
 */
function getCaller() {
  var origPrepareStackTrace = Error.prepareStackTrace

  Error.prepareStackTrace = function(_, stack) { return stack }

  var stack = new Error().stack; // Get stack and remove this
  Error.prepareStackTrace = origPrepareStackTrace // Restore original function
  
  return stack[2].getFileName();
}

module.exports = function requireAll(options) {
  var parentDir = path.dirname(getCaller());
  
  var dirname = typeof options === 'string' ? options : options.dirname;
  var excludeDirs = options.excludeDirs === undefined ? DEFAULT_EXCLUDE_DIR : options.excludeDirs;
  var filter = options.filter === undefined ? DEFAULT_FILTER : options.filter;
  var modules = {};
  var recursive = options.recursive === undefined ? DEFAULT_RECURSIVE : options.recursive;
  var resolve = options.resolve || identity;
  var map = options.map || identity;

  function excludeDirectory(dirname) {
    return !recursive || (excludeDirs && dirname.match(excludeDirs));
  }
  
  var dirPath = dirname;
  if(!path.isAbsolute(dirname)) dirPath = parentDir + '/' + dirname;
  
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

function identity(val) {
  return val;
}
