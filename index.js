var fs = require('fs');

module.exports = function requireAll(options) {
  if (typeof options === 'string') {
    options = {
      dirname: options,
      filter: /(.+)\.js(on)?$/,
      excludeDirs: /^\.(git|svn)$/
    };
  }

  var files = fs.readdirSync(options.dirname);
  var modules = {};
  var resolve = options.resolve || identity;
  var map = options.map || identity;
  var mapSubDirectoryNames = typeof options.mapSubDirectoryNames === "undefined" ?
      true : options.mapSubDirectoryNames

  function excludeDirectory(dirname) {
    return options.excludeDirs && dirname.match(options.excludeDirs);
  }

  files.forEach(function (file) {
    var filepath = options.dirname + '/' + file;
    if (fs.statSync(filepath).isDirectory()) {

      if (excludeDirectory(file)) return;

      if (mapSubDirectoryNames){
        file = map(file, filepath);
      }

      modules[file] = requireAll({
        dirname: filepath,
        filter: options.filter,
        excludeDirs: options.excludeDirs,
        resolve: resolve,
        map: map
      });

    } else {
      var match = file.match(options.filter);
      if (!match) return;

      modules[map(match[1], filepath)] = resolve(require(filepath));
    }
  });

  return modules;
};

function identity(val) {
  return val;
}
