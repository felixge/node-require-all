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

var controllersMap = requireAll({
  dirname: __dirname + '/controllers',
  filter: /.+Controller\.js$/
});

assert.deepEqual(controllersMap, {
  'main-Controller.js': {
    index: 1,
    show: 2,
    add: 3,
    edit: 4
  },
  'other-Controller.js': {
   index: 1,
   show: 'nothing'
  },
  'sub-dir': {
    'other-Controller.js': {
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

if (semver.gt(process.version, 'v0.8.0')) {

var merge = requireAll({
  dirname: __dirname + '/merge',
  merge: true
});

var merge_contents =  {
  afunction: merge.afunction,
  anarray: [ 1, 2, 3, 4 ],
  astring: 'justastring',
  state: 'Kentucky',
  world: true,
  universe: 42,
  first: { second: { third: { third1: 'deep', third2: 'merge' } } },
  sub: { system: 'Sol', country: 'France' } }

assert.deepEqual(merge, merge_contents);
assert.equal(merge.afunction.toString(),merge_contents.afunction.toString())

}
