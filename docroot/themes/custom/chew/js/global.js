/**
 * @file
 * Custom global JavaScript for UW CHEW.
 *
 */
(function ($, Drupal) {

  /**
   * Add scroll behavior.
   */
  Drupal.behaviors.chewBootstrapDropdownHover = {
    attach: function (context, settings) {
      // if($(window).width()>1200){
      //   $('.navbar .dropdown').hover(function() {
      //     $(this).find('.dropdown-menu').first().stop(true, true).show();
      //
      //   }, function() {
      //     $(this).find('.dropdown-menu').first().stop(true, true).hide();
      //
      //   });
      //
      //   $('.navbar .dropdown > a').click(function(){
      //     location.href = this.href;
      //   });
      // }
    }
  };

})(jQuery, Drupal);
