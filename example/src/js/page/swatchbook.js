//扇形特效
require('swatchbook');

module.exports = function ($this, isInit) {
    if (isInit) {
        $('.swatchbook').each(function () {
            $(this).swatchbook({
                angleInc: 25,
                neighbor: 15,
                proximity: 80,
                initIsClosed: true,
                closeIdx: 12,
                selectCallback: function (index) {
                    console.log(index);
                }
            });
        });
    }
};