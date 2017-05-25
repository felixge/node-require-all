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
### Merging directory modules

In the case where you want to build a single "flat" module that comes from a set of modules within a directory use the `merge` option.
With this option set each file/module will not create it's own "name" property/key in combined module but rather any properties/keys in each file/module will be merged.  In the case where a module file does not export an actual object the "name" property/key will be used.  If you enable recursion *(the default)* the same will happen in each subdirectory.
```js
var merge = requireAll({
  dirname: __dirname + '/merge',
  merge: true
});
```

**Example:**  the directory tree in this repo `/test/merge` will result in this hash   
```js
{
afunction: function test() { return 'afucntionresult' },
anarray: [ 1, 2, 3, 4 ],
astring: 'justastring',
state: 'Kentucky',
world: true,
universe: 42,
first: { second: { third: { third1: 'deep', third2: 'merge' } } },
sub: { system: 'Sol', country: 'France' }
}
```

[npm-image]: https://img.shields.io/npm/v/require-all.svg
[npm-url]: https://npmjs.org/package/require-all
[downloads-image]: https://img.shields.io/npm/dm/require-all.svg
[downloads-url]: https://npmjs.org/package/require-all
[travis-image]: https://img.shields.io/travis/felixge/node-require-all/master.svg
[travis-url]: https://travis-ci.org/felixge/node-require-all
