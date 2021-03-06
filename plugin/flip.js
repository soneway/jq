/*
 * flip.js
 * 3d翻转效果js
 */
(function(window, $) {

  $.fn.flip = function(options) {

    //每个元素执行
    return this.each(function() {
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
          swipSpan, isAnimating,
          width = $this.width();

        //复位函数
        function reset(me) {
          me.style.cssText = '';
        }

        //旋转到函数
        function rotate(swipSpan) {
          var transform;

          if (typeof swipSpan === 'number') {
            var deg = Math.sqrt(Math.abs(swipSpan) / width) * 130;
            if (swipSpan < 0) {
              deg = -deg;
            }
            $items.each(function(i) {
              var $this = $(this);
              if (i === index) {
                transform = isVertical ? 'rotate3d(1,0,0,' + -deg + 'deg)' : 'rotate3d(0,1,0,' + deg + 'deg)';
                $this.css({
                  'transform': transform
                });
              }
              else {
                transform = isVertical ? 'rotate3d(1,0,0,' + (180 - deg) + 'deg)' : 'rotate3d(0,1,0,' + -(180 - deg) + 'deg)';
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

            $items.each(function(i) {
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
            setTimeout(function() {
              //加上动画
              $items.addClass('notrans').each(function() {
                reset(this);
              });
              isAnimating = false;
            }, duration);
          }
        }

        //触摸开始事件
        $this.on('touchstart', function(evt) {
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
        $this.on('touchmove', function(evt) {
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
        $this.on('touchend', function() {
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