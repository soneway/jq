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
            el instanceof $init && (el = el[0]);
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
            var $el = el instanceof $init ? el : $(el);
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
            var $el = el instanceof $init ? el : $(el);
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
            var $el = el instanceof $init ? el : $(el);
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
            offset.left += window.pageXOffset;
            offset.top += window.pageYOffset;
            return offset;
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
        type       : 'GET',
        contentType: 'application/x-www-form-urlencoded',
        async      : true
    };


    //CommonJS
    if (typeof exports === 'object') {
        return module.exports = $;
    }

    //添加到全局变量
    window.jq = window.$ = $;

})(window);