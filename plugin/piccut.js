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