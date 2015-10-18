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
  var filter = options.filter || /^(.*)$/;
  var resolve = options.resolve || identity;
  var map = options.map || identity;

  function excludeDirectory(dirname) {
    return options.excludeDirs && dirname.match(options.excludeDirs);
  }

  files.forEach(function (file) {
    var filepath = options.dirname + '/' + file;
    if (fs.statSync(filepath).isDirectory()) {

      if (excludeDirectory(file)) return;

      modules[map(file, filepath)] = requireAll({
        dirname: filepath,
        filter: filter,
        excludeDirs: options.excludeDirs,
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
