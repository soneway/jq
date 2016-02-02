//分享
(function (window, $) {

    var document = window.document,
        $doc = $(document);

    //share函数
    var share = require('share');
    //分享按钮点击
    $doc.on('click', '.icon_share a', function () {
        share(module.exports.urlShare, module.exports.txtShare, module.exports.picShare, this.getAttribute('data-provider'));
    });

})(window, $);