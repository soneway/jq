/*
 * carousel.js
 * 焦点图js
 */
(function (window, $) {

    $.fn.carousel = function (options) {

        // 每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.carousel.defaults, options);

            // 配置项
            var isVertical = opts.isVertical,
                swipThreshold = opts.swipThreshold,
                swipSpanThreshold = opts.swipSpanThreshold,
                isAutoPlay = opts.isAutoPlay,
                autoPlayInter = opts.autoPlayInter,
                slideCallback = opts.slideCallback,
                isShowTitle = opts.isShowTitle,
                isShowPager = opts.isShowPager,
                removeClassDelay = opts.removeClassDelay,
                inited = opts.inited,
                initIndex = opts.initIndex,
                pullRatio = opts.pullRatio;

            // 变量
            var $this = $(this),
                me = this,
                $wrap, wrapElStyle, $items, itemCount,
                $title, $pagers;

            // 初始化函数
            function init() {
                $this.addClass('pi-carousel').html('<div class="pi-wrap">' + $this.html() + '</div>' + (isShowTitle ? '<div class="pi-title"></div>' : ''));

                $wrap = $this.find('.pi-wrap');
                wrapElStyle = $wrap[0].style;
                $items = $wrap.children('*');
                itemCount = $items.length;

                // html初始化完成回调
                typeof inited === 'function' && inited($items);

                isVertical && $this.addClass('vertical');
                $title = $this.find('.pi-title');

                // pager
                var html = '';
                if (isShowPager) {
                    html += '<div class="pi-pager">';
                    for (var i = 0, len = itemCount; i < len; i++) {
                        html += '<span></span>';
                    }
                    html += '</div>';
                }
                $pagers = $this.append(html).find('.pi-pager span');

                // 初始化事件
                initEvent();
            }

            // 初始化事件函数
            function initEvent() {
                var width, height, inter, index = initIndex,
                    startX, startY,
                    swipSpan;

                // 设置尺寸函数
                function setSize() {
                    width = $this.width();
                    height = $this.height();

                    // 水平方向滚动
                    if (!isVertical) {
                        wrapElStyle.width = width * itemCount + 'px';
                        $items.css('width', width + 'px');
                    }
                    // 竖直方向滚动
                    else {
                        wrapElStyle.height = height * itemCount + 'px';
                        $items.css('height', height + 'px');
                    }
                }

                // 设置inter函数
                function setInter() {
                    isAutoPlay && (inter = setInterval(function () {
                        ++index === itemCount && (index = 0);
                        slide();
                    }, autoPlayInter));
                }

                // 移动到函数
                function slide(swipSpan) {
                    var translate = -index * (isVertical ? height : width),
                        transform;

                    if (typeof swipSpan === 'number') {
                        // 起点
                        if (index === 0 && swipSpan > 0) {
                            swipSpan /= pullRatio;
                        }
                        // 终点
                        if (index === itemCount - 1 && swipSpan < 0) {
                            swipSpan /= pullRatio;
                        }
                        translate += swipSpan;
                    }
                    else {

                        // 滚动回调函数
                        typeof slideCallback === 'function' && slideCallback.call($items[index], index);

                        // 延迟removeClass('current')
                        setTimeout(function () {
                            $items.each(function () {
                                var $this = $(this),
                                    i = $this.index();
                                i !== index && $this.removeClass('current');
                            });
                        }, removeClassDelay);

                        // title
                        if (isShowTitle) {
                            var title = $items.eq(index).addClass('current').attr('data-title');
                            $title.removeClass('visible');
                            title && setTimeout(function () {
                                $title.addClass('visible').html(title);
                            }, 150);
                        }

                        // pager状态
                        if (isShowPager) {
                            $pagers.removeClass('selected');
                            // 下一队列执行,以防某些情况下无效
                            setTimeout(function () {
                                $pagers.eq(index).addClass('selected');
                            }, 0);
                        }
                    }

                    transform = 'translate3d(' + (isVertical ? '0,' + translate + 'px,0' : translate + 'px,0,0') + ')';
                    // 作动画
                    $wrap.css({
                        'transform': transform
                    });
                }


                // 初始化
                // 设置尺寸
                setSize();

                // 暴露slideToIndex方法
                me.slideToIndex = function (i, isNoAni) {
                    if (typeof i !== 'number') {
                        return console.log('index应为数字');
                    }

                    // 是否有动画
                    isNoAni ? $wrap.removeClass('transform') : $wrap.addClass('transform');

                    index = i;
                    slide();
                };

                // 暴露prev方法
                me.prev = function () {
                    --index < 0 && (index = itemCount - 1);
                    slide();
                };

                // 暴露next方法
                me.next = function () {
                    ++index === itemCount && (index = 0);
                    slide();
                };


                // 触摸开始事件
                $this.on('touchstart', function (evt) {
                    var touch = evt.targetTouches ? evt.targetTouches[0] : evt;

                    // 记录触摸开始位置
                    startX = touch.pageX;
                    startY = touch.pageY;

                    // 重置swipSpan
                    swipSpan = 0;
                    // 取消动画
                    $wrap.removeClass('transform');
                    // 取消自动轮播
                    isAutoPlay && clearInterval(inter);
                });

                // 触摸移动事件
                $this.on('touchmove', function (evt) {
                    var touch = evt.targetTouches ? evt.targetTouches[0] : evt,
                        //  x轴滑动距离
                        swipSpanX = touch.pageX - startX,
                        absX = Math.abs(swipSpanX),
                        //  y轴滑动距离
                        swipSpanY = touch.pageY - startY,
                        absY = Math.abs(swipSpanY);

                    // 上下
                    if (isVertical) {
                        // x轴滑动距离小于阈值,或y轴滑动距离大于x轴,说明的确是上下滑动
                        if (absX < swipSpanThreshold || absX < absY) {
                            evt.preventDefault();
                            evt.stopPropagation();
                            slide(swipSpan = swipSpanY);
                        }
                    }
                    // 左右
                    else {
                        // y轴滑动距离小于阈值,或x轴滑动距离大于y轴,说明的确是左右滑动
                        if (absY < swipSpanThreshold || absY < absX) {
                            evt.preventDefault();
                            evt.stopPropagation();
                            slide(swipSpan = swipSpanX);
                        }
                    }
                });

                // 触摸结束事件
                $this.on('touchend', function () {
                    // 向右,下
                    if (swipSpan > swipThreshold) {
                        --index < 0 && (index = 0);
                    }
                    // 向左,上
                    else if (swipSpan < -swipThreshold) {
                        ++index === itemCount && (index = itemCount - 1);
                    }

                    // 加上动画
                    $wrap.addClass('transform');

                    // 滚动(swipSpan === undefined时无动画)
                    swipSpan !== 0 && slide();

                    // 自动轮播
                    setInter();
                }).trigger('touchend');

                // pager点击事件
                $pagers.on('click', function () {
                    var index = $(this).index();
                    me.slideToIndex(index);
                });

                // 屏幕尺寸改变事件
                window.addEventListener('resize', function () {
                    var w = $this.width();
                    if (w > 0) {
                        setSize();
                        slide(0);
                    }
                }, false);

            }


            // 初始化
            init();

        });

    };
    $.fn.carousel.defaults = {
        // 是否竖直方向滚动
        isVertical: false,
        // 滑动阈值
        swipThreshold: 100,
        //  滑动距离阈值
        swipSpanThreshold: 10,
        // 是否自动轮播
        isAutoPlay: true,
        // 轮播inter
        autoPlayInter: 8000,
        // 轮播回调函数
        slideCallback: null,
        // 是否显示title
        isShowTitle: true,
        // 是否显示pager
        isShowPager: true,
        // 移除class延迟
        removeClassDelay: 0,
        // 初始化完成回调函数
        inited: null,
        // 初始index
        initIndex: 0,
        // first和last拉不动的比率
        pullRatio: 3
    };

})(window, $);