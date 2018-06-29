/**
 * Scripting for urgent care page.
 */


(function ($, Drupal, drupalSettings) {

  'use strict';


  Drupal.behaviors.showCurrentHours = {
    attach: function (context, settings) {

      var nodeId = 12861;
      var $hrsDiv = $('.clinic-hours-wrapper');

      if (nodeId > 0 && $hrsDiv.length > 0) {

        $.get('/locations/location-hours/' + nodeId, function (data) {

          var $newHrs = $('.clinic-hours-wrapper', data);
          if ($newHrs.length > 0) {
            $hrsDiv.html($newHrs.html()).removeClass('hidden');
          }

        });
      }
    }
  };

})(jQuery, Drupal, drupalSettings);