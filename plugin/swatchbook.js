/*
 * swatchbook.js
 * 扇形特效js
 * */
(function (window, $) {

    $.fn.swatchbook = function (options) {
        $.fn.swatchbook.defaults = {
            //打开的index
            centerIdx: 6,
            //item之间的角度(center右边的item)
            angleInc: 8,
            //打开的item与右边item之间的角度
            proximity: 45,
            //item之间的角度(center左边的item)
            neighbor: 4,
            //初始化时是否关闭
            initIsClosed: false,
            //能打开和关闭的index
            closeIdx: -1,
            //打开项
            openAt: -1,
            //点选状态下再点击时触发函数
            selectCallback: null,
            //打开延迟
            openDelay: 25
        };

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.swatchbook.defaults, options);

            //配置项
            var centerIdx = opts.centerIdx,
                angleInc = opts.angleInc,
                proximity = opts.proximity,
                neighbor = opts.neighbor,
                initIsClosed = opts.initIsClosed,
                closeIdx = opts.closeIdx,
                openAt = opts.openAt,
                selectCallback = opts.selectCallback,
                openDelay = opts.openDelay;

            //变量
            var $this = $(this),
                $items = $this.addClass('sb-container').children('*'),
                itemsCount = $items.length,
                currentIdx = -1,
                cache = [],
                isClosed;

            //初始化函数
            function init() {
                //兼容安卓2.x
                $.isAndroid2 && $this.css({
                    '-webkit-backface-visibility': 'visible',
                    'backface-visibility': 'visible'
                });

                if (!initIsClosed) {
                    center(centerIdx);
                }
                else {
                    isClosed = true;
                }

                if (openAt >= 0 && openAt < itemsCount) {
                    openItem($items.eq(openAt));
                }

                initEvents();
            }

            function center(idx) {
                $items.each(function (i) {
                    var $this = $(this),
                        transformStr = 'rotateZ(' + (angleInc * (i - idx)) + 'deg)';

                    //设定一定延时,防止计算能力差的浏览器(ucweb)打不开swatchbook
                    setTimeout(function () {
                        $this.css({
                            '-webkit-transform': transformStr,
                            'transform': transformStr
                        });
                    }, i * openDelay);
                });
            }

            function openItem($item) {
                var itemIdx = $item.index();
                if (itemIdx !== currentIdx) {
                    $items.removeClass('selected');
                    if (closeIdx !== -1 && itemIdx === closeIdx) {
                        currentIdx = -1;
                        openClose();
                    }
                    else {
                        currentIdx = itemIdx;
                        $item.css({
                            '-webkit-transform': 'rotateZ(0deg)',
                            'transform': 'rotateZ(0deg)'
                        }).addClass('selected');
                        rotateSiblings($item, itemIdx);
                    }
                }
                else if (itemIdx === currentIdx && typeof selectCallback === 'function') {
                    selectCallback(itemIdx);
                }
            }

            function openClose() {
                if (isClosed) {
                    center(centerIdx);
                }
                else {
                    $items.css({
                        '-webkit-transform': 'rotateZ(0deg)',
                        'transform': 'rotateZ(0deg)'
                    });
                }
                isClosed = !isClosed;
            }

            function rotateSiblings($item, itemIdx) {
                var $cached = cache[itemIdx],
                    $siblings;

                if ($cached) {
                    $siblings = $cached;
                }
                else {
                    $siblings = $item.siblings();
                    cache[itemIdx] = $siblings;
                }

                $siblings.each(function (i) {
                    var rotateVal = i < itemIdx ?
                    angleInc * (i - itemIdx) : i - itemIdx === 1 ?
                        proximity : proximity + (i - itemIdx - 1) * neighbor;
                    var transformStr = 'rotateZ(' + rotateVal + 'deg)';

                    $(this).css({
                        '-webkit-transform': transformStr,
                        'transform': transformStr
                    });
                });
            }

            //初始化事件函数
            function initEvents() {
                $items.on('click', function () {
                    openItem($(this));
                });
            }


            //初始化
            init();

        });
    };

})(window, $);