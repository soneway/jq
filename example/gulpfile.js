//npm install gulp gulp-jshint gulp-sass gulp-concat gulp-uglify gulp-rename gulp-minify-css --save-dev
'use strict';

//是否调试
var debug = 1;
//根目录
var root = '../';//'Y:/static/v1/jq/'
//任务对象
var tasks = {
    css: {
        src: ['css/index.scss'],
        watch: ['css/**']
    },
    js: {
        src: {
            index: [
                root + 'jq.js',
                root + 'ui/ui.js',
                root + 'plugin/carousel.js',
                root + 'plugin/customalert.js',
                root + 'plugin/flip.js',
                root + 'plugin/picpager.js',
                root + 'plugin/scratchcard.js',
                root + 'plugin/scroll.js',
                root + 'plugin/swatchbook.js',
                root + 'plugin/turntable.js',
                'js/index.js'
            ]
        },
        watch: ['js/**']
    }
};
//输出文件夹
var dest = 'out';


//引入gulp
var gulp = require('gulp');


//编译sass,压缩css
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
gulp.task('css', function () {
    var css = tasks.css;
    var task = gulp.src(css.src)
        //编译
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dest));

    //压缩
    if (!debug) {
        task.pipe(minifyCss())
            .pipe(gulp.dest(dest));
    }
});


//合并,压缩文件js
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
//var rename = require('gulp-rename');
gulp.task('js', function () {
    var js = tasks.js,
        src = js.src;

    for (var p in src) {
        //合并
        var task = gulp.src(src[p])
            .pipe(concat(p + '.js'))
            .pipe(gulp.dest(dest));

        //压缩
        if (!debug) {
            task.pipe(uglify())
                .pipe(gulp.dest(dest));
        }
    }
});


//监听任务
gulp.task('watch', function () {
    //监听文件变化
    gulp.watch(tasks.css.watch, ['css']);
    gulp.watch(tasks.js.watch, ['js']);
});


//默认任务
gulp.task('default', ['watch', 'css', 'js']);