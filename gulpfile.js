var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['./*.html']
};

gulp.task("copy-html", function ()
{
    return gulp.src(paths.pages)
        .pipe(gulp.dest("."));
});

//gulp.task("default", ["copy-html"], function () {

gulp.task("default", function ()
{
    return browserify({
        basedir: '.',
        debug: true, // set to false to release
        entries: ['./main.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        //.pipe(uglify()) // comment for debug and uncomment for release version
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("."));
});
