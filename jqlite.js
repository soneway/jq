//jqlite.js
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
    cssPrefix = '-webkit-',
    classRegCache = {},
    RegExp = window.RegExp,
    bodyEl = document.body,
    computedStyleCache = {};

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
    if (sel && sel.length > 0) {
      return nodesToThis(sel, this);
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
  elProto.matchesSelector || (elProto.matchesSelector = elProto.webkitMatchesSelector);

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
     * 取第i个元素
     * @param {number} i 索引值
     * @returns {$init} 选择后的$对象
     */
    eq: function (i) {
      return $(this[i]);
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
     * @returns {number} 索引值
     */
    index: function () {
      return indexOf.call(this[0].parentNode.children, this[0]);
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
     * 元素属性取值/赋值
     * @param {Object|string} key 属性|属性对象
     * @param {string} val 属性值
     * @returns {$init|string} $对象本身|属性值
     */
    attr: function (key, val) {
      return this.prop(key, val, true);
    },

    /**
     * 元素对象属性取值/赋值
     * @param {Object|string} key 属性|属性对象
     * @param {string} val 属性值
     * @param {boolean} isAttr 属性值
     * @returns {$init|string} $对象本身|属性值
     */
    prop: function (key, val, isAttr) {
      //$().prop(key)
      if (typeof key === 'string' && val === undefined) {
        return isAttr ? this[0].getAttribute(key) : this[0][key];
      }
      return this.forEach(function (el) {
        //$().prop(obj)
        if ($.isObject(key)) {
          for (var p in key) {
            isAttr ? el.setAttribute(p, key[p]) : el[p] = key[p];
          }
          return;
        }
        //$().prop(key,val)
        isAttr ? el.setAttribute(key, val) : el[key] = val;
      });
    },

    /**
     * 元素移除属性
     * @param {string} key 待移除的属性
     * @returns {$init} $对象本身
     */
    removeAttr: function (key) {
      return this.forEach(function (el) {
        el.removeAttribute(key);
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
        var style = el.style;
        if (style.display === 'none') {
          return style.display = null;
        }
        style.display = getInitialStyle(el.tagName, 'display');
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
     * 元素添加class
     * @param {string} name css类名
     * @returns {$init} $对象本身
     */
    addClass: function (name) {
      return this.forEach(function (el) {
        var oldClass = el.className;
        !classReg(name).test(oldClass) && (el.className += (oldClass ? ' ' : '') + name);
      });
    },

    /**
     * 元素移除class
     * @param {string} name css类名
     * @returns {$init} 返回$对象本身
     */
    removeClass: function (name) {
      return this.forEach(function (el) {
        el.className = name === undefined ? '' : el.className.replace(classReg(name), ' ').trim();
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
   * $实例属性扩展函数
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
    el.addEventListener(type, sel === undefined ? fn : function (evt) {
      var matchEl = $(evt.target).closest(sel, el)[0];
      matchEl && fn.call(matchEl, evt);
    }, false);
  }

  /**
   * 移除事件函数
   * @param {Node} el 解绑事件的元素
   * @param {string} type 事件类型
   * @param {Function} fn 事件响应函数
   * @ignore
   */
  function removeEvent(el, type, fn) {
    el.removeEventListener(type, fn, false);
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
     * @param {string} sel 选择器
     * @param {Function} fn 事件响应函数
     * @returns {$init} $对象本身
     */
    on: function (type, sel, fn) {
      return this.forEach(function (el) {
        typeof sel === 'function' ? addEvent(el, type, sel) : addEvent(el, type, fn, sel);
      });
    },

    /**
     * 元素解绑事件
     * @param {string} type 事件类型
     * @param {Function} fn 事件响应函数
     * @returns {$init} $对象本身
     */
    off: function (type, fn) {
      return this.forEach(function (el) {
        removeEvent(el, type, fn);
      });
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


  //CommonJS
  if (typeof exports === 'object') {
    return module.exports = $;
  }

  //添加到全局变量
  window.jqlite = window.$ = $;

})(window);