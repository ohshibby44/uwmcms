/**
 * Scripting for clinic-type nodes.
 */


(function ($, Drupal, drupalSettings) {

    'use strict';


    Drupal.behaviors.showCurrentHours = {

        attach: function (context, settings) {

            var $elm = $('[uwm-opens-next]', context);

            $elm.each(function (a, b) {

                var opens = $(b).attr('data-opens');
                var dateTimeString = moment(opens).format("DD-MM-YYYY HH:mm:ss");
                var timeString = moment(opens).format("HH:mm:ss");

            });

        }

    };

})(jQuery, Drupal, drupalSettings);