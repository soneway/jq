//刮刮卡

require('scratchcard');


//加载时执行
exports.load = function ($this, isInit) {
    if (isInit) {
        $('.scratchcard').each(function () {
            $(this).scratchcard({
                text  : '刮开有奖',
                imgSrc: 'img/4.jpg'
            });
        });
    }
};