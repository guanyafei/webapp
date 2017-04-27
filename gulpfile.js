const path = require('path');
const gulp = require('gulp');
const less = require('gulp-less');
const cssnano = require('gulp-cssnano');
const clean = require('gulp-clean');
const gulpif = require('gulp-if');
const argv = require('yargs').argv;
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();

const paths = {
    less: './src/less/main.less',
    vendors: [
        './node_modules/jquery/dist/jquery.min.js',
        './node_modules/bootstrap/dist/js/bootstrap.min.js'
    ]
};

gulp.task('less', () => {
    return gulp.src('./src/less/main.less')
        .pipe(less())
        .pipe(gulpif(argv.deploy, cssnano()))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('fonts', () => {
    return gulp.src('./src/fonts/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest('./dist/fonts'));
});
/**
 * 将所有的项目第三方依赖的客户端 js 打包压缩成 vendor.js 到 dist/js/vendor.js
 */
gulp.task('vendor', () => {
    return gulp.src(paths.vendors)
        .pipe(concat('vendor.js'))
        .pipe(gulpif(argv.deploy, uglify()))
        .pipe(gulp.dest('./dist/js'));
});


/**
 * 压缩 img 中的图片写入 dist/img
 */
gulp.task('img', () => {
    return gulp.src('./src/images/**/*.{jpg,jpeg,png,gif}')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'));
});


/**
 * 合并压缩 app 中所有的自己的 js 文件到 dist/js/bundle.js
 */
gulp.task('scripts', () => {
    return gulp.src([
            './src/app/**/*.js'
        ])
        .pipe(concat('bundle.js'))
        .pipe(gulpif(argv.deploy, uglify()))
        .pipe(gulp.dest('./dist/js'));
});


gulp.task('template', () => {
    return gulp.src('./src/page/**/*.html')
        .pipe(gulpif(argv.deploy, htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest('./dist/page/'));
});

gulp.task('html', () => {
    return gulp.src('./src/index.html')
        .pipe(gulpif(argv.deploy, htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest('./dist/'));
});

//删除dist文件夹
gulp.task('del', function (callback) {
  gulp.src('./dist', {read: false})
    .pipe(clean());
    callback();
});

gulp.task('watch-html', ['html'], (callback) => {
    browserSync.reload();
    callback();
});
gulp.task('watch-fonts', ['fonts'], (callback) => {
    browserSync.reload();
    callback();
});

gulp.task('watch-template', ['template'], (callback) => {
    browserSync.reload();
    callback();
});

gulp.task('watch-less', ['less'], (callback) => {
    browserSync.reload();
    callback();
});

gulp.task('watch-scripts', ['scripts'], (callback) => {
    browserSync.reload();
    callback();
});


gulp.task('serve', ['fonts', 'template', 'less', 'scripts', 'html', 'vendor', 'img'], () => {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
    gulp.watch('./src/fonts/*.{eot,svg,ttf,woff,woff2}', ['watch-fonts']);
    gulp.watch('./src/page/**/*.html', ['watch-template']);
    gulp.watch('./src/index.html', ['watch-html']);
    gulp.watch('./src/less/**/*.less', ['watch-less']);
    gulp.watch(['./src/app/**/*.js', './src/app/**/*.html'], ['watch-scripts']);
});

gulp.task('default', ['serve']);
