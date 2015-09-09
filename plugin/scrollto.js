/*
 * scrollto.js
 * 滚动到js
 */
(function (window, $) {

    /**
     * 页面滚动到函数
     * @param toScrollTop 滚动到的scrollTop
     * @param rate 比率
     * @param el 滚动元素
     */
    $.scrollTo = function (toScrollTop, rate, el) {
        rate || (rate = 20);
        el || (el = bodyEl);

        var scrollTop = el.scrollTop,
            scrollSpan = (toScrollTop - scrollTop) / rate;

        function scroll() {
            scrollTop += scrollSpan;
            el.scrollTop = scrollTop;
            scrollSpan > 0 ? ( toScrollTop > scrollTop && requestAnimationFrame(scroll)) : ( toScrollTop < scrollTop && requestAnimationFrame(scroll));
        }

        //定位滚动
        scrollSpan > 0 ? ( toScrollTop > scrollTop && requestAnimationFrame(scroll)) : ( toScrollTop < scrollTop && requestAnimationFrame(scroll));
    };

})(window, $);