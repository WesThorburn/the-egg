var argv = require('yargs').argv;
var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cssMin = require('gulp-css');
var shell = require('gulp-shell');
var replace = require('gulp-batch-replace');

gulp.task('scripts', function(){
	gulp.src([
		'./client/js/classes/*.js',
		'./client/js/rendering/*.js',
		'./client/js/selection/*.js',
		'./client/js/controls/*.js',
		'./client/js/gameLoop.js'
		])
		.pipe(concat("theegg.js"))
		.pipe(gulp.dest("./public/js"));
});

gulp.task('watch', function(){
	gulp.watch('./client/js/**/*.js', ['scripts']);
});

gulp.task('default', ['scripts']);


