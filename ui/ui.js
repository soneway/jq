﻿//ui.js
(function (window, $) {

    //文档元素
    var document = window.document,
    //文档$对象
        $doc = $(document),
    //body $对象
        $body = $(document.body),
    //mainbox $对象
        $mainbox = $('#mainbox');

    /**
     * 首页hash(默认为#panel1)
     * @type {string}
     */
    $.indexSelector = '#panel1';


    //scrollTop处理相关
    var scrollTop = (function () {
        var cache = {},
            bodyEl = document.body,
        //是否body滚动
            isBodyScroll = $mainbox.css('overflow') !== 'hidden';

        return function (id, isCache) {
            if (isBodyScroll) {
                //是否是存储scrollTop
                isCache ? (cache[id] = bodyEl.scrollTop) : (bodyEl.scrollTop = cache[id] || 0);
            }
        };
    })();


    /**
     * 显示panel时函数
     * @param $toShow 显示的$对象
     * @param $toHide 隐藏的$对象
     * @ignore
     */
    var toShowPanel = (function () {
        var cache = {};
        return function ($toShow) {
            var panelLoaded = $.panelLoaded,
                id = $toShow[0].id;

            //显示时调用函数
            typeof panelLoaded === 'function' && panelLoaded($toShow, !cache[id]);

            //记录panel是否初始化过
            cache[id] = true;
        };
    })();

    /**
     * 隐藏panel时函数
     * @param $toHide 隐藏的$对象
     * @param $toShow 显示的$对象
     * @ignore
     */
    function toHidePanel($toHide) {
        //隐藏时调用函数
        var panelUnloaded = $.panelUnloaded;
        typeof panelUnloaded === 'function' && panelUnloaded($toHide);
    }

    /**
     * 显示/隐藏边栏函数
     * @param isShow 是否显示
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

    /**
     * 显示/隐藏头部函数
     * @param isShow 是否显示
     */
    $.toggleHeader = function (isShow) {
        isShow ? $mainbox.removeClass('offheader') : $mainbox.addClass('offheader');
    };

    /**
     * 显示/隐藏导航条函数
     * @param isShow 是否显示
     */
    $.toggleNavbar = function (isShow) {
        isShow ? $mainbox.removeClass('offnavbar') : $mainbox.addClass('offnavbar');
    };

    /**
     * 设置标题函数
     * @param title 标题
     */
    $.setTitle = (function () {
        var $title = $('.roottitle .title');
        return function (title) {
            title && $title.html(title);
        };
    })();

    /**
     * 设置二级页面标题函数
     * @param title 二级页面标题
     */
    $.setSubtitle = (function () {
        var $title = $('.subtitle .title');
        return function (title) {
            title && $title.html(title);
        };
    })();


    /**
     * 加载panel函数
     * @param hash panel的hash(如#panel1)
     */
    $.loadPanel = (function () {

        //导航中的a元素
        var $navbarA = $('#navbar a'),
        //导航容器元素
            navboxEl = document.querySelector('.navbox'),
        //index元素
            $index = $($.indexSelector),
        //panel切换动画duration
            duration = parseFloat($index.css('transition-duration') || $index.css('-webkit-transition-duration')) * 1000,
        //历史记录对象
            history = $.history = [],
        //header元素
            $header = $('#header');

        return function (hash) {
            var $toShow, $toHide;

            if (!hash) {
                $toHide = history.pop();
                $toShow = history[history.length - 1];
                hash = '#' + $toShow.attr('id');
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


                //没有隐藏面板的特殊情况(页面第一次加载)
                if (!$toHide) {
                    //显示panel和导航
                    $toShow.addClass('show opened');

                    //设置标题
                    $.setTitle($toShow.attr('title'));

                    //显示时调用函数
                    toShowPanel($toShow);
                    return;
                }


                //面板切换
                if ('#' + $toHide.attr('id') !== hash) {

                    var showRole = $toShow.attr('data-role'),
                        hideRole = $toHide.attr('data-role');

                    //1.立即操作
                    $toShow.addClass('show');
                    $mainbox.addClass('reflow');//切换面板时强制重排一次,以免出现横向滚动条

                    //2.延迟保证显示动画
                    setTimeout(function () {
                        //显示一级面板
                        if (showRole === 'root') {

                            //设置标题
                            $.setTitle($toShow.attr('title'));

                            //显示navbar
                            $.toggleNavbar(true);

                            //header内容切换
                            $header.removeClass('onsubtitle');

                            //一级->一级时无动画
                            if (hideRole === 'root') {
                                $toShow.addClass('notrans');
                                $toHide.addClass('notrans');
                            }
                            else {
                                $toShow.removeClass('notrans');
                                $toHide.removeClass('notrans');
                            }

                            $toShow.removeClass('subopened').addClass('opened');
                            $toHide.removeClass('opened');
                        }
                        //显示二级面板
                        else {

                            //设置二级页面标题
                            $.setSubtitle($toShow.attr('title'));

                            //隐藏navbar
                            $.toggleNavbar(false);

                            //header内容切换
                            $header.addClass('onsubtitle');

                            $toShow.removeClass('notrans');
                            $toHide.removeClass('notrans');

                            if ($toShow.hasClass('subopened')) {
                                $toShow.removeClass('subopened').addClass('opened');
                                $toHide.removeClass('opened');
                            }
                            else {
                                $toShow.addClass('opened');
                                $toHide.addClass('subopened').removeClass('opened');
                            }
                        }

                        //a.记录scrollTop(必须放在隐藏之前)
                        scrollTop($toHide.attr('id'), true);

                        //显示时调用函数(放在靠后)
                        toShowPanel($toShow);
                    }, 0);

                    //3.延迟保证隐藏动画
                    setTimeout(function () {
                        $toHide.removeClass('show');

                        //b.设置scrollTop(必须放在显示之后)
                        scrollTop($toShow.attr('id'), false);
                        setTimeout(function () {
                            $mainbox.removeClass('reflow');//切换面板时强制重排一次(延迟100ms在ios8上才有效果)
                        }, 100);

                        //如果是打开iframe页面的面板
                        $toHide.attr('id') === 'paneliframe' && ($toHide.html(''));

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
            $.toggleSidebox(true);
        });
        //btn-offsidebox点击
        $doc.on('click', '.btn-offsidebox', function () {
            $.toggleSidebox(false);
        });

        //a标签点击事件切换panel
        var $iframe = $('#paneliframe');
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
                $iframe.html('<iframe example="' + href + '"></iframe>');
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

        //初始化加载index
        $.loadPanel($.indexSelector);

        //加载指定panel
        var hash = location.hash;
        hash && setTimeout(function () {
            $.loadPanel(hash);
        }, 400);//加上一定ms数保证panel加载动画流畅

    });

})(this, $);