var assert = require('assert');
var semver = require('semver');
var requireAll = require('..');

var controllers = requireAll({
  dirname: __dirname + '/controllers',
  filter: /(.+Controller)\.js$/
});

assert.deepEqual(controllers, {
  'main-Controller': {
    index: 1,
    show: 2,
    add: 3,
    edit: 4
  },

  'other-Controller': {
    index: 1,
    show: 'nothing'
  },

  'sub-dir': {
    'other-Controller': {
      index: 1,
      show: 2
    }
  }
});

var controllersTop = requireAll({
  dirname: __dirname + '/controllers',
  filter: /(.+Controller)\.js$/,
  recursive: false
});

assert.deepEqual(controllersTop, {
  'main-Controller': {
    index: 1,
    show: 2,
    add: 3,
    edit: 4
  },

  'other-Controller': {
    index: 1,
    show: 'nothing'
  }
});

var controllersMap = requireAll({
  dirname: __dirname + '/controllers',
  filter: /(.+Controller)\.js$/,
  map: function (name) {
    return name.replace(/-([A-Z])/, function (m, c) {
      return '_' + c.toLowerCase();
    });
  }
});

assert.deepEqual(controllersMap, {
  main_controller: {
    index: 1,
    show: 2,
    add: 3,
    edit: 4
  },

  other_controller: {
    index: 1,
    show: 'nothing'
  },

  'sub-dir': {
    other_controller: {
      index: 1,
      show: 2
    }
  }
});


controllersMap = requireAll({
  dirname: __dirname + '/controllers',
  filter: /(.+Controller)\.js$/,
  map: function (name) {
    return name.replace(/-([A-Za-z])/, function (m, c) {
      return '_' + c.toLowerCase();
    });
  }
});

assert.deepEqual(controllersMap, {
  main_controller: {
    index: 1,
    show: 2,
    add: 3,
    edit: 4
  },

  other_controller: {
    index: 1,
    show: 'nothing'
  },

  sub_dir: {
    other_controller: {
      index: 1,
      show: 2
    }
  }
});

controllersMap = requireAll({
  dirname: __dirname + '/controllers',
  filter: /(.+Controller)\.js$/,
  map: function (name) {
    return name.replace(/-([A-Za-z])/, function (m, c) {
      return '_' + c.toLowerCase();
    });
  }
});

assert.deepEqual(controllersMap, {
  main_controller: {
    index: 1,
    show: 2,
    add: 3,
    edit: 4
  },

  other_controller: {
    index: 1,
    show: 'nothing'
  },

  sub_dir: {
    other_controller: {
      index: 1,
      show: 2
    }
  }
});

//
// requiring json only became an option in 0.6+
//
if (semver.gt(process.version, 'v0.6.0')) {
  var mydir = requireAll({
    dirname: __dirname + '/mydir'
  });

  var mydir_contents = {
    foo: 'bar',
    hello: {
      world: true,
      universe: 42
    },
    sub: {
      config: {
        settingA: 'A',
        settingB: 'B'
      },
      yes: true
    }
  };

  assert.deepEqual(mydir, mydir_contents);

  var defaults = requireAll(__dirname + '/mydir');

  assert.deepEqual(defaults, mydir_contents);
}

var unfiltered = requireAll({
  dirname: __dirname + '/filterdir',
  filter: /(.+)\.js$/,
  excludeDirs: false
});

assert(unfiltered['.svn']);
assert(unfiltered.root);
assert(unfiltered.sub);

var excludedSvn = requireAll({
  dirname: __dirname + '/filterdir',
  filter: /(.+)\.js$/,
  excludeDirs: /^\.svn$/
});

assert.equal(excludedSvn['.svn'], undefined);
assert.ok(excludedSvn.root);
assert.ok(excludedSvn.sub);

var excludedSvnAndSub = requireAll({
  dirname: __dirname + '/filterdir',
  filter: /(.+)\.js$/,
  excludeDirs: /^(\.svn|sub)$/
});

assert.equal(excludedSvnAndSub['.svn'], undefined);
assert.ok(excludedSvnAndSub.root);
assert.equal(excludedSvnAndSub.sub, undefined);

var resolvedValues = requireAll({
  dirname: __dirname + '/resolved',
  filter: /(.+)\.js$/,
  resolve: function (fn) {
    return fn('arg1', 'arg2');
  }
});

assert.equal(resolvedValues.onearg, 'arg1');
assert.equal(resolvedValues.twoargs, 'arg2');

var filterFunction = requireAll({
  dirname: __dirname + '/controllers',
  filter: function (fileName) {
    var parts = fileName.split('-');
    if (parts[1] !== 'Controller.js') return;
    return parts[0];
  }
});

assert.deepEqual(filterFunction, {
  'main': {
    index: 1,
    show: 2,
    add: 3,
    edit: 4
  },

  'other': {
    index: 1,
    show: 'nothing'
  },

  'sub-dir': {
    'other': {
      index: 1,
      show: 2
    }
  }
});

// Tests that the absolute file path is + propertyname converted by the map
// function are passed to the resolve function
var moduleInfos = [];
var resolvedValues = requireAll({
  dirname: __dirname + '/resolved',
  filter: /(.+)\.js$/,
  map: function (name) {
    return name.replace(/([A-Za-z]+)/, function (m, c) {
      return c.toUpperCase();
    });
  },
  resolve: function (fn, name, filepath) {
    moduleInfos.push({
      name: name,
      path: filepath
    });
    return fn('arg1', 'arg2');
  }
});

assert.equal(resolvedValues.ONEARG, 'arg1');
assert.equal(resolvedValues.TWOARGS, 'arg2');
assert.equal(moduleInfos[0].name, 'ONEARG');
assert.equal(moduleInfos[0].path, __dirname + '/' + 'resolved/onearg.js');
assert.equal(moduleInfos[1].name, 'TWOARGS');
assert.equal(moduleInfos[1].path, __dirname + '/' + 'resolved/twoargs.js');
