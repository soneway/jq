(function (window) {

    var performance = window.performance;

    function logPerfInfo(fn, times, start, end) {
        var fnStr = fn + '';

        fnStr = fnStr.slice(fnStr.indexOf('{') + 1);
        fnStr = fnStr.slice(0, fnStr.length - 1);

        console.log(fnStr + ' 运行' + times + '次时长：' + (end - start).toFixed(2));
    }

    //支持performance
    if (performance) {

        var mark = performance.mark || performance.webkitMark || performance.msMark || performance.mozMark;

        //支持performance.mark
        if (mark) {

            var getEntriesByName = performance.getEntriesByName || performance.webkitGetEntriesByName || performance.msGetEntriesByName || performance.mozGetEntriesByName;

            window.perfTest = function (fn, times) {
                var rand = new Date().valueOf();

                //开始时间
                mark.call(performance, 'start' + rand);
                for (var i = 0; i < times; i++) {
                    fn();
                }
                //结束时间
                mark.call(performance, 'end' + rand);

                var start = getEntriesByName.call(performance, 'start' + rand)[0].startTime,
                    end = getEntriesByName.call(performance, 'end' + rand)[0].startTime;

                logPerfInfo(fn, times, start, end);
            };

            return;
        }
    }

    //不支持performance.mark
    window.perfTest = function (fn, times) {
        //开始时间
        var start = new Date().valueOf();
        for (var i = 0; i < times; i++) {
            fn();
        }
        //结束时间
        var end = new Date().valueOf();

        logPerfInfo(fn, times, start, end);
    };

})(this);