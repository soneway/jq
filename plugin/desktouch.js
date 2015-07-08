/*
 * desktouch.js
 * 桌面浏览器模拟touch事件
 * */
(function (window) {

    var document = window.document;

    //阻止函数
    function preventAll(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }

    //mouse事件转touch
    function mouseToTouch(type, evt, target) {
        target || (target = evt.target);

        var tagName = target.tagName.toLowerCase();
        //除文本域以外preventAll
        if (tagName.indexOf('select') === -1 && tagName.indexOf('textarea') === -1 && tagName.indexOf('input') === -1) {
            preventAll(evt);
        }

        var event = document.createEvent('Event');
        event.initEvent(type, true, true);

        //非touchend添加touches
        if (type !== 'touchend') {
            var touch = {
                pageX: evt.pageX,
                pageY: evt.pageY,
                target: target
            };
            event.touches = event.changedTouches = event.targetTouches = [touch];
        }

        //添加事件的其他属性
        for (var p in evt) {
            event[p] === undefined && (event[p] = evt[p]);
        }

        event.isFromMouse = true;
        target.dispatchEvent(event);
    }

    var isDowned = false,
        isFirstMove = false,
        isMoved = false,
        lastTarget = null;

    document.addEventListener('mousedown', function (evt) {
        isDowned = true;
        lastTarget = evt.target;

        mouseToTouch('touchstart', evt);
        isFirstMove = true;
        isMoved = false;
    }, true);

    document.addEventListener('mousemove', function (evt) {
        if (!isDowned) {
            return;
        }
        if (isFirstMove) {
            isFirstMove = false;
            return;
        }

        mouseToTouch('touchmove', evt);
        isMoved = true;
    }, true);

    document.addEventListener('mouseup', function (evt) {
        if (!isDowned) {
            return;
        }

        mouseToTouch('touchend', evt, lastTarget);
        lastTarget = null;
        isDowned = false;
    }, true);

    document.addEventListener('click', function (evt) {
        if (!evt.isFromMouse && evt.target === lastTarget) {
            preventAll(evt);
        }
        if (isMoved) {
            preventAll(evt);
            isMoved = false;
        }
    }, true);


    //禁用所有移动端不存在的事件
    ['drag', 'dragstart', 'dragenter', 'dragover', 'dragleave', 'dragend', 'drop', 'selectstart'].forEach(function (type) {
        document.addEventListener(type, preventAll, true);
    });

})(this);
