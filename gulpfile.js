var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');
var ejsmin = require('gulp-ejsmin');

var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

var less = require('gulp-less');


var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();

var paths = {
    js: ['./src/**/**/*.js', './src/**/*.js', './src/*.js'],
    css: ['./src/css/**/*.css', './src/css/*.css'],
    less: ['./src/styles/*.less'],
    views: ['./src/views/*.*']
};

gulp.task('build-css', function() {
    return gulp.src(paths.css)
        .pipe(concatCss('main.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
});

gulp.task('build-less', function () {
    return gulp.src(paths.less)
        .pipe(less())
        .pipe(gulp.dest('./build/less'))
        .pipe(browserSync.stream());
});

gulp.task('build-views', function() {
    return gulp.src(paths.views)
        .pipe(ejsmin({removeComment: true}))
        .pipe(gulp.dest('./build/views'))
        .pipe(browserSync.stream());
});

gulp.task('build-js', function() {
    return browserify('./src/main.js')
        .transform(reactify)
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
});

gulp.task('run', ['build-js', 'build-css', 'build-views', 'build-less'], function(cb) {
    var called = false;
    browserSync.init({
        proxy: 'http://localhost:8888',
        port: 3000
    });

    nodemon({
        script: 'app.js',
        env: {
            'NODE_ENV': 'development'
        },
        watch: ['app.js']
    })
        .on('start', function onStart() {
            if (!called) {
                cb();
                called = true;
            }
        })
        .on('restart', function onRestart() {
            setTimeout(function reload() {
                browserSync.reload({
                    stream: false
                });
            }, 500);
        });

    gulp.watch(paths.js, ['build-js']);
    gulp.watch(paths.css, ['build-css']);
    gulp.watch(paths.less, ['build-less']);
    gulp.watch(paths.views, ['build-views']);

});





//Default Task
gulp.task('default', ['run']);