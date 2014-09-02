'use strict';

var jison = require('jison');
var ebnfParser = require('ebnf-parser');
var lexParser = require('lex-parser');
var path = require('path');

module.exports = function(grunt) {

    var file = grunt.file;
    var option = grunt.option;
    var config = grunt.config;

    grunt.registerTask('compile', 'jison rules to js', function() {

        config.data.compile.files.forEach(function(f) {

            var src = f.src.shift();

            if (!src) {
                return false;
            }
            var dest = f.dest;

            if (!dest) {
                return false;
            }
            var bnf = file.read(src, 'utf-8');
            var grammar = ebnfParser.parse(bnf);

            var jerrymarker = new jison.Generator(grammar, {});
            var js = jerrymarker.generate({
                'moduleName' : f.module,
                'module-type': 'js'
            });

            file.write(dest, js);
            grunt.log.oklns('generate ' + dest);
        });
    });
};
