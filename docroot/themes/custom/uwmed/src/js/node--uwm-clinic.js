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

    Drupal.behaviors.showCurrentHours = {
        attach: function (context, settings) {

            var nodeId = $('div#main-container article.uwm-clinic')
                    .attr('data-node-id');
            var $hrsDiv = $('.clinic-hours-wrapper.hidden');

            if (nodeId > 0 && $hrsDiv.length > 0) {

                $.get('/locations/location-hours/' + nodeId, function (data) {

                    var $newHrs = $('.clinic-hours-wrapper.hidden', data);
                    if ($newHrs.length > 0) {
                        $hrsDiv.html($newHrs.html()).removeClass('hidden');
                    }

                });
            }
        }
    };

})(jQuery, Drupal, drupalSettings);