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
            var $primaryDropDowns = $('header .desktop-main-navigation ul.nav > li.dropdown');

            $primaryDropDowns.hover(function () {
                $(this).find('.dropdown-menu').first().stop(true, true).show();
            }, function () {
                $(this).find('.dropdown-menu').first().stop(true, true).hide();
                $(this).find('li').removeClass('open');
            });
        }

    };

    Drupal.behaviors.uwMainNavClick = {

        attach: function (context, settings) {
            // Trigger hover when top-nav clicked:
            $('header .header-main-navigation .dropdown a.dropdown-toggle').click(function (e) {
                e.preventDefault();
                $(this).trigger('mouseenter');
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
