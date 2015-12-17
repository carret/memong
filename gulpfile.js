'use strict';

var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var exec = require('child_process').execSync;
var minifyCss = require('gulp-minify-css');
var minifyEjs = require('gulp-minify-ejs');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var runSeq = require('run-sequence');
var less = require('gulp-less');

var connect = require('gulp-connect');
var cache = require('gulp-cached');
var eslint = require('gulp-eslint');
var path = require('path');
var util = require('gulp-util');


var paths = {
    'templates': './src/templates/*.ejs',
    'js': './src/js/**/*.js',
    'styles': './src/styles/**/*.less',
    'src': './src',
    'compiled-css': './src/css',
    'dist': './dist',
    'assets': './assets'
};




// TASK: Build
gulp.task('build', function (done) {
    runSeq(['build-less', 'build-js'], 'build-templates', done);
});

gulp.task('build-less', function () {
    gulp.src(paths.styles)
        .pipe(replace('../', '../../assets/'))
        .pipe(concat('main.css'))
        .pipe(less())
        .pipe(autoprefixer())
        //.pipe(minifyCss())
        .pipe(gulp.dest(paths.dist + '/css'));
});

gulp.task('build-js', function () {
    exec('npm run build', function (err, stdout, stderr) {
        if (err)
            throw err;
        else
            console.log('Build complete!');
    });
});

gulp.task('build-templates', function () {
    gulp.src(paths.templates)
        .pipe(replace('../jspm_packages/system.js', '../js/main.js'))
        .pipe(replace('<script src="../config.js"></script>', ''))
        .pipe(replace("<script>System.import('../js/app');</script>", ''))
        .pipe(replace('"./', '"../../assets/'))
        //.pipe(minifyEjs())
        .pipe(gulp.dest(paths.dist + '/templates'));
});




// TASK: Watch
gulp.task('watch', function() {
    gulp.watch([paths.js], ['lintjs', 'js']).on('change', logChanges);
    gulp.watch([paths.styles], ['less']).on('change', logChanges);
    gulp.watch([paths.templates], ['templates']).on('change', logChanges);
});

function logChanges(event) {
    util.log(
        util.colors.green('File ' + event.type + ': ') +
        util.colors.magenta(path.basename(event.path))
    );
}


// TASK: Connect
gulp.task('connect', function() {
    connect.server({
        root: [paths.src, paths.assets],
        livereload: true,
        fallback: paths.src + '/templates/index.ejs'
    });
});


// TASK: Compile
gulp.task('templates', function() {
    gulp.src(paths.templates)
        .pipe(connect.reload());
});

gulp.task('lintjs', function () {
    return gulp.src(paths.js)
        .pipe(cache('lintjs'))
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('js', function() {
    gulp.src(paths.js)
        .pipe(connect.reload());
});

gulp.task('less', function() {
    gulp.src(paths.styles)
        .pipe(concat('main.css'))
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths['compiled-css']))
        .pipe(connect.reload());
});



// TASK: Default
gulp.task('default', ['connect', 'watch']);