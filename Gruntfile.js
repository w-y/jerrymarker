module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/fix-ie.js', 'src/parser.js', 'src/ast.js', 'src/util.js', 'src/main.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'src/ast.js', 'src/util.js', 'src/main.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    },
    compile: {
      files: [{
        src: ['src/parser.jison'],
        dest: 'src/parser.compiled.js',
        module: 'jerrymarker'
      }]
    },
    preprocessor: {
      files: [{
        src: ['src/parser.compiled.js'],
        dest: 'src/parser.js'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-sed');

  grunt.loadTasks('tasks');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('build', ['compile', 'preprocessor']);

  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};
