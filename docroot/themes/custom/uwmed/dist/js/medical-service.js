'use strict';

(function ($, Drupal) {
  Drupal.behaviors.medicalServices = {
    attach: function attach() {
      // trigger main tab when user clicks on find a location overview, then jump
      $('div.medical-service-hero__links-with-icon__desktop a[href="#find-a-location-jump"]').off().click(function (e) {
        e.preventDefault();
        var href = "#approach";

        $('.nav-tabs a[href="' + href + '"]').trigger('click');
        window.setTimeout("window.location.href = '#find-a-location-jump';", 250);
      });

      $('a#approach-tab').on('shown.bs.tab', function () {
        $('#condition-spotlight').show();
      }).on('hide.bs.tab', function () {
        $('#condition-spotlight').hide();
      });
    }
  };
})(jQuery, Drupal);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lZGljYWwtc2VydmljZS5qcyJdLCJuYW1lcyI6WyIkIiwiRHJ1cGFsIiwiYmVoYXZpb3JzIiwibWVkaWNhbFNlcnZpY2VzIiwiYXR0YWNoIiwib2ZmIiwiY2xpY2siLCJlIiwicHJldmVudERlZmF1bHQiLCJocmVmIiwidHJpZ2dlciIsIndpbmRvdyIsInNldFRpbWVvdXQiLCJvbiIsInNob3ciLCJoaWRlIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOztBQUFBLENBQUMsVUFBVUEsQ0FBVixFQUFhQyxNQUFiLEVBQXFCO0FBQ3BCQSxTQUFPQyxTQUFQLENBQWlCQyxlQUFqQixHQUFtQztBQUNqQ0MsWUFBUSxrQkFBVztBQUNqQjtBQUNBSixRQUFFLG9GQUFGLEVBQXdGSyxHQUF4RixHQUE4RkMsS0FBOUYsQ0FBb0csVUFBVUMsQ0FBVixFQUFhO0FBQy9HQSxVQUFFQyxjQUFGO0FBQ0EsWUFBSUMsT0FBTyxXQUFYOztBQUVBVCxVQUFFLHVCQUF1QlMsSUFBdkIsR0FBOEIsSUFBaEMsRUFBc0NDLE9BQXRDLENBQThDLE9BQTlDO0FBQ0FDLGVBQU9DLFVBQVAsQ0FBa0IsaURBQWxCLEVBQXFFLEdBQXJFO0FBQ0QsT0FORDs7QUFRQVosUUFBRSxnQkFBRixFQUNHYSxFQURILENBQ00sY0FETixFQUNzQixZQUFZO0FBQzlCYixVQUFFLHNCQUFGLEVBQTBCYyxJQUExQjtBQUNELE9BSEgsRUFJR0QsRUFKSCxDQUlNLGFBSk4sRUFJcUIsWUFBWTtBQUM3QmIsVUFBRSxzQkFBRixFQUEwQmUsSUFBMUI7QUFDRCxPQU5IO0FBUUQ7QUFuQmdDLEdBQW5DO0FBcUJELENBdEJELEVBc0JHQyxNQXRCSCxFQXNCV2YsTUF0QlgiLCJmaWxlIjoibWVkaWNhbC1zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgkLCBEcnVwYWwpIHtcbiAgRHJ1cGFsLmJlaGF2aW9ycy5tZWRpY2FsU2VydmljZXMgPSB7XG4gICAgYXR0YWNoOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIHRyaWdnZXIgbWFpbiB0YWIgd2hlbiB1c2VyIGNsaWNrcyBvbiBmaW5kIGEgbG9jYXRpb24gb3ZlcnZpZXcsIHRoZW4ganVtcFxuICAgICAgJCgnZGl2Lm1lZGljYWwtc2VydmljZS1oZXJvX19saW5rcy13aXRoLWljb25fX2Rlc2t0b3AgYVtocmVmPVwiI2ZpbmQtYS1sb2NhdGlvbi1qdW1wXCJdJykub2ZmKCkuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgaHJlZiA9IFwiI2FwcHJvYWNoXCI7XG5cbiAgICAgICAgJCgnLm5hdi10YWJzIGFbaHJlZj1cIicgKyBocmVmICsgJ1wiXScpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KFwid2luZG93LmxvY2F0aW9uLmhyZWYgPSAnI2ZpbmQtYS1sb2NhdGlvbi1qdW1wJztcIiwgMjUwKTtcbiAgICAgIH0pO1xuXG4gICAgICAkKCdhI2FwcHJvYWNoLXRhYicpXG4gICAgICAgIC5vbignc2hvd24uYnMudGFiJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQoJyNjb25kaXRpb24tc3BvdGxpZ2h0Jykuc2hvdygpXG4gICAgICAgIH0pXG4gICAgICAgIC5vbignaGlkZS5icy50YWInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJCgnI2NvbmRpdGlvbi1zcG90bGlnaHQnKS5oaWRlKClcbiAgICAgICAgfSk7XG5cbiAgICB9XG4gIH1cbn0pKGpRdWVyeSwgRHJ1cGFsKTsiXX0=
