var gulp = require('gulp'),
    less = require('gulp-less'),
    livereload = require('gulp-livereload'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    // browserify = require('gulp-browserify-globs');
    source = require('vinyl-source-stream'),
    babelify = require('babelify'),
    util = require('gulp-util'),
    glob = require('glob'),
    buffer = require('vinyl-buffer');


 
gulp.task('css', function() {
  gulp.src('*.css')
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});
gulp.task('html', function() {
  gulp.src('*.html')
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});
gulp.task('php', function() {
  gulp.src('*.php')
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});
gulp.task('scripts', function() {

    var globs = glob.sync('./js/**/*.js');

    browserify({
      entries: globs,
      debug: true
    })
    .transform(babelify)
    .bundle()
    .on('error', err => {
      util.log("Browserify Error", util.colors.red(err.message))
    })
    .pipe(source('all.js'))
    .pipe(buffer())
    // .pipe(sourcemaps.init())
    .pipe(gulp.dest('dist/js'))
    .pipe(livereload());
}); 

gulp.task('dotfiles', function() {
  gulp.src('.htaccess')
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});
gulp.task('copy', function() {
  gulp.src('assets/*.*' )
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});
gulp.task('api', function() {
  gulp.src('api/*/*.*')
    .pipe(gulp.dest('dist/api'))
    .pipe(livereload());
});
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('*.html', ['html']);
  gulp.watch('*.css', ['css']);
  gulp.watch('*.php', ['php']);
  gulp.watch('js/**/*.*', ['scripts']);
  gulp.watch('assets/*.*', ['copy']);
  gulp.watch('.htaccess', ['dotfiles']);
  gulp.watch('api/*/*.*', ['api']);

});	
gulp.task('build', ['css', 'html', 'php', 'scripts', 'copy', 'dotfiles', 'api']);
gulp.task('default', ['watch']);