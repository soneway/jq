//3d旋转切换
require('flip');

module.exports = function ($this, isInit) {
    if (isInit) {
        $('.flip').each(function () {
            var len = this.getAttribute('data-len'),
                part = this.getAttribute('data-part'),
                html = '';

            for (var i = 0; i < len; i++) {
                html += '<a><p style="background: url(img/' + (part ? part + '/' : '') + '' + i + '.jpg) center center no-repeat; background-size: cover;" data-title="3d旋转切换示例 ' + (i + 1) + '"></p></a>';
            }

            $(this).html(html).flip({
                isVertical: this.getAttribute('data-isvertical') === '1'
            });
        });
    }
};