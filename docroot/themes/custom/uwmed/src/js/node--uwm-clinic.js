/**
 * Scripting for clinic-type nodes.
 */


(function ($, Drupal, drupalSettings) {

    'use strict';

    Drupal.behaviors.clinicExtraTabLinks = {
        attach: function (context, settings) {

          $('section.clinic-header a[href="#directions-jump"]').click(function () {
            var href = '#directions-tab';
            $('.nav-tabs a[href="' + href + '"]').trigger('click');
          });

          // trigger main tab when user clicks on clinic overview, then jump
          $('section.clinic-header a[href="#clinic-overview-jump"]').click(function (e) {
            e.preventDefault();
            var href = "#main-tab";
            $('.nav-tabs a[href="' + href + '"]').trigger('click');
            window.location.href = '#clinic-overview-jump';
          });

        }
    };

})(jQuery, Drupal, drupalSettings);