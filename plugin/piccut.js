/*
 * piccut.js
 * 图片裁切功能js
 */
(function (window, $) {

    $.fn.piccut = function (options) {
        $.fn.piccut.defaults = {
            //裁切起点x值
            cutX       : undefined,
            //裁切起点y值
            cutY       : undefined,
            //裁切宽度
            cutWidth   : 160,
            //裁切高度
            cutHeight  : 160,
            //file元素
            fileEl     : null,
            //遮罩样式
            layerStyle : 'rgba(128,128,128,0.7)',
            //图片是否缩放
            imgScalable: true,
            //截图是否保持比例
            isKeepScale: true,
            //是否有最小限制(默认限制为裁切宽度和裁切高度)
            isMinLimit : true,
            //缩放比例
            scale      : 2
        };

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
                imgScalable = opts.imgScalable,
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
                    //cutter的位置的尺寸
                    cutterEl.style.cssText = 'width:' + cutCurWidth + 'px; height:' + cutCurHeight + 'px; left:' + cutCurX + 'px; top:' + cutCurY + 'px;';

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

                        //缩放图片
                        if (imgScalable) {
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

                        //刷新遮罩
                        refreshMask();

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

                $this.on('touchmove', function (evt) {
                    evt.preventDefault();
                    evt.stopPropagation();

                    //计算位移
                    var touch = evt.targetTouches[0],
                        swipSpanX = touch.pageX - startX,
                        swipSpanY = touch.pageY - startY;

                    //是否正在形变
                    if (isResing) {
                        //计算尺寸
                        cutCurHeight = cutHeight + swipSpanY;
                        cutCurWidth = isKeepScale ? cutCurHeight * cutRatio : cutWidth + swipSpanX;

                        //不能超出范围内
                        isMinLimit && cutCurWidth < opts.cutWidth && (cutCurWidth = opts.cutWidth);
                        isMinLimit && cutCurHeight < opts.cutHeight && (cutCurHeight = opts.cutHeight);
                        cutCurX + cutCurWidth > meWidth && (cutCurWidth = meWidth - cutCurX);
                        cutCurY + cutCurHeight > meHeight && (cutCurHeight = meHeight - cutCurY );
                    }
                    else {
                        //计算位置
                        cutCurX = cutX + swipSpanX;
                        cutCurY = cutY + swipSpanY;

                        //不能超出范围内
                        cutCurX < 0 && (cutCurX = 0);
                        cutCurY < 0 && (cutCurY = 0);
                        cutCurX + cutCurWidth > meWidth && (cutCurX = meWidth - cutCurWidth);
                        cutCurY + cutCurHeight > meHeight && (cutCurY = meHeight - cutCurHeight);
                    }

                    //刷新遮罩
                    refreshMask();
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

})(window, $);