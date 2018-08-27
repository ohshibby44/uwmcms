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



})(jQuery, Drupal);
