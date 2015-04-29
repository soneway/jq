//scroll.js
(function (window, $) {

    $.fn.scroll = function (options) {
        $.fn.scroll.defaults = {
            //是否竖直方向滚动
            isVertical: false,
            //滚动率
            rate: 400,
            //时间间隙阈值
            timeSpanThreshold: 300,
            //滚动最大值
            maxScroll: 400,
            //安卓响应率
            androidRate: 2,
            //是否调整点击元素居中
            isAdjust: false
        };

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.scroll.defaults, options);

            //配置项
            var isVertical = opts.isVertical,
                rate = opts.rate,
                timeSpanThreshold = opts.timeSpanThreshold,
                maxScroll = opts.maxScroll,
                androidRate = opts.androidRate,
                isAdjust = opts.isAdjust;

            //变量
            var $this = $(this),
                $items = $this.children('*'),
                isAndroid = /(android)/i.test(window.navigator.userAgent);


            //初始化函数
            function init() {
                $items.addClass('pi-scroll-item');

                //初始化事件
                initEvent();
            }


            //初始化事件函数
            function initEvent() {
                //touchstart起点
                var startX, startY,
                //touch时间点
                    startTime, endTime,
                //move的距离
                    swipSpan,
                //作动画的值
                    translateVal = 0,
                //当然translate值
                    currentVal,
                //可滚动的值
                    scrollVal;

                //初始化可滚动的值函数
                function initScrollVal() {
                    //item包含margin的尺寸
                    var itemsOuterVal = isVertical ?
                        $items.height() + parseFloat($items.css('margin-top')) + parseFloat($items.css('margin-bottom')) :
                        $items.width() + parseFloat($items.css('margin-left')) + parseFloat($items.css('margin-right')),
                    //this不包含padding的尺寸
                        thisInnerVal = isVertical ?
                        $this.height() - parseFloat($this.css('padding-top')) - parseFloat($this.css('padding-bottom')) :
                        $this.width() - parseFloat($this.css('padding-left')) - parseFloat($this.css('padding-right'));

                    //记录可滚动的值
                    scrollVal = itemsOuterVal - thisInnerVal;
                }

                initScrollVal();

                //移动到函数
                function slide(x) {
                    //起点
                    if (x > 0) {
                        x /= 2;
                    }
                    //终点
                    if (-x > scrollVal) {
                        x = x + (-x - scrollVal) / 2;
                    }

                    var transform = 'translate3d(' + (isVertical ? '0,' + (translateVal = x) + 'px,0' : (translateVal = x) + 'px,0,0') + ')';
                    $items.css({
                        '-webkit-transform': transform,
                        'transform': transform
                    });
                }

                //居中函数
                function center(me) {
                    var translateVal = isVertical ?
                    (me.offsetTop - $items[0].offsetTop) - ($this.height() - me.clientHeight) / 2 :
                    (me.offsetLeft - $items[0].offsetLeft) - ($this.width() - me.clientWidth) / 2;

                    if (translateVal < 0) {
                        slide(0);
                    }
                    else {
                        translateVal < scrollVal ? slide(-translateVal) : slide(-scrollVal);
                    }
                }

                //暴露居中函数
                $this[0].center = center;


                //触摸开始事件
                $this.on('touchstart', function (evt) {
                    var touch = evt.targetTouches[0];
                    //记录开始时间
                    startTime = evt.timeStamp;
                    //记录触摸开始位置
                    startX = touch.pageX;
                    startY = touch.pageY;
                    //重置swipSpan
                    swipSpan = 0;
                    //记录x
                    currentVal = translateVal;

                    //不作动画
                    $items.addClass('notrans');
                });

                //触摸移动事件
                $this.on('touchmove', function (evt) {
                    var touch = evt.targetTouches[0],
                        swipSpanX = touch.pageX - startX,
                        swipSpanY = touch.pageY - startY;

                    //上下
                    if (isVertical && Math.abs(swipSpanX) < Math.abs(swipSpanY)) {
                        evt.preventDefault();
                        evt.stopPropagation();

                        slide(currentVal + (swipSpan = swipSpanY));
                    }
                    //左右
                    if (!isVertical && Math.abs(swipSpanX) > Math.abs(swipSpanY)) {
                        evt.preventDefault();
                        evt.stopPropagation();

                        slide(currentVal + (swipSpan = swipSpanX));
                    }
                });

                //触摸结束事件
                $this.on('touchend', function (evt) {
                    //记录结束时间
                    endTime = evt.timeStamp;

                    //计算校正值(更加拟物化)
                    var timeSpan = endTime - startTime,
                    //安卓的touch响应时间较长故除以一定比率
                        swipSpanAdjust = timeSpan > timeSpanThreshold ? 0 : swipSpan / (isAndroid ? timeSpan /= androidRate : timeSpan),
                        span = Math.abs(swipSpanAdjust) * rate;

                    //设置最大滚动值
                    span > maxScroll && (span = maxScroll);

                    //作动画
                    $items.removeClass('notrans');

                    if (swipSpan < 0) {
                        -(translateVal - span) < scrollVal ? slide(translateVal - span) : slide(-scrollVal);
                    }
                    else if (swipSpan > 0) {
                        translateVal + span < 0 ? slide(translateVal + span) : slide(0);
                    }
                });

                //点击事件(如果需要将点击元素定位到居中)
                isAdjust && $this.on('click', function (evt) {
                    center(evt.target);
                });

                //屏幕尺寸改变事件
                window.addEventListener('resize', function () {
                    var w = $this.width();
                    w > 0 && initScrollVal();
                }, false);
            }


            //初始化
            init();

        });

    };

})(this, $);