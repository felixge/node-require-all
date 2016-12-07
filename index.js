var fs = require('fs'), path = require('path');

var parentDir = path.dirname(module.parent.filename); // Directory of the module from which requireAll is called from

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

      var name = map(match[1], filepath);

      modules[name] = resolve(require(filepath), name, filepath);
    }
  });

  return modules;
};

function identity(val) {
  return val;
}
