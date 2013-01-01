var fs    = require('fs');

module.exports = function requireAll(options) {
  var files;
  var modules = {};
  try { files = fs.readdirSync(options.dirname); }
  catch (e) { return false; }

  function excludeDirectory(dirname) {
    return options.excludeDirs && dirname.match(options.excludeDirs);
  }

  files.forEach(function(file) {
    var filepath = options.dirname + '/' + file;
    if (fs.statSync(filepath).isDirectory()) {

      if (excludeDirectory(file)) return;

      modules[file] = requireAll({
        dirname     :  filepath,
        filter      :  options.filter,
        excludeDirs :  options.excludeDirs
      });

    } else {
      var match = file.match(options.filter);
      if (!match) return;

      modules[match[1]] = require(filepath);
    }
  });

  return modules;
};

