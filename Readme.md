# require-all

An easy way to require all files within a directory.

## Usage

```js
require('require-all')(dirname[, options]);
```

which returns a object containing all files required.

`options`, optional, a Object to change default behavior.

See test for more examples.

### options.filter

a RegExp used to filter files.

**Example**

`/(.+Controller)\.js$/`

**Default**

`/^(.+)\.js(on)?$/`

**Note**

First match of the expression will be used as the key in the returning object.


### options.excludeDirs

a RegExp used to exclude directories.

**Example**

`/^/`

**Default**

`/^\.(git|svn)$/`

**Note**

When give `false`, it will include all sub directories, while `true` will
exclude all.

### options.sort

a Function used to sort files before require them.

**Example**

```js

funcion(leftHandName, rightHandName) {
  if (leftHandName < rightHandName)
    return -1;
  return 1;
}
```

**Default**

`undefined`

**Note**

This may not work as desired when file name is a number.

## Update from 0.0.8

require-all still take old options format, and behave the same as before. But it
may be changed in the future.

Update to 0.1.0 will only take seconds:

1. if you're not using options, nothing need to be done;
2. otherwise, move options.dirname to first argument;
3. update `excludeDirs`

  1. remove it if you are using default value;
  2. _or_ set it to `true`, if you want to exclude all dirs;
  3. _or_ set it to `false`, if you want to include all dirs.

4. update `filter`

  1. remove it if you are using default value;
  2. _or_ leave it as it with your setting.
