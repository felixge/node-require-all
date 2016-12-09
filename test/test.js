var assert = require('assert');
var semver = require('semver');
var requireAll = require('..');

console.log('\nTEST #1:\tdirname: __dirname + `/controllers`\tfilter: `/(.+Controller)\\.js$/');
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


console.log('\nTEST #2:\tdirname: __dirname + `/controllers`\tfilter: `/(.+Controller)\\.js$/\trecursive: false');
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


console.log('\nTEST #3:\tdirname: __dirname + `/controllers`\tfilter: `/(.+Controller)\\.js$/\tmap: replace -C for _c');
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

console.log('\nTEST #4:\tdirname: __dirname + `/controllers`\tfilter: `/(.+Controller)\\.js$/\tmap: replace -C and -c for _c');
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


if(semver.gt(process.version, 'v0.6.0')) { // only became an option in 0.6+
  console.log('\nTEST #5:\tdirname: __dirname + `/mydir`\t\trequire .json file');
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


console.log('\nTEST #6:\tdirname: __dirname + `/filterdir`\tfilter: /(.+)\\.js$/\texcludeDirs: false');
var unfiltered = requireAll({
  dirname: __dirname + '/filterdir',
  filter: /(.+)\.js$/,
  excludeDirs: false
});
assert(unfiltered['.svn']);
assert(unfiltered.root);
assert(unfiltered.sub);


console.log('\nTEST #7:\tdirname: __dirname + `/filterdir`\tfilter: /(.+)\\.js$/\texcludeDirs: /^\\.svn$/');
var excludedSvn = requireAll({
  dirname: __dirname + '/filterdir',
  filter: /(.+)\.js$/,
  excludeDirs: /^\.svn$/
});
assert.equal(excludedSvn['.svn'], undefined);
assert.ok(excludedSvn.root);
assert.ok(excludedSvn.sub);


console.log('\nTEST #8:\tdirname: __dirname + `/filterdir`\tfilter: /(.+)\\.js$/\texcludeDirs: /^(\\.svn|sub)$/');
var excludedSvnAndSub = requireAll({
  dirname: __dirname + '/filterdir',
  filter: /(.+)\.js$/,
  excludeDirs: /^(\.svn|sub)$/
});
assert.equal(excludedSvnAndSub['.svn'], undefined);
assert.ok(excludedSvnAndSub.root);
assert.equal(excludedSvnAndSub.sub, undefined);


console.log('\nTEST #9:\tdirname: __dirname + `/resolved`\tfilter: /(.+)\\.js$/\tresolve: function(fn) {return fn(\'arg1\', \'arg2\');}');
var resolvedValues = requireAll({
  dirname: __dirname + '/resolved',
  filter: /(.+)\.js$/,
  resolve: function(fn) {
    return fn('arg1', 'arg2');
  }
});
assert.equal(resolvedValues.onearg, 'arg1');
assert.equal(resolvedValues.twoargs, 'arg2');


console.log('\nTEST #10:\tdirname: __dirname + `/resolved`\tfilter: /(.+)\\.js$/\tmap: toUpperCase\tresolve: function(fn) {return fn(\'arg1\', \'arg2\');}');
var moduleInfos = [];
var resolvedValues = requireAll({
  dirname: __dirname + '/resolved',
  filter: /(.+)\.js$/,
  map: function(name) {
    return name.replace(/([A-Za-z]+)/, function (m, c) {
      return c.toUpperCase();
    });
  },
  resolve: function(fn, name, path) {
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


console.log('\nTEST #11:\tdirname: `controllers`\t\t\tfilter: `/(.+Controller)\\.js$/');
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


console.log('\nTEST #12:\tdirname: `./controllers`\t\tfilter: `/(.+Controller)\\.js$/');
var controllers = requireAll({
  dirname: './controllers',
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


console.log('\nTEST #13:\tModule caching issue workaround test'); // Module caching issue: https://github.com/felixge/node-require-all/pull/41#issuecomment-265566058
require('./relative-path-test/ab.js');