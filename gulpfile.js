const gulp = require('gulp');
const gulp_ts = require('gulp-typescript');
const gulp_tslint = require('gulp-tslint');
const gulp_sourcemaps = require('gulp-sourcemaps');
const tslint = require('tslint');
const del = require('del');
const path = require('path');

const project = gulp_ts.createProject('tsconfig.json');
const linter = tslint.Linter.createProgram('tsconfig.json');

/*
 This task will transpile the solution suing src/main.ts as the entry point
*/
gulp.task('build', () => {
	del.sync(['./bin/**/*.*']);
	const tsCompile = gulp.src('./src/**/*.ts')
		.pipe(gulp_sourcemaps.init())
		.pipe(project());

	tsCompile.pipe(gulp.dest('bin/'));

	gulp.src('./src/**/*.png')
		.pipe(gulp.dest('bin/'));
	gulp.src('./src/**/*.ttf')
		.pipe(gulp.dest('bin/'));

	gulp.src('./src/**/*.js')
		.pipe(gulp.dest('bin/'));

	gulp.src('./src/**/*.json')
		.pipe(gulp.dest('bin/'));

	return tsCompile.js
		.pipe(gulp_sourcemaps.write(".", { sourceRoot: '../src' }))
		.pipe(gulp.dest('bin/'));
});


/*
 This task will "run" the app using src/index.ts as the entry point
*/
gulp.task('run', ['build'], function (cb) {
	exec('node bin/index.js', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});

/*
 Provide linting support
*/
gulp.task('lint', () => {
	gulp.src('./src/**/*.ts')
		.pipe(gulp_tslint({
			configuration: 'tslint.json',
			formatter: 'prose',
			program: linter
		}))
		.pipe(gulp_tslint.report());
});