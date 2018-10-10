/**
 * @file
 * Custom JavaScript for UW Medicine.
 */

(function ($, Drupal) {

    Drupal.behaviors.uwmSearchLayout = {

        attach: function (context, settings) {

            var $searchField = $('.content-header form .form-group', context).eq(0);
            var $searchFacet = $('.content-header section div.facets-widget', context).clone(true);

            $searchField.once('rearrange').each(function () {
                $(this).after($searchFacet);
            });

        }

    };

    Drupal.behaviors.uwmSearchRedirect = {

        attach: function (context, settings) {

            var terms = $('input#edit-search-api-fulltext').val();

            $('.content-header a[href*="Locations"]', context).click(function (e) {
                window.location = '/search/locations/?' + terms;
                e.preventDefault();
            });
            $('.content-header a[href*="Providers"]', context).click(function (e) {
                window.location = '/search/providers/?' + terms;
                e.preventDefault();
            });

        }

    };

})(jQuery, Drupal);
