//jq.js
(function (window) {

    var $ = (function () {

        /**
         * 选择器函数,兼容jQuery语法,实现jQuery大部分api
         * @param {Node|NodeList|string} sel 选择器
         * @returns {$init} 选择到的$对象
         */
        var $ = function (sel) {
            return new $init(sel);
        };

        var document = window.document,
            toString = {}.toString,
            tmpArray = [],
            slice = tmpArray.slice,
            indexOf = tmpArray.indexOf,
            oneSelReg = /^[\w-]*$/,
            spaceReg = /\s+/g;

        /**
         * 选择器构造函数
         * @param {Node|NodeList|string} sel 选择器
         * @returns {$init} 选择到的$对象
         * @ignore
         */
        function $init(sel) {
            this.length = 0;

            if (!sel) {
                return this;
            }

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

            //NodeList
            if (sel instanceof NodeList || $.isArray(sel)) {
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
        var classReg = (function () {
            var cache = {};
            return function (name) {
                return cache[name] || (cache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
            };
        })();

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
         * @param {Node} el 元素
         * @param {string} sel 选择器
         * @returns {boolean} 元素是否符合sel
         * @ignore
         */
        var matchesSelector = (function () {
            var bodyEl = document.body;
            if (bodyEl.matchesSelector) {
                return function (el, sel) {
                    return el.matchesSelector(sel);
                };
            }
            if (bodyEl.webkitMatchesSelector) {
                return function (el, sel) {
                    return el.webkitMatchesSelector(sel);
                };
            }
            if (bodyEl.msMatchesSelector) {
                return function (el, sel) {
                    return el.msMatchesSelector(sel);
                };
            }
            if (bodyEl.mozMatchesSelector) {
                return function (el, sel) {
                    return el.mozMatchesSelector(sel);
                };
            }
        })();

        /**
         * 按sel过滤nodes并返回$对象函数
         * @param {$init|NodeList} nodes
         * @param {string} sel 选择器
         * @returns {$init} 过滤后的$对象
         * @ignore
         */
        function filterNodes(nodes, sel) {
            if (sel === undefined) {
                return $(nodes);
            }
            var els = [];
            forEach(nodes, function (el) {
                matchesSelector(el, sel) && els.push(el);
            });
            return $(els);
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
                    fn() : document.addEventListener('DOMContentLoaded', fn, false);
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
                    var parentNode = el.parentNode;
                    //父元素的子元素,排除当前元素
                    parentNode && forEach(parentNode.children, function (item) {
                        item !== el && els.indexOf(item) === -1 && els.push(item);
                    });
                });
                return filterNodes(els, sel);
            },

            /**
             * not过滤元素
             * @param {string} sel 选择器
             * @returns {$init} 选择后的$对象
             */
            not: function (sel) {
                var els = [];
                this.forEach(function (el) {
                    !matchesSelector(el, sel) && els.push(el);
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
                        els.indexOf(item) === -1 && els.push(item);
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
                    parentNode && parentNode !== document && els.indexOf(parentNode) === -1 && els.push(parentNode);
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
                    var parentNode = el.parentNode;
                    //遍历parentNode直到根元素
                    while (parentNode) {
                        parentNode !== document && els.indexOf(parentNode) === -1 && els.push(parentNode);
                        parentNode = parentNode.parentNode;
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
                while (curEl && !matchesSelector(curEl, sel)) {
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
                return html === undefined ? this[0].innerHTML : this.forEach(function (el) {
                    el.innerHTML = html;
                });
            },

            /**
             * 元素text取值/赋值(textContent比innerText要好)
             * @param {string} text text值
             * @returns {$init|string} $对象本身|text值
             */
            text: function (text) {
                return text === undefined ? this[0].textContent : this.forEach(function (el) {
                    el.textContent = text;
                });
            },

            /**
             * 元素内容置为空
             */
            empty: function () {
                return this.html('');
            },

            /**
             * 元素取值/赋值
             * @param {string} val 待赋的值
             * @returns {$init|string} $对象本身|获取的值
             */
            val: function (val) {
                return val === undefined ? this[0].value : this.forEach(function (el) {
                    el.value = val;
                });
            },

            /**
             * 元素属性取值/赋值
             * @param {Object|string} key 属性|属性对象
             * @param {string} val 属性值
             * @returns {$init|string} $对象本身|属性值
             */
            attr: function (key, val) {
                //$().attr(key)
                if (typeof key === 'string' && val === undefined) {
                    return this[0].getAttribute(key);
                }
                return this.forEach(function (el) {
                    //$().attr(obj)
                    if ($.isObject(key)) {
                        for (var p in key) {
                            el.setAttribute(p, key[p]);
                        }
                    }
                    //$().attr(key,val)
                    else {
                        el.setAttribute(key, val);
                    }
                });
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
                    //计算样式
                    var style = window.getComputedStyle(this[0]);
                    return style[key];
                }
                return this.forEach(function (el) {
                    var style = el.style;
                    //$().css(obj)
                    if ($.isObject(key)) {
                        for (var p in key) {
                            style[p] = key[p];
                        }
                    }
                    //$().css(key,val)
                    else {
                        style[key] = val;
                    }
                });
            },

            /**
             * 元素显示
             * @returns {$init} $对象本身
             */
            show: function () {
                return this.forEach(function (el) {
                    var display = el.getAttribute('data-display') || 'block';
                    display === 'none' && (display = 'block');
                    el.style.display = display;
                    el.removeAttribute('data-display');
                });
            },

            /**
             * 元素隐藏
             * @returns {$init} $对象本身
             */
            hide: function () {
                return this.forEach(function (el) {
                    el.setAttribute('data-display', $(el).css('display'));
                    el.style.display = 'none';
                });
            },

            /**
             * 元素渐显(实际上是操作class,然后配合css来控制渐显动画)
             * @returns {$init} $对象本身
             */
            fadeIn: function () {
                return this.forEach(function (el) {
                    $(el).removeClass('fade-out').addClass('fade-in');
                });
            },

            /**
             * 元素渐隐(实际上是操作class,然后配合css来控制渐隐动画)
             * @returns {$init} $对象本身
             */
            fadeOut: function () {
                return this.forEach(function (el) {
                    $(el).removeClass('fade-in').addClass('fade-out');
                });
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
             * @returns {$init} $对象本身
             */
            appendTo: function (el) {
                var $el = el instanceof $init ? el : $(el);
                $el.append(this);
            },

            /**
             * 元素前置添加到
             * @param {Node|NodeList|string|$init} el 内容添加到的元素
             * @returns {$init} $对象本身
             */
            prependTo: function (el) {
                var $el = el instanceof $init ? el : $(el);
                $el.append(this, true);
            },

            /**
             * 元素取尺寸对象
             * @returns {Object} 尺寸对象
             */
            offset: function () {
                var el = this[0];
                return el === window ? {
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                } : el.getBoundingClientRect();
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
                var el = this[0];
                return sel && matchesSelector(el, sel);
            },

            /**
             * 元素添加class
             * @param {string} name css类名
             * @returns {$init} $对象本身
             */
            addClass: function (name) {
                return this.forEach(function (el) {
                    var oldClass = el.className,
                        classes = [];

                    forEach(name.split(spaceReg), function (item) {
                        !$(el).hasClass(item) && classes.push(item);
                    });
                    classes.length > 0 && (el.className += (oldClass ? ' ' : '') + classes.join(' '));
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
                        el.className = '';
                        return;
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
                if (sel === undefined) {
                    el.addEventListener(item, fn, false);
                }
                //代理方式
                else {
                    el.addEventListener(item, function (evt) {
                        var match = $(evt.target).closest(sel, el)[0];
                        match && fn.call(match, evt);
                    }, false);
                }
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
         * @param {Object} evt 事件对象
         * @returns {Event} 事件
         * @ignore
         */
        function createEvent(type, evt) {
            var event = document.createEvent('Events');
            //第二个参数:是否冒泡,第三个参数:是否可以preventDefault阻止事件
            event.initEvent(type, true, true);

            //添加事件的其他属性
            if (evt) {
                for (var p in evt) {
                    event[p] === undefined && (event[p] = evt[p]);
                }
            }
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
             * @param {Object} evt 事件对象
             * @returns {$init} $对象本身
             */
            trigger: function (type, evt) {
                type = createEvent(type, evt);
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
         * @param url 请求地址
         * @param fn 回调函数
         */
        $.jsonp = (function () {
            var headEl = document.getElementsByTagName('head')[0];

            return function (url, fn) {
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
        })();

        /**
         * ajax请求函数
         * @param opts ajax请求配置项
         */
        $.ajax = (function () {
            var defaults = {
                method: 'get',
                async: true
            };

            //将data转换为str函数
            function getDataStr(data) {
                var array = [];
                for (var p in data) {
                    array.push(p + '=' + data[p]);
                }
                return array.join('&');
            }

            return function (opts) {
                opts = $.extend({}, defaults, opts);
                //xhr对象
                var xhr = new XMLHttpRequest();
                //打开链接
                xhr.open(opts.method, opts.url, opts.async);
                //设置header
                var header = opts.header;
                if (header) {
                    for (var p in header) {
                        xhr.setRequestHeader(p, header[p]);
                    }
                }
                //xhr状态改变事件
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var fn = opts.callback;
                        typeof fn === 'function' && fn(xhr.responseText);
                    }
                };
                //发送数据
                xhr.send(getDataStr(opts.data));
            };
        })();

        return $;

    })();

    //AMD
    if (typeof define === 'function') {
        define(function () {
            return $;
        });
        return;
    }
    //CommonJS
    if (typeof exports === 'object') {
        module.exports = $;
        return;
    }

    //添加到全局变量
    window.jq = window.$ = $;

})(this);
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
        $body = $(document.body);


    /**
     * 是否显示二维码(默认为true)
     * @type {boolean}
     */
    $.isShowQrcode = true;


    var ua = navigator.userAgent;
    /**
     * 是否为移动端
     * @type {boolean}
     */
    $.isMobi = /(iPhone|iPod|iPad|android|windows phone os|iemobile)/i.test(navigator.userAgent);
    /**
     * 是否为安卓
     * @type {string}
     */
    $.isAndroid = /(android)/i.test(ua);
    /**
     * 是否为ios
     * @type {string}
     */
    $.isIos = /(iPhone|iPod|iPad)/i.test(ua);


    /**
     * 显示/隐藏mask函数
     * @param isShow 是否显示
     */
    $.toggleMask = (function () {
        var $mask = $('#mask');
        if ($mask.length === 0) {
            $mask = $('<div id="mask"><i class="spinner"></i></div>');
            $body.append($mask);
        }
        return function (isShow) {
            isShow ? $mask.addClass('visible') : $mask.removeClass('visible');
        };
    })();


    //文档加载完成
    $(function () {

        //添加class
        $body.addClass('loaded');

        //a标签touch
        $doc.on('touchstart', 'a', function () {
            $(this).addClass('focus');
        });
        $doc.on('touchend', 'a', function () {
            $(this).removeClass('focus');
        });

        //pc端二维码
        $.isShowQrcode && !$.isMobi && $.jsonp('http://img.gd.sohu.com/static/v1/qrcode.js', function () {
                var $qrcode = $('#qrcode');
                if ($qrcode.length === 0) {
                    $qrcode = $('<div id="qrcode"></div>');
                    $body.append($qrcode);
                    new QRCode($qrcode[0], {
                        width: $qrcode.width(),
                        height: $qrcode.height(),
                        text: location.href
                    });
                }
                $doc.on('click', '#qrcode', function () {
                    $qrcode.fadeOut();
                });
            }
        );

    });

})(this, $);
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
     * 首页hash(默认为#panel1)
     * @type {string}
     */
    $.indexSelector = '#panel1';


    //scrollTop处理相关
    var scrollTop = (function () {
        var cache = {},
        //是否body滚动
            isBodyScroll = $mainbox.css('overflow') !== 'hidden';

        return function (id, isCache) {
            if (isBodyScroll) {
                //是否是存储scrollTop
                isCache ? (cache[id] = bodyEl.scrollTop) : (bodyEl.scrollTop = cache[id] || 0);
            }
        };
    })();


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


    /**
     * 显示panel时函数
     * @param $toShow 显示的$对象
     * @ignore
     */
    var toShowPanel = (function () {
        var cache = {};
        return function ($toShow) {
            var panelLoaded = $.panelLoaded,
                id = $toShow[0].id;

            //显示时调用函数
            typeof panelLoaded === 'function' && panelLoaded($toShow, !cache[id]);

            //记录panel是否初始化过
            cache[id] = true;
        };
    })();

    /**
     * 隐藏panel时函数
     * @param $toHide 隐藏的$对象
     * @ignore
     */
    function toHidePanel($toHide) {
        //隐藏时调用函数
        var panelUnloaded = $.panelUnloaded;
        typeof panelUnloaded === 'function' && panelUnloaded($toHide);
    }

    /**
     * 显示/隐藏边栏函数
     * @param isShow 是否显示
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
                toHidePanel($panel);
            }
            else {
                $body.removeClass('onsidebox');
                //隐藏时调用函数
                toHidePanel($sidebox);
                //显示原页面
                toShowPanel($panel);
            }
        };
    })();

    /**
     * 显示/隐藏头部函数
     * @param isShow 是否显示
     */
    $.toggleHeader = function (isShow) {
        isShow ? $mainbox.removeClass('offheader') : $mainbox.addClass('offheader');
    };

    /**
     * 显示/隐藏导航条函数
     * @param isShow 是否显示
     */
    $.toggleNavbar = function (isShow) {
        isShow ? $mainbox.removeClass('offnavbar') : $mainbox.addClass('offnavbar');
    };

    /**
     * 设置标题函数
     * @param title 标题
     */
    $.setTitle = (function () {
        var $title = $('.roottitle .title');
        return function (title) {
            title && $title.html(title);
        };
    })();

    /**
     * 设置二级页面标题函数
     * @param title 二级页面标题
     */
    $.setSubtitle = (function () {
        var $title = $('.subtitle .title');
        return function (title) {
            title && $title.html(title);
        };
    })();


    /**
     * 加载panel函数
     * @param hash panel的hash(如#panel1)
     */
    $.loadPanel = (function () {

        //导航中的a元素
        var $navbarA = $('#navbar a'),
        //导航容器元素
            navboxEl = document.querySelector('.navbox'),
        //index元素
            $index = $($.indexSelector),
        //panel切换动画duration
            duration = parseFloat($index.css('transition-duration') || $index.css('-webkit-transition-duration')) * 1000,
        //历史记录对象
            history = $.history = [],
        //header元素
            $header = $('#header');

        return function (hash) {
            var $toShow, $toHide;

            if (!hash) {
                $toHide = history.pop();
                $toShow = history[history.length - 1];
                hash = '#' + $toShow.attr('id');
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


                //没有隐藏面板的特殊情况(页面第一次加载)
                if (!$toHide) {
                    //显示panel和导航
                    $toShow.addClass('show opened');

                    //设置标题
                    $.setTitle($toShow.attr('title'));

                    //显示时调用函数
                    toShowPanel($toShow);
                    return;
                }


                //a.记录scrollTop(必须放在隐藏之前)
                scrollTop($toHide.attr('id'), true);


                //面板切换
                if ('#' + $toHide.attr('id') !== hash) {

                    var showRole = $toShow.attr('data-role'),
                        hideRole = $toHide.attr('data-role');

                    //1.立即操作
                    $toShow.addClass('show');

                    //切换面板时强制重排一次,以免出现横向滚动条
                    $mainbox.addClass('reflow');

                    //2.延迟保证显示动画
                    setTimeout(function () {
                        //显示一级面板
                        if (showRole === 'root') {

                            //设置标题
                            $.setTitle($toShow.attr('title'));

                            //显示navbar
                            $.toggleNavbar(true);

                            //header内容切换
                            $header.removeClass('onsubtitle');

                            //一级->一级时无动画
                            if (hideRole === 'root') {
                                $toShow.addClass('notrans');
                                $toHide.addClass('notrans');
                            }
                            else {
                                $toShow.removeClass('notrans');
                                $toHide.removeClass('notrans');
                            }

                            $toShow.removeClass('subopened').addClass('opened');
                            $toHide.removeClass('opened');
                        }
                        //显示二级面板
                        else {

                            //设置二级页面标题
                            $.setSubtitle($toShow.attr('title'));

                            //隐藏navbar
                            $.toggleNavbar(false);

                            //header内容切换
                            $header.addClass('onsubtitle');

                            $toShow.removeClass('notrans');
                            $toHide.removeClass('notrans');

                            if ($toShow.hasClass('subopened')) {
                                $toShow.removeClass('subopened').addClass('opened');
                                $toHide.removeClass('opened');
                            }
                            else {
                                $toShow.addClass('opened');
                                $toHide.addClass('subopened').removeClass('opened');
                            }
                        }

                        //显示时调用函数(放在靠后)
                        toShowPanel($toShow);
                    }, 10);

                    //3.延迟保证隐藏动画
                    setTimeout(function () {
                        $toHide.removeClass('show');

                        //b.设置scrollTop(必须放在显示之后)
                        scrollTop($toShow.attr('id'), false);

                        //延迟重排(延迟100ms在ios8上才有效果)
                        setTimeout(function () {
                            $mainbox.removeClass('reflow');//切换面板时强制重排一次
                        }, 100);

                        //如果是打开iframe页面的面板
                        $toHide.attr('id') === 'paneliframe' && ($toHide.html(''));

                        //隐藏时调用函数(放在靠后)
                        toHidePanel($toHide);
                    }, duration + 20);
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
            $.toggleSidebox(true);
        });
        //btn-offsidebox点击
        $doc.on('click', '.btn-offsidebox', function () {
            $.toggleSidebox(false);
        });

        //a标签点击事件切换panel
        var $iframe = $('#paneliframe');
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

        //初始化加载index
        $.loadPanel($.indexSelector);

        //加载指定panel
        var hash = location.hash;
        hash && setTimeout(function () {
            $.loadPanel(hash);
        }, 400);//加上一定ms数保证panel加载动画流畅

    });

})(this, $);
/*
 * carousel.js
 * 焦点图js
 */
(function (window, $) {

    $.fn.carousel = function (options) {
        $.fn.carousel.defaults = {
            //是否竖直方向滚动
            isVertical: false,
            //滑动阈值
            swipThreshold: 50,
            //是否自动轮播
            isAutoPlay: true,
            //轮播inter
            autoPlayInter: 8000,
            //轮播回调函数
            slideCallback: null,
            //是否显示title
            isShowTitle: true,
            //是否显示pager
            isShowPager: true
        };

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.carousel.defaults, options);

            //配置项
            var isVertical = opts.isVertical,
                swipThreshold = opts.swipThreshold,
                isAutoPlay = opts.isAutoPlay,
                autoPlayInter = opts.autoPlayInter,
                slideCallback = opts.slideCallback,
                isShowTitle = opts.isShowTitle,
                isShowPager = opts.isShowPager;

            //变量
            var $this = $(this),
                me = this,
                $wrap, wrapElStyle, $items, itemCount,
                $title, $pagers;

            //初始化函数
            function init() {
                $this.addClass('pi-carousel').html('<div class="pi-carousel-wrap">' + $this.html() + '</div>' + (isShowTitle ? '<div class="pi-carousel-title"></div>' : ''));

                $wrap = $this.find('.pi-carousel-wrap');
                wrapElStyle = $wrap[0].style;
                $items = $wrap.children('*');
                itemCount = $items.length;

                isVertical && $this.addClass('vertical');
                $title = $this.find('.pi-carousel-title');

                //pager
                var html = '';
                if (isShowPager) {
                    html += '<div class="pi-carousel-pager">';
                    for (var i = 0, len = itemCount; i < len; i++) {
                        html += '<span></span>';
                    }
                    html += '</div>';
                }
                $pagers = $this.append(html).find('.pi-carousel-pager span');

                //初始化事件
                initEvent();
            }

            //初始化事件函数
            function initEvent() {
                var width, height, inter, index = 0,
                    startX, startY,
                    swipSpan;

                //设置尺寸函数
                function setSize() {
                    width = $this.width();
                    height = $this.height();

                    //水平方向滚动
                    if (!isVertical) {
                        wrapElStyle.width = width * itemCount + 'px';
                        $items.css('width', width + 'px');
                    }
                    //竖直方向滚动
                    else {
                        wrapElStyle.height = height * itemCount + 'px';
                        $items.css('height', height + 'px');
                    }
                }

                //设置inter函数
                function setInter() {
                    isAutoPlay && (inter = setInterval(function () {
                        ++index === itemCount && (index = 0);
                        slide();
                    }, autoPlayInter));
                }

                //移动到函数
                function slide(swipSpan) {
                    var translate = -index * (isVertical ? height : width),
                        transform;

                    if (typeof swipSpan === 'number') {
                        //起点
                        if (index === 0 && swipSpan > 0) {
                            swipSpan /= 2;
                        }
                        //终点
                        if (index === itemCount - 1 && swipSpan < 0) {
                            swipSpan /= 2;
                        }
                        translate += swipSpan;
                    }
                    else {
                        //滚动回调函数
                        typeof slideCallback === 'function' && slideCallback(index);
                        //title
                        var title = $items.removeClass('current').eq(index).addClass('current').attr('data-title');
                        $title.removeClass('visible');
                        title && setTimeout(function () {
                            $title.addClass('visible').html(title);
                        }, 200);
                        //pager状态
                        $pagers.removeClass('selected').eq(index).addClass('selected');
                    }

                    transform = 'translate3d(' + (isVertical ? '0,' + translate + 'px,0' : translate + 'px,0,0') + ')';
                    $wrap.css({
                        '-webkit-transform': transform,
                        'transform': transform
                    });
                }


                //初始化
                //设置尺寸
                setSize();

                //暴露slideToIndex方法
                me.slideToIndex = function (i) {
                    index = i;
                    slide();
                };


                //触摸开始事件
                $this.on('touchstart', function (evt) {
                    var touch = evt.targetTouches[0];
                    //记录触摸开始位置
                    startX = touch.pageX;
                    startY = touch.pageY;
                    //重置swipSpan
                    swipSpan = 0;
                    //取消动画
                    $wrap.removeClass('transform');
                    //取消自动轮播
                    isAutoPlay && clearInterval(inter);
                });

                //触摸移动事件
                $this.on('touchmove', function (evt) {
                    var touch = evt.targetTouches[0],
                        swipSpanX = touch.pageX - startX,
                        swipSpanY = touch.pageY - startY;

                    //上下
                    if (isVertical) {
                        if (Math.abs(swipSpanY) > Math.abs(swipSpanX)) {
                            evt.preventDefault();
                            evt.stopPropagation();
                            slide(swipSpan = swipSpanY);
                        }
                    }
                    //左右
                    else {
                        if (Math.abs(swipSpanX) > Math.abs(swipSpanY)) {
                            evt.preventDefault();
                            evt.stopPropagation();
                            slide(swipSpan = swipSpanX);
                        }
                    }
                });

                //触摸结束事件
                $this.on('touchend', function (evt) {
                    //向右,下
                    if (swipSpan > swipThreshold) {
                        --index < 0 && (index = 0);
                    }
                    //向左,上
                    if (swipSpan < -swipThreshold) {
                        ++index === itemCount && (index = itemCount - 1);
                    }

                    //加上动画
                    $wrap.addClass('transform');

                    //滚动
                    swipSpan !== 0 && slide();

                    //自动轮播
                    setInter();
                }).trigger('touchend');

                //屏幕尺寸改变事件
                window.addEventListener('resize', function () {
                    var w = $this.width();
                    if (w > 0) {
                        setSize();
                        slide(0);
                    }
                }, false);

            }


            //初始化
            init();

        });

    };

})(this, $);
/*
 * customalert.js
 * 自定义提示框js
 */
(function (window, $) {

    //1.变量
    var $title, $content,
        $btnOk, $btnCancel,
        btnOkClick, btnCancelClick,
        onShow, onHide,
        document = window.document,
        $doc = $(document),
        $customalert = $('#customalert');


    //2.初始化
    (function () {
        if ($customalert.length === 0) {
            $customalert = $('<div id="customalert">' +
            '<div class="box">' +
            '<h1 id="customalert-title">提示</h1>' +
            '<p id="customalert-content">是否转到登陆</p>' +
            '<a id="customalert-btnok" class="btn">确定</a>' +
            '<a id="customalert-btncancel" class="btn">关闭</a>' +
            '</div>' +
            '</div>');
            //添加html元素
            $(document.body).append($customalert);
        }

        $title = $('#customalert-title');
        $content = $('#customalert-content');
        $btnOk = $('#customalert-btnok');
        $btnCancel = $('#customalert-btncancel');
    })();


    //3.事件
    //确定按钮
    $doc.on('click', '#customalert-btnok', function () {
        //隐藏
        $customalert.removeClass('visible');
        typeof onHide === 'function' && onHide();
        typeof btnOkClick == 'function' && btnOkClick();
    });
    //关闭按钮
    $doc.on('click', '#customalert-btncancel', function () {
        //隐藏
        $customalert.removeClass('visible');
        typeof onHide === 'function' && onHide();
        typeof btnCancelClick === 'function' && btnCancelClick();
    });


    //4.扩展属性
    $.customalert = function (options) {
        options = options || {};

        //配置项
        var opts = $.extend({}, $.customalert.defaults, options);

        var title = opts.title,
            content = opts.content,
            btnOkText = opts.btnOkText,
            btnCancelText = opts.btnCancelText,
            isAlert = opts.isAlert;

        btnOkClick = opts.btnOkClick;
        btnCancelClick = opts.btnCancelClick;
        onShow = opts.onShow;
        onHide = opts.onHide;

        //是否是alert(只显示确定按钮)
        if (isAlert) {
            $customalert.addClass('alert');
        }
        else {
            $customalert.removeClass('alert');
        }

        //设置内容
        title && $title.html(title);
        content && $content.html(content);
        btnOkText && $btnOk.text(btnOkText);
        btnCancelText && $btnCancel.text(btnCancelText);

        //显示
        $customalert.addClass('visible');
        typeof onShow === 'function' && onShow();
    };

    //默认配置
    $.customalert.defaults = {
        title: '提示',
        content: '内容',
        btnOkText: '确定',
        btnOkClick: null,
        btnCancelText: '取消',
        btnCancelClick: null,
        isAlert: true,
        onShow: null,
        onHide: null
    };

})(this, $);
/*
 * flip.js
 * 3d翻转效果js
 * */
(function (window, $) {

    $.fn.flip = function (options) {
        $.fn.flip.defaults = {
            //是否竖直方向滚动
            isVertical: false,
            //滑动阈值
            swipThreshold: 40,
            //比率
            rate: 1.3,
            //轮播回调函数
            slideCallback: null
        };

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.flip.defaults, options);

            //配置项
            var isVertical = opts.isVertical,
                swipThreshold = opts.swipThreshold,
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
                    duration = parseFloat($items.css('transition-duration') || $items.css('-webkit-transition-duration')) * 1000,
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
                                    '-webkit-transform': transform,
                                    'transform': transform
                                });
                            }
                            else {
                                transform = isVertical ? 'rotate3d(1,0,0,' + (180 - swipSpan) + 'deg)' : 'rotate3d(0,1,0,' + -(180 - swipSpan) + 'deg)';
                                $this.css({
                                    '-webkit-transform': transform,
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
                                    '-webkit-transform': transform,
                                    'transform': transform
                                });
                            }
                            else {
                                transform = isVertical ? 'rotate3d(1,0,0,' + -(swipSpan ? 180 : -180) + 'deg)' : 'rotate3d(0,1,0,' + (swipSpan ? 180 : -180) + 'deg)';
                                $this.removeClass('visible').css({
                                    '-webkit-transform': transform,
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
                    if (!isAnimating) {
                        var touch = evt.targetTouches[0];
                        //记录触摸开始位置
                        startX = touch.pageX;
                        startY = touch.pageY;
                        //重置swipSpan
                        swipSpan = 0;

                        //去掉动画
                        $items.addClass('notrans');
                    }
                });

                //触摸移动事件
                $this.on('touchmove', function (evt) {
                    var touch = evt.targetTouches[0],
                        swipSpanX = touch.pageX - startX,
                        swipSpanY = touch.pageY - startY;

                    //上下
                    if (isVertical && Math.abs(swipSpanX) < Math.abs(swipSpanY)) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        !isAnimating && rotate(swipSpan = swipSpanY / rate);
                    }
                    //左右
                    if (!isVertical && Math.abs(swipSpanX) > Math.abs(swipSpanY)) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        !isAnimating && rotate(swipSpan = swipSpanX / rate);
                    }
                });

                //触摸结束事件
                $this.on('touchend', function (evt) {
                    if (!isAnimating) {
                        //达到滚动阈值
                        if (Math.abs(swipSpan) > swipThreshold) {
                            if (swipSpan > 0 && --index === -1) {
                                index = itemCount - 1;
                            }
                            if (swipSpan < 0 && ++index === itemCount) {
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

})(this, $);
/*
 * picpager.js
 * 相册js
 * */
(function (window, $) {

    $.fn.picpager = function (options) {
        $.fn.picpager.defaults = {
            //图片数据
            imgData: null,
            //表示图片地址属性名
            imgAttrName: null,
            //滑动阈值
            swipThreshold: 40,
            //轮播回调函数
            slideCallback: null
        };

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.picpager.defaults, options);

            //配置项
            var imgData = opts.imgData,
                imgAttrName = opts.imgAttrName,
                swipThreshold = opts.swipThreshold,
                slideCallback = opts.slideCallback;

            //变量
            var $this = $(this),
                me = this,
                $pics, itemCount = imgData.length;

            //初始化函数
            function init() {
                $this.addClass('pi-picpager').html('<div class="pi-picpager-wrap"><div class="pi-picpager-pic"></div><div class="pi-picpager-pic"></div><div class="pi-picpager-pic"></div></div>');
                $pics = $this.find('.pi-picpager-pic');

                //初始化事件
                initEvent();
            }

            //初始化事件函数
            function initEvent() {
                var width = $this.width(),
                    index = 0,
                    startX, startY,
                    swipSpan, isAnimating,
                    duration = parseFloat($pics.css('transition-duration') || $pics.css('-webkit-transition-duration')) * 1000;


                //移动到函数
                function slide(direction) {
                    //加上动画
                    $pics.removeClass('notrans');

                    //判断滚动
                    switch (direction) {
                        //向右
                        case 1:
                        //向左
                        case -1:
                        {
                            //动画
                            isAnimating = true;
                            var transform = 'translate3d(' + (direction === 1 ? '' : '-') + width + 'px,0,0)';
                            $pics.css({
                                '-webkit-transform': transform,
                                'transform': transform
                            });

                            //复位操作,更新图片
                            setTimeout(function () {
                                $pics.each(function (i) {
                                    loadImg($(this).addClass('notrans').css({
                                        '-webkit-transform': 'translate3d(0,0,0)',
                                        'transform': 'translate3d(0,0,0)'
                                    }), index + i - 1);
                                });
                                isAnimating = false;
                            }, duration + 100);//加上一定ms数,可以减缓部分浏览器由于复位操作而引起的闪烁
                            break;
                        }
                        default:
                        {
                            $pics.css({
                                '-webkit-transform': 'translate3d(0,0,0)',
                                'transform': 'translate3d(0,0,0)'
                            });
                        }
                    }

                    //滚动回调函数
                    typeof slideCallback === 'function' && slideCallback(index, direction);

                }


                //加载图片函数
                function loadImg($this, i) {
                    var item = imgData[i];
                    $this.css({
                        'background-image': item ? 'url(' + (imgAttrName ? item[imgAttrName] : item) + ')' : 'none'
                    });
                }

                //初始化加载图片
                $pics.each(function (i) {
                    loadImg($(this), i - 1);
                });


                //暴露slideToIndex方法
                me.slideToIndex = function (i) {
                    var direction;
                    //如不为数字或者超出范围
                    if (typeof i !== 'number' || i < 0 || i >= itemCount || i === index) {
                        return;
                    }

                    //向左
                    if (i > index) {
                        direction = -1;
                        loadImg($pics.eq(2), i);
                    }
                    //向右
                    else {
                        direction = 1;
                        loadImg($pics.eq(0), i);
                    }

                    //做动画
                    index = i;
                    slide(direction);
                };

                //暴露addItem方法
                me.addItem = function (item) {
                    //如为数组
                    if ($.isArray(item)) {
                        imgData = imgData.concat(item);
                    }
                    else {
                        imgData.push(item);
                    }
                    itemCount = imgData.length;
                };


                //触摸开始事件
                $this.on('touchstart', function (evt) {
                    if (!isAnimating) {
                        var touch = evt.targetTouches[0];
                        //记录触摸开始位置
                        startX = touch.pageX;
                        startY = touch.pageY;
                        //重置swipSpan
                        swipSpan = 0;
                        //取消动画
                        $pics.addClass('notrans');
                    }
                });

                //触摸移动事件
                $this.on('touchmove', function (evt) {

                    if (!isAnimating) {
                        var touch = evt.targetTouches[0],
                            swipSpanX = touch.pageX - startX,
                            swipSpanY = touch.pageY - startY;

                        //左右
                        if (Math.abs(swipSpanX) > Math.abs(swipSpanY)) {
                            evt.preventDefault();
                            evt.stopPropagation();

                            //第一张图
                            if (index === 0 && swipSpanX > 0) {
                                swipSpanX /= 2;
                            }
                            //最后一张图
                            if (index === itemCount - 1 && swipSpanX < 0) {
                                swipSpanX /= 2;
                            }

                            var transform = 'translate3d(' + (swipSpan = swipSpanX) + 'px,0,0)';
                            $pics.css({
                                '-webkit-transform': transform,
                                'transform': transform
                            });
                        }
                    }
                    else {
                        evt.preventDefault();
                        evt.stopPropagation();
                    }
                });

                //触摸结束事件
                $this.on('touchend', function (evt) {
                    if (!isAnimating) {
                        var direction;
                        //向右
                        if (swipSpan > swipThreshold) {
                            --index < 0 ? index = 0 : direction = 1;
                        }
                        //向左
                        if (swipSpan < -swipThreshold) {
                            ++index === itemCount ? index = itemCount - 1 : direction = -1;
                        }

                        //滚动
                        swipSpan !== 0 && slide(direction);
                    }
                }).trigger('touchend');

                //屏幕尺寸改变事件
                window.addEventListener('resize', function () {
                    var w = $this.width();
                    w > 0 && (width = w);
                }, false);

            }


            //初始化
            init();

        });

    };

})(this, $);
/*
 * scratchcard.js
 * 刮刮卡js
 * */
(function (window, $) {

    $.fn.scratchcard = function (options) {
        $.fn.scratchcard.deflunt = {
            //画笔大小
            fineness: 15,
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
            scale: 2
        };

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

})(this, $);
/*
 * scroll.js
 * 自定义滚动js
 * */
(function (window, $) {

    $.fn.scroll = function (options) {
        $.fn.scroll.defaults = {
            //是否竖直方向滚动
            isVertical: false,
            //滚动率
            rate: 400,
            //时间间隙阈值
            timeSpanThreshold: 300,
            //滚动最大值
            maxScroll: 400,
            //安卓响应率
            androidRate: 2,
            //是否调整点击元素居中
            isAdjust: false
        };

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.scroll.defaults, options);

            //配置项
            var isVertical = opts.isVertical,
                rate = opts.rate,
                timeSpanThreshold = opts.timeSpanThreshold,
                maxScroll = opts.maxScroll,
                androidRate = opts.androidRate,
                isAdjust = opts.isAdjust;

            //变量
            var $this = $(this),
                $items = $this.children('*'),
                isAndroid = /(android)/i.test(window.navigator.userAgent);


            //初始化函数
            function init() {
                $items.addClass('pi-scroll-item');

                //初始化事件
                initEvent();
            }


            //初始化事件函数
            function initEvent() {
                //touchstart起点
                var startX, startY,
                //touch时间点
                    startTime, endTime,
                //move的距离
                    swipSpan,
                //作动画的值
                    translateVal = 0,
                //当然translate值
                    currentVal,
                //可滚动的值
                    scrollVal;

                //初始化可滚动的值函数
                function initScrollVal() {
                    //item包含margin的尺寸
                    var itemsOuterVal = isVertical ?
                        $items.height() + parseFloat($items.css('margin-top')) + parseFloat($items.css('margin-bottom')) :
                        $items.width() + parseFloat($items.css('margin-left')) + parseFloat($items.css('margin-right')),
                    //this不包含padding的尺寸
                        thisInnerVal = isVertical ?
                        $this.height() - parseFloat($this.css('padding-top')) - parseFloat($this.css('padding-bottom')) :
                        $this.width() - parseFloat($this.css('padding-left')) - parseFloat($this.css('padding-right'));

                    //记录可滚动的值
                    scrollVal = itemsOuterVal - thisInnerVal;
                }

                initScrollVal();

                //移动到函数
                function slide(x) {
                    //起点
                    if (x > 0) {
                        x /= 2;
                    }
                    //终点
                    if (-x > scrollVal) {
                        x = x + (-x - scrollVal) / 2;
                    }

                    var transform = 'translate3d(' + (isVertical ? '0,' + (translateVal = x) + 'px,0' : (translateVal = x) + 'px,0,0') + ')';
                    $items.css({
                        '-webkit-transform': transform,
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
                    var touch = evt.targetTouches[0];
                    //记录开始时间
                    startTime = evt.timeStamp;
                    //记录触摸开始位置
                    startX = touch.pageX;
                    startY = touch.pageY;
                    //重置swipSpan
                    swipSpan = 0;
                    //记录x
                    currentVal = translateVal;

                    //不作动画
                    $items.addClass('notrans');
                });

                //触摸移动事件
                $this.on('touchmove', function (evt) {
                    var touch = evt.targetTouches[0],
                        swipSpanX = touch.pageX - startX,
                        swipSpanY = touch.pageY - startY;

                    //上下
                    if (isVertical && Math.abs(swipSpanX) < Math.abs(swipSpanY)) {
                        evt.preventDefault();
                        evt.stopPropagation();

                        slide(currentVal + (swipSpan = swipSpanY));
                    }
                    //左右
                    if (!isVertical && Math.abs(swipSpanX) > Math.abs(swipSpanY)) {
                        evt.preventDefault();
                        evt.stopPropagation();

                        slide(currentVal + (swipSpan = swipSpanX));
                    }
                });

                //触摸结束事件
                $this.on('touchend', function (evt) {
                    //记录结束时间
                    endTime = evt.timeStamp;

                    //计算校正值(更加拟物化)
                    var timeSpan = endTime - startTime,
                    //安卓的touch响应时间较长故除以一定比率
                        swipSpanAdjust = timeSpan > timeSpanThreshold ? 0 : swipSpan / (isAndroid ? timeSpan /= androidRate : timeSpan),
                        span = Math.abs(swipSpanAdjust) * rate;

                    //设置最大滚动值
                    span > maxScroll && (span = maxScroll);

                    //作动画
                    $items.removeClass('notrans');

                    if (swipSpan < 0) {
                        -(translateVal - span) < scrollVal ? slide(translateVal - span) : slide(-scrollVal);
                    }
                    else if (swipSpan > 0) {
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
                    w > 0 && initScrollVal();
                }, false);
            }


            //初始化
            init();

        });

    };

})(this, $);
/*
 * swatchbook.js
 * 扇形特效js
 * */
(function (window, $) {

    $.fn.swatchbook = function (options) {
        $.fn.swatchbook.defaults = {
            //打开的index
            centerIdx: 6,
            //item之间的角度(center右边的item)
            angleInc: 8,
            //打开的item与右边item之间的角度
            proximity: 45,
            //item之间的角度(center左边的item)
            neighbor: 4,
            //初始化时是否关闭
            initIsClosed: false,
            //能打开和关闭的index
            closeIdx: -1,
            //打开项
            openAt: -1,
            //点选状态下再点击时触发函数
            selectCallback: null,
            //打开延迟
            openDelay: 25
        };

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.swatchbook.defaults, options);

            //配置项
            var centerIdx = opts.centerIdx,
                angleInc = opts.angleInc,
                proximity = opts.proximity,
                neighbor = opts.neighbor,
                initIsClosed = opts.initIsClosed,
                closeIdx = opts.closeIdx,
                openAt = opts.openAt,
                selectCallback = opts.selectCallback,
                openDelay = opts.openDelay;

            //变量
            var $this = $(this),
                $items = $this.addClass('sb-container').children('*'),
                itemsCount = $items.length,
                currentIdx = -1,
                cache = [],
                isClosed;

            //初始化函数
            function init() {
                //兼容安卓2.x
                $.isAndroid2 && $this.css({
                    '-webkit-backface-visibility': 'visible',
                    'backface-visibility': 'visible'
                });

                if (!initIsClosed) {
                    center(centerIdx);
                }
                else {
                    isClosed = true;
                }

                if (openAt >= 0 && openAt < itemsCount) {
                    openItem($items.eq(openAt));
                }

                initEvents();
            }

            function center(idx) {
                $items.each(function (i) {
                    var $this = $(this),
                        transformStr = 'rotateZ(' + (angleInc * (i - idx)) + 'deg)';

                    //设定一定延时,防止计算能力差的浏览器(ucweb)打不开swatchbook
                    setTimeout(function () {
                        $this.css({
                            '-webkit-transform': transformStr,
                            'transform': transformStr
                        });
                    }, i * openDelay);
                });
            }

            function openItem($item) {
                var itemIdx = $item.index();
                if (itemIdx !== currentIdx) {
                    $items.removeClass('selected');
                    if (closeIdx !== -1 && itemIdx === closeIdx) {
                        currentIdx = -1;
                        openClose();
                    }
                    else {
                        currentIdx = itemIdx;
                        $item.css({
                            '-webkit-transform': 'rotateZ(0deg)',
                            'transform': 'rotateZ(0deg)'
                        }).addClass('selected');
                        rotateSiblings($item, itemIdx);
                    }
                }
                else if (itemIdx === currentIdx && typeof selectCallback === 'function') {
                    selectCallback(itemIdx);
                }
            }

            function openClose() {
                if (isClosed) {
                    center(centerIdx);
                }
                else {
                    $items.css({
                        '-webkit-transform': 'rotateZ(0deg)',
                        'transform': 'rotateZ(0deg)'
                    });
                }
                isClosed = !isClosed;
            }

            function rotateSiblings($item, itemIdx) {
                var $cached = cache[itemIdx],
                    $siblings;

                if ($cached) {
                    $siblings = $cached;
                }
                else {
                    $siblings = $item.siblings();
                    cache[itemIdx] = $siblings;
                }

                $siblings.each(function (i) {
                    var rotateVal = i < itemIdx ?
                    angleInc * (i - itemIdx) : i - itemIdx === 1 ?
                        proximity : proximity + (i - itemIdx - 1) * neighbor;
                    var transformStr = 'rotateZ(' + rotateVal + 'deg)';

                    $(this).css({
                        '-webkit-transform': transformStr,
                        'transform': transformStr
                    });
                });
            }

            //初始化事件函数
            function initEvents() {
                $items.on('click', function () {
                    openItem($(this));
                });
            }


            //初始化
            init();

        });
    };

})(this, $);
/*
 * turntable.js
 * 转盘抽奖js
 * */
