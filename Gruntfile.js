module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodewebkit: {
            options: {
                build_dir: './build',
                mac: true,
                win: true,
                linux32: true,
                linux64: true
            },
            src: ['index.html', 'package.json', './css/**/*', './fonts/**/*', './img/**/*', './js/**/*', './node_modules/**/*', 'LICENSE', 'favicon.png']
        }
    });
    
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.registerTask('default', ['nodewebkit']);
};
