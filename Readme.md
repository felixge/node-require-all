# require-all

An easy way to require all files within a directory.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]

## Usage

```js
var controllers = require('require-all')({
  dirname     : 'controllers',
  filter      : /(.+Controller)\.js$/,
  excludeDirs : /^\.(git|svn)$/,
  recursive   : true
});

// controllers now is an object with references to all modules matching the filter
// for example:
// { HomeController: function HomeController() {...}, ...}
```

## Advanced usage

If your objective is to simply require all .js and .json files in a directory you can just pass a string to require-all:

``` js
var libs = require('require-all')('lib');
```

### Constructed object usage

If your directory contains files that all export constructors, you can require them all and automatically construct the objects using `resolve`:

```js
var controllers = require('require-all')({
  dirname     : 'controllers',
  filter      : /(.+Controller)\.js$/,
  resolve     : function (Controller, name, path) {
    console.log('Constructor of `%s` from `%s` executed', name, path);
    return new Controller();
  }
});
```

### Alternative property names

If your directory contains files where the names do not match what you want in the resulting property (for example, you want camelCase but the file names are snake_case), then you can use the `map` function. The `map` function is called on both file and directory names, as they are added to the resulting object.

```js
var controllers = require('require-all')({
  dirname : 'controllers',
  filter  : /(.+Controller)\.js$/,
  map     : function (name, path) {
    return name.replace(/_([a-z])/g, function (m, c) {
      return c.toUpperCase();
    });
  }
});
```

[npm-image]: https://img.shields.io/npm/v/require-all.svg
[npm-url]: https://npmjs.org/package/require-all
[downloads-image]: https://img.shields.io/npm/dm/require-all.svg
[downloads-url]: https://npmjs.org/package/require-all
[travis-image]: https://img.shields.io/travis/felixge/node-require-all/master.svg
[travis-url]: https://travis-ci.org/felixge/node-require-all
