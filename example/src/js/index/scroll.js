//自定义滚动

require('scroll');


//加载时执行
exports.load = function load($this, isInit) {
    if (isInit) {
        $('.scroll').each(function () {
            $(this).scroll({
                isVertical: this.getAttribute('data-isvertical') === '1'
            });
        });
    }
};