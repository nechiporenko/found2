// Application Scripts:

// Мобильное меню
// Fullpage слайдер на главной странице
// Кнопка скролла страницы
// Модальное окно

jQuery(document).ready(function ($) {
    $('body').append('<div id="overlay" class="overlay"></div>');//оверлей
 
    //
    // Мобильное меню
    //---------------------------------------------------------------------------------------
    (function () {
        //...
    })();

    //
    // Fullpage слайдер на главной странице
    //---------------------------------------------------------------------------------------
    function initHeaderSlider() {
        var slider = $('.js-headerslider');
        slider.bxSlider({
            mode: 'fade',
            controls: false,
            auto: true,
            pause:8000
        });
        $('.b-header__slider').find('.bx-pager-item').hover(function () {//поставим слайдер на паузу при наведении на пейджер
            slider.stopAuto();
        }, function () {
            slider.startAuto();
        });
    };
    if ($('.js-headerslider').length) { initHeaderSlider(); }


    //
    // Слайдер
    //---------------------------------------------------------------------------------------
    function initSlider() {
        var $slider = $('.js-slider'),
            rtime, //переменные для пересчета ресайза окна с задержкой delta
            timeout = false,
            delta = 200,
            method = {};

        method.getSliderSettings = function () {
            var setting,
                    settings1 = {
                        maxSlides: 1,
                        minSlides: 1,
                        moveSlides: 1,
                        slideWidth: 280,
                    },
                    settings2 = {
                        maxSlides: 1,
                        minSlides: 1,
                        moveSlides: 1,
                        slideWidth: 360,
                    },
                    settings3 = {
                        maxSlides: 2,
                        minSlides: 2,
                        moveSlides: 2,
                        slideWidth: 280,
                    },
                    settings4 = {
                         maxSlides: 3,
                         minSlides: 3,
                         moveSlides: 3,
                         slideWidth: 230,
                    },
                    settings5 = {
                        maxSlides: 3,
                        minSlides: 3,
                        moveSlides: 3,
                        slideWidth: 320,
                    },
                    settings6 = {
                        maxSlides: 3,
                        minSlides: 3,
                        moveSlides: 3,
                        slideWidth: 380,
                    },
                    common = {
                        slideMargin: 20,
                        auto: false,
                        mode: 'horizontal',
                        infiniteLoop: false,
                        hideControlOnEnd: true,
                        useCSS: false,
                        nextText: '<i class="flaticon-arrows-1"></i>',
                        prevText: '<i class="flaticon-arrows-2"></i>',
                    },
                    winW = $.viewportW();
            if (winW < 450) {
                setting = $.extend(settings1, common);
            }
            if (winW >= 450 && winW < 600) {
                setting = $.extend(settings2, common);
            }
            if (winW >= 600 && winW < 768) {
                setting = $.extend(settings3, common);
            }
            if (winW >= 768 && winW < 1024) {
                setting = $.extend(settings4, common);
            }
            if (winW >= 1024 && winW < 1200) {
                setting = $.extend(settings5, common);
            }
            if (winW >= 1200) {
                setting = $.extend(settings6, common);
            }
            return setting;
        }

        method.reloadSliderSettings = function () {
            $slider.reloadSlider($.extend(method.getSliderSettings(), { startSlide: $slider.getCurrentSlide() }));
        }


        method.endResize = function () {
            if (new Date() - rtime < delta) {
                setTimeout(method.endResize, delta);
            } else {
                timeout = false;
                //ресайз окончен - пересчитываем
                method.reloadSliderSettings();
            }
        }

        method.startResize = function () {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(method.endResize, delta);
            }
        }

        $slider.bxSlider(method.getSliderSettings());//запускаем слайдер

        $(window).bind('resize', method.startResize);//пересчитываем кол-во видимых элементов при ресайзе окна с задержкой .2с
    }

    if ($('.js-slider').length) { initSlider() }

    //
    // Кнопка скролла страницы
    //---------------------------------------------------------------------------------------
    (function () {
        var $scroller = $('<div class="scroll-up-btn"><i class="icon-up-open-big"></i></div>');
        $('body').append($scroller);
        $(window).on('scroll', function () {
            if ($(this).scrollTop() > 300) {
                $scroller.show();
            } else {
                $scroller.hide();
            }
        });
        $scroller.on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 800);
            return false;
        });
    })();

    //
    // Модальное окно
    //---------------------------------------------------------------------------------------
    var showModal = (function (link) {
        var
        method = {},
        $modal,
        $window = $(window),
        $overlay = $('#overlay'),
        $close;

        $close = $('<a class="modal__close" href="#"><i class="icon-cancel"></i></a>'); //иконка закрыть


        $close.on('click', function (e) {
            e.preventDefault();
            method.close();
        });

        // центрируем окно
        method.center = function () {
            var top, left;
            top = Math.max($window.height() - $modal.outerHeight(), 0) / 2;
            left = Math.max($window.width() - $modal.outerWidth(), 0) / 2;

            $modal.css({
                top: top + $window.scrollTop(),
                left: left + $window.scrollLeft()
            });
        };


        // открываем
        method.open = function (link) {
            $modal = $(link);
            $modal.append($close);
            method.center();
            $window.bind('resize.modal', method.center);
            $modal.show();
            $overlay.show().bind('click', method.close);
        };

        // закрываем
        method.close = function () {
            $modal.hide();
            $overlay.hide().unbind('click', method.close);
            $window.unbind('resize.modal');
        };

        // клик по кнопке с атрибутом data-modal - открываем модальное окно
        $('[data-modal]').on('click', function (e) {//передаем айди модального окна
            e.preventDefault();
            var link = $(this).data('modal');
            if (link) { showModal.open(link); }
        });

        return method;
    }());

});
