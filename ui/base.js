/*
 * base.js
 * 移动端基础js,包含pc端二维码,mask,a标签触摸等基础功能
 */
(function (window, $) {

    //文档元素
    var document = window.document,
    //文档$对象
        $doc = $(document),
    //body $对象
        $body = $(document.body);


    //去掉部分浏览器地址栏(ucweb,qq有效)
    $body.addClass('very-high');
    window.scrollTo(0, 1);
    $body.removeClass('very-high');


    /**
     * 是否显示二维码(默认为true)
     * @type {boolean}
     */
    $.isShowQrcode = true;


    var ua = navigator.userAgent;
    /**
     * 是否为移动端
     * @type {boolean}
     */
    $.isMobi = /(iPhone|iPod|iPad|android|windows phone os|iemobile)/i.test(ua);
    /**
     * 是否为安卓
     * @type {string}
     */
    $.isAndroid = /(android)/i.test(ua);
    /**
     * 是否为ios
     * @type {string}
     */
    $.isIos = /(iPhone|iPod|iPad)/i.test(ua);


    /**
     * 显示/隐藏mask函数
     * @param isShow 是否显示
     */
    $.toggleMask = function (isShow) {
        isShow ? $body.addClass('onmask') : $body.removeClass('onmask');
    };


    //文档加载完成
    $(function () {

        setTimeout(function () {
            //添加class
            $body.addClass('loaded');
        }, 100);

        //a标签touch
        $doc.on('touchstart', 'a', function () {
            $(this).addClass('focus');
        });
        $doc.on('touchend', 'a', function () {
            $(this).removeClass('focus');
        });

        //pc端二维码
        $.isShowQrcode && !$.isMobi && $.jsonp('http://img.gd.sohu.com/static/v1/qrcode.js', function () {
                var $qrcode = $('#qrcode');
                if ($qrcode.length === 0) {
                    $qrcode = $('<div id="qrcode"></div>');
                    $body.append($qrcode);
                    new QRCode($qrcode[0], {
                        width : $qrcode.width(),
                        height: $qrcode.height(),
                        text  : location.href
                    });
                }
                $doc.on('click', '#qrcode', function () {
                    $qrcode.fadeOut();
                });
            }
        );

        //pc端mouse转touch事件
        !$.isMobi && $.jsonp('http://img.gd.sohu.com/static/v1/desktouch.js');

    });

})(window, $);