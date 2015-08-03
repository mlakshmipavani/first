var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-ruby-sass');

gulp.task('sass', function() {
    return sass('./public/css/')
        .pipe(gulp.dest('./public/css'))
        .pipe(livereload());
});

gulp.task('watch', function() {
    gulp.watch('./public/css/*.scss', ['sass']);
});

gulp.task('develop', function() {
    livereload.listen();
    nodemon({
        script: 'bin/www',
        ext: 'js jade coffee',
        env: {
            'MONGO_URL': 'mongodb://172.30.16.238:27017/stayyolo'
        }
    }).on('restart', function() {
        setTimeout(function() {
            livereload.changed(__dirname);
        }, 500);
    });
});

gulp.task('build', function() {
    return sass('./public/css/')
        .pipe(gulp.dest('./public/css'));
});

gulp.task('default', [
    'sass',
    'develop',
    'watch'
]);