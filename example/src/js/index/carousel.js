//焦点图
(function (window, $) {

    require('carousel');


    //加载时执行
    function load($this, isInit) {
        if (isInit) {
            $('.carousel').each(function () {
                $(this).carousel({
                    isVertical: this.getAttribute('data-isvertical') === '1',
                    isAutoPlay: false
                });
            });

            var html = '';
            for (var i = 0, len = 5; i < len; i++) {
                html += '<img src="img/' + i + '.jpg"/>';
            }
            $('#img_car').html(html).carousel();
        }
    }

    $.extend(exports, {
        load: load
    });

})(window, $);