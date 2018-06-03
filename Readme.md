# require-all

An easy way to require all files within a directory.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]

## Usage

```js
var controllers = require('require-all')({
  dirname     :  __dirname + '/controllers',
  filter      :  /(.+Controller)\.js$/,
  excludeDirs :  /^\.(git|svn)$/,
  recursive   : true
});

// controllers now is an object with references to all modules matching the filter
// for example:
// { HomeController: function HomeController() {...}, ...}
```

## Advanced usage

If your objective is to simply require all .js and .json files in a directory
you can just pass a string to require-all:

``` js
var libs = require('require-all')(__dirname + '/lib');
```

### Constructed object usage

If your directory contains files that all export constructors, you can require
them all and automatically construct the objects using `resolve`:

```js
var controllers = require('require-all')({
  dirname     :  __dirname + '/controllers',
  filter      :  /(.+Controller)\.js$/,
  resolve     : function (Controller) {
    return new Controller();
  }
});
```

### Alternative property names

If your directory contains files where the names do not match what you want in
the resulting property (for example, you want camelCase but the file names are
snake_case), then you can use the `map` function. The `map` function is called
on both file and directory names, as they are added to the resulting object.

```js
var controllers = require('require-all')({
  dirname :  __dirname + '/controllers',
  filter  :  /(.+Controller)\.js$/,
  map     : function (name, path) {
    return name.replace(/_([a-z])/g, function (m, c) {
      return c.toUpperCase();
    });
  }
});
```

### Filtering files

If your directory contains files that you do not want to require, or that you
want only a part of the file's name to be used as the property name, `filter`
can be a regular expression. In the following example, the `filter` is set to
`/^(.+Controller)\.js$/`, which means only files that end in "Controller.js"
are required, and the resulting property name will be the name of the file
without the ".js" extension. For example, the file "MainController.js" will
match, and since the first capture group will contain "MainController", that
will be the property name used. If no capture group is used, then the entire
match will be used as the name.

```js
var controllers = require('require-all')({
  dirname : __dirname + '/controllers',
  filter  : /^(.+Controller)\.js$/
});
```

For even more advanced usage, the `filter` option also accepts a function that
is invoked with the file name as the first argument. The filter function is
expected to return a falsy value to ignore the file, otherwise a string to use
as the property name.

```js
var controllers = requireAll({
  dirname : __dirname + '/controllers',
  filter  : function (fileName) {
    var parts = fileName.split('-');
    if (parts[1] !== 'Controller.js') return;
    return parts[0];
  }
});
```

Note that empty directories are always excluded from the end result.

[npm-image]: https://img.shields.io/npm/v/require-all.svg
[npm-url]: https://npmjs.org/package/require-all
[downloads-image]: https://img.shields.io/npm/dm/require-all.svg
[downloads-url]: https://npmjs.org/package/require-all
[travis-image]: https://img.shields.io/travis/felixge/node-require-all/master.svg
[travis-url]: https://travis-ci.org/felixge/node-require-all
