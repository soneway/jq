/*通用弹框*/
(function (window, $) {

    //初始化html
    var html = '<div id="alert"><div class="box"><h2 class="head"></h2><p class="msg"></p><p><a class="btn btn_ok">确定</a></p></div></div>' +
        '<div id="confirm"><div class="box"><h2 class="head"></h2><p class="msg"></p><p><a class="btn btn_ok">确定</a><a class="btn btn_cancel">取消</a></p></div></div>' +
        '<div id="modal"><div class="box"><iframe frameborder="0"></iframe><a class="btn_close">╳</a></div></div>' +
        '<div id="dialog"><div class="box"><a class="btn_close">╳</a></div><div class="tempbox"></div></div>' +
        '<div id="tooltip"></div>';
    $(document.body).append(html);


    //alert方法
    var alert = (function () {
        var $alert = $('#alert'),
            $head = $alert.find('.head'),
            $msg = $alert.find('.msg'), opts;

        //确定按钮点击
        $alert.on('click', '.btn_ok', function () {
            var btnOkClick = opts.btnOkClick;
            typeof btnOkClick === 'function' && btnOkClick();

            //关闭窗口
            $alert.removeClass('visible');
        });

        return function (options) {
            //配置项
            typeof options !== 'object' && (options = {msg: options});
            opts = $.extend({}, alert.defaults, options);

            //显示内容
            $head.html(opts.head);
            $msg.html(opts.msg);

            //打开窗口
            $alert.addClass('visible');
        };
    })();
    alert.defaults = {
        msg : '内容',
        head: '提示'
    };


    //confirm方法
    var confirm = (function () {
        var $confirm = $('#confirm'),
            $head = $confirm.find('.head'),
            $msg = $confirm.find('.msg'), opts;

        //确定和取消按钮点击
        $confirm.on('click', '.btn_ok', function () {
            var btnOkClick = opts.btnOkClick;
            typeof btnOkClick === 'function' && btnOkClick();

            //关闭窗口
            $confirm.removeClass('visible');
        }).on('click', '.btn_cancel', function () {
            var btnCancelClick = opts.btnCancelClick;
            typeof btnCancelClick === 'function' && btnCancelClick();

            //关闭窗口
            $confirm.removeClass('visible');
        });

        return function (options) {
            //配置项
            typeof options !== 'object' && (options = {msg: options});
            //配置项
            opts = $.extend({}, confirm.defaults, options);

            //设置内容
            $head.html(opts.head);
            $msg.html(opts.msg);

            //打开窗口
            $confirm.addClass('visible');
        };
    })();
    confirm.defaults = {
        msg : '内容',
        head: '提示'
    };


    //modal方法
    var modal = (function () {
        var $modal = $('#modal'),
            $box = $modal.find('.box'),
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
        width : 980,
        height: 640
    };


    //dialog方法
    var dialog = (function () {
        var $dialog = $('#dialog'),
            $box = $dialog.find('.box'),
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


    //tooltip方法
    var tooltip = (function () {
        var $tooltip = $('#tooltip'),
            timeout;

        return function (msg, isOk, time) {
            $tooltip.html(msg).addClass('visible');

            //ok状态
            isOk ? $tooltip.addClass('ok') : $tooltip.removeClass('ok');

            //定时隐藏
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                $tooltip.removeClass('visible');
            }, time || 2000);
        };
    })();

    module.exports = {
        alert  : alert,
        confirm: confirm,
        dialog : dialog,
        modal  : modal,
        tooltip: tooltip
    };

})(window, $);