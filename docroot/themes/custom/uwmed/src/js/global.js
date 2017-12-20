/**
 * @file
 * Custom global JavaScript for UW Medicine.
 */

(function ($, Drupal) {

  /**
   * Open dropdown menus on hover.
   */
  Drupal.behaviors.uwmedBootstrapDropdownHover = {
    attach: function (context, settings) {
      $('.navbar .dropdown').hover(function () {
        $(this).find('.dropdown-menu').first().stop(true, true).show();
      }, function () {
        $(this).find('.dropdown-menu').first().stop(true, true).hide();

      });

      $('.navbar .dropdown > a').click(function () {
        location.href = this.href;
      });
    }
  };

})(jQuery, Drupal);