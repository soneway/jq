/*
 * flip.js
 * 3d翻转效果js
 */
(function (window, $) {

    $.fn.flip = function (options) {
        $.fn.flip.defaults = {
            //是否竖直方向滚动
            isVertical: false,
            //滑动阈值
            swipThreshold: 40,
            //比率
            rate: 1.3,
            //轮播回调函数
            slideCallback: null
        };

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.flip.defaults, options);

            //配置项
            var isVertical = opts.isVertical,
                swipThreshold = opts.swipThreshold,
                rate = opts.rate,
                slideCallback = opts.slideCallback;

            //变量
            var $this = $(this),
                $items = $this.children('*');

            //初始化函数
            function init() {
                $this.addClass('pi-flip');

                //初始化第一个item显示
                $items.eq(0).addClass('visible');
                //滚动回调函数
                typeof slideCallback === 'function' && slideCallback(0);

                //初始化事件
                initEvent();
            }

            //初始化事件函数
            function initEvent() {
                var itemCount = $items.length,
                    index = 0,
                    duration = parseFloat($items.css('transition-duration') || $items.css('-webkit-transition-duration')) * 1000,
                    startX, startY,
                    swipSpan, isAnimating;

                //复位函数
                function reset(me) {
                    me.style.cssText = '';
                }

                //旋转到函数
                function rotate(swipSpan) {
                    var transform;

                    if (typeof swipSpan === 'number') {
                        $items.each(function (i) {
                            var $this = $(this);
                            if (i === index) {
                                transform = isVertical ? 'rotate3d(1,0,0,' + -swipSpan + 'deg)' : 'rotate3d(0,1,0,' + swipSpan + 'deg)';
                                $this.css({
                                    '-webkit-transform': transform,
                                    'transform': transform
                                });
                            }
                            else {
                                transform = isVertical ? 'rotate3d(1,0,0,' + (180 - swipSpan) + 'deg)' : 'rotate3d(0,1,0,' + -(180 - swipSpan) + 'deg)';
                                $this.css({
                                    '-webkit-transform': transform,
                                    'transform': transform
                                });
                            }
                        });
                    }
                    else {
                        isAnimating = true;
                        //滚动回调函数
                        $.isFunction(slideCallback) && slideCallback(index);

                        $items.each(function (i) {
                            var $this = $(this);
                            if (i === index) {
                                transform = isVertical ? 'rotate3d(1,0,0,' + -(swipSpan ? 0 : -360) + 'deg)' : 'rotate3d(0,1,0,' + (swipSpan ? 0 : -360) + 'deg)';
                                $this.addClass('visible').css({
                                    '-webkit-transform': transform,
                                    'transform': transform
                                });
                            }
                            else {
                                transform = isVertical ? 'rotate3d(1,0,0,' + -(swipSpan ? 180 : -180) + 'deg)' : 'rotate3d(0,1,0,' + (swipSpan ? 180 : -180) + 'deg)';
                                $this.removeClass('visible').css({
                                    '-webkit-transform': transform,
                                    'transform': transform
                                });
                            }
                        });

                        //延迟复位
                        setTimeout(function () {
                            //加上动画
                            $items.addClass('notrans').each(function () {
                                reset(this);
                            });
                            isAnimating = false;
                        }, duration);
                    }
                }

                //触摸开始事件
                $this.on('touchstart', function (evt) {
                    if (!isAnimating) {
                        var touch = evt.targetTouches[0];
                        //记录触摸开始位置
                        startX = touch.pageX;
                        startY = touch.pageY;
                        //重置swipSpan
                        swipSpan = 0;

                        //去掉动画
                        $items.addClass('notrans');
                    }
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
                        !isAnimating && rotate(swipSpan = swipSpanY / rate);
                    }
                    //左右
                    if (!isVertical && Math.abs(swipSpanX) > Math.abs(swipSpanY)) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        !isAnimating && rotate(swipSpan = swipSpanX / rate);
                    }
                });

                //触摸结束事件
                $this.on('touchend', function (evt) {
                    if (!isAnimating) {
                        //达到滚动阈值
                        if (Math.abs(swipSpan) > swipThreshold) {
                            if (swipSpan > 0 && --index === -1) {
                                index = itemCount - 1;
                            }
                            if (swipSpan < 0 && ++index === itemCount) {
                                index = 0;
                            }

                            //加上动画
                            $items.removeClass('notrans');
                            rotate(swipSpan > 0);
                        }
                        else if (swipSpan !== 0) {
                            //加上动画
                            $items.eq(index).removeClass('notrans');
                            reset($items[index]);
                        }
                    }
                });
            }


            //初始化
            init();

        });

    };

})(window, $);