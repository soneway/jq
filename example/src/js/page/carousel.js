//焦点图
(function (window, $) {

    require('carousel');

    module.exports = function ($this, isInit) {
        if (isInit) {
            $('.carousel').each(function () {
                var len = this.getAttribute('data-len'),
                    part = this.getAttribute('data-part'),
                    html = '';

                for (var i = 0; i < len; i++) {
                    html += '<a style="background: url(img/' + (part ? part + '/' : '') + '' + i + '.jpg) center center no-repeat; background-size: cover;" data-title="焦点图示例 ' + (i + 1) + '"></a>';
                }

                $(this).html(html).carousel({
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
    };

})(window, $);