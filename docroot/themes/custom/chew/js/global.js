/**
 * @file
 * Custom global JavaScript for UW CHEW.
 */

(function ($, Drupal) {

  /**
   * Open dropdown menus on hover.
   */
  Drupal.behaviors.chewBootstrapDropdownHover = {
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

  /**
   * Make navbar sticky.
   */
  Drupal.behaviors.chewStickyNavbar = {
    attach: function (context, settings) {
      $('#page-header').stickybits();
    }
  };

})(jQuery, Drupal);
