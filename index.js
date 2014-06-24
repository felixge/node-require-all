var fs = require('fs');

var defaultOptions = {
  filter: /^(.+)\.js(on)?$/,
  excludeDirs: /^\.(git|svn)$/
};

function extend(obj, ext) {
  for (var key in ext)
    if (obj[key] === undefined)
      obj[key] = ext[key];
  return obj;
}

function requireAll(dirname, options) {

  var files = fs.readdirSync(dirname);
  var modules = {};

  if (options.sort !== undefined)
    files.sort(options.sort);

  files.forEach(function(file) {
    var filepath = dirname + '/' + file;
    if (fs.statSync(filepath).isDirectory()) {
      if (!options.excludeDirs ||
          options.excludeDirs !== true && !options.excludeDirs.test(file))
        modules[file] = requireAll(filepath, options);
    } else {
      var match = file.match(options.filter);
      if (match)
        modules[match[1]] = require(filepath);
    }
  });

  return modules;

}

module.exports = function(dirname, options) {
  if (typeof dirname == 'object') {
    options = {
      filter: dirname.filter,
      excludeDirs: dirname.excludeDirs || false
    };
    dirname = dirname.dirname;
  }
  return requireAll(dirname, extend(options || {}, defaultOptions));
};
