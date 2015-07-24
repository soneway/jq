//npm install gulp gulp-sass gulp-minify-css gulp-browserify gulp-uglify gulp-imagemin imagemin-pngquant gulp-base64 gulp-include-html gulp-htmlmin --save-dev
'use strict';

//输出文件夹
var out = '../dist/';
//是否压缩
var isPack = 1;
//配置对象
var config = {
    img : {
        src  : ['./img/**'],
        watch: ['./img/**'],
        dest : out + 'img'
    },
    css : {
        //源文件
        src   : ['./css/*.scss'],
        //监听文件
        watch : ['./css/**'],
        //输出文件夹
        dest  : out + 'css',
        //是否压缩
        isPack: undefined
    },
    js  : {
        src   : ['./js/*.js'],
        watch : ['./js/**'],
        dest  : out + 'js',
        isPack: undefined,
        //模块化js文件shim
        shim  : {
            jq: {
                path   : '../../jq.js',
                //闭包中module是undefined,js代码中将按照没有模块化的方式运行,从而使得成员变量正常添加到全局变量(var a = require('jq')时,a的值将是window.$)
                exports: '$'
            }
        }
    },
    html: {
        src   : ['./*.html'],
        watch : ['./*.html', './html/**'],
        dest  : out,
        isPack: undefined
    }
};


//gulp插件的require函数(避免win上面初始化太久)
var gulpDir = 'D:/node_modules/';
function gr(name) {
    return require(gulpDir + name);
}
var gulp = require('gulp');


//出错处理(避免任务停止)
function errorHandler(e) {
    console.log('ERROR IN ' + e.plugin + ': ' + e.message);
}
//出错处理对象
var plumber = gr('gulp-plumber');


//img任务
(function (require) {
    var conf = config.img;
    var imagemin = require('gulp-imagemin');
    var pngquant = require('imagemin-pngquant');

    //图片压缩
    gulp.task('img', function () {
        gulp.src(conf.src)
            .pipe(plumber({
                errorHandler: errorHandler
            }))
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use        : [pngquant({quality: '65-80'})]
            }))
            .pipe(gulp.dest(conf.dest));
    });
})(gr);


//css任务
(function (require) {
    var conf = config.css;
    var sass = require('gulp-sass');
    var minifyCss = require('gulp-minify-css');
    var base64 = require('gulp-base64');

    //编译sass,压缩css
    gulp.task('css', function () {
        var task = gulp.src(conf.src)
            .pipe(plumber({
                errorHandler: errorHandler
            }))
            //编译
            .pipe(sass())
            .pipe(gulp.dest(conf.dest));

        //压缩
        if (conf.isPack === undefined ? isPack : conf.isPack) {
            task.pipe(minifyCss())
                .pipe(base64({
                    //排除匹配的
                    exclude     : [/^http:\/\/.+$/i],
                    //小于该设定K数的文件就编码
                    maxImageSize: 5 * 1024
                }))
                .pipe(gulp.dest(conf.dest));
        }
    });
})(gr);


//js任务
(function (require) {
    var conf = config.js;
    var browserify = require('gulp-browserify');
    var uglify = require('gulp-uglify');

    //browserify编译合并,压缩文件js
    gulp.task('js', function () {
        var task = gulp.src(conf.src)
            .pipe(plumber({
                errorHandler: errorHandler
            }))
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
})(gr);


//html任务
(function (require) {
    var conf = config.html;
    var htmlmin = require('gulp-htmlmin');
    var includer = require('gulp-include-html');

    //html编译和压缩
    gulp.task('html', function () {
        var task = gulp.src(conf.src)
            .pipe(plumber({
                errorHandler: errorHandler
            }))
            //include编译
            .pipe(includer({
                //include语法
                include: '@include',
                //base目录
                baseDir: './html/'
            }))
            .pipe(gulp.dest(conf.dest));

        //压缩
        if (conf.isPack === undefined ? isPack : conf.isPack) {
            task.pipe(htmlmin({
                collapseWhitespace: true,
                removeComments    : true,
                minifyJS          : true,
                minifyCSS         : true
            }))
                .pipe(gulp.dest(conf.dest));
        }
    });
})(gr);


//监听任务
gulp.task('watch', function () {
    //监听文件变化
    gulp.watch(config.css.watch, ['css']);
    gulp.watch(config.js.watch, ['js']);
    gulp.watch(config.img.watch, ['img']);
    gulp.watch(config.html.watch, ['html']);
});


//默认任务
gulp.task('default', ['watch', 'img', 'css', 'js', 'html']);