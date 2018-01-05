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

            $('header .header-main-navigation .dropdown').hover(function () {
                $(this).find('.dropdown-menu').first().stop(true, true).show();
            }, function () {
                $(this).find('.dropdown-menu').first().stop(true, true).hide();

            });

        }

    };

    Drupal.behaviors.uwMainNavClick = {

        attach: function (context, settings) {
            $('header .header-main-navigation ul > li a.dropdown-toggle').click(function (e) {
                e.preventDefault();
                $(this).trigger('mouseenter');
            });
        }
    };

    Drupal.behaviors.uwHeaderSearchClick = {

        attach: function (context, settings) {
            $('header form i.fa.fa-search').click(function (e) {

                $(this).parents('form').first().submit();
            });
        }
    };


})(jQuery, Drupal);
