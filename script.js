$(function() {
    var folder = '';
    if ($(window).innerWidth() <= 768) {
        folder = 'mobile/';
    }
    $('.diaporama img').each(function() {
        $(this).attr('src', folder + $(this).attr('rel'));
    });

    var animationDuration = 500;

    var getSectionHeight = function() {
        return ($(window).innerHeight() - ($('.header-fix-nav').outerHeight() || 65)) / $('.diaporama__section').length;
    };

    var onResize = function() {
        $('h2').each(function() {
            var $this = $(this);

            $this.css('width', $this.parents('.diaporama__section').innerWidth());

            var width = 0;
            $this.parent().children().each(function() {
                width += $(this).outerWidth();
            });
            $this.parent().css('width', width + 10);

            if ($('.diaporama__section.open').length <= 0) {
                $this.parents('.diaporama__section').css('height', getSectionHeight());
            }
        });
    };

    var open = function() {
        // Unbind open handler
        $('.diaporama__section').off('click.open');

        var $this = $(this);

        // Disable body scroll
        $('body').addClass('no-scroll');

        // Close everything
        $('.diaporama__section.open').removeClass('open');
        $('.diaporama__section').css('height', getSectionHeight());

        // Open current
        $this.addClass('open');
        $this.animate({
            height: $(window).innerHeight() - $('.header-fix-nav').outerHeight()
        }, animationDuration, function() {

            onResize();

            $this.on('mousewheel', function(ev, delta) {
                $this.scrollLeft(parseInt($(this).scrollLeft()) - (delta * 40));
            });
        });

        // Scroll to section
        $('html, body').animate({
            scrollTop: String($this.position().top - $('.header-fix-nav').outerHeight()) + 'px'
        }, animationDuration);
    };

    var close = function() {
        // Close everything
        $('.diaporama__section.open')
            .off('mousewheel')
            .scrollLeft(0)
            .removeClass('open')
            .animate({
                height: getSectionHeight()
            }, animationDuration, function() {
                // Disable body scroll
                $('body').removeClass('no-scroll');

                // Rebind open handler
                window.setTimeout(function() {
                    $('.diaporama__section').on('click.open', open);
                }, 100);

                onResize();
            });

        // Scroll to top
        $('html, body').animate({
            scrollTop: 0
        }, animationDuration);
    };

    $('.diaporama__section').on('click.open', open);
    $(window).on('resize', onResize);
    onResize();

    $('.diaporama__section').each(function() {
        var closeButton = $('<a>', { class : 'diaporama__section__close' }).html('&times;');
        closeButton.on('click', close);
        $(this).prepend(closeButton);
    });
});
