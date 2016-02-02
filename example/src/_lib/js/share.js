(function (window) {

    var share = (function () {
        return function (url, txt, pic, provider, isGetUrl) {
            if (!provider) return;

            var toUrl;
            url = encodeURIComponent(url || '');
            txt = encodeURIComponent(txt || '');
            pic = encodeURIComponent(pic || '');

            switch (provider) {
                case 'weibosohu':
                {
                    toUrl = 'http://t.sohu.com/third/post.jsp?url=' + url + '&title=' + txt + '&pic=' + pic;
                    break;
                }
                case 'weibosina':
                {
                    toUrl = 'http://service.t.sina.com.cn/share/share.php?title=' + txt + url + '&pic=' + pic + '&searchPic=false';
                    break;
                }
                case 'qq':
                {
                    toUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + url + '&title=' + txt + '&desc=' + txt + '&summary=' + pic;
                    break;
                }
                case 'tqq':
                {
                    toUrl = 'http://v.t.qq.com/share/share.php?url=' + url + '&title=' + txt + '&pic=' + pic;
                    break;
                }
                case 'renren':
                {
                    toUrl = 'http://widget.renren.com/dialog/share?resourceUrl=' + pic + '&srcUrl=' + url + '&title=' + txt + '&description=' + txt;
                    break;
                }
                case 'baishehui':
                {
                    toUrl = 'http://bai.sohu.com/share/blank/addbutton.do?link=' + url + '&title=' + txt + '&pic=' + pic;
                    break;
                }
                case 'douban':
                {
                    toUrl = 'http://shuo.douban.com/!service/share?href=' + url + '&name=' + txt;
                    break;
                }
                case 'kaixin001':
                {
                    toUrl = 'http://www.kaixin001.com/rest/records.php?url=' + url + '&style=11&content=' + txt;
                    break;
                }
                case '163':
                {
                    toUrl = 'http://t.163.com/article/user/checkLogin.do?info=' + txt + url;
                    break;
                }
                case '51':
                {
                    toUrl = 'http://share.51.com/share/share.php?vaddr=' + url + '&title=' + txt + '&type=8&pic=' + pic;
                    break;
                }
                case 'txpengyou':
                {
                    toUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?to=pengyou&url=' + url + '&title=' + txt + '&desc=' + txt + '&summary=' + pic;
                    break;
                }
                case 'tieba':
                {
                    toUrl = 'http://tieba.baidu.com/f/commit/share/openShareApi?url=' + url + '&title=' + txt + '&desc=' + txt;
                    break;
                }
            }

            return isGetUrl ? toUrl : window.open(toUrl);
        };
    })();


    //CommonJS
    if (typeof exports === 'object') {
        module.exports = share;
        return;
    }

    //添加到全局
    window.share = share;

})(window);