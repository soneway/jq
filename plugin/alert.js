/*通用弹框*/
(function (window, $) {

    //初始化html
    var html = '<div id="pi-alert"><div class="pi-box"><h2 class="pi-head"></h2><p class="pi-msg"></p><p><a class="btn btn_ok">确定</a></p></div></div>' +
        '<div id="pi-confirm"><div class="pi-box"><h2 class="pi-head"></h2><p class="pi-msg"></p><p><a class="btn btn_ok">确定</a><a class="btn btn_cancel">取消</a></p></div></div>' +
        '<div id="pi-tooltip"></div>';
    $(document.body).append(html);


    //alert方法
    var alert = (function () {
        var $alert = $('#pi-alert'),
            $head = $alert.find('.pi-head'),
            $msg = $alert.find('.pi-msg'), opts;

        //确定按钮点击
        $alert.on('click', '.btn_ok', function () {
            //关闭窗口
            $alert.removeClass('visible');

            //响应事件放在靠后
            var btnOkClick = opts.btnOkClick;
            typeof btnOkClick === 'function' && btnOkClick();
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
        var $confirm = $('#pi-confirm'),
            $head = $confirm.find('.pi-head'),
            $msg = $confirm.find('.pi-msg'), opts;

        //确定和取消按钮点击
        $confirm.on('click', '.btn_ok', function () {
            //关闭窗口
            $confirm.removeClass('visible');

            //响应事件放在靠后
            var btnOkClick = opts.btnOkClick;
            typeof btnOkClick === 'function' && btnOkClick();
        }).on('click', '.btn_cancel', function () {
            //关闭窗口
            $confirm.removeClass('visible');

            //响应事件放在靠后
            var btnCancelClick = opts.btnCancelClick;
            typeof btnCancelClick === 'function' && btnCancelClick();
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


    //tooltip方法
    var tooltip = (function () {
        var $tooltip = $('#pi-tooltip'),
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


    //导出对象
    var exports = {
        alert  : alert,
        confirm: confirm,
        tooltip: tooltip
    };

    //CommonJS
    if (typeof exports === 'object') {
        return module.exports = exports;
    }

    $.extend(window, exports);

})(window, $);