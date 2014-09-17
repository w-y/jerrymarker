'use strict';

var path = require('path');
var fs = require('fs');

module.exports = function(grunt) {

    var file = grunt.file;
    var option = grunt.option;
    var config = grunt.config;
    var util = grunt.util;

    grunt.registerTask('postprocessor', 'remove jison cmd code', function() {


        config.data.postprocessor.files.forEach(function(f) {

            var lines;
            var src = f.src.shift();

            if (!src) {
                return false;
            }
            var dest = f.dest;
            if (!dest) {
                return false;
            }

            var fileContents = file.read(src);
            var bufferArr = fileContents.split(util.linefeed);
            var lines = bufferArr.length;

            var processed = bufferArr.slice(0, lines-16);
            var output = processed.join(util.linefeed);

            file.write(dest, output);

            fs.unlinkSync(src);
            grunt.log.oklns('preprocessor ok ' + dest);
        });
    });
};
