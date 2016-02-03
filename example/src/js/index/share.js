//分享
(function (window, $) {

    var $doc = $(document),
        share = require('share');

    var txtShare = document.title,
        picShare = 'http://www.sohu.com/upload/images20140108/sohulogo.png',
        urlShare = location.href;

    //分享按钮点击
    $doc.on('click', '.icon_share a', function () {
        share(urlShare, txtShare, picShare, this.getAttribute('data-provider'));
    });

})(window, $);