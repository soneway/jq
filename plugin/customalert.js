//$.customalert
(function (window, $) {

    //1.变量
    var $title, $content,
        $btnOk, $btnCancel,
        btnOkClick, btnCancelClick,
        onShow, onHide,
        document = window.document,
        $doc = $(document),
        $customalert = $('#customalert');


    //2.初始化
    (function () {
        if ($customalert.length === 0) {
            $customalert = $('<div id="customalert">' +
            '<div>' +
            '<div class="box">' +
            '<h1 id="customalert-title">提示</h1>' +
            '<p id="customalert-content">是否转到登陆</p>' +
            '<a id="customalert-btnok" class="btn">确定</a>' +
            '<a id="customalert-btncancel" class="btn">关闭</a>' +
            '</div>' +
            '</div>' +
            '</div>');
            //添加html元素
            $(document.body).append($customalert);
        }

        $title = $('#customalert-title');
        $content = $('#customalert-content');
        $btnOk = $('#customalert-btnok');
        $btnCancel = $('#customalert-btncancel');
    })();


    //3.事件
    //确定按钮
    $doc.on('click', '#customalert-btnok', function () {
        //隐藏
        $customalert.removeClass('visible');
        typeof onHide === 'function' && onHide();
        typeof btnOkClick == 'function' && btnOkClick();
    });
    //关闭按钮
    $doc.on('click', '#customalert-btncancel', function () {
        //隐藏
        $customalert.removeClass('visible');
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
        $customalert.addClass('visible');
        typeof onShow === 'function' && onShow();
    };

    //默认配置
    $.customalert.defaults = {
        title: '提示',
        content: '内容',
        btnOkText: '确定',
        btnOkClick: null,
        btnCancelText: '取消',
        btnCancelClick: null,
        isAlert: true,
        onShow: null,
        onHide: null
    };

})(this, $);