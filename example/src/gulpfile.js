(function () {

    var gulp = require('gulp');

    //默认配置
    var opts = {
        //第三方资源库路径
        libDir: './_lib/',
        //打包生成代码的路径
        out   : '../dist/',
        //是否压缩
        isPack: 0,
        //是否PC端
        isPC  : 0
    };

    //gulp插件require函数(避免win上面初始化太久)
    var grequire = (function () {
        var gulpDir = process.platform === 'darwin' ? '' : 'D:/node_modules/';
        return function (name) {
            return require(gulpDir + name);
        };
    })();



    //出错处理函数(避免任务停止)
    function errorHandler(e) {
        console.log('ERROR IN ' + e.plugin + ': ' + e.message);
    }

    //出错处理对象
    var plumber = grequire('gulp-plumber');

    var out = opts.out,
        libDir = opts.libDir,
        isPack = opts.isPack,
        isPC = opts.isPC;

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
            src     : ['./css/*.scss'],
            watch   : ['./css/**'],
            dest    : out + 'css',
            loadPath: ['../../../', libDir]
        },
        js  : {
            src  : ['./js/*.js'],
            watch: ['./js/**'],
            dest : out + 'js'
        },
        html: {
            src    : ['./*.html'],
            watch  : ['./*.html', './html/**'],
            dest   : out,
            baseDir: libDir
        }
    };


    //img任务
    (function (require) {
        var conf = config.img;
        var image = require('gulp-image');

        //图片压缩
        gulp.task('img', function () {
            gulp.src(conf.src)
                .pipe(plumber({
                    errorHandler: errorHandler
                }))
                .pipe(image())
                .pipe(gulp.dest(conf.dest));
        });
    })(grequire);


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
                .pipe(sass({
                    includePaths: conf.loadPath
                }))
                .pipe(gulp.dest(conf.dest));

            //压缩
            if (isPack) {
                task.pipe(minifyCss())
                    .pipe(base64({
                        //排除匹配的
                        exclude: [/^http:\/\/.+$/i],
                        //小于该设定K数的文件就编码
                        maxImageSize: isPC ? 1 : 5 * 1024
                    }))
                    .pipe(gulp.dest(conf.dest));
            }
        });
    })(grequire);


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
                .pipe(browserify())
                .pipe(gulp.dest(conf.dest));

            //压缩
            if (isPack) {
                task.pipe(uglify())
                    .pipe(gulp.dest(conf.dest));
            }
        });
    })(grequire);


    //html任务
    (function (require) {
        var conf = config.html;
        var htmlmin = require('gulp-htmlmin');
        var include = require('gulp-include');

        //html编译和压缩
        gulp.task('html', function () {
            var task = gulp.src(conf.src)
                .pipe(plumber({
                    errorHandler: errorHandler
                }))
                //include编译
                .pipe(include())
                .pipe(gulp.dest(conf.dest));

            //压缩
            if (isPack) {
                task.pipe(htmlmin({
                        collapseWhitespace: true,
                        removeComments    : true,
                        minifyJS          : true,
                        minifyCSS         : true
                    }))
                    .pipe(gulp.dest(conf.dest));
            }
        });
    })(grequire);


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

})();