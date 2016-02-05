//焦点图
(function (window, $) {

    require('carousel');

    //加载时执行
    function load($this, isInit) {
        if (isInit) {
            var html = '';
            for (var i = 1, len = 6; i < len; i++) {
                html += '<img data-title="标题' + i + '" src="img/' + i + '.jpg"/>';
            }

            $('.carousel').each(function () {
                $(this).html(html).carousel({
                    isVertical: this.getAttribute('data-isvertical') === '1',
                    isAutoPlay: false
                });
            });
        }
    }

    $.extend(exports, {
        load: load
    });

})(window, $);