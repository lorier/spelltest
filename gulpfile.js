var gulp = require('gulp'),
    less = require('gulp-less'),
    livereload = require('gulp-livereload');
 
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
  gulp.src('write.php')
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});
gulp.task('scripts', function() {
  gulp.src('scripts.js')
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});
gulp.task('copy', function() {
  gulp.src('assets/*.*')
    .pipe(gulp.dest('dist/assets'))
    .pipe(livereload());
});
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('*.html', ['html']);
  gulp.watch('*.css', ['css']);
  gulp.watch('*.php', ['php']);
  gulp.watch('scripts.js', ['scripts']);
  gulp.watch('assets/*.*', ['copy']);

});	
gulp.task('build', ['css', 'html', 'php', 'scripts', 'copy']);
gulp.task('default', ['watch']);