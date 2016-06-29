/*通用弹框*/
(function (window, $) {

    //初始化html
    var html = '<div id="pi-dialog"><div class="pi-box"><a class="btn_close">╳</a></div><div class="tempbox"></div></div>' +
        '<div id="pi-modal"><div class="pi-box"><iframe frameborder="0"></iframe><a class="btn_close">╳</a></div></div>';
    $(document.body).append(html);


    //dialog方法
    var dialog = (function () {
        var $dialog = $('#pi-dialog'),
            $box = $dialog.find('.pi-box'),
            $tempbox = $dialog.find('.tempbox'),
            htmlEl = document.documentElement,
            opts, elCache = {};

        //关闭按钮点击
        $dialog.on('click', '.btn_close', function () {
            dialog.close();
        });

        return function (options) {
            //配置项
            typeof options !== 'object' && (options = {sel: options});
            opts = $.extend({}, dialog.defaults, options);

            //显示的元素
            var sel = opts.sel,
                $el = elCache[sel] || (elCache[sel] = $(sel)),
                width = $el[0].offsetWidth,
                height = $el[0].offsetHeight;

            //高度限定不超过窗口高度
            var wHeight = htmlEl.clientHeight;
            height > wHeight && (height = wHeight);

            //设置位置尺寸
            $box.css({
                width        : width + 'px',
                height       : height + 'px',
                'margin-left': -width / 2 + 'px',
                'margin-top' : -height / 2 + 'px'
            }).append($el);

            //打开窗口
            $dialog.addClass('visible');

            //关闭函数
            dialog.close = function () {
                var onClose = opts.onClose;
                typeof onClose === 'function' && onClose();

                //关闭窗口
                $dialog.removeClass('visible');

                //重置内容
                setTimeout(function () {
                    $el.appendTo($tempbox);
                }, parseFloat($dialog.css('transition-duration')) * 1000);
            };
        };
    })();
    dialog.defaults = {};


    //modal方法
    var modal = (function () {
        var $modal = $('#pi-modal'),
            $box = $modal.find('.pi-box'),
            $iframe = $modal.find('iframe'),
            htmlEl = document.documentElement, opts;

        //关闭按钮点击
        $modal.on('click', '.btn_close', function () {
            modal.close();
        });

        return function (options) {
            //配置项
            typeof options !== 'object' && (options = {href: options});
            opts = $.extend({}, modal.defaults, options);

            //高度限定不超过窗口高度
            var wHeight = htmlEl.clientHeight;
            opts.height > wHeight && (opts.height = wHeight);

            //设置页面
            $iframe.attr({
                width : opts.width,
                height: opts.height,
                src   : opts.href
            });

            //设置位置尺寸
            $box.css({
                'margin-left': -opts.width / 2 + 'px',
                'margin-top' : -opts.height / 2 + 'px'
            });

            //打开窗口
            $modal.addClass('visible');

            //关闭函数
            modal.close = function () {
                var onClose = opts.onClose;
                typeof onClose === 'function' && onClose();

                //关闭窗口
                $modal.removeClass('visible');

                //重置页面
                setTimeout(function () {
                    $iframe.attr('src', '');
                }, parseFloat($modal.css('transition-duration')) * 1000);
            };
        };
    })();
    modal.defaults = {
        width : window.innerWidth,
        height: window.innerHeight
    };


    //导出对象
    var exports = {
        dialog: dialog,
        modal : modal
    };

    //CommonJS
    if (typeof exports === 'object') {
        return module.exports = exports;
    }

    $.extend(window, exports);

})(window, $);