//npm install gulp gulp-sass gulp-minify-css gulp-browserify gulp-uglify gulp-imagemin imagemin-pngquant gulp-htmlmin --save-dev
'use strict';

//输出文件夹
var out = './out/';
//是否压缩
var isPack = 1;
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
        isPack: 0 || isPack
    },
    js: {
        src: ['./js/*.js'],
        watch: ['./js/**'],
        dest: out + 'js',
        isPack: 0 || isPack,
        //模块化js文件shim
        shim: {
            jq: {
                path: '../jq.js',
                //闭包中module是undefined,js代码中将按照没有模块化的方式运行,从而使得成员变量正常添加到全局变量(var a = require('jq')时,a的值将是window.$)
                exports: '$'
            }
        }
    },
    images: {
        src: ['./images/**'],
        watch: ['./images/**'],
        dest: out + 'images'
    },
    html: {
        src: ['./*.html'],
        watch: ['./*.html'],
        dest: out,
        isPack: 0 || isPack
    }
};


//引入gulp
var gulp = require('gulp');


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
    if (conf.isPack) {
        task.pipe(minifyCss())
            .pipe(gulp.dest(conf.dest));
    }
});


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
    if (conf.isPack) {
        task.pipe(uglify())
            .pipe(gulp.dest(conf.dest));
    }
});


//images压缩
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
gulp.task('images', function () {
    var conf = config.images;

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


//html压缩
var htmlmin = require('gulp-htmlmin');
gulp.task('html', function () {
    var conf = config.html;

    if (conf) {
        var task = gulp.src(conf.src)
            .pipe(gulp.dest(conf.dest));

        if (conf.isPack) {
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
    gulp.watch(config.css.watch, ['css']);
    gulp.watch(config.js.watch, ['js']);
    gulp.watch(config.images.watch, ['images']);
    gulp.watch(config.html.watch, ['html']);
});


//默认任务
gulp.task('default', ['watch', 'css', 'js', 'images', 'html']);