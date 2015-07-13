//npm install gulp gulp-sass gulp-minify-css gulp-browserify gulp-uglify --save-dev
'use strict';

//输出文件夹
var dest = './out';
//配置对象
var config = {
    css: {
        //源文件
        src: ['./css/*.scss'],
        //监听文件
        watch: ['./css/**'],
        //输出文件夹
        dest: dest,
        //是否压缩
        isPack: 1
    },
    js: {
        src: ['./js/*.js'],
        watch: ['./js/**'],
        dest: dest,
        isPack: 1,
        //模块化js文件shim
        shim: {
            jq: {
                path: '../jq.js', exports: '$'
            },
            base: {
                path: '../ui/base.js', exports: null
            },
            ui: {
                path: '../ui/ui.js', exports: null
            },
            carousel: {
                path: '../plugin/carousel.js', exports: null
            },
            customalert: {
                path: '../plugin/customalert.js', exports: null
            },
            flip: {
                path: '../plugin/flip.js', exports: null
            },
            picpager: {
                path: '../plugin/picpager.js', exports: null
            },
            scratchcard: {
                path: '../plugin/scratchcard.js', exports: null
            },
            scroll: {
                path: '../plugin/scroll.js', exports: null
            },
            swatchbook: {
                path: '../plugin/swatchbook.js', exports: null
            },
            turntable: {
                path: '../plugin/turntable.js', exports: null
            }
        }
    }
};


//引入gulp
var gulp = require('gulp');


//编译sass,压缩css
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
gulp.task('css', function () {
    var css = config.css;

    var task = gulp.src(css.src)
        //编译
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(css.dest));

    //压缩
    if (css.isPack) {
        task.pipe(minifyCss())
            .pipe(gulp.dest(css.dest));
    }
});


//browserify编译合并,压缩文件js
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
gulp.task('js', function () {
    var js = config.js;

    var task = gulp.src(js.src)
        //编译合并
        .pipe(browserify({
            shim: js.shim
        }))
        .pipe(gulp.dest(js.dest));

    //压缩
    if (js.isPack) {
        task.pipe(uglify())
            .pipe(gulp.dest(js.dest));
    }
});


//监听任务
gulp.task('watch', function () {
    //监听文件变化
    gulp.watch(config.css.watch, ['css']);
    gulp.watch(config.js.watch, ['js']);
});


//默认任务
gulp.task('default', ['watch', 'css', 'js']);