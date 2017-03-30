//相册功能

require('picpager');


//加载时执行
exports.load = function ($this, isInit) {
    if (isInit) {
        var page = 1;
        $.getScript('http://app.gd.sohu.com/minisite/xtep/20140530/get.php?vname=rs&act=list&page=' + page + '&code=aa1c9153608a7755b7c20e97c0eade27', function () {
            var $picpager = $('.picpager').picpager({
                imgData: rs.data.detail.map(function (item) {
                    return item.image;
                }),
                imgAttrName: 'image',
                slideCallback: function (index) {
                    index + 1 === page * 10 && $.getScript('http://app.gd.sohu.com/minisite/xtep/20140530/get.php?vname=rs&act=list&page=' + ++page + '&code=aa1c9153608a7755b7c20e97c0eade27', function () {
                        $picpager[0].addItem(rs.data.detail.map(function (item) {
                            return item.image;
                        }));
                    });
                }
            });
        });
    }
};