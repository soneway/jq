/*
 * scratchcard.js
 * 刮刮卡js
 */
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

})(window, $);