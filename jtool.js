(function (window) {
    //文档对象
    var document = window.document,
    //location
        location = window.location;

    //是否为函数
    function isFunction(fn) {
        return typeof fn === 'function';
    }

    //显示信息函数
    function showMsg(o, msgEl) {
        msgEl ? (msgEl.innerHTML = o) : alert(o);
    }

    //合并配置项函数
    function mergeOpts(opts, defaults) {
        //合并
        for (var p in defaults) {
            !opts.hasOwnProperty(p) && (opts[p] = defaults[p]);
        }
    }

    //异步加载js函数
    var jsonp = (function () {
        var headEl = document.getElementsByTagName('head')[0];

        return function (url, fn) {
            //是否js文件
            var isJs = /(\.js)$/.test(url),
                script = document.createElement('script');

            script.type = 'text/javascript';
            script.onload = function () {
                isFunction(fn) && fn();
                !isJs && headEl.removeChild(script);
            };
            script.src = url;
            headEl.appendChild(script);
        };
    })();


    //工具类属性或方法
    var jtool = (function () {
        var jtool,
            guid = 0;

        //pv监测
        function pvCheck(tab) {
            var url = 'http://js.app.gd.sohu.com:8080/pv.gif?',
                host = location.host,
                href = location.href,
                referrer = document.referrer;

            referrer.length === 0 && (referrer = 'null');
            href = href + '&tab=' + encodeURIComponent(tab);
            url += (host + '|' + href + '|' + referrer);

            jsonp(url);
        }

        //获取参数
        function getQueryString(key) {
            key = key.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');

            var regex = new RegExp('[\\?&]' + key + '=([^&#]*)'),
                qs = regex.exec(location.href);

            return (qs == null ? '' : qs[1]);
        }

        //表单验证
        function formValid(opts) {
            var $items,
                $context = opts.$context,
                msgEl = opts.msgEl,
                rs = {
                    status: 1,
                    data  : {}
                },
                data = rs.data;

            if (!($context && $context.html && $context.length > 0)) {
                console.log('context为空,或不为jq对象,或jq对象为空');
                return {
                    status: -1
                };
            }

            //遍历输入项
            $items = $context.find('input,textarea,select').not('.not');
            for (var i = 0, len = $items.length; i < len; i++) {
                var $item = $items.eq(i),
                    item = $item[0],
                    field = $item.attr('data-field') || item.id,
                    msg = $item.attr('data-msg') || field,
                    itemValue = item.value;

                //非空验证
                if ($item.hasClass('notnull') && itemValue === '') {
                    showMsg(item.nodeName.toLowerCase() === 'select' ? ('请选择' + msg) : (msg + '不能为空'), msgEl);
                    rs.status = -1;
                    break;
                }

                //电话验证
                if (field === 'tel') {
                    var patrnPhone = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
                        patrnMobile = /^1[358]\d{9}$/;

                    if (!(patrnPhone.exec(itemValue) || patrnMobile.exec(itemValue))) {
                        showMsg(msg + '格式无效', msgEl);
                        rs.status = -1;
                        break;
                    }
                }

                //email验证
                if (field === 'email') {
                    var patrnEmail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

                    if (!patrnEmail.exec(itemValue)) {
                        rs.status = -1;
                        showMsg(msg + '格式无效', msgEl);
                        break;
                    }
                }

                data[field] = itemValue;
            }
            return rs;
        }

        //其他平台登陆
        function otherLogin(provider, ru) {
            location.href = 'http://passport.sohu.com/openlogin/request.action?provider=' + provider + '&appid=1030&hun=1&ru=' + (ru || location.href);
        }


        //初始化对象
        jtool = {
            //1.info
            constructor: 'jtool',
            ver        : '1.0',

            //2.属性

            //3.方法
            //是否为函数
            isFunction    : isFunction,
            //显示信息函数
            showMsg       : showMsg,
            //合并配置项函数
            mergeOpts     : mergeOpts,
            //跨域请求
            jsonp         : jsonp,
            //pv监测
            pvCheck       : pvCheck,
            //获取参数
            getQueryString: getQueryString,
            //表单验证
            formValid     : formValid,
            //其他平台登陆
            otherLogin    : otherLogin,
            //获取guid函数
            getGuid       : function () {
                return guid++;
            }
        };

        //返回对象
        return jtool;

    })();


    //数据请求类
    jtool.proxy = (function () {
        var proxy, pushData;

        //初始化对象
        proxy = {
            //状态对应信息
            statusMsg: {
                100: '正常',
                101: '执行异常', 102: '参数有误',
                201: '只能通过内部访问', 202: '接口关闭',
                301: '接口授权码有误', 302: '接口过期',
                401: '当前用户未登录访问', 402: '当前用户未授权访问',
                501: '电话号码已存在', 502: '投票次数已用完'
            },
            //默认配置
            defaults : {
                method   : 'get',
                isShowMsg: false,
                ru       : location.protocol + '//' + location.host + '/proxy/callback.html'
            }
        };

        //提交数据函数
        pushData = (function () {
            var statusMsg = proxy.statusMsg;

            //get
            function get(opts) {
                //请求地址
                var url = opts.url,
                //传输数据
                    data = opts.data,
                //是否显示信息
                    isShowMsg = opts.isShowMsg,
                //显示消息的元素
                    msgEl = opts.msgEl,
                //正常返回时回调函数
                    success = opts.success,
                //异常返回时回调函数
                    error = opts.error,
                //回调函数(成功或者失败都调用)
                    callback = opts.callback,
                //接口验证标识
                    code = opts.code,
                //uid
                    uid = jtool.getGuid(),
                //接收结果的全局变量名
                    rsName = 'jtoolrs' + uid;

                //添加vname参数
                url += (url.indexOf('?') === -1 ? '?' : '&') + 'vname=' + rsName;

                //将数据拼接成参数
                for (var p in data) {
                    url += '&' + p + '=' + encodeURIComponent(data[p]);
                }

                //添加code参数
                code && (url += '&code=' + code);

                //请求数据
                jsonp(url, function () {
                    var rs = window[rsName],
                        status = +rs.status;

                    //判断返回结果
                    switch (status) {
                        //正常返回
                        case 100:
                        {
                            isFunction(success) && success(rs);
                            break;
                        }
                        //其他情况
                        default:
                        {
                            isShowMsg && showMsg(statusMsg[status], msgEl);
                            isFunction(error) && error(rs);
                        }
                    }
                    //回调
                    isFunction(callback) && callback(rs);
                    //请求完成后触发
                    var onEnd = opts.onEnd;
                    isFunction(onEnd) && onEnd();

                    //释放全局变量
                    try {
                        window[rsName] = null;
                        delete window[rsName];
                    }
                    catch (e) {
                    }
                });
            }

            //post
            function post(opts) {
                //请求地址
                var url = opts.url,
                //传输数据
                    data = opts.data,
                //是否显示信息
                    isShowMsg = opts.isShowMsg,
                //显示消息的元素
                    msgEl = opts.msgEl,
                //正常返回时回调函数
                    success = opts.success,
                //异常返回时回调函数
                    error = opts.error,
                //回调函数(成功或者失败都调用)
                    callback = opts.callback,
                //接口验证标识
                    code = opts.code,
                //处理后回路路径
                    ru = opts.ru,
                //form元素id
                    formId = opts.formId,
                //uid
                    uid = jtool.getGuid(),
                //回调函数名
                    callbackName = 'jtoolcb' + uid,
                //iframe元素id
                    ifrId = 'jtoolifr' + uid,
                //iframe元素
                    ifrEl,
                //form元素
                    formEl = formId ? document.getElementById(formId) : document.createElement('form'),
                //body元素
                    body = document.body;


                //添加ru的callback参数
                ru += (ru.indexOf('?') === -1 ? '?' : '&') + 'callback=' + callbackName;

                //添加ru参数
                url += (url.indexOf('?') === -1 ? '?' : '&') + 'ru=' + ru;

                //添加code参数
                code && (url += '&code=' + code);

                //iframe
                ifrEl = document.createElement('iframe');
                ifrEl.id = ifrId;
                ifrEl.name = ifrId;
                ifrEl.style.display = 'none';
                //添加dom
                body.appendChild(ifrEl);

                //form
                formEl.action = url;
                formEl.method = 'post';
                formEl.target = ifrId;
                !formId && (formEl.style.display = 'none');

                //遍历data,并加到form表单域
                for (var p in data) {
                    if (data.hasOwnProperty(p)) {
                        var txtEl = document.createElement('input');

                        txtEl.type = 'hidden';
                        txtEl.name = p;
                        txtEl.value = data[p];
                        formEl.appendChild(txtEl);
                    }
                }

                //添加dom
                !formId && body.appendChild(formEl);//必须将form添加到html里,否则在ie里将出现"无操作权限"
                //提交
                formEl.submit();

                //回调函数
                window[callbackName] = function (rs) {
                    var status = +rs.status;
                    switch (status) {
                        //正常返回
                        case 100:
                        {
                            isFunction(success) && success(rs);
                            break;
                        }
                        //特殊状态901
                        case 901:
                        {
                            setTimeout(function () {
                                post(opts);
                            }, 50);
                            break;
                        }
                        //其他情况
                        default:
                        {
                            isShowMsg && showMsg(statusMsg[status], msgEl);
                            isFunction(error) && error(rs);
                        }
                    }

                    //回调
                    isFunction(callback) && callback(rs);
                    //请求完成后触发
                    var onEnd = opts.onEnd;
                    isFunction(onEnd) && onEnd();

                    //释放全局变量
                    try {
                        window[callbackName] = null;
                        delete window[callbackName];
                    }
                    catch (e) {
                    }

                    //移除节点
                    ifrEl.parentNode.removeChild(ifrEl);
                    !formId && formEl.parentNode.removeChild(formEl);
                };
            }

            //返回函数
            return function (opts, defaults) {
                //初始化一个空对象
                !opts && (opts = {});

                //与小默认配置合并配置项
                mergeOpts(opts, defaults);

                //与大默认配置合并配置项
                mergeOpts(opts, proxy.defaults);

                //请求前触发
                var onStart = opts.onStart;
                isFunction(onStart) && onStart();

                //get或者post
                opts.method === 'get' ? get(opts) : post(opts);
            };

        })();


        //扩展属性
        //提交数据
        proxy.pushData = pushData;

        //通行证
        proxy.passport = (function () {
            var defaults = {
                api : 'http://app.gd.sohu.com/minisite/public/passport/20140220/',
                code: 'b6e569482459b0f6691302ecc67c4a85'
            };

            return {
                //检测
                check: function (opts) {
                    defaults.method = 'get';
                    defaults.url = defaults.api + 'get.php?act=check';

                    pushData(opts, defaults);
                },

                //登陆
                login: function (opts) {
                    defaults.method = 'post';
                    defaults.url = defaults.api + 'put.php?act=login';

                    pushData(opts, defaults);
                },

                //退出
                logout: function (opts) {
                    defaults.method = 'get';
                    defaults.url = 'http://app.gd.sohu.com/minisite/SohuPassport/logout.php';

                    pushData(opts, defaults);
                }
            };

        })();

        //图片处理
        proxy.pic = (function () {
            var defaults = {
                code: 'b6e569482459b0f6691302ecc67c4a85',
                api : 'http://app.gd.sohu.com/minisite/public/pic/'
            };

            return {
                //上传
                upload: function (opts) {
                    defaults.method = 'post';
                    defaults.url = defaults.api + 'put.php?act=upload';

                    pushData(opts, defaults);
                },

                //读取(比较特殊,返回的是一个图片链接)
                view: function (opts) {
                    var data,
                        code = defaults.code,
                        url = defaults.api + 'get.php?act=show';

                    !opts && (opts = {});

                    //加code参数
                    code && (url += '&code=' + code);

                    //加传入参数
                    data = opts.data;
                    for (var p in opts.data) {
                        url += '&' + p + '=' + data[p];
                    }

                    return url;
                },

                //旋转
                rotate: function (opts) {
                    defaults.method = 'get';
                    defaults.url = defaults.api + 'get.php?act=rotate';

                    pushData(opts, defaults);
                }
            };

        })();

        //获奖信息
        proxy.lottery = (function () {
            var defaults = {
                code: 'aa1c9153608a7755b7c20e97c0eade27',
                api : 'http://app.gd.sohu.com/minisite/public/lottery/20140227/'
            };

            return {
                //获奖名单
                list: function (opts) {
                    defaults.method = 'get';
                    defaults.url = defaults.api + 'get.php?act=list';

                    pushData(opts, defaults);
                }
            };
        })();


        //返回对象
        return proxy;
    })();


    //CommonJS
    if (typeof exports === 'object') {
        module.exports = jtool;
        return;
    }

    //添加到全局变量
    window.jtool = jtool;

})(window);