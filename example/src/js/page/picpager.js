//相册功能
require('picpager');
var jtool = require('jtool');

module.exports = function ($this, isInit) {
    if (isInit) {
        var page = 1,
            perpage = 10;

        var proxy = jtool.proxy;

        //请求数据
        proxy.pushData({
            url    : 'http://app.gd.sohu.com/minisite/xtep/20140530/get.php?act=list&page=' + page + '&perpage=' + perpage + '&order=' + 0 + '&code=aa1c9153608a7755b7c20e97c0eade27',
            onStart: function () {
                $.toggleMask(1);
            },
            onEnd  : function () {
                $.toggleMask(0);
            },
            success: function (rs) {
                var $picpager = $('.picpager').picpager({
                    imgData      : rs.data.detail,
                    imgAttrName  : 'image',
                    slideCallback: function (index) {
                        if (index + 1 === page * 10) {
                            page++;

                            //请求数据
                            proxy.pushData({
                                url    : 'http://app.gd.sohu.com/minisite/xtep/20140530/get.php?act=list&page=' + page + '&perpage=' + perpage + '&order=' + 0 + '&code=aa1c9153608a7755b7c20e97c0eade27',
                                success: function (rs) {
                                    $picpager[0].addItem(rs.data.detail);
                                }
                            });
                        }
                    }
                });
            }
        });
    }
};