(function (window, $) {

    $.fn.turntable = function (options) {
        $.fn.turntable.defaults = {
            //奖品格数
            count: 12,
            //旋转度数
            rotateDeg: 3600,
            //旋转时长
            duration: 7000,
            //动画fx
            timeFx: 'cubic-bezier(0.42,0,0.25,1)',
            //校正值
            offset: 0
        };

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
                $pointer = $('<div class="pi-turntable-pointer"></div>');
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
                            '-webkit-transition': '-webkit-transform ' + transition,
                            'transition': 'transform ' + transition,
                            '-webkit-transform': transform,
                            'transform': transform
                        });

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

})(this, $);
(function (window, $) {

    //文档jq对象
    var $doc = $(window.document),
    //全局变量
        global = window.Global = {},
        load = {}, unload = {};

    //alert方法
    window.alert = function alert(str) {
        $.customalert({
            content: str
        });
    };


    //面板显示回调函数
    $.panelLoaded = function ($this, isInit) {
        var loadfn = load[$this.attr('id')];
        $.isFunction(loadfn) && loadfn($this, isInit);
    };

    //面板隐藏回调函数
    $.panelUnloaded = function ($this) {
        var unloadfn = unload[$this.attr('id')];
        $.isFunction(unloadfn) && unloadfn($this);
    };


    //焦点图
    load.panelcarousel = (function () {

        return function ($this, isInit) {
            if (isInit) {
                $('.carousel').each(function () {
                    var len = this.getAttribute('data-len'),
                        part = this.getAttribute('data-part'),
                        html = '';

                    for (var i = 0; i < len; i++) {
                        html += '<a style="background: url(images/' + (part ? part + '/' : '') + '' + i + '.jpg) center center no-repeat; background-size: cover;" data-title="焦点图示例 ' + (i + 1) + '"></a>';
                    }

                    $(this).html(html).carousel({
                        isVertical: this.getAttribute('data-isvertical') === '1'
                    });
                });

                $('#img_car').carousel();
            }
        };

    })();


    //3d旋转切换
    load.panelflip = (function () {

        return function ($this, isInit) {
            if (isInit) {
                $('.flip').each(function () {
                    var len = this.getAttribute('data-len'),
                        part = this.getAttribute('data-part'),
                        html = '';

                    for (var i = 0; i < len; i++) {
                        html += '<a><p style="background: url(images/' + (part ? part + '/' : '') + '' + i + '.jpg) center center no-repeat; background-size: cover;" data-title="焦点图示例 ' + (i + 1) + '"></p></a>';
                    }

                    $(this).html(html).flip({
                        isVertical: this.getAttribute('data-isvertical') === '1'
                    });
                });
            }
        };

    })();


    //相册功能
    load.panelpicpager = (function () {

        return function ($this, isInit) {
            if (isInit) {

                $.jsonp('http://img.gd.sohu.com/static/v1/jtool.js', function () {
                    var page = 1,
                        perpage = 10;

                    var proxy = jtool.proxy;

                    //请求数据
                    proxy.pushData({
                        url: 'http://app.gd.sohu.com/minisite/xtep/20140530/get.php?act=list&page=' + page + '&perpage=' + perpage + '&order=' + 0 + '&code=aa1c9153608a7755b7c20e97c0eade27',
                        success: function (rs) {
                            var $picpager = $('.picpager').picpager({
                                imgData: rs.data.detail,
                                imgAttrName: 'image',
                                slideCallback: function (index) {
                                    if (index + 1 === page * 10) {
                                        page++;

                                        //请求数据
                                        proxy.pushData({
                                            url: 'http://app.gd.sohu.com/minisite/xtep/20140530/get.php?act=list&page=' + page + '&perpage=' + perpage + '&order=' + 0 + '&code=aa1c9153608a7755b7c20e97c0eade27',
                                            success: function (rs) {
                                                $picpager[0].addItem(rs.data.detail);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });

                });
            }
        };

    })();


    //自定义滚动
    load.panelscroll = (function () {

        return function ($this, isInit) {
            if (isInit) {
                $('.scroll').each(function () {
                    $(this).scroll({
                        isVertical: this.getAttribute('data-isvertical') === '1'
                    });
                });
            }
        };

    })();


    //扇形特效
    load.panelswatchbook = (function () {

        return function ($this, isInit) {
            if (isInit) {
                $('.swatchbook').each(function () {
                    $(this).swatchbook({
                        angleInc: 25,
                        neighbor: 15,
                        proximity: 80,
                        initIsClosed: true,
                        closeIdx: 12,
                        selectCallback: function (index) {
                            console.log(index);
                        }
                    });
                });
            }
        };

    })();


    //刮刮卡
    load.panelscratchcard = (function () {

        return function ($this, isInit) {
            if (isInit) {
                $('.scratchcard').each(function () {
                    $(this).scratchcard({
                        text: '刮开有奖',
                        imgSrc: 'images/3.jpg'
                    });
                });
            }
        };

    })();


    //转盘抽奖
    load.panelturntable = (function () {

        return function ($this, isInit) {
            if (isInit) {
                var turntableEl = $('#turntable').turntable({
                    count: 10
                })[0];

                $doc.on('click', '#turntable_start', function () {
                    var index = parseInt(Math.random() * 10);
                    turntableEl.turnToIndex(index, function () {
                        alert(index + 1);
                    });
                });
            }
        };

    })();

})(this, $);