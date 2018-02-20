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

})(jQuery, Drupal, drupalSettings);