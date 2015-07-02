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
    window.soneway = window.$ = $;

})(this);