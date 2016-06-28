//首页
exports.load = function ($this, isInit) {
    if (isInit) {
        var $list = $this.find('.list'),
            html = '';
        for (var p in $.fn) {
            html += '<a>' + p + '</a>';
        }
        $list.append(html);
    }
};