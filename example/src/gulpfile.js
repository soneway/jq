//打包生成代码的路径
var out = '../dist/',
//第三方资源库路径
    libDir = './_lib/',
//是否压缩
    isPack = 0,
//是否PC端
    isPC = 0;

//任务配置
var config = {
    img : {
        //源文件
        src  : ['./img/**'],
        //监听文件
        watch: ['./img/**'],
        //输出文件夹
        dest : out + 'img'
    },
    css : {
        src  : ['./css/*.scss'],
        watch: ['./css/**'],
        dest : out + 'css',
        opts : {
            //sass
            includePaths: [libDir, '../../../'],

            //autoprefixer
            browsers: isPC ? ['ie 6', 'chrome 31'] : ['ios 7', 'android 4'],

            //base64
            //排除匹配的
            exclude     : [/^http:\/\/.+$/i],
            //小于该设定K数的文件就编码
            maxImageSize: isPC ? 5 * 1024 : 5 * 1024
        }
    },
    js  : {
        src  : ['./js/*.js'],
        watch: ['./js/**'],
        dest : out + 'js',
        opts : {
            //browserify
            paths: [libDir]
        }
    },
    html: {
        src  : ['./*.html'],
        watch: ['./*.html', './html/**'],
        dest : out,
        opts : {
            //include
            prefix  : '@',
            basepath: './html/',

            //htmlmin
            collapseWhitespace: true,
            removeComments    : true,
            minifyJS          : true,
            minifyCSS         : true,
            processScripts    : ['text/html']
        }
    }
};


//gulp
var gulp = require('gulp');


//出错处理函数(避免任务停止)
function errorHandler(e) {
    console.log('ERROR IN ' + e.plugin + ': ' + e.message);
}

//出错处理对象
var plumber = require('gulp-plumber');


//img任务
(function () {
    var conf = config.img;
    var imgmin = require('gulp-imagemin');

    //图片压缩
    gulp.task('img', function () {
        gulp.src(conf.src)
            .pipe(plumber({
                errorHandler: errorHandler
            }))
            .pipe(imgmin())
            .pipe(gulp.dest(conf.dest));
    });
})();


//css任务
(function () {
    var conf = config.css;
    var sass = require('gulp-sass');
    var autoprefixer = require('gulp-autoprefixer');
    var cssmin = require('gulp-clean-css');
    var base64 = require('gulp-base64');

    //编译sass,压缩css
    gulp.task('css', function () {
        var task = gulp.src(conf.src)
            .pipe(plumber({
                errorHandler: errorHandler
            }))
            //编译
            .pipe(sass(conf.opts))
            .pipe(autoprefixer(conf.opts))
            .pipe(gulp.dest(conf.dest));

        //压缩
        if (isPack) {
            task.pipe(cssmin())
                .pipe(base64(conf.opts))
                .pipe(gulp.dest(conf.dest));
        }
    });
})();


//js任务
(function () {
    var conf = config.js;
    var browserify = require('gulp-browserify');
    var jsmin = require('gulp-uglify');

    //browserify编译合并,压缩文件js
    gulp.task('js', function () {
        var task = gulp.src(conf.src)
            .pipe(plumber({
                errorHandler: errorHandler
            }))
            //编译合并
            .pipe(browserify(conf.opts))
            .pipe(gulp.dest(conf.dest));

        //压缩
        if (isPack) {
            task.pipe(jsmin())
                .pipe(gulp.dest(conf.dest));
        }

        gulp.src('../../jq.js')
            .pipe(jsmin())
            .pipe(gulp.dest(conf.dest));
    });
})();


//html任务
(function () {
    var conf = config.html;
    var include = require('gulp-file-include');
    var htmlmin = require('gulp-htmlmin');

    //html编译和压缩
    gulp.task('html', function () {
        var task = gulp.src(conf.src)
            .pipe(plumber({
                errorHandler: errorHandler
            }))
            //include编译
            .pipe(include(conf.opts))
            .pipe(gulp.dest(conf.dest));

        //压缩
        if (isPack) {
            task.pipe(htmlmin(conf.opts))
                .pipe(gulp.dest(conf.dest));
        }
    });
})();


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