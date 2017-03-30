(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
//index.js

var $ = window.$ = require('jq');
require('base');
require('ui');
require('scroll');


//页面模块加载对象
var loader = {
    home       : require('./index/home'),
    ui         : require('./index/ui'),
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
},{"./index/carousel":3,"./index/flip":4,"./index/home":5,"./index/piccut":6,"./index/picpager":7,"./index/scratchcard":8,"./index/scroll":9,"./index/share":10,"./index/turntable":11,"./index/ui":12,"base":22,"jq":13,"scroll":20,"ui":23}],3:[function(require,module,exports){
//焦点图

require('carousel');

//加载时执行
exports.load = function ($this, isInit) {
    if (isInit) {
        var html = '';
        for (var i = 1, len = 6; i < len; i++) {
            html += '<img data-title="标题' + i + '" src="img/' + i + '.jpg"/>';
        }

        $('.carousel').each(function () {
            $(this).html(html).carousel({
                isVertical: this.getAttribute('data-isvertical') === '1',
                isAutoPlay: true,
                isLoop: true
            });
        });
    }
};
},{"carousel":15}],4:[function(require,module,exports){
//3d旋转切换

require('flip');


//加载时执行
exports.load = function ($this, isInit) {
    if (isInit) {
        $('.flip').each(function () {
            var len = this.getAttribute('data-len'),
                html = '';

            for (var i = 0; i < len; i++) {
                html += '<a><p style="background: url(img/' + (i + 1) + '.jpg) center center; background-size: cover;" data-title="3d旋转切换示例 ' + (i + 1) + '"></p></a>';
            }

            $(this).html(html).flip({
                isVertical: this.getAttribute('data-isvertical') === '1'
            });
        });
    }
};
},{"flip":16}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{"piccut":17}],7:[function(require,module,exports){
//相册功能

require('picpager');


//加载时执行
exports.load = function ($this, isInit) {
    if (isInit) {
        var page = 1;
        $.getScript('http://app.gd.sohu.com/minisite/xtep/20140530/get.php?vname=rs&act=list&page=' + page + '&code=aa1c9153608a7755b7c20e97c0eade27', function () {
            var $picpager = $('.picpager').picpager({
                imgData: rs.data.detail.map(function (item) {
                    return item.image;
                }),
                imgAttrName: 'image',
                slideCallback: function (index) {
                    index + 1 === page * 10 && $.getScript('http://app.gd.sohu.com/minisite/xtep/20140530/get.php?vname=rs&act=list&page=' + ++page + '&code=aa1c9153608a7755b7c20e97c0eade27', function () {
                        $picpager[0].addItem(rs.data.detail.map(function (item) {
                            return item.image;
                        }));
                    });
                }
            });
        });
    }
};
},{"picpager":18}],8:[function(require,module,exports){
//刮刮卡

require('scratchcard');


//加载时执行
exports.load = function ($this, isInit) {
    if (isInit) {
        $('.scratchcard').each(function () {
            $(this).scratchcard({
                text  : '刮开有奖',
                imgSrc: 'img/4.jpg'
            });
        });
    }
};
},{"scratchcard":19}],9:[function(require,module,exports){
//自定义滚动

require('scroll');


//加载时执行
exports.load = function load($this, isInit) {
    if (isInit) {
        $('.scroll').each(function () {
            $(this).scroll({
                isVertical: this.getAttribute('data-isvertical') === '1'
            });
        });
    }
};
},{"scroll":20}],10:[function(require,module,exports){
//分享

var $doc = $(document),
    share = require('share');

var txtShare = document.title,
    picShare = 'http://www.sohu.com/upload/images20140108/sohulogo.png',
    urlShare = location.href;

//分享按钮点击
$doc.on('click', '.icon_share a', function () {
    share(urlShare, txtShare, picShare, this.getAttribute('data-provider'));
});
},{"share":1}],11:[function(require,module,exports){
//转盘抽奖

require('turntable');

//文档jq对象
var $doc = $(document);

exports.load = function ($this, isInit) {
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
};
},{"turntable":21}],12:[function(require,module,exports){
//ui页

//alert方法
$.extend(window, require('alert'));
},{"alert":14}],13:[function(require,module,exports){
//jq.js
(function (window, undefined) {

    /**
     * 选择器函数,兼容jQuery语法,实现jQuery大部分api
     * @param {Node|NodeList|string} sel 选择器
     * @returns {$init} 选择到的$对象
     */
    var $ = function (sel) {
        return new $init(sel);
    };

    var document = window.document,
        Node = window.Node,
        getComputedStyle = window.getComputedStyle,
        toString = {}.toString,
        tmpArray = [],
        slice = tmpArray.slice,
        indexOf = tmpArray.indexOf,
        filter = tmpArray.filter,
        cssPrefix = '-webkit-',
        oneSelReg = /^[\w-]*$/,
        spaceReg = /\s+/g,
        classRegCache = {},
        RegExp = window.RegExp,
        bodyEl = document.body,
        computedStyleCache = {},
        headEl = document.head,
        XMLHttpRequest = window.XMLHttpRequest;

    /**
     * 选择器构造函数
     * @param {Node|NodeList|string} sel 选择器
     * @returns {$init} 选择到的$对象
     * @ignore
     */
    function $init(sel) {
        this.length = 0;

        //字符选择器或html
        if (typeof sel === 'string') {

            //id选择器(优先使用getElementById效率高很多)
            if (sel[0] === '#') {
                var id = sel.slice(1);
                if (oneSelReg.test(id)) {
                    var node = document.getElementById(id);
                    node && (this[this.length++] = node);
                    return this;
                }
            }

            //class选择器(getElementsByClassName效率较querySelectorAll高)
            if (sel[0] === '.') {
                var cls = sel.slice(1);
                if (oneSelReg.test(cls)) {
                    return nodesToThis(document.getElementsByClassName(cls), this);
                }
            }

            //如果是html
            if (sel[0] === '<' && sel[sel.length - 1] === '>') {
                var tmpEl = document.createElement('div');
                tmpEl.innerHTML = sel;
                //不用children,须保留文本节点
                return nodesToThis(tmpEl.childNodes, this);
            }

            //其他选择器
            return nodesToThis(document.querySelectorAll(sel), this);
        }

        //Node或window
        if (sel instanceof Node || sel === window) {
            this[this.length++] = sel;
            return this;
        }

        //类数组
        if (sel && sel.length > 0) {
            return nodesToThis(sel, this);
        }

        //加载完成函数
        if (typeof sel === 'function') {
            return $().ready(sel);
        }
    }


    /**
     * 将node添加到this函数
     * @param {NodeList} nodes 被添加到$对象的node对象
     * @param {Object} obj 待添加node对象的$对象
     * @returns {Object} 添加了node对象的$对象
     * @ignore
     */
    function nodesToThis(nodes, obj) {
        //nodes为null时
        if (!nodes) {
            return obj;
        }

        //NodeList
        forEach(nodes, function (item) {
            obj[obj.length++] = item;
        });
        return obj;
    }

    /**
     * 生成class正式表达式函数
     * @param {String} name css类名
     * @returns {RegExp} css类名正式表达式
     * @ignore
     */
    function classReg(name) {
        return classRegCache[name] || (classRegCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
    }

    /**
     * 数组遍历函数
     * @param {Array} array 待遍历的数组
     * @param {Function} fn 回调函数
     * @ignore
     */
    function forEach(array, fn) {
        for (var i = 0, len = array.length; i < len; i++) {
            fn(array[i]);
        }
    }

    /**
     * matchesSelector函数
     * @ignore
     */
    var elProto = Element.prototype;
    elProto.matchesSelector || (elProto.matchesSelector = elProto.webkitMatchesSelector || elProto.msMatchesSelector || elProto.mozMatchesSelector);

    /**
     * 返回元素默认样式值函数
     * @param {string} tagName 元素名
     * @param {string} key 样式key
     * @returns {string} 初始样式值
     * @ignore
     */
    function getInitialStyle(tagName, key) {
        var prop = tagName + '-' + key;
        if (!computedStyleCache[prop]) {
            var tmpEl = document.createElement(tagName);
            bodyEl.appendChild(tmpEl);
            computedStyleCache[prop] = getComputedStyle(tmpEl)[key];
            bodyEl.removeChild(tmpEl);
        }
        return computedStyleCache[prop];
    }

    /**
     * 按sel过滤nodes并返回$对象函数
     * @param {$init|NodeList} nodes
     * @param {string} sel 选择器
     * @returns {$init} 过滤后的$对象
     * @ignore
     */
    function filterNodes(nodes, sel) {
        return $(sel === undefined ? nodes : filter.call(nodes, function (el) {
            return el.matchesSelector(sel);
        }));
    }


    //判断是否为某种类型函数
    forEach(['Object', 'Array', 'Function'], function (item) {
        $['is' + item] = function (obj) {
            return toString.call(obj) === '[object ' + item + ']';
        };
    });


    /**
     * 判断是否为$对象
     * @param obj
     * @returns {boolean}
     */
    $.is$ = function (obj) {
        return obj instanceof $init;
    };


    /**
     * 扩展函数
     * @param {Object} obj 扩展参数
     * @returns {Object} 返回扩展属性后的对象
     */
    $.extend = function (obj) {
        if (obj === undefined) {
            return this;
        }

        //$.extend(obj)
        if (arguments.length === 1) {
            for (var p in obj) {
                this[p] = obj[p];
            }
            return this;
        }

        //$.extend({}, defaults[, obj])
        forEach(slice.call(arguments, 1), function (item) {
            for (var p in item) {
                obj[p] = item[p];
            }
        });
        return obj;
    };


    //原型属性
    $.fn = $init.prototype = {
        constructor: $init,

        /**
         * 遍历元素(效率更高,但回调函数中this不指向元素,第一个参数指向元素)
         * 注: 直接遍历,保证高效率
         * @param {Function} fn 遍历回调函数
         * @returns {$init} $对象本身
         */
        forEach: function (fn) {
            for (var i = 0, len = this.length; i < len; i++) {
                fn(this[i], i);
            }
            return this;
        },

        /**
         * 遍历元素(效率较低,回调函数中this指向元素)
         * @param {Function} fn 遍历回调函数
         * @returns {$init} $对象本身
         */
        each: function (fn) {
            return this.forEach(function (el, i) {
                fn.call(el, i);
            });
        },

        /**
         * 文档加载完成
         * @param {Function} fn 文档加载完成回调函数
         * @returns {$init} $对象本身
         */
        ready: function (fn) {
            var readyState = document.readyState;
            readyState === 'complete' || readyState === 'loaded' || readyState === 'interactive' ?
                fn() : addEvent(document, 'DOMContentLoaded', fn);
            return this;
        },

        /**
         * 过滤元素
         * @param {string} sel 选择器
         * @returns {$init} 选择后的$对象
         */
        filter: function (sel) {
            return filterNodes(this, sel);
        },

        /**
         * 取兄弟元素
         * @param {string} sel 选择器
         * @returns {$init} 选择后的$对象
         */
        siblings: function (sel) {
            var els = [];
            this.forEach(function (el) {
                //父元素的子元素,排除当前元素
                forEach(el.parentNode.children, function (item) {
                    item !== el && els.indexOf(item) < 0 && els.push(item);
                });
            });
            return filterNodes(els, sel);
        },

        /**
         * not过滤元素(不用filter.call,效率较高)
         * @param {string} sel 选择器
         * @returns {$init} 选择后的$对象
         */
        not: function (sel) {
            if (sel === undefined) {
                return this;
            }
            var els = [];
            this.forEach(function (el) {
                !el.matchesSelector(sel) && els.push(el);
            });
            return $(els);
        },

        /**
         * 取子孙元素
         * @param {string} sel 选择器
         * @returns {$init} 选择后的$对象
         */
        find: function (sel) {
            var els = [];
            this.forEach(function (el) {
                //根据当前元素查找符合sel的元素
                forEach(el.querySelectorAll(sel), function (item) {
                    els.indexOf(item) < 0 && els.push(item);
                });
            });
            return $(els);
        },

        /**
         * 取第i个元素
         * @param {number} i 索引值
         * @returns {$init} 选择后的$对象
         */
        eq: function (i) {
            return $(this[i]);
        },

        /**
         * 取子级元素
         * @param {string} sel 选择器
         * @returns {$init} 选择后的$对象
         */
        children: function (sel) {
            var els = [];
            this.forEach(function (el) {
                //所有子元素
                forEach(el.children, function (item) {
                    els.push(item);
                });
            });
            //过滤
            return filterNodes(els, sel);
        },

        /**
         * 取父级元素
         * @param {string} sel 选择器
         * @returns {$init} 选择后的$对象
         */
        parent: function (sel) {
            var els = [];
            this.forEach(function (el) {
                var parentNode = el.parentNode;
                //添加parentNode
                parentNode !== document && els.indexOf(parentNode) < 0 && els.push(parentNode);
            });
            //过滤
            return filterNodes(els, sel);
        },

        /**
         * 取祖先元素
         * @param {string} sel 选择器
         * @returns {$init} 选择后的$对象
         */
        parents: function (sel) {
            var els = [];
            this.forEach(function (el) {
                //遍历parentNode直到根元素
                while (el = el.parentNode) {
                    el !== document && els.indexOf(el) < 0 && els.push(el);
                }
            });
            //过滤
            return filterNodes(els, sel);
        },

        /**
         * 取最近元素
         * @param {string} sel 选择器
         * @param {Node|NodeList|$init} context 选择范围
         * @returns {$init} 选择后的$对象
         */
        closest: function (sel, context) {
            var curEl = this[0];
            while (curEl && !curEl.matchesSelector(sel)) {
                //document没有matchesSelector
                var parentNode = curEl.parentNode;
                curEl = parentNode === document ? null : (curEl !== context && parentNode);
            }
            return $(curEl);
        },

        /**
         * 取元素索引
         * @param {Node|$init} el 被索引的node
         * @returns {number} 索引值
         */
        index: function (el) {
            $.is$(el) && (el = el[0]);
            return el ? indexOf.call(this, el) : indexOf.call(this[0].parentNode.children, this[0]);
        },

        /**
         * 元素html取值/赋值
         * @param {string} html html值
         * @returns {$init|string} $对象本身|html值
         */
        html: function (html) {
            return this.prop('innerHTML', html);
        },

        /**
         * 元素text取值/赋值(textContent比innerText要好)
         * @param {string} text text值
         * @returns {$init|string} $对象本身|text值
         */
        text: function (text) {
            return this.prop('textContent', text);
        },

        /**
         * 元素取值/赋值
         * @param {string} val 待赋的值
         * @returns {$init|string} $对象本身|获取的值
         */
        val: function (val) {
            return this.prop('value', val);
        },

        /**
         * 元素标签属性取值/赋值
         * @param {Object|string} key 属性|属性对象
         * @param {string} val 属性值
         * @param {string} prefix 属性前缀
         * @returns {$init|string} $对象本身|属性值
         */
        attr: function (key, val, prefix) {
            return this.prop(key, val, true, prefix)
        },

        /**
         * 元素对象属性取值/赋值
         * @param {Object|string} key 属性|属性对象
         * @param {string} val 属性值
         * @param {boolean} isAttr 属性值
         * @param {string} prefix 属性前缀
         * @returns {$init|string} $对象本身|属性值
         */
        prop: function (key, val, isAttr, prefix) {
            //属性前缀
            prefix === undefined && (prefix = '');

            //$().prop(key)
            if (typeof key === 'string' && val === undefined) {
                key = prefix + key;
                return isAttr ? this[0].getAttribute(key) : this[0][key];
            }
            return this.forEach(function (el) {
                //$().prop(obj)
                if ($.isObject(key)) {
                    for (var p in key) {
                        var value = key[p];
                        p = prefix + p;
                        isAttr ? el.setAttribute(p, value) : el[p] = value;
                    }
                    return;
                }
                //$().prop(key,val)
                key = prefix + key;
                isAttr ? el.setAttribute(key, val) : el[key] = val;
            });
        },

        /**
         * 元素data-属性取值/赋值
         * @param {Object|string} key 属性|属性对象
         * @param {string} val 属性值
         * @returns {$init|string}
         */
        data: function (key, val) {
            return this.attr(key, val, 'data-');
        },

        /**
         * 元素移除属性
         * @param {string} key 待移除的属性
         * @returns {$init} $对象本身
         */
        removeAttr: function (key) {
            return this.forEach(function (el) {
                forEach(key.split(spaceReg), function (item) {
                    el.removeAttribute(item);
                });
            });
        },

        /**
         * 元素css样式属性取值/赋值
         * @param {Object|string} key css属性|css对象
         * @param {string} val css属性值
         * @returns {$init|string} $对象本身|css属性值
         */
        css: function (key, val) {
            //$().css(key)
            if (typeof key === 'string' && val === undefined) {
                //必须是node
                if (this[0] instanceof Node) {
                    //计算样式
                    var style = getComputedStyle(this[0]);
                    return style[key] || style[cssPrefix + key];
                }
                return;
            }
            return this.forEach(function (el) {
                var style = el.style;
                //$().css(obj)
                if ($.isObject(key)) {
                    for (var p in key) {
                        style[p] = style[cssPrefix + p] = key[p];
                    }
                    return;
                }
                //$().css(key,val)
                style[key] = style[cssPrefix + key] = val;
            });
        },

        /**
         * 元素显示
         * @returns {$init} $对象本身
         */
        show: function () {
            return this.forEach(function (el) {
                var elStyle = el.style;
                if (elStyle.display === 'none') {
                    return elStyle.display = null;
                }
                elStyle.display = getInitialStyle(el.tagName, 'display');
            });
        },

        /**
         * 元素隐藏
         * @returns {$init} $对象本身
         */
        hide: function () {
            return this.css('display', 'none');
        },

        /**
         * 元素后置添加
         * @param {Node|NodeList|string|$init} el 添加的内容
         * @param {boolean} isBefore 是否前置添加
         * @returns {$init} $对象本身
         */
        append: function (el, isBefore) {
            var $el = $.is$(el) ? el : $(el);
            return this.forEach(function (me) {
                $el.forEach(function (el) {
                    isBefore ? me.insertBefore(el, me.firstChild) : me.appendChild(el);
                });
            });
        },

        /**
         * 元素前置添加
         * @param {Node|NodeList|string|$init} el 添加的内容
         * @returns {$init} $对象本身
         */
        prepend: function (el) {
            return this.append(el, true);
        },

        /**
         * 元素后置添加到
         * @param {Node|NodeList|string|$init} el 内容添加到的元素
         * @param {boolean} isBefore 是否前置添加
         * @returns {$init} $对象本身
         */
        appendTo: function (el, isBefore) {
            var $el = $.is$(el) ? el : $(el);
            $el.append(this, isBefore);
            return this;
        },

        /**
         * 元素前置添加到
         * @param {Node|NodeList|string|$init} el 内容添加到的元素
         * @returns {$init} $对象本身
         */
        prependTo: function (el) {
            return this.appendTo(el, true);
        },

        /**
         * 元素包装
         * @param {Node|NodeList|string|$init} el 包装对象
         * @returns {$init} $对象本身
         */
        wrap: function (el) {
            var $el = $.is$(el) ? el : $(el);
            return this.forEach(function (el) {
                el.parentNode.insertBefore($el[0], el);
                $el.append(el);
            });
        },

        /**
         * 元素取尺寸对象
         * @returns {Object} 尺寸对象
         */
        offset: function () {
            var offset = this[0].getBoundingClientRect();
            return {
                left: offset.left + window.pageXOffset,
                top: offset.top + window.pageYOffset,
                width: offset.width,
                height: offset.height
            };
        },

        /**
         * 元素取宽度
         * @returns {number} 宽度
         */
        width: function () {
            var el = this[0];
            return el === window ? window.innerWidth : el.offsetWidth;
        },

        /**
         * 元素取高度
         * @returns {number} 高度
         */
        height: function () {
            var el = this[0];
            return el === window ? window.innerHeight : el.offsetHeight;
        },

        /**
         * 元素判断是否符合sel
         * @param {string} sel 选择器
         * @returns {boolean} 是否符合sel
         */
        is: function (sel) {
            return sel && this[0].matchesSelector(sel);
        },

        /**
         * 元素添加class
         * @param {string} name css类名
         * @returns {$init} $对象本身
         */
        addClass: function (name) {
            return this.forEach(function (el) {
                var oldClass = el.className,
                    classes = name.split(spaceReg).filter(function (item) {
                        return !classReg(item).test(oldClass);
                    });
                classes.length > 0 && (el.className = [oldClass].concat(classes).join(' ').trim());
            });
        },

        /**
         * 元素移除class
         * @param {string} name css类名
         * @returns {$init} 返回$对象本身
         */
        removeClass: function (name) {
            return this.forEach(function (el) {
                if (name === undefined) {
                    return el.className = '';
                }

                var oldClass = el.className;
                forEach(name.split(spaceReg), function (item) {
                    oldClass = oldClass.replace(classReg(item), ' ');
                });
                el.className = oldClass.trim();
            });
        },

        /**
         * 元素判断是否有class
         * @param {string} name css类名
         * @returns {boolean} 是否有class
         */
        hasClass: function (name) {
            return classReg(name).test(this[0].className);
        },

        /**
         * 切换class
         * @param name css类名
         * @returns {$init} 返回$对象本身
         */
        toggleClass: function (name) {
            return this.forEach(function (el) {
                var $this = $(el);
                $this.hasClass(name) ? $this.removeClass(name) : $this.addClass(name);
            });
        }

    };

    /**
     * 原型属性扩展
     * @param {Object} obj 属性对象
     */
    $.fn.extend = function (obj) {
        $.extend.call(this, obj);
    };


    /**
     * 添加事件函数
     * @param {Node} el 绑定事件的元素
     * @param {string} type 事件类型
     * @param {Function} fn 事件响应函数
     * @param {string} sel 选择器
     * @ignore
     */
    function addEvent(el, type, fn, sel) {
        forEach(type.split(spaceReg), function (item) {
            el.addEventListener(item, sel === undefined ? fn : function (evt) {
                var match = $(evt.target).closest(sel, el)[0];
                match && fn.call(match, evt);
            }, false);
        });
    }

    /**
     * 移除事件函数
     * @param {Node} el 解绑事件的元素
     * @param {string} type 事件类型
     * @param {Function} fn 事件响应函数
     * @ignore
     */
    function removeEvent(el, type, fn) {
        forEach(type.split(spaceReg), function (item) {
            el.removeEventListener(item, fn, false);
        });
    }

    /**
     * 创建事件函数
     * @param {string} type 事件类型
     * @returns {Event} 事件
     * @ignore
     */
    function createEvent(type) {
        var event = document.createEvent('Events');
        //第二个参数:是否冒泡,第三个参数:是否可以preventDefault阻止事件
        event.initEvent(type, true, true);
        return event;
    }

    //扩展事件相关
    $.fn.extend({

        /**
         * 元素绑定事件
         * @param {string} type 事件类型
         * @param {Function} fn 事件响应函数
         * @returns {$init} $对象本身
         */
        bind: function (type, fn) {
            return this.forEach(function (el) {
                addEvent(el, type, fn);
            });
        },

        /**
         * 元素解绑事件
         * @param {string} type 事件类型
         * @param {Function} fn 事件响应函数
         * @returns {$init} $对象本身
         */
        unbind: function (type, fn) {
            return this.forEach(function (el) {
                removeEvent(el, type, fn);
            });
        },

        /**
         * 元素代理绑定事件
         * @param {string} type 事件类型
         * @param {string} sel 选择器
         * @param {Function} fn 事件响应函数
         * @returns {$init} $对象本身
         */
        delegate: function (type, sel, fn) {
            return this.forEach(function (el) {
                addEvent(el, type, fn, sel);
            });
        },

        /**
         * 元素绑定事件
         * @param {string} type 事件类型
         * @param {string} sel 选择器
         * @param {Function} fn 事件响应函数
         * @returns {$init} $对象本身
         */
        on: function (type, sel, fn) {
            return typeof sel === 'function' ? this.bind(type, sel) : this.delegate(type, sel, fn);
        },

        /**
         * 元素解绑事件
         * @param {string} type 事件类型
         * @param {Function} fn 事件响应函数
         * @returns {$init} $对象本身
         */
        off: function (type, fn) {
            return this.unbind(type, fn);
        },

        /**
         * 元素事件触发
         * @param {string} type 事件类型
         * @returns {$init} $对象本身
         */
        trigger: function (type) {
            type = createEvent(type);
            return this.forEach(function (el) {
                el.dispatchEvent(type);
            });
        }
    });

    //支持$().click等写法
    forEach(['click', 'touchstart', 'touchmove', 'touchend', 'submit', 'load', 'resize', 'change', 'select'], function (item) {
        $.fn[item] = function (fn) {
            return fn ? this.bind(item, fn) : this.trigger(item);
        };
    });


    /**
     * 跨域请求函数(异步加载js函数)
     * @param {string} url 请求地址
     * @param {Function} fn 回调函数
     */
    $.getScript = function (url, fn) {
        var isJs = /(\.js)$/.test(url),//是否js文件
            script = document.createElement('script');

        script.type = 'text/javascript';
        script.onload = function () {
            typeof fn === 'function' && fn();
            !isJs && headEl.removeChild(script);
        };
        script.src = url;
        headEl.appendChild(script);
    };


    //将data转换为str函数
    function getDataStr(data) {
        var array = [];
        for (var p in data) {
            array.push(p + '=' + data[p]);
        }
        return array.join('&');
    }

    /**
     * ajax请求函数
     * @param {Object} opts ajax请求配置项
     */
    $.ajax = function (opts) {
        opts = $.extend({}, $.ajax.defaults, opts);
        //xhr对象
        var xhr = new XMLHttpRequest();

        //打开链接
        xhr.open(opts.type.toUpperCase(), opts.url, opts.async);

        //设置header
        var header = opts.header || {};
        //contentType
        header['Content-Type'] = opts.contentType;
        for (var p in header) {
            xhr.setRequestHeader(p, header[p]);
        }

        //xhr状态改变事件
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                //成功
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    var success = opts.success;
                    typeof success === 'function' && success(xhr);
                }
                //失败
                else {
                    var error = opts.error;
                    typeof error === 'function' && error(xhr);
                }
                var complete = opts.complete;
                typeof complete === 'function' && complete(xhr);
            }
        };

        //发送数据
        xhr.send(getDataStr(opts.data) || null);
    };
    $.ajax.defaults = {
        type: 'GET',
        contentType: 'application/x-www-form-urlencoded',
        async: true
    };


    //CommonJS
    if (typeof exports === 'object') {
        return module.exports = $;
    }

    //添加到全局变量
    window.jq = window.$ = $;

})(window);
},{}],14:[function(require,module,exports){
/*通用弹框*/
(function ($) {

    //初始化html
    var html = '<div id="pi-alert"><div class="pi-box"><h2 class="pi-head"></h2><p class="pi-msg"></p><p><a class="pi-btn-ok"></a></p></div></div>' +
        '<div id="pi-confirm"><div class="pi-box"><h2 class="pi-head"></h2><p class="pi-msg"></p><p><a class="pi-btn-ok"></a><a class="pi-btn-cancel"></a></p></div></div>' +
        '<div id="pi-tooltip"></div>';
    $(document.body).append(html);


    //alert方法
    var alert = (function () {
        var $alert = $('#pi-alert'),
            $head = $alert.find('.pi-head'),
            $msg = $alert.find('.pi-msg'),
            $btnOk = $alert.find('.pi-btn-ok'), opts;

        //打开
        function open() {
            //打开窗口
            $alert.addClass('visible');

            //响应事件
            var onOpen = opts.onOpen;
            typeof onOpen === 'function' && onOpen();
        }

        //关闭
        function close() {
            //关闭窗口
            $alert.removeClass('visible');

            //响应事件
            var onClose = opts.onClose;
            typeof onClose === 'function' && onClose();
        }

        //确定按钮点击
        $alert.on('click', '.pi-btn-ok', function () {
            //disabled时,不响应
            if ($btnOk.hasClass('disabled')) {
                return;
            }

            //关闭
            close();

            //响应事件放在靠后
            var btnOkClick = opts.btnOkClick;
            typeof btnOkClick === 'function' && btnOkClick();
        }).on('click', function (evt) {
            //点击背景时关闭窗口
            opts.isHideOnBgClick && $(evt.target).closest('.pi-box').length === 0 && close();
        });

        return function (options) {
            //配置项
            typeof options !== 'object' && (options = {msg: options});
            opts = $.extend({}, alert.defaults, options);

            //显示内容
            $head.html(opts.head);
            $msg.html(opts.msg);
            $btnOk.text(opts.okTxt);

            //打开
            open();
        };
    })();
    alert.defaults = {
        head: '提示',
        msg: '内容',
        okTxt: '确定',
        //是否在点击背景时隐藏
        isHideOnBgClick: false
    };


    //confirm方法
    var confirm = (function () {
        var $confirm = $('#pi-confirm'),
            $head = $confirm.find('.pi-head'),
            $msg = $confirm.find('.pi-msg'),
            $btnOk = $confirm.find('.pi-btn-ok'),
            $btnCancel = $confirm.find('.pi-btn-cancel'), opts;

        //打开
        function open() {
            //打开窗口
            $confirm.addClass('visible');

            //响应事件
            var onOpen = opts.onOpen;
            typeof onOpen === 'function' && onOpen();
        }

        //关闭
        function close() {
            //关闭窗口
            $confirm.removeClass('visible');

            //响应事件
            var onClose = opts.onClose;
            typeof onClose === 'function' && onClose();
        }

        //确定和取消按钮点击
        $confirm.on('click', '.pi-btn-ok', function () {
            //disabled时,不响应
            if ($btnOk.hasClass('disabled')) {
                return;
            }

            //关闭
            close();

            //响应事件放在靠后
            var btnOkClick = opts.btnOkClick;
            typeof btnOkClick === 'function' && btnOkClick();
        }).on('click', '.pi-btn-cancel', function () {
            //关闭
            close();

            //响应事件放在靠后
            var btnCancelClick = opts.btnCancelClick;
            typeof btnCancelClick === 'function' && btnCancelClick();
        }).on('click', function (evt) {
            //点击背景时关闭窗口
            opts.isHideOnBgClick && $(evt.target).closest('.pi-box').length === 0 && close();
        });

        return function (options) {
            //配置项
            typeof options !== 'object' && (options = {msg: options});
            //配置项
            opts = $.extend({}, confirm.defaults, options);

            //设置内容
            $head.html(opts.head);
            $msg.html(opts.msg);
            $btnOk.text(opts.okTxt);
            $btnCancel.text(opts.cancelTxt);

            //打开
            open();
        };
    })();
    confirm.defaults = $.extend({}, alert.defaults, {
        cancelTxt: '取消'
    });


    //tooltip方法
    var tooltip = (function () {
        var $tooltip = $('#pi-tooltip'),
            timeout;

        return function (msg, isOk, time) {
            $tooltip.html(msg).addClass('visible');

            //ok状态
            isOk ? $tooltip.addClass('ok') : $tooltip.removeClass('ok');

            //定时隐藏
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                $tooltip.removeClass('visible');
            }, time || 2000);
        };
    })();


    //导出对象
    var out = {
        alert: alert,
        confirm: confirm,
        tooltip: tooltip
    };

    //CommonJS
    if (typeof exports === 'object') {
        return module.exports = out;
    }

    $.extend(window, out);

})($);
},{}],15:[function(require,module,exports){
/*
 * carousel.js
 * 焦点图js
 */
(function (window, $) {

    $.fn.carousel = function (options) {

        // 每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.carousel.defaults, options);

            // 配置项
            var isVertical = opts.isVertical,
                swipThreshold = opts.swipThreshold,
                swipSpanThreshold = opts.swipSpanThreshold,
                isAutoPlay = opts.isAutoPlay,
                autoPlayInter = opts.autoPlayInter,
                slideCallback = opts.slideCallback,
                isShowTitle = opts.isShowTitle,
                isShowPager = opts.isShowPager,
                removeClassDelay = opts.removeClassDelay,
                inited = opts.inited,
                initIndex = opts.initIndex,
                pullRatio = opts.pullRatio,
                isLoop = opts.isLoop;

            // 变量
            var $this = $(this),
                me = this,
                $wrap, wrapElStyle,
                $items, itemCount,
                $allItems, allItemCount,
                $title, $pagers,
                duration;

            // 初始化函数
            function init() {
                // items
                $items = $this.children('*').each(function () {
                    var $this = $(this),
                        index = $this.index();
                    // 添加index属性
                    $this.attr({
                        'data-index': index
                    });
                });
                itemCount = $items.length;

                // this
                $this.addClass('pi-carousel').html('<div class="pi-wrap"></div>' + (isShowTitle ? '<div class="pi-title"></div>' : ''));

                // wrap
                $wrap = $this.find('.pi-wrap').append($items);
                wrapElStyle = $wrap[0].style;
                duration = parseFloat($wrap.css('transition-duration')) * 1000;
                // 如果需要循环滚动,需要多添加两个元素
                if (isLoop) {
                    // 在最后添加第一个元素
                    $wrap.append($items[0].outerHTML)
                    // 在最前添加最后一个元素
                        .prepend($items[itemCount - 1].outerHTML);
                }

                // allItems
                $allItems = $wrap.children('*');
                allItemCount = $allItems.length;

                // html初始化完成回调
                typeof inited === 'function' && inited($items);

                isVertical && $this.addClass('vertical');

                // title
                $title = $this.find('.pi-title');

                // pager
                var html = '';
                if (isShowPager) {
                    html += '<div class="pi-pager">';
                    for (var i = 0, len = itemCount; i < len; i++) {
                        html += '<span></span>';
                    }
                    html += '</div>';
                }
                $pagers = $this.append(html).find('.pi-pager span');

                // 初始化事件
                initEvent();
            }

            // 初始化事件函数
            function initEvent() {
                var width, height, inter, index = initIndex,
                    startX, startY,
                    swipSpan, isMoving;

                // 设置尺寸函数
                function setSize() {
                    width = $this.width();
                    height = $this.height();

                    // 水平方向滚动
                    if (!isVertical) {
                        wrapElStyle.width = width * allItemCount + 'px';
                        $allItems.css('width', width + 'px');
                        // 如果是循环滚动
                        isLoop && $wrap.css({
                            'margin-left': -width + 'px'
                        });
                    }
                    // 竖直方向滚动
                    else {
                        wrapElStyle.height = height * allItemCount + 'px';
                        $allItems.css('height', height + 'px');
                        // 如果是循环滚动
                        isLoop && $wrap.css({
                            'margin-top': -height + 'px'
                        });
                    }
                }

                // 设置inter函数
                function setInter() {
                    isAutoPlay && (inter = setInterval(function () {
                        ++index;
                        !isLoop && index === itemCount && (index = 0);

                        // 加上动画
                        $wrap.removeClass('notrans');
                        slide();
                    }, autoPlayInter));
                }

                // 移动到函数
                function slide(swipSpan) {
                    var translate = -index * (isVertical ? height : width),
                        transform;

                    // touchmove跟手指滚动
                    if (typeof swipSpan === 'number') {
                        if (!isLoop) {
                            // 起点或者终点
                            if (index === 0 && swipSpan > 0 || index === itemCount - 1 && swipSpan < 0) {
                                // 模拟拉不动的操作体验
                                swipSpan /= pullRatio;
                            }
                        }
                        translate += swipSpan;
                    }
                    // touchend时滚动动画
                    else {
                        var $item = $items.eq(index);
                        // item存在
                        if ($item.length) {
                            // 滚动回调函数
                            typeof slideCallback === 'function' && slideCallback.call($items, index);

                            // 添加当前类
                            $item.addClass('current');

                            // title
                            if (isShowTitle) {
                                var title = $item.attr('data-title');
                                // 隐藏
                                $title.removeClass('visible');
                                title && setTimeout(function () {
                                    // 显示
                                    $title.addClass('visible').html(title);
                                }, duration / 2);
                            }

                            // pager状态
                            if (isShowPager) {
                                $pagers.removeClass('selected');
                                // 下一队列执行,以防某些情况下无效
                                setTimeout(function () {
                                    $pagers.eq(index).addClass('selected');
                                }, 0);
                            }

                            // 延迟removeClass('current')
                            setTimeout(function () {
                                $items.each(function () {
                                    var $this = $(this),
                                        i = $this.attr('data-index');
                                    i !== index && $this.removeClass('current');
                                });
                            }, removeClassDelay);
                        }

                        // 如果是循环滚动
                        isLoop && setTimeout(function () {
                            // 第一帧滑到最后一帧
                            index < 0 && me.slideToIndex(itemCount - 1, 1);
                            // 最后一帧滑到第一帧
                            index === itemCount && me.slideToIndex(0, 1);
                        }, duration);
                    }

                    transform = 'translate3d(' + (isVertical ? '0,' + translate + 'px,0' : translate + 'px,0,0') + ')';
                    // 作动画
                    $wrap.css({
                        transform: transform
                    });
                }


                // 初始化
                // 设置尺寸
                setSize();

                // 暴露slideToIndex方法
                me.slideToIndex = function (i, isNoAni) {
                    if (typeof i !== 'number') {
                        return console.log('index应为数字');
                    }

                    // 是否没有动画
                    isNoAni ? $wrap.addClass('notrans') : $wrap.removeClass('notrans');

                    index = i;
                    slide();
                };

                // 暴露prev方法
                me.prev = function () {
                    --index;
                    !isLoop && index < 0 && (index = itemCount - 1);
                    slide();
                };

                // 暴露next方法
                me.next = function () {
                    ++index;
                    !isLoop && index === itemCount && (index = 0);
                    slide();
                };


                // 触摸开始事件
                $this.on('touchstart', function (evt) {
                    var touch = evt.targetTouches ? evt.targetTouches[0] : evt;

                    // 记录触摸开始位置
                    startX = touch.pageX;
                    startY = touch.pageY;

                    // 重置swipSpan
                    swipSpan = 0;
                    // 重置手指拖拽移动
                    isMoving = false;
                    // 取消动画
                    $wrap.addClass('notrans');
                    // 取消自动轮播
                    isAutoPlay && clearInterval(inter);
                });

                // 触摸移动事件
                $this.on('touchmove', function (evt) {
                    var touch = evt.targetTouches ? evt.targetTouches[0] : evt,
                        // x轴滑动距离
                        swipSpanX = touch.pageX - startX,
                        absX = Math.abs(swipSpanX),
                        // y轴滑动距离
                        swipSpanY = touch.pageY - startY,
                        absY = Math.abs(swipSpanY);

                    // 左右
                    if (!isVertical) {
                        // y轴滑动距离小于阈值,或x轴滑动距离大于y轴,说明的确是左右滑动
                        if (isMoving || absY < swipSpanThreshold || absY < absX) {
                            evt.preventDefault();
                            evt.stopPropagation();
                            slide(swipSpan = swipSpanX);
                            // 已经满足滚动条件,且正在手指拖动
                            isMoving = true;
                        }
                    }
                    // 上下
                    else {
                        // x轴滑动距离小于阈值,或y轴滑动距离大于x轴,说明的确是上下滑动
                        if (isMoving || absX < swipSpanThreshold || absX < absY) {
                            evt.preventDefault();
                            evt.stopPropagation();
                            slide(swipSpan = swipSpanY);
                            // 已经满足滚动条件,且正在手指拖动
                            isMoving = true;
                        }
                    }
                });

                // 触摸结束事件
                $this.on('touchend', function () {
                    // 向右,下
                    if (swipSpan > swipThreshold) {
                        --index;
                        !isLoop && index < 0 && (index = 0);
                    }
                    // 向左,上
                    else if (swipSpan < -swipThreshold) {
                        ++index;
                        !isLoop && index === itemCount && (index = itemCount - 1);
                    }

                    // 加上动画
                    $wrap.removeClass('notrans');
                    // 滚动(swipSpan === undefined时无动画)
                    swipSpan !== 0 && slide();

                    // 自动轮播
                    setInter();
                }).trigger('touchend');

                // pager点击事件
                $pagers.on('click', function () {
                    var index = $(this).index();
                    me.slideToIndex(index);
                });

                // 屏幕尺寸改变事件
                window.addEventListener('resize', function () {
                    var w = $this.width();
                    if (w > 0) {
                        setSize();
                        slide(0);
                    }
                }, false);

            }


            // 初始化
            init();

        });

    };
    $.fn.carousel.defaults = {
        // 是否竖直方向滚动
        isVertical: false,
        // 滑动阈值
        swipThreshold: 100,
        // 滑动距离阈值
        swipSpanThreshold: 10,
        // 是否自动轮播
        isAutoPlay: true,
        // 轮播inter
        autoPlayInter: 8000,
        // 轮播回调函数
        slideCallback: null,
        // 是否显示title
        isShowTitle: true,
        // 是否显示pager
        isShowPager: true,
        // 移除class延迟
        removeClassDelay: 0,
        // 初始化完成回调函数
        inited: null,
        // 初始index
        initIndex: 0,
        // first和last拉不动的比率
        pullRatio: 3,
        // 是否可以循环切换
        isLoop: false
    };

})(window, $);
},{}],16:[function(require,module,exports){
/*
 * flip.js
 * 3d翻转效果js
 */
(function (window, $) {

    $.fn.flip = function (options) {

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.flip.defaults, options);

            //配置项
            var isVertical = opts.isVertical,
                swipThreshold = opts.swipThreshold,
                swipSpanThreshold = opts.swipSpanThreshold,
                rate = opts.rate,
                slideCallback = opts.slideCallback;

            //变量
            var $this = $(this),
                $items = $this.children('*');

            //初始化函数
            function init() {
                $this.addClass('pi-flip');

                //初始化第一个item显示
                $items.eq(0).addClass('visible');
                //滚动回调函数
                typeof slideCallback === 'function' && slideCallback(0);

                //初始化事件
                initEvent();
            }

            //初始化事件函数
            function initEvent() {
                var itemCount = $items.length,
                    index = 0,
                    duration = parseFloat($items.css('transition-duration')) * 1000,
                    startX, startY,
                    swipSpan, isAnimating;

                //复位函数
                function reset(me) {
                    me.style.cssText = '';
                }

                //旋转到函数
                function rotate(swipSpan) {
                    var transform;

                    if (typeof swipSpan === 'number') {
                        $items.each(function (i) {
                            var $this = $(this);
                            if (i === index) {
                                transform = isVertical ? 'rotate3d(1,0,0,' + -swipSpan + 'deg)' : 'rotate3d(0,1,0,' + swipSpan + 'deg)';
                                $this.css({
                                    'transform': transform
                                });
                            }
                            else {
                                transform = isVertical ? 'rotate3d(1,0,0,' + (180 - swipSpan) + 'deg)' : 'rotate3d(0,1,0,' + -(180 - swipSpan) + 'deg)';
                                $this.css({
                                    'transform': transform
                                });
                            }
                        });
                    }
                    else {
                        isAnimating = true;
                        //滚动回调函数
                        $.isFunction(slideCallback) && slideCallback(index);

                        $items.each(function (i) {
                            var $this = $(this);
                            if (i === index) {
                                transform = isVertical ? 'rotate3d(1,0,0,' + -(swipSpan ? 0 : -360) + 'deg)' : 'rotate3d(0,1,0,' + (swipSpan ? 0 : -360) + 'deg)';
                                $this.addClass('visible').css({
                                    'transform': transform
                                });
                            }
                            else {
                                transform = isVertical ? 'rotate3d(1,0,0,' + -(swipSpan ? 180 : -180) + 'deg)' : 'rotate3d(0,1,0,' + (swipSpan ? 180 : -180) + 'deg)';
                                $this.removeClass('visible').css({
                                    'transform': transform
                                });
                            }
                        });

                        //延迟复位
                        setTimeout(function () {
                            //加上动画
                            $items.addClass('notrans').each(function () {
                                reset(this);
                            });
                            isAnimating = false;
                        }, duration);
                    }
                }

                //触摸开始事件
                $this.on('touchstart', function (evt) {
                    var touch = evt.targetTouches ? evt.targetTouches[0] : evt;

                    //记录触摸开始位置
                    startX = touch.pageX;
                    startY = touch.pageY;
                    //重置swipSpan
                    swipSpan = 0;

                    //去掉动画
                    $items.addClass('notrans');
                });

                //触摸移动事件
                $this.on('touchmove', function (evt) {
                    var touch = evt.targetTouches ? evt.targetTouches[0] : evt,
                        // x轴滑动距离
                        swipSpanX = touch.pageX - startX,
                        absX = Math.abs(swipSpanX),
                        // y轴滑动距离
                        swipSpanY = touch.pageY - startY,
                        absY = Math.abs(swipSpanY);

                    //上下
                    if (isVertical) {
                        //x轴滑动距离小于阈值,或y轴滑动距离大于x轴,说明的确是上下滑动
                        if (absX < swipSpanThreshold || absX < absY) {
                            evt.preventDefault();
                            evt.stopPropagation();
                            !isAnimating && rotate(swipSpan = swipSpanY / rate);
                        }
                    }
                    //左右
                    else {
                        //y轴滑动距离小于阈值,或x轴滑动距离大于y轴,说明的确是左右滑动
                        if (absY < swipSpanThreshold || absY < absX) {
                            evt.preventDefault();
                            evt.stopPropagation();
                            !isAnimating && rotate(swipSpan = swipSpanX / rate);
                        }
                    }
                });

                //触摸结束事件
                $this.on('touchend', function () {
                    if (!isAnimating) {
                        //达到滚动阈值
                        if (Math.abs(swipSpan) > swipThreshold) {
                            // 向右,下
                            if (swipSpan > 0 && --index === -1) {
                                index = itemCount - 1;
                            }
                            // 向左,上
                            else if (swipSpan < 0 && ++index === itemCount) {
                                index = 0;
                            }

                            //加上动画
                            $items.removeClass('notrans');
                            rotate(swipSpan > 0);
                        }
                        else if (swipSpan !== 0) {
                            //加上动画
                            $items.eq(index).removeClass('notrans');
                            reset($items[index]);
                        }
                    }
                });
            }


            //初始化
            init();

        });

    };
    $.fn.flip.defaults = {
        //是否竖直方向滚动
        isVertical: false,
        //滑动阈值
        swipThreshold: 60,
        // 滑动距离阈值
        swipSpanThreshold: 10,
        //比率
        rate: 1.3,
        //轮播回调函数
        slideCallback: null
    };

})(window, $);
},{}],17:[function(require,module,exports){
/*
 * piccut.js
 * 图片裁切功能js
 */
(function (window, $) {

    $.fn.piccut = function (options) {

        var URL = window.URL || window.webkitURL;

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.piccut.defaults, options);

            //配置项
            var cutX = opts.cutX,
                cutY = opts.cutY,
                cutWidth = opts.cutWidth,
                cutHeight = opts.cutHeight,
                fileEl = opts.fileEl,
                layerStyle = opts.layerStyle,
                isContain = opts.isContain,
                isKeepScale = opts.isKeepScale,
                isMinLimit = opts.isMinLimit,
                scale = opts.scale;

            //变量
            var me = this,
                $this = $(me),
                meWidth = me.offsetWidth,
                meHeight = me.offsetHeight,
                canvasEl, context,
                canvasWidth = meWidth * scale,
                canvasHeight = meHeight * scale,
                maskEl, maskContext,
                cutterEl, $cutter,
                $resizer,
                cutRatio = cutWidth / cutHeight;

            //默认裁切起点
            cutX === undefined && (cutX = opts.cutX = (meWidth - cutWidth) / 2);
            cutY === undefined && (cutY = opts.cutY = (meHeight - cutHeight) / 2);

            //初始化函数
            function init() {
                $this.addClass('pi-piccut')
                    .html('<canvas class="pi-piccut-canvas" width="' + canvasWidth + '" height="' + canvasHeight + '" style="width:' + meWidth + 'px;"></canvas>' +
                    '<canvas class="pi-piccut-mask" width="' + canvasWidth + '" height="' + canvasHeight + '" style="width:' + meWidth + 'px;"></canvas>' +
                    '<p class="pi-piccut-cutter">' +
                    '<b class="pi-piccut-resizer"></b>' +
                    '</p>');

                //画布canvas
                canvasEl = me.getElementsByClassName('pi-piccut-canvas')[0];
                context = canvasEl.getContext('2d');

                //遮罩canvas
                maskEl = me.getElementsByClassName('pi-piccut-mask')[0];
                maskContext = maskEl.getContext('2d');

                //cutter
                cutterEl = me.getElementsByClassName('pi-piccut-cutter')[0];
                $cutter = $(cutterEl);
                //resizer
                $resizer = $(me.getElementsByClassName('pi-piccut-resizer')[0]);

                //初始化事件
                initEvent();
            }

            //初始化事件函数
            function initEvent() {
                var startX, startY,
                //是否形变
                    isResing,
                //记录touchmove时的位置
                    cutCurX = cutX, cutCurY = cutY,
                //记录touchmove时的尺寸
                    cutCurWidth = cutWidth, cutCurHeight = cutHeight;

                //刷新遮罩函数
                function refreshMask() {
                    //cutter的位置和尺寸
                    $cutter.css({
                        transform: 'translate3d(' + cutCurX + 'px, ' + cutCurY + 'px, 0)',
                        width    : cutCurWidth + 'px',
                        height   : cutCurHeight + 'px'
                    });
                    //cutterEl.style.cssText = 'width:' + cutCurWidth + 'px; height:' + cutCurHeight + 'px; left:' + cutCurX + 'px; top:' + cutCurY + 'px;';

                    //清理画布
                    maskContext.clearRect(0, 0, canvasWidth, canvasHeight);

                    //画layer层
                    maskContext.globalCompositeOperation = 'source-over';
                    maskContext.fillStyle = layerStyle;
                    maskContext.fillRect(0, 0, canvasWidth, canvasHeight);

                    //画mask层
                    maskContext.globalCompositeOperation = 'destination-out';
                    maskContext.fillStyle = '#fff';
                    maskContext.fillRect(cutCurX * scale, cutCurY * scale, cutCurWidth * scale, cutCurHeight * scale);
                }


                //文件选择事件
                fileEl.onchange = function () {
                    var file = fileEl.files[0],
                        url = URL.createObjectURL(file);

                    //重置剪裁参数
                    cutX = opts.cutX;
                    cutY = opts.cutY;
                    cutWidth = opts.cutWidth;
                    cutHeight = opts.cutHeight;

                    //绘制图片
                    var img = new Image();
                    img.src = url;
                    img.onload = function () {
                        var imgWidth = img.width,
                            imgHeight = img.height;

                        //是否如背景图的background-size:contain;那样
                        if (isContain) {
                            var ratio = imgWidth / imgHeight;
                            if (ratio > canvasWidth / canvasHeight) {
                                if (imgWidth > canvasWidth) {
                                    imgWidth = canvasWidth;
                                    imgHeight = imgWidth / ratio;
                                }
                            }
                            else {
                                if (imgHeight > canvasHeight) {
                                    imgHeight = canvasHeight;
                                    imgWidth = imgHeight * ratio;
                                }
                            }
                        }

                        //清理画布
                        context.clearRect(0, 0, canvasWidth, canvasHeight);

                        //画图片层
                        context.drawImage(img, (canvasWidth - imgWidth) / 2, (canvasHeight - imgHeight) / 2, imgWidth, imgHeight);

                        //刷新遮罩(加个延迟,以避免安卓4.2后面的绘图功能不生效)
                        setTimeout(function () {
                            refreshMask();
                        }, 0);

                        //显示裁切相关元素
                        $this.addClass('on');
                    };
                };


                //暴露getDataURL函数
                me.getDataURL = function () {
                    if (!fileEl.value) {
                        alert('请选择图片');
                        return;
                    }

                    //临时canvas导出图片数据
                    var data = context.getImageData(cutX * scale, cutY * scale, cutWidth * scale, cutHeight * scale),
                        tmp = document.createElement('canvas');

                    tmp.width = cutWidth * scale;
                    tmp.height = cutHeight * scale;
                    tmp.getContext('2d').putImageData(data, 0, 0);

                    return tmp.toDataURL('image/png');
                };


                //$this的事件
                $this.on('touchstart', function (evt) {
                    var touch = evt.targetTouches[0];
                    //记录触摸开始位置
                    startX = touch.pageX;
                    startY = touch.pageY;
                });

                //在容器上touchmove时,作形变操作
                $this.on('touchmove', function (evt) {
                    //正在形变
                    if (isResing) {
                        evt.preventDefault();
                        evt.stopPropagation();

                        //计算位移
                        var touch = evt.targetTouches[0],
                            swipSpanX = touch.pageX - startX,
                            swipSpanY = touch.pageY - startY;

                        //宽度
                        cutCurWidth = cutWidth + swipSpanX;
                        //高度
                        cutCurHeight = cutHeight + swipSpanY;

                        //保持比例
                        if (isKeepScale) {
                            //计算出按比例的宽度,高度
                            cutWidth / cutCurHeight > cutRatio ? (cutCurHeight = cutCurWidth / cutRatio) : (cutCurWidth = cutCurHeight * cutRatio);

                            //不能超出范围内
                            if (cutCurY + cutCurHeight > meHeight) {
                                cutCurHeight = meHeight - cutCurY;
                                cutCurWidth = cutCurHeight * cutRatio;
                            }
                            if (cutCurX + cutCurWidth > meWidth) {
                                cutCurWidth = meWidth - cutCurX;
                                cutCurHeight = cutCurWidth / cutRatio;
                            }
                        }
                        else {
                            //不能超出范围内
                            cutCurY + cutCurHeight > meHeight && (cutCurHeight = meHeight - cutCurY);
                            cutCurX + cutCurWidth > meWidth && (cutCurWidth = meWidth - cutCurX);
                        }

                        //有最小限制时,将不能小于配置项中的裁切尺寸
                        isMinLimit && cutCurHeight < opts.cutHeight && (cutCurHeight = opts.cutHeight);
                        isMinLimit && cutCurWidth < opts.cutWidth && (cutCurWidth = opts.cutWidth);

                        //刷新遮罩
                        refreshMask();
                    }
                });

                //cutter上touchmove时,移动遮罩
                $cutter.on('touchmove', function (evt) {
                    //不是形变
                    if (!isResing) {
                        evt.preventDefault();
                        evt.stopPropagation();

                        //计算位移
                        var touch = evt.targetTouches[0],
                            swipSpanX = touch.pageX - startX,
                            swipSpanY = touch.pageY - startY;

                        //X轴
                        cutCurX = cutX + swipSpanX;
                        //不能超出范围内
                        cutCurX < 0 && (cutCurX = 0);
                        cutCurX + cutCurWidth > meWidth && (cutCurX = meWidth - cutCurWidth);

                        //Y轴
                        cutCurY = cutY + swipSpanY;
                        //不能超出范围内
                        cutCurY < 0 && (cutCurY = 0);
                        cutCurY + cutCurHeight > meHeight && (cutCurY = meHeight - cutCurHeight);

                        //刷新遮罩
                        refreshMask();
                    }
                });

                $this.on('touchend', function () {
                    //保存位置
                    cutX = cutCurX;
                    cutY = cutCurY;
                    //保存尺寸
                    cutWidth = cutCurWidth;
                    cutHeight = cutCurHeight;
                });


                //resizer的事件
                $resizer.on('touchstart', function () {
                    //标识正在作形变
                    isResing = true;
                });

                $resizer.on('touchend', function () {
                    isResing = false;
                });

            }


            //初始化
            init();

        });

    };
    $.fn.piccut.defaults = {
        //裁切起点x值
        cutX       : undefined,
        //裁切起点y值
        cutY       : undefined,
        //裁切宽度
        cutWidth   : 320,
        //裁切高度
        cutHeight  : 320,
        //file元素
        fileEl     : null,
        //遮罩样式
        layerStyle : 'rgba(128,128,128,0.7)',
        //是否如背景图的background-size:contain;
        isContain  : true,
        //截图是否保持比例
        isKeepScale: true,
        //是否有最小限制(默认限制为裁切宽度和裁切高度)
        isMinLimit : true,
        //缩放比例
        scale      : 1
    };

})(window, $);
},{}],18:[function(require,module,exports){
/*
 * picpager.js
 * 相册js
 */
(function (window, $) {

    $.fn.picpager = function (options) {

        // 每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.picpager.defaults, options);

            // 配置项
            var imgData = opts.imgData,
                swipThreshold = opts.swipThreshold,
                swipSpanThreshold = opts.swipSpanThreshold,
                slideCallback = opts.slideCallback,
                pullRatio = opts.pullRatio,
                contentFormate = opts.contentFormate;

            // 变量
            var $this = $(this),
                me = this,
                $pics, $wrap,
                itemCount = imgData.length;

            // 初始化函数
            function init() {
                $this.addClass('pi-picpager').html('<div class="pi-wrap"><div class="pi-pic"></div><div class="pi-pic"></div><div class="pi-pic"></div></div>');
                $wrap = $this.find('.pi-wrap');
                $pics = $this.find('.pi-pic').each(function (i) {
                    // 初始化内容
                    $(this).html(contentFormate(imgData[--i]));
                });

                // 初始化事件
                initEvent();
            }

            // 初始化事件函数
            function initEvent() {
                var width = $this.width(),
                    index = 0,
                    startX, startY,
                    swipSpan, isAnimating, isMoving,
                    duration = parseFloat($wrap.css('transition-duration')) * 1000;

                // 移动到函数
                function slide(direction) {
                    // 判断滚动方向
                    switch (direction) {
                        // 向右
                        case 1:
                        // 向左
                        case -1: {
                            // 动画
                            isAnimating = true;
                            // 作动画
                            translate(width * direction);

                            // 复位操作,更新内容
                            setTimeout(function () {
                                // 去掉动画
                                $wrap.addClass('notrans');
                                // 复位
                                translate(0);
                                // 更新内容
                                $pics.each(function (i) {
                                    $(this).html(contentFormate(imgData[index + i - 1]));
                                });
                                // 重置isAnimating
                                isAnimating = false;
                            }, duration);
                            break;
                        }
                        default: {
                            translate(0);
                        }
                    }

                    // 滚动回调函数
                    typeof slideCallback === 'function' && slideCallback.call($pics, index, direction);
                }

                // 移动函数
                function translate(x) {
                    $wrap.css({
                        'transform': 'translate3d(' + x + 'px,0,0)'
                    });
                }


                // 暴露slideToIndex方法
                me.slideToIndex = function (i, isNoAni) {
                    var direction;
                    // 如不为数字或者超出范围
                    if (typeof i !== 'number' || i < 0 || i >= itemCount || i === index) {
                        return;
                    }

                    // 向左
                    if (i > index) {
                        direction = -1;
                        $pics.eq(2).html(contentFormate(imgData[i]));
                    }
                    // 向右
                    else {
                        direction = 1;
                        $pics.eq(0).html(contentFormate(imgData[i]));
                    }

                    index = i;
                    // 是否无动画
                    isNoAni ? $wrap.addClass('notrans') : $wrap.removeClass('notrans');
                    // 滚动
                    slide(direction);
                };

                // 暴露addItem方法
                me.addItem = function (item) {
                    imgData = imgData.concat(item);
                    itemCount = imgData.length;
                };


                // 触摸开始事件
                $this.on('touchstart', function (evt) {
                    var touch = evt.targetTouches ? evt.targetTouches[0] : evt;

                    // 记录触摸开始位置
                    startX = touch.pageX;
                    startY = touch.pageY;

                    // 重置swipSpan
                    swipSpan = 0;
                    // 重置手指拖拽移动
                    isMoving = false;
                    // 取消动画
                    $wrap.addClass('notrans');
                });

                // 触摸移动事件
                $this.on('touchmove', function (evt) {
                    // 如果正在作动画,不作响应
                    if (isAnimating) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        return;
                    }

                    var touch = evt.targetTouches ? evt.targetTouches[0] : evt,
                        //  x轴滑动距离
                        swipSpanX = touch.pageX - startX,
                        absX = Math.abs(swipSpanX),
                        //  y轴滑动距离
                        swipSpanY = touch.pageY - startY,
                        absY = Math.abs(swipSpanY);

                    // y轴滑动距离小于阈值,或x轴滑动距离大于y轴,说明的确是左右滑动
                    if (isMoving || absY < swipSpanThreshold || absY < absX) {
                        evt.preventDefault();
                        evt.stopPropagation();

                        // 第一张图或最后一张图
                        if (index === 0 && swipSpanX > 0 || index === itemCount - 1 && swipSpanX < 0) {
                            // 模拟拉不动操作体验
                            swipSpanX /= pullRatio;
                        }

                        // 位移
                        translate(swipSpan = swipSpanX);
                        // 已经满足滚动条件,且正在手指拖动
                        isMoving = true;
                    }
                });

                // 触摸结束事件
                $this.on('touchend', function () {
                    // 如果正在作动画,不作响应
                    if (isAnimating) {
                        return;
                    }

                    var direction;
                    // 向左
                    if (swipSpan < -swipThreshold) {
                        ++index === itemCount ? index = itemCount - 1 : direction = -1;
                    }
                    // 向右
                    else if (swipSpan > swipThreshold) {
                        --index < 0 ? index = 0 : direction = 1;
                    }

                    // 加上动画
                    $wrap.removeClass('notrans');
                    // 滚动
                    swipSpan !== 0 && slide(direction);
                }).trigger('touchend');

                // 屏幕尺寸改变事件
                window.addEventListener('resize', function () {
                    var w = $this.width();
                    w > 0 && (width = w);
                }, false);

            }


            // 初始化
            init();

        });

    };
    $.fn.picpager.defaults = {
        // 图片数据
        imgData: null,
        // 滑动阈值
        swipThreshold: 100,
        //  滑动距离阈值
        swipSpanThreshold: 10,
        // 轮播回调函数
        slideCallback: null,
        // first和last拉不动的比率
        pullRatio: 3,
        // 返回内容函数
        contentFormate: function (itemData) {
            return itemData ? '<div style="background: url(' + itemData + ') center center no-repeat; background-size: contain; width: 100%; height: 100%;"></div>' : '';
        }
    };

})(window, $);
},{}],19:[function(require,module,exports){
/*
 * scratchcard.js
 * 刮刮卡js
 */
(function (window, $) {

    $.fn.scratchcard = function (options) {

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.scratchcard.deflunt, options);

            //配置项
            var fineness = opts.fineness,
                paintStyle = opts.paintStyle,
                text = opts.text,
                fontColor = opts.fontColor,
                font = opts.font,
                imgSrc = opts.imgSrc,
                scale = opts.scale;

            //变量
            var $this = $(this),
                width = $this.width() * scale,
                height = $this.height() * scale,
            //绘画元素
                $canvas,
            //容器offsetLeft
                offsetLeft,
            //容器offsetTop
                offsetTop,
            //上下文
                context;

            //初始化函数
            function init() {
                var html = '<canvas style="width: 100%; height: 100%;" width="' + width + '" height="' + height + '"></canvas>';
                $this.css({
                    'position': 'relative',
                    'background-image': 'url(' + imgSrc + ')',
                    'background-size': '100% auto'
                }).html(html);

                //canvas
                $canvas = $this.find('canvas');
                $canvas.css({
                    'position': 'absolute',
                    'top': 0,
                    'left': 0
                });

                //上下文
                context = $this.children('canvas')[0].getContext('2d');

                drawLayer();

                initEvents();
            }

            //画覆盖物
            function drawLayer() {
                context.fillStyle = paintStyle;
                context.fillRect(0, 0, width, height);
                if (text) {
                    context.fillStyle = fontColor;
                    if (font) {
                        context.font = font;
                    }
                    var textWidth = context.measureText(text).width;
                    context.fillText(text, opts.left || (width - textWidth) / 2, opts.top || height / 2 + 20, width);
                }
            }

            //事件绑定
            function initEvents() {
                $canvas.on('touchstart', function (e) {
                    //计算offset
                    var offset = $this.offset();
                    offsetLeft = offset.left;
                    offsetTop = offset.top;
                    //设置画画参数
                    context.fillStyle = '#fff';
                    context.globalCompositeOperation = 'destination-out';
                    context.beginPath();
                    //画画操作
                    draw(e);
                });
                $canvas.on('touchmove', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    //画画操作
                    draw(e);
                });
                $canvas.on('touchend', function (e) {
                    context.globalCompositeOperation = 'source-over';
                });
            }

            //画画函数
            function draw(e) {
                var touch = e.targetTouches[0];
                context.arc((touch.pageX - offsetLeft) * scale, (touch.pageY - offsetTop) * scale, fineness * scale, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
            }


            //初始化
            init();

        });
    };
    $.fn.scratchcard.deflunt = {
        //画笔大小
        fineness: 30,
        //覆盖层颜色
        paintStyle: '#ccc',
        //文字
        text: '',
        //字体颜色
        fontColor: '#f00',
        //字体相关
        font: 'bold 60px sans-serif',
        //图片地址
        imgSrc: '',
        //缩放比例
        scale: 1
    };

})(window, $);
},{}],20:[function(require,module,exports){
/*
 * scroll.js
 * 自定义滚动js
 */
(function (window, $) {

    $.fn.scroll = function (options) {

        var Math = window.Math;

        //计算校正距离函数
        function getReviseSpan(swipSpan, timeSpan, reviseRatio) {
            var speed = Math.abs(swipSpan) / timeSpan;
            return speed * speed * reviseRatio;
        }

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.scroll.defaults, options);

            //配置项
            var isVertical = opts.isVertical,
                timeSpanThreshold = opts.timeSpanThreshold,
                swipSpanThreshold = opts.swipSpanThreshold,
                maxScroll = opts.maxScroll,
                isAdjust = opts.isAdjust,
                reviseRatio = opts.reviseRatio,
                touchDuration = opts.touchDuration;

            //变量
            var $this = $(this),
                $items = $this.children('*');


            //初始化函数
            function init() {
                $items.addClass('pi-scroll-item');

                //初始化事件
                initEvent();
            }


            //初始化事件函数
            function initEvent() {
                //最后一个touch的信息
                var lastTouch = {},
                    //touchstart位置
                    startX, startY,
                    //作动画translate值
                    translateVal = 0,
                    //当前translate值
                    currentTranslateVal,
                    //可滚动的值
                    scrollVal = getScrollVal();

                //获取可滚动的值函数
                function getScrollVal() {
                    //item包含margin的尺寸
                    var itemsOuterVal = isVertical ?
                        $items.height() + parseFloat($items.css('margin-top')) + parseFloat($items.css('margin-bottom')) :
                        $items.width() + parseFloat($items.css('margin-left')) + parseFloat($items.css('margin-right')),
                        //this不包含padding的尺寸
                        thisInnerVal = isVertical ?
                        $this.height() - parseFloat($this.css('padding-top')) - parseFloat($this.css('padding-bottom')) :
                        $this.width() - parseFloat($this.css('padding-left')) - parseFloat($this.css('padding-right'));

                    //记录可滚动的值
                    return itemsOuterVal - thisInnerVal;
                }

                //移动到函数
                function slide(x) {
                    //起点
                    if (x > 0) {
                        x /= 2;
                    }
                    //终点
                    else if (x < -scrollVal) {
                        x += (-x - scrollVal) / 2;
                    }

                    var transform = 'translate3d(' + (isVertical ? '0,' + (translateVal = x) + 'px,0' : (translateVal = x) + 'px,0,0') + ')';
                    $items.css({
                        'transform': transform
                    });
                }

                //居中函数
                function center(me) {
                    var translateVal = isVertical ?
                    (me.offsetTop - $items[0].offsetTop) - ($this.height() - me.clientHeight) / 2 :
                    (me.offsetLeft - $items[0].offsetLeft) - ($this.width() - me.clientWidth) / 2;

                    if (translateVal < 0) {
                        slide(0);
                    }
                    else {
                        translateVal < scrollVal ? slide(-translateVal) : slide(-scrollVal);
                    }
                }

                //暴露居中函数
                $this[0].center = center;


                //触摸开始事件
                $this.on('touchstart', function (evt) {
                    var touch = evt.targetTouches ? evt.targetTouches[0] : evt;

                    //记录开始时间
                    lastTouch.startTime = evt.timeStamp;
                    //记录触摸开始位置
                    lastTouch.startX = startX = touch.pageX;
                    lastTouch.startY = startY = touch.pageY;
                    //记录当前动画值
                    currentTranslateVal = translateVal;

                    //不作动画
                    $items.addClass('notrans');
                });

                //触摸移动事件
                $this.on('touchmove', function (evt) {
                    var touch = evt.targetTouches ? evt.targetTouches[0] : evt,
                        currentX = touch.pageX,
                        currentY = touch.pageY,
                        //x轴滑动距离
                        swipSpanX = currentX - startX,
                        absX = Math.abs(swipSpanX),
                        //y轴滑动距离
                        swipSpanY = currentY - startY,
                        absY = Math.abs(swipSpanY),
                        //事件当前时间
                        timeStamp = evt.timeStamp;

                    //上下
                    if (isVertical) {
                        //x轴滑动距离小于阈值,或y轴滑动距离大于x轴,说明的确是上下滑动
                        if (absX < swipSpanThreshold || absX < absY) {
                            evt.preventDefault();
                            evt.stopPropagation();

                            slide(currentTranslateVal + swipSpanY);
                        }
                    }
                    //左右
                    else {
                        //y轴滑动距离小于阈值,或x轴滑动距离大于y轴,说明的确是左右滑动
                        if (absY < swipSpanThreshold || absY < absX) {
                            evt.preventDefault();
                            evt.stopPropagation();

                            slide(currentTranslateVal + swipSpanX);
                        }
                    }

                    //如果大于一定时间间隔,重置最后一个touch的信息
                    if (timeStamp - lastTouch.startTime > touchDuration) {
                        lastTouch.startTime = timeStamp;
                        lastTouch.startX = currentX;
                        lastTouch.startY = currentY;
                    }
                });

                //触摸结束事件
                $this.on('touchend', function (evt) {
                    var touch = evt.changedTouches ? evt.changedTouches[0] : evt,
                        //滑动距离
                        swipSpan = isVertical ? touch.pageY - lastTouch.startY : touch.pageX - lastTouch.startX,
                        //滑动时间间隔
                        timeSpan = evt.timeStamp - lastTouch.startTime,
                        //计算校正值(更加拟物化)
                        span = timeSpan > timeSpanThreshold ? 0 : getReviseSpan(swipSpan, timeSpan, reviseRatio);

                    //设置最大滚动值
                    span > maxScroll && (span = maxScroll);

                    //作动画
                    $items.removeClass('notrans');

                    if (swipSpan < 0) {
                        //是否滚动到最后
                        -(translateVal - span) < scrollVal ? slide(translateVal - span) : slide(-scrollVal);
                    }
                    else if (swipSpan > 0) {
                        //是否滚动到最前
                        translateVal + span < 0 ? slide(translateVal + span) : slide(0);
                    }
                });

                //点击事件(如果需要将点击元素定位到居中)
                isAdjust && $this.on('click', function (evt) {
                    center(evt.target);
                });

                //屏幕尺寸改变事件
                window.addEventListener('resize', function () {
                    var w = $this.width();
                    //重置可滚动的值
                    w > 0 && (scrollVal = getScrollVal());
                }, false);
            }


            //初始化
            init();

        });

    };
    $.fn.scroll.defaults = {
        //是否竖直方向滚动
        isVertical: false,
        //时间间隙阈值
        timeSpanThreshold: 300,
        //滑动距离阈值
        swipSpanThreshold: 10,
        //滚动最大值
        maxScroll: 800,
        //是否调整点击元素居中
        isAdjust: false,
        //校正系数
        reviseRatio: 400,
        //默认触摸时长
        touchDuration: 300
    };

})(window, $);
},{}],21:[function(require,module,exports){
/*
 * turntable.js
 * 转盘抽奖js
 */
(function (window, $) {

    $.fn.turntable = function (options) {

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.turntable.defaults, options);

            //配置项
            var count = opts.count,
                rotateDeg = opts.rotateDeg,
                duration = opts.duration,
                timeFx = opts.timeFx,
                offset = opts.offset;

            //变量
            var $this = $(this),
                me = this,
                $pointer;

            //初始化函数
            function init() {
                $pointer = $('<div class="pi-pointer"></div>');
                $this.addClass('pi-turntable').prepend($pointer);

                //初始化事件
                initEvent();
            }

            //初始化事件函数
            function initEvent() {

                var timeout,
                    isAnimating;

                //转动函数
                me.turnToIndex = function (index, fn) {
                    //不可大于总数
                    if (index > count) {
                        return;
                    }

                    //正在转动
                    if (isAnimating) {
                        return;
                    }

                    //动画属性
                    var transition = duration / 1000 + 's ' + timeFx,
                        endDeg = rotateDeg + (index / count) * 360 + offset + 'deg',
                        transform = 'rotateZ(' + endDeg + ')';//如用'rotate3d(0, 0, 1, ' + endDeg + ')',ios上动画有bug

                    //重置
                    $pointer[0].style.cssText = '';
                    isAnimating = true;

                    //设定延迟才会有动画效果
                    setTimeout(function () {
                        //动画
                        $pointer.css({
                            'transform': transform
                        });
                        var pointerEl = $pointer[0];
                        pointerEl.style['-webkit-transition'] = '-webkit-transform ' + transition;
                        pointerEl.style['transition'] = 'transform ' + transition;

                        //动画完成后回调
                        clearTimeout(timeout);//清理上一个timeout
                        timeout = setTimeout(function () {
                            typeof fn === 'function' && fn();
                            isAnimating = false;
                        }, duration);

                    }, 40);
                };
            }


            //初始化
            init();

        });
    };
    $.fn.turntable.defaults = {
        //奖品格数
        count    : 12,
        //旋转度数
        rotateDeg: 3600,
        //旋转时长
        duration : 7000,
        //动画fx
        timeFx   : 'cubic-bezier(0.42,0,0.25,1)',
        //校正值
        offset   : 0
    };

})(window, $);
},{}],22:[function(require,module,exports){
/*
 * base.js
 * 移动端基础js,包含pc端二维码,mask,a标签触摸等基础功能
 */
(function (window, $) {

    //文档元素
    var document = window.document,
    //文档$对象
        $doc = $(document),
    //body $对象
        $body = $(document.body),
    //mainbox $对象
        $mainbox = $('#mainbox');


    /**
     * 是否显示二维码(默认为true)
     * @type {boolean}
     */
    $.isShowQrcode = true;


    /**
     * 是否body滚动
     * @type {string}
     */
    $.isBodyScroll = $mainbox.css('overflow') !== 'hidden';
    //去掉部分浏览器地址栏(ucweb,qq有效)
    if (!$.isBodyScroll) {
        $body.addClass('very-high');
        window.scrollTo(0, 1);
        $body.removeClass('very-high');
    }


    var ua = navigator.userAgent;
    /**
     * 是否为移动端
     * @type {boolean}
     */
    $.isMobi = /(iPhone|iPod|iPad|android)/i.test(ua);
    /**
     * 是否为安卓
     * @type {boolean}
     */
    $.isAndroid = /(android)/i.test(ua);
    /**
     * 是否为ios
     * @type {boolean}
     */
    $.isIos = /(iPhone|iPod|iPad)/i.test(ua);


    /**
     * 显示/隐藏mask函数
     * @param {boolean} isShow 是否显示
     */
    $.toggleMask = function (isShow) {
        isShow ? $body.addClass('onmask') : $body.removeClass('onmask');
    };


    //文档加载完成
    $(function () {

        setTimeout(function () {
            //添加class
            $body.addClass('loaded');
        }, 100);

        //a标签touch
        $doc.on('touchstart', 'a', function () {
            $(this).addClass('focus');
        });
        $doc.on('touchend touchmove', 'a', function () {
            $(this).removeClass('focus');
        });

        //pc端二维码
        $.isShowQrcode && !$.isMobi && $.getScript('http://img.gd.sohu.com/static/v3/qrcode.js', function () {
                var $qrcode = $('#qrcode');
                if ($qrcode.length === 0) {
                    $qrcode = $('<div id="qrcode"></div>');
                    $body.append($qrcode);
                    new QRCode($qrcode[0], {
                        width : $qrcode.width(),
                        height: $qrcode.height(),
                        text  : location.href
                    });
                }
                $doc.on('click', '#qrcode', function () {
                    $qrcode.hide();
                });
            }
        );

        //pc端mouse转touch事件
        !$.isMobi && $.getScript('http://img.gd.sohu.com/static/v3/desktouch.js');

    });

})(window, $);
},{}],23:[function(require,module,exports){
/*
 * ui.js
 * 移动端界面js,包括面板切换,导航,边栏等功能
 */
(function (window, $) {

    //文档元素
    var document = window.document,
    //文档$对象
        $doc = $(document),
    //body对象
        bodyEl = document.body,
    //body $对象
        $body = $(bodyEl),
    //mainbox $对象
        $mainbox = $('#mainbox');

    /**
     * 首页hash(默认为#home)
     * @type {string}
     */
    $.homeSelector = '#home';


    //body scroll时设置宽度(ios中header宽度的bug)
    $.isBodyScroll && $.isIos && $(window).on('resize', (function () {
        var $toFix = $('#header,#navbar');
        return function () {
            $toFix.css({
                width: bodyEl.offsetWidth + 'px'
            });
        };
    })()).trigger('resize');


    /**
     * 显示/隐藏头部函数
     * @param {boolean} isShow 是否显示
     */
    $.toggleHeader = function (isShow) {
        isShow ? $mainbox.removeClass('offheader') : $mainbox.addClass('offheader');
    };

    /**
     * 显示/隐藏导航条函数
     * @param {boolean} isShow 是否显示
     */
    $.toggleNavbar = function (isShow) {
        isShow ? $mainbox.removeClass('offnavbar') : $mainbox.addClass('offnavbar');
    };

    /**
     * 设置标题函数
     * @param {string} title 标题
     */
    $.setTitle = (function () {
        var $title = $('.roottitle .title');
        return function (title) {
            title && $title.html(title);
        };
    })();

    /**
     * 设置二级页面标题函数
     * @param {string} title 二级页面标题
     */
    $.setSubtitle = (function () {
        var $title = $('.subtitle .title');
        return function (title) {
            title && $title.html(title);
        };
    })();


    /**
     * 加载panel函数
     * @param {string} hash panel的hash(如#home)
     * @param {boolean} isAnimation 是否动画
     */
    $.loadPanel = (function () {

        //导航中的a元素
        var $navbarA = $('#navbar a'),
        //导航容器元素
            navboxEl = document.querySelector('.navbox'),
        //面板元素
            $panel = $('.panel'),
        //panel切换动画duration
            duration = parseFloat($panel.css('transition-duration')) * 1000,
        //历史记录对象
            history = $.history = [],
        //header元素
            $header = $('#header');

        /**
         * 页面加载是否动画(默认为true)
         * @type {boolean}
         */
        $.isLoadAnimation = true;

        /**
         * scrollTop处理相关
         * @param {string} id 元素id
         * @param {boolean} isCache 是否是存储scrollTop
         * @ignore
         */
        var scrollTop = (function () {
            var cache = {};
            return function (id, isCache) {
                if ($.isBodyScroll) {
                    //是否是存储scrollTop
                    isCache ? (cache[id] = bodyEl.scrollTop) : (bodyEl.scrollTop = cache[id] || 0);
                }
            };
        })();

        /**
         * 显示panel时函数
         * @param {$init} $toShow 显示的$对象
         * @param {boolean} isNoScroll 是否不恢复scrollTop
         * @ignore
         */
        var toShowPanel = (function () {
            var cache = {};
            return function ($toShow, isNoScroll) {
                var id = $toShow[0].id;

                //显示
                $toShow.addClass('show opened');

                //b.设置scrollTop(必须放在显示之后)
                setTimeout(function () {
                    !isNoScroll && scrollTop(id);
                }, 0);

                //显示时调用函数
                var panelLoaded = $.panelLoaded;
                typeof panelLoaded === 'function' && panelLoaded($toShow, !cache[id]);

                //记录panel是否初始化过(放在最后)
                cache[id] = true;
            };
        })();

        /**
         * 隐藏panel时函数
         * @param {$init} $toHide 隐藏的$对象
         * @param {boolean} isShow 是否不隐藏元素
         * @ignore
         */
        function toHidePanel($toHide, isShow) {
            //隐藏
            !isShow && $toHide.removeClass('show');

            //如果是打开iframe页面的面板
            $toHide[0].id === 'paneliframe' && ($toHide.html(''));

            //隐藏时调用函数
            var panelUnloaded = $.panelUnloaded;
            typeof panelUnloaded === 'function' && panelUnloaded($toHide);
        }


        /**
         * 显示/隐藏边栏函数
         * @param {boolean} isShow 是否显示
         */
        $.toggleSidebox = (function () {
            var $sidebox = $('#sidebox');

            return function (isShow) {
                //相关panel
                var $panel = $.history[$.history.length - 1];
                if (isShow) {
                    $body.addClass('onsidebox');
                    //显示时调用函数
                    toShowPanel($sidebox);
                    //隐藏原页面
                    toHidePanel($panel, true);
                }
                else {
                    $body.removeClass('onsidebox');
                    //隐藏时调用函数
                    toHidePanel($sidebox);
                    //显示原页面
                    toShowPanel($panel, true);
                }
            };
        })();

        return function (hash, isAnimation) {
            var $toShow, $toHide;

            //没有hash(表示后退)
            if (hash === undefined) {
                $toHide = history.pop();
                $toShow = history[history.length - 1] || $($.homeSelector);
                hash = '#' + $toShow[0].id;
            }
            else {
                $toShow = $(hash);
                if ($toShow.length > 0) {
                    $toHide = history[history.length - 1];
                    history.push($toShow);
                }
            }


            //如果有显示面板
            if ($toShow.length > 0) {

                //navbar选中状态(与面板切换无关的操作)
                $navbarA.length > 0 && $navbarA.each(function () {
                    var array = (this.getAttribute('data-hash') || this.hash).split('|');
                    for (var i = 0, len = array.length; i < len; i++) {
                        if (array[i] === hash) {
                            $navbarA.removeClass('selected');
                            $(this).addClass('selected');
                            //居中
                            navboxEl.center(this);
                        }
                    }
                });

                //标题,navbar状态(与面板切换无关的操作)
                var showRole = $toShow.attr('data-role');
                if (showRole === 'root') {
                    //设置标题
                    $.setTitle($toShow.attr('title'));

                    //显示navbar
                    $.toggleNavbar(true);

                    //header内容切换
                    $header.removeClass('onsubtitle');
                }
                else {
                    //设置二级页面标题
                    $.setSubtitle($toShow.attr('title'));

                    //隐藏navbar
                    $.toggleNavbar(false);

                    //header内容切换
                    $header.addClass('onsubtitle');
                }


                //没有隐藏面板的特殊情况(页面第一次加载)
                if (!$toHide) {
                    //显示时调用函数
                    toShowPanel($toShow);
                    return;
                }


                //面板切换
                if ('#' + $toHide[0].id !== hash) {
                    var hideRole = $toHide.attr('data-role');

                    //a.记录scrollTop(必须放在隐藏之前)
                    scrollTop($toHide[0].id, 1);


                    //一级->一级或无动画
                    var isAni = isAnimation === undefined ? $.isLoadAnimation : isAnimation;
                    if (!isAni || showRole === 'root' && hideRole === 'root') {
                        //无动画
                        $toShow.addClass('notrans');
                        $toHide.addClass('notrans');

                        //显示时调用函数(放在靠后)
                        toShowPanel($toShow);
                        //隐藏时调用函数(放在靠后)
                        toHidePanel($toHide);
                        return;
                    }


                    //其他切换
                    //1.显示
                    $toShow.addClass('show');

                    //切换面板时强制重排一次,以免出现横向滚动条
                    $mainbox.addClass('reflow');

                    //2.延迟保证显示动画
                    setTimeout(function () {
                        //有动画
                        $toShow.removeClass('notrans');
                        $toHide.removeClass('notrans');

                        //二级->一级
                        if (showRole === 'root') {
                            $toShow.removeClass('subopened');
                            $toHide.removeClass('opened');
                        }
                        //显示二级面板
                        else {
                            //一级->二级
                            if ($toShow.hasClass('subopened')) {
                                $toShow.removeClass('subopened');
                                $toHide.removeClass('opened');
                            }
                            //二级->二级
                            else {
                                $toHide.addClass('subopened').removeClass('opened');
                            }
                        }

                        //显示时调用函数(放在靠后)
                        toShowPanel($toShow);


                        //3.延迟保证隐藏动画
                        setTimeout(function () {

                            //延迟重排(延迟100ms+在ios8上才有效果,安卓4.2需要400ms+)
                            setTimeout(function () {
                                //切换面板时强制重排一次,以免出现横向滚动条
                                $mainbox.removeClass('reflow');
                            }, 400);

                            //隐藏时调用函数(放在靠后)
                            toHidePanel($toHide);
                        }, duration);

                    }, 10);
                }
            }
            //没有显示面板
            else {
                console.log(hash + '面板未找到');
            }

        };

    })();


    //文档加载完成
    $(function () {

        //btn-onsidebox点击
        $doc.on('click', '.btn-onsidebox', function () {
            $.toggleSidebox(1);
        });
        //btn-offsidebox点击
        $doc.on('click', '.btn-offsidebox', function () {
            $.toggleSidebox(0);
        });

        //iframe面板
        var $iframe = $('#paneliframe');
        if ($iframe.length === 0) {
            $iframe = $('<div id="paneliframe" class="panel"></div>');
            $mainbox.append($iframe);
        }

        //a标签点击事件切换panel
        $doc.on('click', 'a', function (evt) {
            var hash = this.hash;
            if (hash) {
                evt.preventDefault();
                $.loadPanel(hash);
                return;
            }

            //不跳出页面加载其他页面(需要a标签有data-href属性)
            var href = this.getAttribute('data-href'),
                title = this.getAttribute('data-title');

            if (href) {
                evt.preventDefault();
                $iframe.html('<iframe src="' + href + '"></iframe>');
                $.setSubtitle(title || '详情');
                $.loadPanel('#paneliframe');
            }
        });

        //返回按钮点击
        $doc.on('click', '#btn-goback', function () {
            $.loadPanel();
        });


        //导航条
        var $navbox = $('.navbox');
        //导航条拨动
        $navbox.length > 0 && $navbox.scroll();

        //初始化加载指定panel或者首页
        var hash = location.hash;
        $.loadPanel(hash || $.homeSelector);

    });

})(window, $);
},{}]},{},[2])