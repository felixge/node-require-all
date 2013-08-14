/*jslint node:true */
var RequireAll = (function () {
    'use strict';
    
    var fs = require('fs'),

        exclude = function (excludeRegexp, name) {
            return excludeRegexp && name.match(excludeRegexp);
        },

        loadAllModules = function (options) {
            var files   = fs.readdirSync(options.dirname),
                modules = {};
    
            files.forEach(function (file) {
                if (exclude(options.exclude, file)) {
                    return;
                }
                
                var filepath = options.dirname + '/' + file;
            
                if (fs.statSync(filepath).isDirectory()) {
                    modules[file] = loadAllModules({
                        dirname     :  filepath,
                        filter      :  options.filter,
                        exclude :  options.exclude,
                        dependencies : options.dependencies
                    });
                } else {
                    if (file.match(options.filter)) {
                        modules[file.split('.')[0]] = require(filepath).apply(this, options.dependencies);
                    }
                }
            });
        };

    return {
        loadAllModules : loadAllModules
    };
}());

module.exports = RequireAll;