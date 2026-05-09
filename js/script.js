'use strict';

(function () {
    var u = navigator.userAgent;
    var ie = u.indexOf('MSIE') !== -1 || u.toLowerCase().indexOf('firefox') !== -1 || navigator.appVersion.indexOf('Trident/') > 0 || navigator.appVersion.indexOf('Edge/') > 0;
    var m = u.toLowerCase().indexOf('firefox') !== -1 && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(u);
    if (ie || m) {
        document.body.classList.add('ie-detect');
    }
})();
