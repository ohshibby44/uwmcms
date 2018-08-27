/**
 * @file
 * Custom JavaScript for UW Medicine.
 */

(function($, Drupal) {


  Drupal.behaviors.uwmSearchLayout = {

    attach: function(context, settings) {

      var $searchField = $('.content-header .form-item.form-item-search-api-fulltext.form-group', context);
      var $searchFacet = $('.content-header section div.facets-widget', context).clone(true);

      $searchField.once('rearrange').each(function() {
        $searchField.after($searchFacet);
      });

    }

  };
  
  Drupal.behaviors.uwmSearchRedirect = {

    attach: function(context, settings) {

      var search = $('input#edit-search-api-fulltext').val();

      $('.content-header form .facets-widget a[href*="Locations"]', context).click(function() {
        window.location = '/search/locations/?' + search;
        return false;
      })
      $('.content-header form .facets-widget a[href*="Providers"]', context).click(function() {
        window.location = '/search/providers/?' + search;
        return false;
      })

    }

  };



})(jQuery, Drupal);
