//3d旋转切换

require('flip');


//加载时执行
exports.load = function ($this, isInit) {
    if (isInit) {
        $('.flip').each(function () {
            var len = this.getAttribute('data-len'),
                html = '';

            for (var i = 0; i < len; i++) {
                html += '<a><p style="background: url(img/' + (i + 1) + '.jpg) center center; background-size: cover;" data-title="3d旋转切换示例 ' + (i + 1) + '"></p></a>';
            }

            $(this).html(html).flip({
                isVertical: this.getAttribute('data-isvertical') === '1'
            });
        });
    }
};