'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	cssmin = require('gulp-minify-css'),
	browserSync = require('browser-sync'),
	imagemin = require('gulp-imagemin'),
	reload = browserSync.reload;

var path = {
	build: { //Тут мы укажем куда складывать готовые после сборки файлы
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: { //Пути откуда брать исходники
		js: 'src/js/*.js',
		style: 'src/style/main.scss',
		img: 'src/img/**/*.*', 
		fonts: 'src/fonts/**/*.*'
	},
	watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	clean: './build'
};

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: "./"
    },
    port: 8080,
    open: true,
    notify: false
  });
});

gulp.task('js:build', function () {
	gulp.src(path.src.js) //Найдем наш main файл
		.pipe(sourcemaps.init()) //Инициализируем sourcemap
		.pipe(sourcemaps.write()) //Пропишем карты
		.pipe(uglify()) //Сожмем наш js
		.pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
		.pipe(reload({stream:true}));
});

gulp.task('style:build', function () {
	gulp.src(path.src.style) //Выберем наш main.scss
		.pipe(sourcemaps.init()) //Инициализируем sourcemap
		.pipe(sass()) //Скомпилируем
		.pipe(prefixer()) //Добавим вендорные префиксы
		.pipe(cssmin()) //Сожмем
		.pipe(sourcemaps.write())//Пропишем карты
		.pipe(gulp.dest(path.build.css)) //И в build
		.pipe(reload({stream:true}));
});

gulp.task('fonts:build', function() {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(reload({stream:true}));
});

gulp.task('image:build', function () {
	gulp.src(path.src.img) //Выберем наши картинки
		.pipe(imagemin())
		.pipe(gulp.dest(path.build.img)) //И бросим в build
		.pipe(reload({stream:true}));
});

gulp.task('build', [
	'js:build',
	'style:build',
	'fonts:build',
	'image:build'
]);

gulp.task('watch' ,function(){
	watch([path.watch.style], function(event, cb) {
		gulp.start('style:build');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('image:build');
	});
	watch([path.watch.fonts], function(event, cb) {
		gulp.start('fonts:build');
	});
	gulp.watch('*.html', browserSync.reload);
});



gulp.task('default', ['build', 'watch', 'browserSync']);