require('blanket')({
  pattern: require('path').join(__dirname, '../')
});

var requireAll = require('..');

describe('require all', function() {

  var controllers = {
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
  };

  var mydir = {
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

  it('should filter files with given `filter`', function() {

    requireAll(__dirname + '/controllers', {
      filter: /(.+Controller)\.js$/
    }).should.eql(controllers);

  });


  it('should include `sub/` and exclude `.svn/` without `excludeDirs`', function() {

    requireAll(__dirname + '/mydir').should.eql(mydir);

  });

  it('should include all directories with `excludeDirs: false`', function() {

    var unfiltered = requireAll(__dirname + '/filterdir', {
      filter: /(.+)\.js$/,
      excludeDirs: false
    }).should.eql({
      '.svn': {
        stuff: true
      },
      sub: {
        hello: true
      },
      root: true
    });

  });

  it('should exclude directories with `excludeDirs: true` and `excludeDirs: /^/`', function() {

    var res = {
      root: true
    };

    requireAll(__dirname + '/filterdir', {
      excludeDirs: true
    }).should.eql(res);

    requireAll(__dirname + '/filterdir', {
      excludeDirs: /^/
    }).should.eql(res);

  });

  it('should sort files first before require with given `sort`', function() {

    Object.keys(requireAll(__dirname + '/order', {
      excludeDirs: false,
      sort: function (lhn, rhn) {
        if (lhn > rhn)
          return -1;
        return 1;
      }
    })).should.eql(['3-1', '2-1', '1-1']);

  });

  it('should work with 0.0.8 style input', function() {

    requireAll({
      dirname: __dirname + '/controllers',
      filter: /(.+Controller)\.js$/
    }).should.eql(controllers);

    requireAll({
      dirname: __dirname + '/filterdir',
      filter: /(.+)\.js$/,
      excludeDirs: /^\.svn$/
    }).should.eql({
      root: true,
      sub: {
        hello: true
      },
    });

  });

});


