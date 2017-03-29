//焦点图

require('carousel');

//加载时执行
exports.load = function ($this, isInit) {
    if (isInit) {
        var html = '';
        for (var i = 1, len = 6; i < len; i++) {
            html += '<img data-title="标题' + i + '" src="img/' + i + '.jpg"/>';
        }

        $('.carousel').each(function () {
            $(this).html(html).carousel({
                isVertical: this.getAttribute('data-isvertical') === '1',
                isAutoPlay: true,
                autoPlayInter: 3000
            });
        });
    }
};