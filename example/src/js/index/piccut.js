//图片剪切

require('piccut');

var $doc = $(document);


//加载时执行
exports.load = function ($this, isInit) {
    if (isInit) {
        var upEl = $('.avator_up').piccut({
            fileEl: document.getElementById('file')
            //, isKeepScale: false
            //, cutHeight: 200
            //, isMinLimit: false
            //, cutX: 0
        })[0];

        var showerEl = document.getElementById('shower');
        $doc.on('click', '#btn_cut', function () {
            showerEl.src = upEl.getDataURL();
        });
    }
};