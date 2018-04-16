'use strict';

var map = void 0;
var center = { lat: 56.018816, lng: 92.824230 };

function initMap() {
    var zoom = 18;
    if (window.innerWidth < 768) {
        zoom = 16;
    }
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: center.lat + 0.0002, lng: center.lng },
        zoom: zoom,
        disableDefaultUI: true,
        clickableIcons: false
    });

    google.maps.event.addListenerOnce(map, 'idle', function () {
        setTimeout(function () {
            var iw = $('.gm-style-iw').parent();
            iw.addClass('custom-iw');
            iw.find('> div:not(.gm-style-iw)').remove();
        }, 1000);
    });

    var marker = new google.maps.Marker({
        position: center,
        map: map,
        title: '660018, г. Красноярск, ул.Яковлева, д. 1а'
    });

    var infoWindow = new google.maps.InfoWindow({
        content: '<span class="iw-content">660018, г. Красноярск, ул.Яковлева, д. 1а</span>'
    });
    infoWindow.open(map, marker);
}

function detectIE() {
    return navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.toLowerCase().indexOf('firefox') !== -1 || navigator.appVersion.indexOf('Trident/') > 0 || navigator.appVersion.indexOf('Edge/') > 0;
}

function isMobile() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
}

function detectMobileFF() {
    return navigator.userAgent.toLowerCase().indexOf('firefox') !== -1 && isMobile();
}

function slideTo(e, id) {
    e.preventDefault();

    var timeout = isMobile() ? 300 : 100;

    setTimeout(function () {
        $('#serviceModal').modal('show');
        slide = id;

        if (carousel) $('.slider').slick('slickGoTo', slide, false);
    }, timeout);
}

var carousel = null;
var slide = 0;

$(function () {
    if (detectIE() || detectMobileFF()) {
        $('body').addClass('ie-detect');
    }

    $('#serviceModal').on('shown.bs.modal', function () {
        if (!carousel) {
            carousel = $('.slider').slick({
                infinite: true,
                initialSlide: slide,
                slidesToShow: 1,
                appendDots: '.slider__dots',
                dots: true,
                prevArrow: '.slider__arrow--prev',
                nextArrow: '.slider__arrow--next',
                arrows: true
            });
        }
    });
});
//# sourceMappingURL=script.js.map
