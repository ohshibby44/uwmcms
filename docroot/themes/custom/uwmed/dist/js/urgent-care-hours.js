'use strict';

/**
 * Scripting for urgent care page.
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  Drupal.behaviors.showCurrentHours = {
    attach: function attach(context, settings) {

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVyZ2VudC1jYXJlLWhvdXJzLmpzIl0sIm5hbWVzIjpbIiQiLCJEcnVwYWwiLCJkcnVwYWxTZXR0aW5ncyIsImJlaGF2aW9ycyIsInNob3dDdXJyZW50SG91cnMiLCJhdHRhY2giLCJjb250ZXh0Iiwic2V0dGluZ3MiLCJub2RlSWQiLCIkaHJzRGl2IiwibGVuZ3RoIiwiZ2V0IiwiZGF0YSIsIiRuZXdIcnMiLCJodG1sIiwicmVtb3ZlQ2xhc3MiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFLQSxDQUFDLFVBQVVBLENBQVYsRUFBYUMsTUFBYixFQUFxQkMsY0FBckIsRUFBcUM7O0FBRXBDOztBQUdBRCxTQUFPRSxTQUFQLENBQWlCQyxnQkFBakIsR0FBb0M7QUFDbENDLFlBQVEsZ0JBQVVDLE9BQVYsRUFBbUJDLFFBQW5CLEVBQTZCOztBQUVuQyxVQUFJQyxTQUFTLEtBQWI7QUFDQSxVQUFJQyxVQUFVVCxFQUFFLHVCQUFGLENBQWQ7O0FBRUEsVUFBSVEsU0FBUyxDQUFULElBQWNDLFFBQVFDLE1BQVIsR0FBaUIsQ0FBbkMsRUFBc0M7O0FBRXBDVixVQUFFVyxHQUFGLENBQU0sK0JBQStCSCxNQUFyQyxFQUE2QyxVQUFVSSxJQUFWLEVBQWdCOztBQUUzRCxjQUFJQyxVQUFVYixFQUFFLHVCQUFGLEVBQTJCWSxJQUEzQixDQUFkO0FBQ0EsY0FBSUMsUUFBUUgsTUFBUixHQUFpQixDQUFyQixFQUF3QjtBQUN0QkQsb0JBQVFLLElBQVIsQ0FBYUQsUUFBUUMsSUFBUixFQUFiLEVBQTZCQyxXQUE3QixDQUF5QyxRQUF6QztBQUNEO0FBRUYsU0FQRDtBQVFEO0FBQ0Y7QUFqQmlDLEdBQXBDO0FBb0JELENBekJELEVBeUJHQyxNQXpCSCxFQXlCV2YsTUF6QlgsRUF5Qm1CQyxjQXpCbkIiLCJmaWxlIjoidXJnZW50LWNhcmUtaG91cnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFNjcmlwdGluZyBmb3IgdXJnZW50IGNhcmUgcGFnZS5cbiAqL1xuXG5cbihmdW5jdGlvbiAoJCwgRHJ1cGFsLCBkcnVwYWxTZXR0aW5ncykge1xuXG4gICd1c2Ugc3RyaWN0JztcblxuXG4gIERydXBhbC5iZWhhdmlvcnMuc2hvd0N1cnJlbnRIb3VycyA9IHtcbiAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0LCBzZXR0aW5ncykge1xuXG4gICAgICB2YXIgbm9kZUlkID0gMTI4NjE7XG4gICAgICB2YXIgJGhyc0RpdiA9ICQoJy5jbGluaWMtaG91cnMtd3JhcHBlcicpO1xuXG4gICAgICBpZiAobm9kZUlkID4gMCAmJiAkaHJzRGl2Lmxlbmd0aCA+IDApIHtcblxuICAgICAgICAkLmdldCgnL2xvY2F0aW9ucy9sb2NhdGlvbi1ob3Vycy8nICsgbm9kZUlkLCBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgdmFyICRuZXdIcnMgPSAkKCcuY2xpbmljLWhvdXJzLXdyYXBwZXInLCBkYXRhKTtcbiAgICAgICAgICBpZiAoJG5ld0hycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkaHJzRGl2Lmh0bWwoJG5ld0hycy5odG1sKCkpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG59KShqUXVlcnksIERydXBhbCwgZHJ1cGFsU2V0dGluZ3MpOyJdfQ==
