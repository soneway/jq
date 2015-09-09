/*
 * ui.js
 * 移动端界面js,包括面板切换,导航,边栏等功能
 */
(function (window, $) {

    //文档元素
    var document = window.document,
    //文档$对象
        $doc = $(document),
    //body对象
        bodyEl = document.body,
    //body $对象
        $body = $(bodyEl),
    //mainbox $对象
        $mainbox = $('#mainbox');

    /**
     * 首页hash(默认为#home)
     * @type {string}
     */
    $.homeSelector = '#home';


    //header及navbar宽度(解决ios中header宽度的bug)
    $.isBodyScroll && $(window).on('resize', (function () {
        var $toFix = $('#header,#navbar');
        return function () {
            $toFix.css({
                width: window.innerWidth + 'px'
            });
        };
    })()).trigger('resize');


    /**
     * 显示/隐藏头部函数
     * @param {boolean} isShow 是否显示
     */
    $.toggleHeader = function (isShow) {
        isShow ? $mainbox.removeClass('offheader') : $mainbox.addClass('offheader');
    };

    /**
     * 显示/隐藏导航条函数
     * @param {boolean} isShow 是否显示
     */
    $.toggleNavbar = function (isShow) {
        isShow ? $mainbox.removeClass('offnavbar') : $mainbox.addClass('offnavbar');
    };

    /**
     * 设置标题函数
     * @param {string} title 标题
     */
    $.setTitle = (function () {
        var $title = $('.roottitle .title');
        return function (title) {
            title && $title.html(title);
        };
    })();

    /**
     * 设置二级页面标题函数
     * @param {string} title 二级页面标题
     */
    $.setSubtitle = (function () {
        var $title = $('.subtitle .title');
        return function (title) {
            title && $title.html(title);
        };
    })();


    /**
     * 加载panel函数
     * @param {string} hash panel的hash(如#home)
     * @param {boolean} isAnimation 是否动画
     */
    $.loadPanel = (function () {

        //导航中的a元素
        var $navbarA = $('#navbar a'),
        //导航容器元素
            navboxEl = document.querySelector('.navbox'),
        //面板元素
            $panel = $('.panel'),
        //panel切换动画duration
            duration = parseFloat($panel.css('transition-duration')) * 1000,
        //历史记录对象
            history = $.history = [],
        //header元素
            $header = $('#header');

        /**
         * 页面加载是否动画(默认为true)
         * @type {boolean}
         */
        $.isLoadAnimation = true;

        /**
         * scrollTop处理相关
         * @param {string} id 元素id
         * @param {boolean} isCache 是否是存储scrollTop
         * @ignore
         */
        var scrollTop = (function () {
            var cache = {};
            return function (id, isCache) {
                if ($.isBodyScroll) {
                    //是否是存储scrollTop
                    isCache ? (cache[id] = bodyEl.scrollTop) : (bodyEl.scrollTop = cache[id] || 0);
                }
            };
        })();

        /**
         * 显示panel时函数
         * @param {$init} $toShow 显示的$对象
         * @ignore
         */
        var toShowPanel = (function () {
            var cache = {};
            return function ($toShow) {
                var id = $toShow[0].id;

                //显示
                $toShow.addClass('show opened');

                //b.设置scrollTop(必须放在显示之后)
                scrollTop(id, false);

                //显示时调用函数
                var panelLoaded = $.panelLoaded;
                typeof panelLoaded === 'function' && panelLoaded($toShow, !cache[id]);

                //记录panel是否初始化过(放在最后)
                cache[id] = true;
            };
        })();

        /**
         * 隐藏panel时函数
         * @param {$init} $toHide 隐藏的$对象
         * @ignore
         */
        function toHidePanel($toHide) {
            //隐藏
            $toHide.removeClass('show');

            //如果是打开iframe页面的面板
            $toHide[0].id === 'paneliframe' && ($toHide.html(''));

            //隐藏时调用函数
            var panelUnloaded = $.panelUnloaded;
            typeof panelUnloaded === 'function' && panelUnloaded($toHide);
        }


        /**
         * 显示/隐藏边栏函数
         * @param {boolean} isShow 是否显示
         */
        $.toggleSidebox = (function () {
            var $sidebox = $('#sidebox');

            return function (isShow) {
                //相关panel
                var $panel = $.history[$.history.length - 1];
                if (isShow) {
                    $body.addClass('onsidebox');
                    //显示时调用函数
                    toShowPanel($sidebox);
                    //隐藏原页面
                    toHidePanel($panel);
                }
                else {
                    $body.removeClass('onsidebox');
                    //隐藏时调用函数
                    toHidePanel($sidebox);
                    //显示原页面
                    toShowPanel($panel);
                }
            };
        })();

        return function (hash, isAnimation) {
            var $toShow, $toHide;

            if (!hash) {
                $toHide = history.pop();
                $toShow = history[history.length - 1] || $($.homeSelector);
                hash = '#' + $toShow[0].id;
            }
            else {
                $toShow = $(hash);
                if ($toShow.length > 0) {
                    $toHide = history[history.length - 1];
                    history.push($toShow);
                }
            }


            //如果有显示面板
            if ($toShow.length > 0) {

                //navbar选中状态(与面板切换无关的操作)
                $navbarA.length > 0 && $navbarA.each(function () {
                    var array = (this.getAttribute('data-hash') || this.hash).split('|');
                    for (var i = 0, len = array.length; i < len; i++) {
                        if (array[i] === hash) {
                            $navbarA.removeClass('selected');
                            $(this).addClass('selected');
                            //居中
                            navboxEl.center(this);
                        }
                    }
                });

                //标题,navbar状态(与面板切换无关的操作)
                var showRole = $toShow.attr('data-role');
                if (showRole === 'root') {
                    //设置标题
                    $.setTitle($toShow.attr('title'));

                    //显示navbar
                    $.toggleNavbar(true);

                    //header内容切换
                    $header.removeClass('onsubtitle');
                }
                else {
                    //设置二级页面标题
                    $.setSubtitle($toShow.attr('title'));

                    //隐藏navbar
                    $.toggleNavbar(false);

                    //header内容切换
                    $header.addClass('onsubtitle');
                }


                //没有隐藏面板的特殊情况(页面第一次加载)
                if (!$toHide) {
                    //显示时调用函数
                    toShowPanel($toShow);
                    return;
                }


                //面板切换
                if ('#' + $toHide[0].id !== hash) {
                    var hideRole = $toHide.attr('data-role');

                    //a.记录scrollTop(必须放在隐藏之前)
                    scrollTop($toHide[0].id, 1);


                    //一级->一级或无动画
                    var isAni = isAnimation === undefined ? $.isLoadAnimation : isAnimation;
                    if (!isAni || showRole === 'root' && hideRole === 'root') {
                        //无动画
                        $toShow.addClass('notrans');
                        $toHide.addClass('notrans');

                        //显示时调用函数(放在靠后)
                        toShowPanel($toShow);
                        //隐藏时调用函数(放在靠后)
                        toHidePanel($toHide);
                        return;
                    }


                    //其他切换
                    //1.显示
                    $toShow.addClass('show');

                    //切换面板时强制重排一次,以免出现横向滚动条
                    $mainbox.addClass('reflow');

                    //2.延迟保证显示动画
                    setTimeout(function () {
                        //有动画
                        $toShow.removeClass('notrans');
                        $toHide.removeClass('notrans');

                        //二级->一级
                        if (showRole === 'root') {
                            $toShow.removeClass('subopened');
                            $toHide.removeClass('opened');
                        }
                        //显示二级面板
                        else {
                            //一级->二级
                            if ($toShow.hasClass('subopened')) {
                                $toShow.removeClass('subopened');
                                $toHide.removeClass('opened');
                            }
                            //二级->二级
                            else {
                                $toHide.addClass('subopened').removeClass('opened');
                            }
                        }

                        //显示时调用函数(放在靠后)
                        toShowPanel($toShow);
                    }, 0);

                    //3.延迟保证隐藏动画
                    setTimeout(function () {

                        //延迟重排(延迟100ms在ios8上才有效果)
                        setTimeout(function () {
                            $mainbox.removeClass('reflow');//切换面板时强制重排一次
                        }, 100);

                        //隐藏时调用函数(放在靠后)
                        toHidePanel($toHide);
                    }, duration);
                }
            }
            //没有显示面板
            else {
                console.log(hash + '面板未找到');
            }

        };

    })();


    //文档加载完成
    $(function () {

        //btn-onsidebox点击
        $doc.on('click', '.btn-onsidebox', function () {
            $.toggleSidebox(1);
        });
        //btn-offsidebox点击
        $doc.on('click', '.btn-offsidebox', function () {
            $.toggleSidebox(0);
        });

        //iframe面板
        var $iframe = $('#paneliframe');
        if ($iframe.length === 0) {
            $iframe = $('<div id="paneliframe" class="panel"></div>');
            $mainbox.append($iframe);
        }

        //a标签点击事件切换panel
        $doc.on('click', 'a', function (evt) {
            var hash = this.hash;
            if (hash) {
                evt.preventDefault();
                $.loadPanel(hash);
                return;
            }

            //不跳出页面加载其他页面(需要a标签有data-href属性)
            var href = this.getAttribute('data-href'),
                title = this.getAttribute('data-title');

            if (href) {
                evt.preventDefault();
                $iframe.html('<iframe src="' + href + '"></iframe>');
                $.setSubtitle(title || '详情');
                $.loadPanel('#paneliframe');
            }
        });

        //返回按钮点击
        $doc.on('click', '#btn-goback', function () {
            $.loadPanel();
        });


        //导航条
        var $navbox = $('.navbox');
        //导航条拨动
        $navbox.length > 0 && $navbox.scroll();

        //初始化加载指定panel或者首页
        var hash = location.hash;
        $.loadPanel(hash || $.homeSelector);

    });

})(window, $);