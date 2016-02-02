//刮刮卡
(function (window, $) {

    require('scratchcard');


    //加载时执行
    function load($this, isInit) {
        if (isInit) {
            $('.scratchcard').each(function () {
                $(this).scratchcard({
                    text  : '刮开有奖',
                    imgSrc: 'img/3.jpg'
                });
            });
        }
    }

    $.extend(exports, {
        load: load
    });

})(window, $);