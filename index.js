/*jslint node:true */
var RequireAll = (function () {
    'use strict';
    
    var fs = require('fs'),

        excludeDirectory = function (excludeDirs, dirname) {
            return excludeDirs && dirname.match(excludeDirs);
        },

        loadAllModules = function (options) {
            var files   = fs.readdirSync(options.dirname),
                modules = {};
    
            files.forEach(function (file) {
                if (excludeDirectory(options.excludeDirs, file)) {
                    return;
                }
                
                var filepath = options.dirname + '/' + file;
            
                if (fs.statSync(filepath).isDirectory()) {
                    modules[file] = loadAllModules({
                        dirname     :  filepath,
                        filter      :  options.filter,
                        excludeDirs :  options.excludeDirs,
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