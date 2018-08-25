/**
 * @file
 * Custom JavaScript for UW Medicine.
 */

(function($, Drupal) {


  Drupal.behaviors.uwmSearchLayout = {

    attach: function(context, settings) {

      var $searchField = $('.form-item.form-item-search-api-fulltext.form-group', context);
      var $searchFacet = $('section#block-uwmsearchwithinstring div.facets-widget', context).clone(true);

      $searchField.once('rearrange').each(function() {
            $searchField.after($searchFacet);
      });
        

    }

  };



})(jQuery, Drupal);
