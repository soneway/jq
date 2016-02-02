//转盘抽奖
(function (window, $) {

    require('turntable');

    //文档jq对象
    var $doc = $(window.document);

    function load($this, isInit) {
        if (isInit) {
            var turntableEl = $('.turntable').turntable({
                count: 10
            })[0];

            $doc.on('click', '.turntable .btn_start', function () {
                var index = parseInt(Math.random() * 10);
                turntableEl.turnToIndex(index, function () {
                    alert(index + 1);
                });
            });
        }
    }

    $.extend(exports, {
        load: load
    });

})(window, $);