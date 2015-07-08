/*
 * desktouch.js
 * 桌面浏览器模拟touch事件
 * */
(function (window, $) {

    var document = window.document,
        $doc = $(document);

    var cancelClickMove = false;

    function preventAll(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }

    function redirectMouseToTouch(type, originalEvent, newTarget) {

        var theTarget = newTarget ? newTarget : originalEvent.target,
            tagName = theTarget.tagName.toLowerCase();

        //除文本域以外preventAll
        if (tagName.indexOf('select') === -1 && tagName.indexOf('textarea') === -1 && tagName.indexOf('input') === -1) {
            preventAll(originalEvent);
        }

        var touchevt = document.createEvent('Event');
        touchevt.initEvent(type, true, true);
        if (type != 'touchend') {
            touchevt.touches = [];
            touchevt.touches[0] = {};
            touchevt.touches[0].pageX = originalEvent.pageX;
            touchevt.touches[0].pageY = originalEvent.pageY;
            //target
            touchevt.touches[0].target = theTarget;
            touchevt.changedTouches = touchevt.touches;
            touchevt.targetTouches = touchevt.touches;
        }
        //target
        touchevt.target = theTarget;

        touchevt.mouseToTouch = true;
        if ($.os.ie) {
            //handle inline event handlers for target and parents (for bubbling)
            var elem = originalEvent.target;
            while (elem != null) {
                if (elem.hasAttribute('on' + type)) {
                    eval(elem.getAttribute('on' + type));
                }
                elem = elem.parentElement;
            }
        }
        theTarget.dispatchEvent(touchevt);
    }

    var mouseDown = false,
        lastTarget = null,
        firstMove = false;


    document.addEventListener('mousedown', function (e) {
        mouseDown = true;
        lastTarget = e.target;
        if (e.target.nodeName.toLowerCase() == 'a' && e.target.href.toLowerCase() == 'javascript:;')
            e.target.href = '#';
        redirectMouseToTouch('touchstart', e);
        firstMove = true;
        cancelClickMove = false;
    }, true);

    document.addEventListener('mouseup', function (e) {
        if (!mouseDown) return;
        redirectMouseToTouch('touchend', e, lastTarget);	//bind it to initial mousedown target
        lastTarget = null;
        mouseDown = false;
    }, true);

    document.addEventListener('mousemove', function (e) {
        if (!mouseDown) return;
        if (firstMove) return;
        firstMove = false;
        redirectMouseToTouch('touchmove', e);
        e.preventDefault();

        cancelClickMove = true;
    }, true);


    //禁用所有移动端不存在的事件
    document.addEventListener('drag', preventAll, true);
    document.addEventListener('dragstart', preventAll, true);
    document.addEventListener('dragenter', preventAll, true);
    document.addEventListener('dragover', preventAll, true);
    document.addEventListener('dragleave', preventAll, true);
    document.addEventListener('dragend', preventAll, true);
    document.addEventListener('drop', preventAll, true);
    document.addEventListener('selectstart', preventAll, true);
    document.addEventListener('click', function (e) {
        if (!e.mouseToTouch && e.target == lastTarget) {
            preventAll(e);
        }
        if (cancelClickMove) {
            preventAll(e);
            cancelClickMove = false;
        }
    }, true);

})(this, $);
