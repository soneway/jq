/*
 * picpager.js
 * 相册js
 */
(function (window, $) {

    $.fn.picpager = function (options) {
        $.fn.picpager.defaults = {
            //图片数据
            imgData: null,
            //表示图片地址属性名
            imgAttrName: null,
            //滑动阈值
            swipThreshold: 40,
            //轮播回调函数
            slideCallback: null
        };

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.picpager.defaults, options);

            //配置项
            var imgData = opts.imgData,
                imgAttrName = opts.imgAttrName,
                swipThreshold = opts.swipThreshold,
                slideCallback = opts.slideCallback;

            //变量
            var $this = $(this),
                me = this,
                $pics, $wrap,
                itemCount = imgData.length;

            //初始化函数
            function init() {
                $this.addClass('pi-picpager').html('<div class="pi-picpager-wrap"><div class="pi-picpager-pic"></div><div class="pi-picpager-pic"></div><div class="pi-picpager-pic"></div></div>');
                $wrap = $this.find('.pi-picpager-wrap');
                $pics = $this.find('.pi-picpager-pic');

                //初始化事件
                initEvent();
            }

            //初始化事件函数
            function initEvent() {
                var width = $this.width(),
                    index = 0,
                    startX, startY,
                    swipSpan, isAnimating,
                    duration = parseFloat($wrap.css('transition-duration') || $wrap.css('-webkit-transition-duration')) * 1000;

                //移动到函数
                function slide(direction) {
                    //加上动画
                    $wrap.removeClass('notrans');

                    //判断滚动
                    switch (direction) {
                        //向右
                        case 1:
                        //向左
                        case -1:
                        {
                            //动画
                            isAnimating = true;
                            var transform = 'translate3d(' + (direction === 1 ? '' : '-') + width + 'px,0,0)';
                            translate($wrap, transform);

                            //复位操作,更新图片
                            setTimeout(function () {
                                translate($wrap.addClass('notrans'), 'translate3d(0,0,0)');
                                $pics.each(function (i) {
                                    loadImg($(this), index + i - 1);
                                });
                                isAnimating = false;
                            }, duration + 100);//加上一定ms数,可以减缓部分浏览器由于复位操作而引起的闪烁
                            break;
                        }
                        default:
                        {
                            translate($wrap, 'translate3d(0,0,0)');
                        }
                    }

                    //滚动回调函数
                    typeof slideCallback === 'function' && slideCallback(index, direction);
                }

                //移动函数
                function translate($this, val) {
                    $this.css({
                        '-webkit-transform': val,
                        'transform': val
                    });
                }

                //加载图片函数
                function loadImg($this, i) {
                    var item = imgData[i];
                    $this.css({
                        'background-image': item ? 'url(' + (imgAttrName ? item[imgAttrName] : item) + ')' : 'none'
                    });
                }

                //初始化加载图片
                $pics.each(function (i) {
                    loadImg($(this), i - 1);
                });


                //暴露slideToIndex方法
                me.slideToIndex = function (i) {
                    var direction;
                    //如不为数字或者超出范围
                    if (typeof i !== 'number' || i < 0 || i >= itemCount || i === index) {
                        return;
                    }

                    //向左
                    if (i > index) {
                        direction = -1;
                        loadImg($pics.eq(2), i);
                    }
                    //向右
                    else {
                        direction = 1;
                        loadImg($pics.eq(0), i);
                    }

                    //做动画
                    index = i;
                    slide(direction);
                };

                //暴露addItem方法
                me.addItem = function (item) {
                    //如为数组
                    if ($.isArray(item)) {
                        imgData = imgData.concat(item);
                    }
                    else {
                        imgData.push(item);
                    }
                    itemCount = imgData.length;
                };


                //触摸开始事件
                $this.on('touchstart', function (evt) {
                    if (!isAnimating) {
                        var touch = evt.targetTouches[0];
                        //记录触摸开始位置
                        startX = touch.pageX;
                        startY = touch.pageY;
                        //重置swipSpan
                        swipSpan = 0;
                        //取消动画
                        $wrap.addClass('notrans');
                    }
                });

                //触摸移动事件
                $this.on('touchmove', function (evt) {

                    if (!isAnimating) {
                        var touch = evt.targetTouches[0],
                            swipSpanX = touch.pageX - startX,
                            swipSpanY = touch.pageY - startY;

                        //左右
                        if (Math.abs(swipSpanX) > Math.abs(swipSpanY)) {
                            evt.preventDefault();
                            evt.stopPropagation();

                            //第一张图
                            if (index === 0 && swipSpanX > 0) {
                                swipSpanX /= 2;
                            }
                            //最后一张图
                            if (index === itemCount - 1 && swipSpanX < 0) {
                                swipSpanX /= 2;
                            }

                            var transform = 'translate3d(' + (swipSpan = swipSpanX) + 'px,0,0)';
                            translate($wrap, transform);
                        }
                    }
                    else {
                        evt.preventDefault();
                        evt.stopPropagation();
                    }
                });

                //触摸结束事件
                $this.on('touchend', function () {
                    if (!isAnimating) {
                        var direction;
                        //向右
                        if (swipSpan > swipThreshold) {
                            --index < 0 ? index = 0 : direction = 1;
                        }
                        //向左
                        if (swipSpan < -swipThreshold) {
                            ++index === itemCount ? index = itemCount - 1 : direction = -1;
                        }

                        //滚动
                        swipSpan !== 0 && slide(direction);
                    }
                }).trigger('touchend');

                //屏幕尺寸改变事件
                window.addEventListener('resize', function () {
                    var w = $this.width();
                    w > 0 && (width = w);
                }, false);

            }


            //初始化
            init();

        });

    };

})(window, $);