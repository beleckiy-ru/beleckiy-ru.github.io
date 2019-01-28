'use strict';

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
