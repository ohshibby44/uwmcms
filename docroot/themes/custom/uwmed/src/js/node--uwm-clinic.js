/**
 * Scripting for clinic-type nodes.
 */


(function ($, Drupal, drupalSettings) {

    'use strict';

    Drupal.behaviors.clinicExtraTabLinks = {
        attach: function (context, settings) {

            $('section.medical-service-tabs a[href^="#"]').click(function () {
                var href = $(this).attr('href');
                $('.nav-tabs a[href="' + href + '"]').trigger('click');
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