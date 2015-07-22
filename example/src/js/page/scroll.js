//自定义滚动
require('scroll');

module.exports = function ($this, isInit) {
    if (isInit) {
        $('.scroll').each(function () {
            $(this).scroll({
                isVertical: this.getAttribute('data-isvertical') === '1'
            });
        });
    }
};