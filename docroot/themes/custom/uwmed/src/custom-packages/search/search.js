/**
 * @file
 * Custom JavaScript for UW Medicine.
 */

(function ($, Drupal) {


    Drupal.behaviors.uwmSearchLayout = {

        attach: function (context, settings) {

            var $searchField = $('.content-header .form-item.form-item-search-api-fulltext.form-group', context);
            var $searchFacet = $('.content-header section div.facets-widget', context).clone(true);

            $searchField.once('rearrange').each(function () {
                $searchField.after($searchFacet);
            });

        }

    };

    Drupal.behaviors.uwmSearchRedirect = {

        attach: function (context, settings) {

            var search = $('input#edit-search-api-fulltext').val();

            $('.content-header a[href*="Locations"]', context).click(function (e) {
                window.location = '/search/locations/?' + search;
                e.preventDefault();
            });
            $('.content-header a[href*="Providers"]', context).click(function (e) {
                window.location = '/search/providers/?' + search;
                e.preventDefault();
            });

        }

    };


})(jQuery, Drupal);
