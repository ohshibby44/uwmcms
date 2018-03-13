/**
 * @file
 * Custom global JavaScript for UW Medicine.
 */

(function ($, Drupal) {

    /**
     * Open dropdown menus on hover.
     */
    Drupal.behaviors.uwmedNavHover = {

        attach: function (context, settings) {

            var $navItems = $('header .desktop-main-navigation .navbar-collapse > ul.nav > li.dropdown');

            var closeClickMenus = function ($exceptThis) {
                $navItems.not($exceptThis)
                    .removeClass('uw-hold-open')
                    .find('ul, li').removeClass('uw-hold-open');
            };

            var closeHoverMenus = function ($exceptThis) {
                $navItems.not($exceptThis)
                    .removeClass('open uw-open')
                    .find('ul, li').removeClass('open uw-open');
            };

            $navItems.hover(function (e) {

                closeHoverMenus();

                $(this).stop(true, true).addClass('uw-open');

            }, function () {

                closeHoverMenus();

            });

            // Hold open when clicked:
            $navItems.click(function (e) {

                e.stopPropagation(); // Prevent bubling to window close event
                e.preventDefault();

                closeHoverMenus();

                // Tablets bind hover as touch, so don't duplicate:
                if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
                    return;
                }
                closeClickMenus($(this));

                $(this).toggleClass('uw-hold-open');

            });

            // Open 3rd menus:
            $navItems.find('li.dropdown-submenu').click(function (e) {

                e.stopPropagation(); // Prevent bubling to window close event
                e.preventDefault();

                $(this).toggleClass('uw-hold-open');

            });

            // Close all menus:
            $(window).click(function (e) {
                closeClickMenus();
                closeHoverMenus();
            });

        }
    };



    Drupal.behaviors.uwHeaderSearchClick = {

        attach: function (context, settings) {

            $('header form i.fa.fa-search').click(function (e) {

                $(this).parents('form').first().submit();

            });

            $('header.mobile button[data-target=".search-collapse"]').click(function (e) {

                $('header.mobile input[name="k"]').val('');

            });
        }
    };


})(jQuery, Drupal);
