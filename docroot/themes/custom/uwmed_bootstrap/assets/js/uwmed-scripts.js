/**
 * @file
 * A JavaScript file for the theme.
 */

(function ($, Drupal, window, document) {

  'use strict';

  Drupal.behaviors.uwmed_custom = {
    attach: function (context, settings) {

      // Only fire on document load.
      if (typeof context['location'] !== 'undefined') {

        // Mobile Nav / Search Toggle.
        $(".header-button").on("click", function () {
          $(this).toggleClass('active');
        });
        $('.carousel').carousel({
          pause: true,
          interval: false
        });

        // Calendar datepicker.
        $('#edit-submit-uwm-events').unbind('click');
        $('.dpbar-cal').click(function (e) {
          e.preventDefault();
          $('#dpbar-dpui').datepicker({
            dateFormat: 'yy-mm-dd',
            onClose: function () {
              if ($('#dpbar-dpui').val()) {
                $('#edit-date').val($('#dpbar-dpui').val());
                $('#views-exposed-form-uwm-events-page-events-main, #views-exposed-form-uwm-events-page-events-subpages').submit();
              }
            }
          });
          $('#dpbar-dpui').datepicker('show');
        });
      }
    }
  };
})(jQuery, Drupal, this, this.document);
