/*
 * picpager.js
 * 相册js
 */
(function (window, $) {

    $.fn.picpager = function (options) {

        // 每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.picpager.defaults, options);

            // 配置项
            var imgData = opts.imgData,
                swipThreshold = opts.swipThreshold,
                swipSpanThreshold = opts.swipSpanThreshold,
                slideCallback = opts.slideCallback,
                pullRatio = opts.pullRatio,
                contentFormate = opts.contentFormate;

            // 变量
            var $this = $(this),
                me = this,
                $pics, $wrap,
                itemCount = imgData.length;

            // 初始化函数
            function init() {
                $this.addClass('pi-picpager').html('<div class="pi-wrap"><div class="pi-pic"></div><div class="pi-pic"></div><div class="pi-pic"></div></div>');
                $wrap = $this.find('.pi-wrap');
                $pics = $this.find('.pi-pic').each(function (i) {
                    // 初始化内容
                    $(this).html(contentFormate(imgData[i - 1]));
                });

                // 初始化事件
                initEvent();
            }

            // 初始化事件函数
            function initEvent() {
                var width = $this.width(),
                    index = 0,
                    startX, startY,
                    swipSpan, isAnimating, isMoving,
                    duration = parseFloat($wrap.css('transition-duration')) * 1000;

                // 移动到函数
                function slide(direction) {
                    // 判断滚动方向
                    switch (direction) {
                        // 向右
                        case 1:
                        // 向左
                        case -1: {
                            // 动画
                            isAnimating = true;
                            // 作动画
                            translate(width * direction);

                            // 复位操作,更新内容
                            setTimeout(function () {
                                // 去掉动画
                                $wrap.addClass('notrans');
                                // 复位
                                translate(0);
                                // 更新内容
                                $pics.each(function (i) {
                                    $(this).html(contentFormate(imgData[index + i - 1]));
                                });
                                // 重置isAnimating
                                isAnimating = false;
                            }, duration);
                            break;
                        }
                        default: {
                            translate(0);
                        }
                    }

                    // 滚动回调函数
                    typeof slideCallback === 'function' && slideCallback.call($pics, index, direction);
                }

                // 移动函数
                function translate(x) {
                    $wrap.css({
                        'transform': 'translate3d(' + x + 'px,0,0)'
                    });
                }


                // 暴露slideToIndex方法
                me.slideToIndex = function (i, isNoAni) {
                    var direction;
                    // 如不为数字或者超出范围
                    if (typeof i !== 'number' || i < 0 || i >= itemCount || i === index) {
                        return;
                    }

                    // 向左
                    if (i > index) {
                        direction = -1;
                        $pics.eq(2).html(contentFormate(imgData[i]));
                    }
                    // 向右
                    else {
                        direction = 1;
                        $pics.eq(0).html(contentFormate(imgData[i]));
                    }

                    index = i;
                    // 是否无动画
                    isNoAni ? $wrap.addClass('notrans') : $wrap.removeClass('notrans');
                    // 滚动
                    slide(direction);
                };

                // 暴露addItem方法
                me.addItem = function (item) {
                    imgData = imgData.concat(item);
                    itemCount = imgData.length;
                };


                // 触摸开始事件
                $this.on('touchstart', function (evt) {
                    var touch = evt.targetTouches ? evt.targetTouches[0] : evt;

                    // 记录触摸开始位置
                    startX = touch.pageX;
                    startY = touch.pageY;

                    // 重置swipSpan
                    swipSpan = 0;
                    // 重置手指拖拽移动
                    isMoving = false;
                    // 取消动画
                    $wrap.addClass('notrans');
                });

                // 触摸移动事件
                $this.on('touchmove', function (evt) {
                    // 如果正在作动画,不作响应
                    if (isAnimating) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        return;
                    }

                    var touch = evt.targetTouches ? evt.targetTouches[0] : evt,
                        //  x轴滑动距离
                        swipSpanX = touch.pageX - startX,
                        absX = Math.abs(swipSpanX),
                        //  y轴滑动距离
                        swipSpanY = touch.pageY - startY,
                        absY = Math.abs(swipSpanY);

                    // y轴滑动距离小于阈值,或x轴滑动距离大于y轴,说明的确是左右滑动
                    if (isMoving || absY < swipSpanThreshold || absY < absX) {
                        evt.preventDefault();
                        evt.stopPropagation();

                        // 第一张图或最后一张图
                        if (index === 0 && swipSpanX > 0 || index === itemCount - 1 && swipSpanX < 0) {
                            // 模拟拉不动操作体验
                            swipSpanX /= pullRatio;
                        }

                        // 位移
                        translate(swipSpan = swipSpanX);
                        // 已经满足滚动条件,且正在手指拖动
                        isMoving = true;
                    }
                });

                // 触摸结束事件
                $this.on('touchend', function () {
                    // 如果正在作动画,不作响应
                    if (isAnimating) {
                        return;
                    }

                    var direction;
                    // 向左
                    if (swipSpan < -swipThreshold) {
                        ++index === itemCount ? index = itemCount - 1 : direction = -1;
                    }
                    // 向右
                    else if (swipSpan > swipThreshold) {
                        --index < 0 ? index = 0 : direction = 1;
                    }

                    // 加上动画
                    $wrap.removeClass('notrans');
                    // 滚动
                    swipSpan !== 0 && slide(direction);
                }).trigger('touchend');

                // 屏幕尺寸改变事件
                window.addEventListener('resize', function () {
                    var w = $this.width();
                    w > 0 && (width = w);
                }, false);

            }


            // 初始化
            init();

        });

    };
    $.fn.picpager.defaults = {
        // 图片数据
        imgData: null,
        // 滑动阈值
        swipThreshold: 100,
        //  滑动距离阈值
        swipSpanThreshold: 10,
        // 轮播回调函数
        slideCallback: null,
        // first和last拉不动的比率
        pullRatio: 3,
        // 返回内容函数
        contentFormate: function (itemData) {
            return itemData ? '<div style="background: url(' + itemData + ') center center no-repeat; background-size: contain; width: 100%; height: 100%;"></div>' : '';
        }
    };

})(window, $);