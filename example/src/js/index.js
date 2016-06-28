//index.js

var $ = window.$ = require('jq');
require('base');
require('ui');
require('customalert');
require('scroll');

//alert方法
$.extend(window, require('alert'));


//页面模块加载对象
var loader = {
    home       : require('./index/home'),
    carousel   : require('./index/carousel'),
    flip       : require('./index/flip'),
    picpager   : require('./index/picpager'),
    piccut     : require('./index/piccut'),
    scroll     : require('./index/scroll'),
    scratchcard: require('./index/scratchcard'),
    turntable  : require('./index/turntable'),
    share      : require('./index/share')
};


//面板显示回调函数
$.panelLoaded = function ($this, isInit) {
    var load = (loader[$this.attr('id')] || {}).load;
    typeof load === 'function' && load($this, isInit);
};
//面板隐藏回调函数
$.panelUnloaded = function ($this) {
    var unload = (loader[$this.attr('id')] || {}).unload;
    typeof unload === 'function' && unload($this);
};