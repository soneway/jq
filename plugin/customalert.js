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
            $customalert = $('<div id="customalert"><div><div id="customalert-box"><h1>提示</h1><div id="customalert-content">是否转到登陆</div><a id="customalert-btnok" class="btn">确定</a><a id="customalert-btncancel" class="btn">关闭</a></div></div></div>');
            //添加html元素
            $(document.body).append($customalert);
        }

        $title = $customalert.find('h1');
        $content = $('#customalert-content');
        $btnOk = $('#customalert-btnok');
        $btnCancel = $('#customalert-btncancel');
    })();


    //3.事件
    //确定按钮
    $doc.on('click', '#customalert-btnok', function () {
        //隐藏
        $customalert.removeClass('visible');
        $.isFunction(onHide) && onHide();
        $.isFunction(btnOkClick) && btnOkClick();
    });
    //关闭按钮
    $doc.on('click', '#customalert-btncancel', function () {
        //隐藏
        $customalert.removeClass('visible');
        $.isFunction(onHide) && onHide();
        $.isFunction(btnCancelClick) && btnCancelClick();
    });


    //4.扩展属性
    $.customalert = function (opts) {
        opts = opts || {};
        var title, content, btnOkTxt, btnCancelTxt,
            defaults = $.customalert.defaults;

        //配置项
        for (var p in defaults) {
            opts[p] === undefined && (opts[p] = defaults[p]);
        }
        title = opts.title;
        content = opts.content;
        btnOkTxt = opts.btnOkTxt;
        btnOkClick = opts.btnOkClick;
        btnCancelTxt = opts.btnCancelTxt;
        btnCancelClick = opts.btnCancelClick;
        btnCancelOnly = opts.btnCancelOnly,
        onShow = opts.onShow,
        onHide = opts.onHide;

        //是否只显示关闭
        if (btnCancelOnly) {
            $btnOk.hide();
            $btnCancel.addClass('only').text('确定');
        }
        else {
            $btnOk.show();
            $btnCancel.removeClass('only');
            btnCancelTxt && $btnCancel.text(btnCancelTxt);
        }

        //设置内容
        title && $title.html(title);
        content && $content.html(content);
        btnOkTxt && $btnOk.text(btnOkTxt);

        //显示
        $customalert.addClass('visible');
        $.isFunction(onShow) && onShow();
    };
    //默认配置
    $.customalert.defaults = {
        title: '提示',
        content: '内容',
        btnOkTxt: '确定',
        btnOkClick: null,
        btnCancelTxt: '取消',
        btnCancelClick: null,
        btnCancelOnly: true,
        onShow: null,
        onHide: null
    };

})(this, $);