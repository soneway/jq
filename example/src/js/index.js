(function (window) {

    var $ = require('jq');
    require('base');
    require('ui');
    require('customalert');
    require('scroll');

    //alert方法
    window.alert = function alert(str) {
        $.customalert({
            content: str
        });
    };


    //面板显示回调函数
    $.panelLoaded = function ($this, isInit) {
        var load = loader[$this.attr('id')];
        typeof load === 'function' && load($this, isInit);
    };

    //面板隐藏回调函数
    $.panelUnloaded = function ($this) {
        var unload = unloader[$this.attr('id')];
        typeof unload === 'function' && unload($this);
    };

    var loader = {
        carousel: require('./panel/carousel.js'),
        flip: require('./panel/flip.js'),
        picpager: require('./panel/picpager.js'),
        scroll: require('./panel/scroll.js'),
        scratchcard: require('./panel/scratchcard.js'),
        turntable: require('./panel/turntable.js'),
        swatchbook: require('./panel/swatchbook.js')
    };
    var unloader = {};

})(window);