//刮刮卡
(function (window, $) {

    require('scratchcard');

    module.exports = function ($this, isInit) {
        if (isInit) {
            $('.scratchcard').each(function () {
                $(this).scratchcard({
                    text  : '刮开有奖',
                    imgSrc: 'img/3.jpg'
                });
            });
        }
    };

})(window, $);