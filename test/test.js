var assert = require('assert');
var semver = require('semver');
var requireAll = require('..');

/**
 * TEST #1
 * Recursively load .js files from the `controller` folder that end with `Controller`
 **/
var controllers = requireAll({
  dirname: 'controllers',
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

/**
 * TEST #2
 * Non-recursively load .js files from the `controller` folder that end with `Controller`
 **/
var controllersTop = requireAll({
  dirname: 'controllers',
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

/**
 * TEST #3
 * Recursively load .js files from the `controller` folder that end with `Controller`
 * Replace `-C` for `_c` in the property name using the map option
 **/
var controllersMap = requireAll({
  dirname: 'controllers',
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

/**
 * TEST #4
 * Recursively load .js files from the `controller` folder that end with `Controller`
 * Replace `-C` for `_c` in the property name using the map option
 **/
controllersMap = requireAll({
  dirname: 'controllers',
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

/**
 * TEST #5
 * Require JSON test
 * Only became an option in 0.6+
 **/
if(semver.gt(process.version, 'v0.6.0')) {
  var mydir = requireAll({
    dirname: 'mydir'
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

  var defaults = requireAll('mydir');

  assert.deepEqual(defaults, mydir_contents);
}

/**
 * TEST #6
 * Exclude dirs false
 **/
var unfiltered = requireAll({
  dirname: 'filterdir',
  filter: /(.+)\.js$/,
  excludeDirs: false
});

assert(unfiltered['.svn']);
assert(unfiltered.root);
assert(unfiltered.sub);

/**
 * TEST #7
 * Exclude .svn dirs
 **/
var excludedSvn = requireAll({
  dirname: 'filterdir',
  filter: /(.+)\.js$/,
  excludeDirs: /^\.svn$/
});

assert.equal(excludedSvn['.svn'], undefined);
assert.ok(excludedSvn.root);
assert.ok(excludedSvn.sub);

/**
 * TEST #8
 * Exclude .svn and sub dirs
 **/
var excludedSvnAndSub = requireAll({
  dirname: 'filterdir',
  filter: /(.+)\.js$/,
  excludeDirs: /^(\.svn|sub)$/
});

assert.equal(excludedSvnAndSub['.svn'], undefined);
assert.ok(excludedSvnAndSub.root);
assert.equal(excludedSvnAndSub.sub, undefined);

/**
 * TEST #9
 * Resolve test
 **/
var resolvedValues = requireAll({
  dirname: 'resolved',
  filter: /(.+)\.js$/,
  resolve: function(fn) {
    return fn('arg1', 'arg2');
  }
});

assert.equal(resolvedValues.onearg, 'arg1');
assert.equal(resolvedValues.twoargs, 'arg2');

/**
 * TEST #10
 * Module info test, tests that the name is converted by the map function
 **/
var moduleInfos = [];
var resolvedValues = requireAll({
  dirname: 'resolved',
  filter: /(.+)\.js$/,
  map: function (name) {
    return name.replace(/([A-Za-z]+)/, function (m, c) {
      return c.toUpperCase();
    });
  },
  resolve: function (fn, name, path) {
    moduleInfos.push({
      name: name,
      path: path
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

/**
 * TEST #11
 * Test backwards compatibility with absolute dirnames
 **/
var unfiltered = requireAll({
  dirname: __dirname + '/filterdir',
  filter: /(.+)\.js$/,
});

assert(unfiltered, 'Absolute path backwards compatibility not working');

/**
 * TEST #12
 * Test relative path
 **/
require('./relative-path-test/ab.js');
