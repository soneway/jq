//自定义滚动
(function (window, $) {

    require('scroll');


    //加载时执行
    function load($this, isInit) {
        if (isInit) {
            $('.scroll').each(function () {
                $(this).scroll({
                    isVertical: this.getAttribute('data-isvertical') === '1'
                });
            });
        }
    }

    $.extend(exports, {
        load: load
    });

})(window, $);