var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');
var ejsmin = require('gulp-ejsmin');

var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();

var paths = {
    js: ['./src/**/**/*.jsx', './src/**/*.jsx', './src/*.jsx'],
    css: ['./src/css/**/*.css', './src/css/*.css'],
    views: ['./src/views/*.*']
};




gulp.task('build-js', function() {
    return browserify('./src/main.jsx')
        .transform(reactify)
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
});

gulp.task('build-css', function() {
    return gulp.src(paths.css)
        .pipe(concatCss('main.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
});

gulp.task('build-views', function() {
    return gulp.src(paths.views)
        .pipe(ejsmin({removeComment: true}))
        .pipe(gulp.dest('./build/views'))
        .pipe(browserSync.stream());
});


gulp.task('run', ['build-js', 'build-css', 'build-views'], function(cb) {
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
    gulp.watch(paths.views, ['build-views']);
});





//Default Task
gulp.task('default', ['run']);