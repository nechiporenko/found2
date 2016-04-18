// Application Scripts:

// Мобильное меню
// Покажем / спрячем форму поиска в хидере
// Fullpage слайдер на главной странице
// Слайдер объектов продажи
// Фиксируем фильтры при скролле
// Дозагрузка контента при скролле
// Кнопка скролла страницы
// Стилизация Select
// Модальное окно

jQuery(document).ready(function ($) {
    $('body').append('<div id="overlay" class="overlay"></div>');//оверлей
 
    //
    // Мобильное меню
    //---------------------------------------------------------------------------------------
    (function () {
        var $menu = $('.js-mm'),
            $toggle_btn = $('.js-mm-toggle'),
            $html = $('html'),
            $overlay=$('#overlay'),
            method = {};

        $menu.find('.m-menu__label').filter(':first').addClass('m-menu__label--close');

        $toggle_btn.on('click', function () {
            if ($(this).hasClass('active')) {
                method.close();
            } else {
                method.show();
            }
        });

        $menu.on('click', '.m-menu__label--close', function () {
            method.close();
        });

        method.show = function () {
            $html.css('overflow', 'hidden');
            $overlay.show().bind('click', method.close);
            $toggle_btn.addClass('active');
            $menu.addClass('active');
        };

        method.close = function () {
            $overlay.hide().unbind('click', method.close);
            $toggle_btn.removeClass('active');
            $menu.removeClass('active');
            $html.css('overflow', 'auto');
        };
    })();

    //
    // Покажем / спрячем форму поиска в хидере
    //---------------------------------------------------------------------------------------
    (function () {
        var $form = $('.js-search'),
            $btn = $('.js-search-toggle'),
            $body=$('body'),
            method = {};
        method.showForm = function () {
            $btn.addClass('active');
            $form.fadeIn(400).find('input').focus();

            $form.find('.h-search').on('mouseleave', function () {
                $body.bind('click', method.hideForm);
            }).on('mouseenter', function () {
                $body.unbind('click', method.hideForm);
            });
        };

        method.hideForm = function () {
            $btn.removeClass('active');
            $form.fadeOut(400);
            $body.unbind('click', method.hideForm);
        };

        $btn.on('click', function () {
            if ($(this).hasClass('active')) {
                method.hideForm();
            } else {
                method.showForm();
            }
        });
    })();

    //
    // Fullpage слайдер на главной странице
    //---------------------------------------------------------------------------------------
    function initHeaderSlider() {
        var slider = $('.js-headerslider'),
            $outer = $('.b-header'),
            rtime, //переменные для пересчета ресайза окна с задержкой delta
            timeout = false,
            delta = 200,
            winH = $.viewportH(),
            method = {};
        

        method.initSlider = function () {
            slider.bxSlider({
                mode: 'fade',
                controls: false,
                auto: true,
                pause: 8000
            });
        };
        
        method.setMaxHeight = function () {
            if (winH > 1020) {
                winH = 1020;
            };
            $outer.css('height', winH + 'px');
        };

        method.checkResize = function () {//без этого метода на мобильных будет происходить дергание контента при скролле (когда прячется - показывается тулбар браузера)
             var newWinH = $.viewportH();

             if (Math.abs((newWinH - winH) / winH) > .15) {
                 console.log(Math.abs((newWinH - winH) / winH));
                 winH = newWinH;
                 method.setMaxHeight();
             };
        };

        method.endResize = function () {
            if (new Date() - rtime < delta) {
                setTimeout(method.endResize, delta);
            } else {
                timeout = false;
                //ресайз окончен - пересчитываем
                method.checkResize();
            }
        };

        method.startResize = function () {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(method.endResize, delta);
            }
        };

        method.setMaxHeight();
        method.initSlider();
        $(window).bind('resize', method.startResize);

        $('.b-header__slider').find('.bx-pager-item').hover(function () {//поставим слайдер на паузу при наведении на пейджер
            slider.stopAuto();
        }, function () {
            slider.startAuto();
        });

        $('.h-hero').on('click', '.h-hero__btn', function (e) {//плавный скролл к секции при клике на кнопку
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $($.attr(this, 'href')).offset().top
            }, 800);
        });
    };
    if ($('.js-headerslider').length) { initHeaderSlider(); }


    //
    // Слайдер объектов продажи
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
                        nextText: '<i class="icomoon-arrow-right"></i>',
                        prevText: '<i class="icomoon-arrow-left"></i>',
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
        };


        method.endResize = function () {
            if (new Date() - rtime < delta) {
                setTimeout(method.endResize, delta);
            } else {
                timeout = false;
                //ресайз окончен - пересчитываем
                method.reloadSliderSettings();
            }
        };

        method.startResize = function () {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(method.endResize, delta);
            }
        };

        $slider.bxSlider(method.getSliderSettings());//запускаем слайдер

        $(window).bind('resize', method.startResize);//пересчитываем кол-во видимых элементов при ресайзе окна с задержкой .2с
    }

    if ($('.js-slider').length) { initSlider() }

    //
    // Фиксируем фильтры при скролле
    //---------------------------------------------------------------------------------------
    function stickyFilter() {
        var stick_breakpoint = 768, //на меньших экранах - будем отключать
            flag = false, //статус - фиксировано или нет
            $filter = $('.js-sticky'),
            rtime, //переменные для пересчета ресайза окна с задержкой delta
            timeout = false,
            delta = 200,
            method = {};

        method.stick = function () {
            $filter.stick_in_parent({//фиксируем
                parent: $('.js-sticky').parents('.page__grid'),
            });
            flag = true;
        };

        method.unstick = function () {
            $filter.trigger('sticky_kit:detach');
            flag = false;
        };

        method.recalc = function () {//если раскрыли - скрыли подменю и меню фиксировано - пересчитаем размер, чтобы убрать "прыжки" при скролле
            if (flag) {
                $filter.trigger('sticky_kit:recalc');
            };
        };

        method.checkout = function () {
            winW = $.viewportW();
            if (winW >= 768 && !flag) {
                method.stick();
            }
            if (winW < 768 && flag) {
                method.unstick();
            };
        };

        method.endResize = function () {
            if (new Date() - rtime < delta) {
                setTimeout(method.endResize, delta);
            } else {
                timeout = false;
                //ресайз окончен - пересчитываем
                method.checkout();
            };
        };

        method.startResize = function () {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(method.endResize, delta);
            }
        };

        method.checkout();//проверили на старте
        $(window).bind('resize', method.startResize);//проверяем, нужно ли фиксировать при ресайзе окна
    };
    if ($('.js-sticky').length) { stickyFilter(); }


    //
    // Дозагрузка контента при скролле
    //---------------------------------------------------------------------------------------
    function loadMoreObjects() {
        var $list = $('.js-loadmore'), //список новостей
            total = +$list.data('total-items'), //через дата-атрибут задаем максимальное кол-во блоков на странице
            $overlay = $('#overlay'),
            $window=$(window),
            method = {};


        method.checkTotal = function () {//проверяем сколько элементов списка загружено
            var count = $list.children('li').length;
            if (count < total) {//если загружено меньше чем указано, включаем отслеживание скролла
                $window.bind('scroll', method.scrollToEnd);
            }
        };


        method.scrollToEnd = function () {//когда докрутили до нижней точки - догружаем контент и отключаем отслеживание
            var $last = $list.children('li:last-child'),
                itemHeight=$last.outerHeight(),//берем последний элемент списка
                isBottom = verge.inY($last, -itemHeight);
            
            if (isBottom) {
                $window.unbind('scroll', method.scrollToEnd);
                $list.after('<ul class="g-hidden" id="hidden"></ul>');
                var $hidden = $('#hidden');
                $hidden.load('ajax/_more-content.html li', function () {
                    var i = 0;
                    $hidden.find('li').each(function () {
                        i++;
                        var $item = $(this);
                        if (i <= 3) {
                            $item.addClass('g-invisible');
                        };
                        $list.append($item); //добавили в список
                        if (i <= 3) {
                            $item.addClass('showItem-' + i);
                        };
                    });
                    $hidden.remove();
                    method.checkTotal();//новая проверка кол-ва загруженных новостей
                });
            };
        };
        method.checkTotal();
    };
    if ($('.js-loadmore').length) { loadMoreObjects();}

    //
    // Кнопка скролла страницы
    //---------------------------------------------------------------------------------------
    (function () {
        var $scroller = $('<div class="scroll-up-btn"><i class="icomoon-up"></i></div>');
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
    // Стилизация Select
    //---------------------------------------------------------------------------------------
    function stylingSelect() {
        var $select = $('.js-select');
        $select.each(function () {
            $(this).selectric({
                disableOnMobile: false,
                responsive: true
            });
        });
    }
    if ($('.js-select').length) { stylingSelect(); }

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
