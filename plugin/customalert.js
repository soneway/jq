/*
 * customalert.js
 * 自定义提示框js
 */
(function (window, $) {

    //1.变量
    var $title, $content,
        $btnOk, $btnCancel,
        btnOkClick, btnCancelClick,
        onShow, onHide,
        document = window.document,
        $doc = $(document),
        $body = $(document.body),
        $customalert = $('#customalert');


    //2.初始化
    (function () {
        if ($customalert.length === 0) {
            $customalert = $('<div id="customalert">' +
                '<div class="ca-box">' +
                '<h1 class="ca-title">提示</h1>' +
                '<p class="ca-content">是否转到登陆</p>' +
                '<a class="btn ca-ok">确定</a>' +
                '<a class="btn ca-cancel">关闭</a>' +
                '</div>' +
                '</div>');
            //添加html元素
            $body.append($customalert);
        }

        $title = $customalert.find('.ca-title');
        $content = $customalert.find('.ca-content');
        $btnOk = $customalert.find('.ca-ok');
        $btnCancel = $customalert.find('.ca-cancel');
    })();


    //3.事件
    //确定按钮
    $doc.on('click', '#customalert .ca-ok', function () {
        //隐藏
        $body.removeClass('oncustomalert');
        typeof onHide === 'function' && onHide();
        typeof btnOkClick == 'function' && btnOkClick();
    });
    //关闭按钮
    $doc.on('click', '#customalert .ca-cancel', function () {
        //隐藏
        $body.removeClass('oncustomalert');
        typeof onHide === 'function' && onHide();
        typeof btnCancelClick === 'function' && btnCancelClick();
    });


    //4.扩展属性
    $.customalert = function (options) {
        options = options || {};

        //配置项
        var opts = $.extend({}, $.customalert.defaults, options);

        var title = opts.title,
            content = opts.content,
            btnOkText = opts.btnOkText,
            btnCancelText = opts.btnCancelText,
            isAlert = opts.isAlert;

        btnOkClick = opts.btnOkClick;
        btnCancelClick = opts.btnCancelClick;
        onShow = opts.onShow;
        onHide = opts.onHide;

        //是否是alert(只显示确定按钮)
        if (isAlert) {
            $customalert.addClass('alert');
        }
        else {
            $customalert.removeClass('alert');
        }

        //设置内容
        title && $title.html(title);
        content && $content.html(content);
        btnOkText && $btnOk.text(btnOkText);
        btnCancelText && $btnCancel.text(btnCancelText);

        //显示
        $body.addClass('oncustomalert');
        typeof onShow === 'function' && onShow();
    };

    //默认配置
    $.customalert.defaults = {
        title         : '提示',
        content       : '内容',
        btnOkText     : '确定',
        btnOkClick    : null,
        btnCancelText : '取消',
        btnCancelClick: null,
        isAlert       : true,
        onShow        : null,
        onHide        : null
    };

})(window, $);