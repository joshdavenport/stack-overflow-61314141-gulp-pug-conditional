const gulp = require('gulp');
const gulpPlugins = {
	pug: require('gulp-pug')
}
const html = require('html');
const through2 = require('through2')

pugtest = () => {
	const dataSet = {
		'top.pug': {
			foo: "alpha",
			bar: "bravo"
		},
		'about.pug': {
			foo: "charlie",
			bar: "delta"
		}
	};
	
	return gulp.src('src/**/*.pug')
		.pipe(through2.obj((file, enc, next) => 
			gulpPlugins.pug({
				// Grab the filename, and set pug data to the value found in dataSet by that name
				data: dataSet[file.basename] || {}
			})._transform(file, enc, next)
		))
		.pipe(through2.obj((file, enc, next) => {
			const options = {
				indent_char: ' ',
				indent_size: 4
			};

			if(file.relative.match(/admin\//)) {
				options.indent_size = 2;
			} else if(file.relative.match(/auth\//)) {
				options.indent_size = 3;
			}

			file.contents = new Buffer.from(html.prettyPrint(String(file.contents), options), enc);
			next(null, file);
		}))
		.pipe(gulp.dest('output'));
}
module.exports.pugtest = pugtest;
