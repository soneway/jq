﻿//ui.js
(function (window, $) {

    //文档元素
    var document = window.document,
    //loc对象
        location = window.location,
    //文档$对象
        $doc = $(document),
    //body$对象
        $body = $(document.body);


    /**
     * 是否显示二维码(默认为true)
     * @type {boolean}
     */
    $.isShowQrcode = true;

    /**
     * 是否为移动端
     * @type {boolean}
     */
    $.isMobi = /(iPhone|iPod|iPad|android|windows phone os|iemobile)/i.test(window.navigator.userAgent);


    //文档加载完成
    $(function () {

        //添加class
        $body.addClass('loaded');

        //a标签touch
        $doc.on('touchstart', 'a', function () {
            $(this).addClass('focus');
        });
        $doc.on('touchend', 'a', function () {
            $(this).removeClass('focus');
        });

        //pc端二维码
        $.isShowQrcode && !$.isMobi && $.jsonp('http://img.gd.sohu.com/js/qrcode.js', function () {
                var $qrcode = $('#qrcode');
                if ($qrcode.length === 0) {
                    $qrcode = $('<div id="qrcode"></div>');
                    $body.append($qrcode);
                    new QRCode($qrcode[0], {
                        width: $qrcode.width(),
                        height: $qrcode.height(),
                        text: location.href
                    });
                }
                $doc.on('click', '#qrcode', function () {
                    $qrcode.fadeOut();
                });
            }
        );

    });

})(this, $);