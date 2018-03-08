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

            // Deactivate other menus when hovering:
            $navItems.hover(function () {

                var $this = $(this),
                    $subMenu = $this.find('.dropdown-menu').first();

                $navItems.not($this).removeClass('hold-open');
                $subMenu.stop(true, true).show();

            }, function () {

                var $this = $(this),
                    $subMenu = $this.find('.dropdown-menu').first();

                $subMenu.stop(true, true).hide();

            });

            // Trigger hover when clicked:
            $(' > a.dropdown-toggle', $navItems).click(function (e) {

                e.stopPropagation();
                e.preventDefault();

                $navItems.removeClass('hold-open');

                var $parent = $(this).parents('li').first();
                $parent.trigger('mouseenter').addClass('hold-open');

            });

            // Close clicked menus:
            $(window).click(function (e) {
                $navItems.trigger('focusout').trigger('mouseleave').removeClass('hold-open');
                $navItems.removeClass('open').find('li').removeClass('open');
            });

        }
    };

    // Drupal.behaviors.uwMainSubNavClick = {
    //
    //     attach: function (context, settings) {
    //         $('header .header-main-navigation li.dropdown-submenu a.dropdown-toggle').click(function (e) {
    //             e.preventDefault();
    //             $(this).parents('li').first().find('.dropdown-menu').first().toggleClass('dropdown-submenu-open');
    //         });
    //     }
    // };

    Drupal.behaviors.uwHeaderSearchClick = {

        attach: function (context, settings) {
            $('header form i.fa.fa-search').click(function (e) {

                $(this).parents('form').first().submit();
            });
        }
    };


})(jQuery, Drupal);
