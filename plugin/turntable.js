//turntable.js
(function (window, $) {

    $.fn.turntable = function (options) {
        $.fn.turntable.defaults = {
            //奖品格数
            count: 12,
            //旋转度数
            rotateDeg: 3600,
            //旋转时长
            duration: 7000,
            //动画fx
            timeFx: 'cubic-bezier(0.42,0,0.25,1)',
            //校正值
            offset: 0
        };

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.turntable.defaults, options);

            //配置项
            var count = opts.count,
                rotateDeg = opts.rotateDeg,
                duration = opts.duration,
                timeFx = opts.timeFx,
                offset = opts.offset;

            //变量
            var $this = $(this),
                me = this,
                $pointer;

            //初始化函数
            function init() {
                $pointer = $('<div class="pi-turntable-pointer"></div>');
                $this.addClass('pi-turntable').prepend($pointer);

                //初始化事件
                initEvent();
            }

            //初始化事件函数
            function initEvent() {

                var timeout,
                    isAnimating;

                //转动函数
                me.turnToIndex = function (index, fn) {
                    //不可大于总数
                    if (index > count) {
                        return;
                    }

                    //正在转动
                    if (isAnimating) {
                        return;
                    }

                    //动画属性
                    var transition = duration / 1000 + 's ' + timeFx,
                        endDeg = rotateDeg + (index / count) * 360 + offset + 'deg',
                        transform = 'rotateZ(' + endDeg + ')';//如用'rotate3d(0, 0, 1, ' + endDeg + ')',ios上动画有bug

                    //重置
                    $pointer[0].style.cssText = '';
                    isAnimating = true;

                    //设定延迟才会有动画效果
                    setTimeout(function () {
                        //动画
                        $pointer.css({
                            '-webkit-transition': '-webkit-transform ' + transition,
                            'transition': 'transform ' + transition,
                            '-webkit-transform': transform,
                            'transform': transform
                        });

                        //动画完成后回调
                        clearTimeout(timeout);//清理上一个timeout
                        timeout = setTimeout(function () {
                            typeof fn === 'function' && fn();
                            isAnimating = false;
                        }, duration);

                    }, 40);
                };
            }


            //初始化
            init();

        });
    };

})(this, $);