/**
 * Scripting for clinic-type nodes.
 */


(function ($, Drupal, drupalSettings) {

    'use strict';

    Drupal.behaviors.clinicExtraTabLinks = {
        attach: function (context, settings) {

            $('section.clinic-header a[href^="#"]').click(function () {
                var href = $(this).attr('href');
                $('.nav a[href="' + href + '"]').tab('show');
            });

        }
    };

})(jQuery, Drupal, drupalSettings);