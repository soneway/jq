//npm install gulp gulp-sass gulp-minify-css gulp-browserify gulp-uglify gulp-imagemin imagemin-pngquant gulp-htmlmin --save-dev
'use strict';

//输出文件夹
var out = '../dist/';
//是否压缩
var isPack = 0;
//配置对象
var config = {
    css: {
        //源文件
        src: ['./css/*.scss'],
        //监听文件
        watch: ['./css/**'],
        //输出文件夹
        dest: out + 'css',
        //是否压缩
        isPack: undefined
    },
    base64: {
        //是否base64编码
        isPack: undefined
    },
    js: {
        src: ['./js/*.js'],
        watch: ['./js/**'],
        dest: out + 'js',
        isPack: undefined,
        //模块化js文件shim
        shim: {
            jq: {
                path: '../../jq.js',
                //闭包中module是undefined,js代码中将按照没有模块化的方式运行,从而使得成员变量正常添加到全局变量(var a = require('jq')时,a的值将是window.$)
                exports: '$'
            }
        }
    },
    img: {
        src: ['./img/**'],
        watch: ['./img/**'],
        dest: out + 'img'
    },
    html: {
        src: ['./*.html'],
        watch: ['./*.html'],
        dest: out,
        isPack: undefined
    }
};

var gulp = require('gulp');


//css任务
//编译sass,压缩css
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
gulp.task('css', function () {
    var conf = config.css;

    var task = gulp.src(conf.src)
        //编译
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(conf.dest));

    //压缩
    if (conf.isPack === undefined ? isPack : conf.isPack) {
        task.pipe(minifyCss())
            .pipe(gulp.dest(conf.dest));
    }
});

//base64任务
//base64编码(对已编译的css中url文件base64编码)
var base64 = require('gulp-base64');
gulp.task('base64', function () {
    var conf = config.base64,
        cssDest = config.css.dest;

    //base64编码
    if (conf && conf.isPack === undefined ? isPack : conf.isPack) {
        gulp.src([cssDest + '/*.css'])
            .pipe(base64({
                maxImageSize: 8 * 1024 //小于8KB的文件就编码
            }))
            .pipe(gulp.dest(cssDest));
    }
});


//js任务
//browserify编译合并,压缩文件js
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
gulp.task('js', function () {
    var conf = config.js;

    var task = gulp.src(conf.src)
        //编译合并
        .pipe(browserify({
            shim: conf.shim
        }))
        .pipe(gulp.dest(conf.dest));

    //压缩
    if (conf.isPack === undefined ? isPack : conf.isPack) {
        task.pipe(uglify())
            .pipe(gulp.dest(conf.dest));
    }
});


//img任务
//图片压缩
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
gulp.task('img', function () {
    var conf = config.img;

    if (conf) {
        gulp.src(conf.src)
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()]
            }))
            .pipe(gulp.dest(conf.dest));
    }
});


//html任务
//html压缩
var htmlmin = require('gulp-htmlmin');
gulp.task('html', function () {
    var conf = config.html;

    if (conf) {
        var task = gulp.src(conf.src)
            .pipe(gulp.dest(conf.dest));

        if (conf.isPack === undefined ? isPack : conf.isPack) {
            task.pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true,
                minifyCSS: true
            }))
                .pipe(gulp.dest(conf.dest));
        }
    }
});


//监听任务
gulp.task('watch', function () {
    //监听文件变化
    gulp.watch(config.css.watch, ['css', 'base64']);
    gulp.watch(config.js.watch, ['js']);
    gulp.watch(config.img.watch, ['img']);
    gulp.watch(config.html.watch, ['html']);
});


//默认任务(img任务不依赖别的任务且耗时,所以放在第1,base64依赖img和css任务,所以放在靠后)
gulp.task('default', ['watch', 'img', 'css', 'js', 'html', 'base64']);