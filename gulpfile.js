var gulp = require('gulp'); 
var clean = require('gulp-clean');
var jade = require('gulp-jade');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('clean', function() {
  return gulp.src('./dist/')
    .pipe(clean());
});

gulp.task('copy-assets', ['clean'], function() {
  gulp.src('./assets/**/*')
    .pipe(gulp.dest('./dist/assets/'));
});

gulp.task('jade', ['clean'], function() {
  gulp.src('*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('uglify', ['clean'], function() {
  gulp.src('./app/**/*.js')
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/app/'))
});
gulp.task('default', ['clean', 'copy-assets', 'jade', 'uglify']);