/*
 * scroll.js
 * 自定义滚动js
 */
(function (window, $) {

    $.fn.scroll = function (options) {

        var Math = window.Math;

        //计算校正距离函数
        function getReviseSpan(swipSpan, timeSpan, reviseRatio) {
            var speed = Math.abs(swipSpan) / timeSpan;
            return speed * speed * reviseRatio;
        }

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.scroll.defaults, options);

            //配置项
            var isVertical = opts.isVertical,
                timeSpanThreshold = opts.timeSpanThreshold,
                swipSpanThreshold = opts.swipSpanThreshold,
                maxScroll = opts.maxScroll,
                isAdjust = opts.isAdjust,
                reviseRatio = opts.reviseRatio,
                touchDuration = opts.touchDuration;

            //变量
            var $this = $(this),
                $items = $this.children('*');


            //初始化函数
            function init() {
                $items.addClass('pi-scroll-item');

                //初始化事件
                initEvent();
            }


            //初始化事件函数
            function initEvent() {
                //最后一个touch的信息
                var lastTouch = {},
                    //touchstart位置
                    startX, startY,
                    //作动画translate值
                    translateVal = 0,
                    //当前translate值
                    currentTranslateVal,
                    //可滚动的值
                    scrollVal = getScrollVal();

                //获取可滚动的值函数
                function getScrollVal() {
                    //item包含margin的尺寸
                    var itemsOuterVal = isVertical ?
                        $items.height() + parseFloat($items.css('margin-top')) + parseFloat($items.css('margin-bottom')) :
                        $items.width() + parseFloat($items.css('margin-left')) + parseFloat($items.css('margin-right')),
                        //this不包含padding的尺寸
                        thisInnerVal = isVertical ?
                        $this.height() - parseFloat($this.css('padding-top')) - parseFloat($this.css('padding-bottom')) :
                        $this.width() - parseFloat($this.css('padding-left')) - parseFloat($this.css('padding-right'));

                    //记录可滚动的值
                    return itemsOuterVal - thisInnerVal;
                }

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
                    var touch = evt.targetTouches ? evt.targetTouches[0] : evt;

                    //记录开始时间
                    lastTouch.startTime = evt.timeStamp;
                    //记录触摸开始位置
                    lastTouch.startX = startX = touch.pageX;
                    lastTouch.startY = startY = touch.pageY;
                    //记录当前动画值
                    currentTranslateVal = translateVal;

                    //不作动画
                    $items.addClass('notrans');
                });

                //触摸移动事件
                $this.on('touchmove', function (evt) {
                    var touch = evt.targetTouches ? evt.targetTouches[0] : evt,
                        currentX = touch.pageX,
                        currentY = touch.pageY,
                        //x轴滑动距离
                        swipSpanX = currentX - startX,
                        absX = Math.abs(swipSpanX),
                        //y轴滑动距离
                        swipSpanY = currentY - startY,
                        absY = Math.abs(swipSpanY),
                        //事件当前时间
                        timeStamp = evt.timeStamp;

                    //上下
                    if (isVertical) {
                        //x轴滑动距离小于阈值,或y轴滑动距离大于x轴,说明的确是上下滑动
                        if (absX < swipSpanThreshold || absX < absY) {
                            evt.preventDefault();
                            evt.stopPropagation();

                            slide(currentTranslateVal + swipSpanY);
                        }
                    }
                    //左右
                    else {
                        //y轴滑动距离小于阈值,或x轴滑动距离大于y轴,说明的确是左右滑动
                        if (absY < swipSpanThreshold || absY < absX) {
                            evt.preventDefault();
                            evt.stopPropagation();

                            slide(currentTranslateVal + swipSpanX);
                        }
                    }

                    //如果大于一定时间间隔,重置最后一个touch的信息
                    if (timeStamp - lastTouch.startTime > touchDuration) {
                        lastTouch.startTime = timeStamp;
                        lastTouch.startX = currentX;
                        lastTouch.startY = currentY;
                    }
                });

                //触摸结束事件
                $this.on('touchend', function (evt) {
                    var touch = evt.changedTouches ? evt.changedTouches[0] : evt,
                        //滑动距离
                        swipSpan = isVertical ? touch.pageY - lastTouch.startY : touch.pageX - lastTouch.startX,
                        //滑动时间间隔
                        timeSpan = evt.timeStamp - lastTouch.startTime,
                        //计算校正值(更加拟物化)
                        span = timeSpan > timeSpanThreshold ? 0 : getReviseSpan(swipSpan, timeSpan, reviseRatio);

                    //设置最大滚动值
                    span > maxScroll && (span = maxScroll);

                    //作动画
                    $items.removeClass('notrans');

                    if (swipSpan < 0) {
                        //是否滚动到最后
                        -(translateVal - span) < scrollVal ? slide(translateVal - span) : slide(-scrollVal);
                    }
                    else if (swipSpan > 0) {
                        //是否滚动到最前
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
                    //重置可滚动的值
                    w > 0 && (scrollVal = getScrollVal());
                }, false);
            }


            //初始化
            init();

        });

    };
    $.fn.scroll.defaults = {
        //是否竖直方向滚动
        isVertical: false,
        //时间间隙阈值
        timeSpanThreshold: 300,
        //滑动距离阈值
        swipSpanThreshold: 20,
        //滚动最大值
        maxScroll: 800,
        //是否调整点击元素居中
        isAdjust: false,
        //校正系数
        reviseRatio: 400,
        //默认触摸时长
        touchDuration: 200
    };

})(window, $);