'use strict';

/**
 * Scripting for clinic-type nodes.
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  Drupal.behaviors.clinicExtraTabLinks = {
    attach: function attach(context, settings) {

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGUtLXV3bS1jbGluaWMuanMiXSwibmFtZXMiOlsiJCIsIkRydXBhbCIsImRydXBhbFNldHRpbmdzIiwiYmVoYXZpb3JzIiwiY2xpbmljRXh0cmFUYWJMaW5rcyIsImF0dGFjaCIsImNvbnRleHQiLCJzZXR0aW5ncyIsImNsaWNrIiwiaHJlZiIsInRyaWdnZXIiLCJlIiwicHJldmVudERlZmF1bHQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImpRdWVyeSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUtBLENBQUMsVUFBVUEsQ0FBVixFQUFhQyxNQUFiLEVBQXFCQyxjQUFyQixFQUFxQzs7QUFFbEM7O0FBRUFELFNBQU9FLFNBQVAsQ0FBaUJDLG1CQUFqQixHQUF1QztBQUNuQ0MsWUFBUSxnQkFBVUMsT0FBVixFQUFtQkMsUUFBbkIsRUFBNkI7O0FBRW5DUCxRQUFFLGtEQUFGLEVBQXNEUSxLQUF0RCxDQUE0RCxZQUFZO0FBQ3RFLFlBQUlDLE9BQU8saUJBQVg7QUFDQVQsVUFBRSx1QkFBdUJTLElBQXZCLEdBQThCLElBQWhDLEVBQXNDQyxPQUF0QyxDQUE4QyxPQUE5QztBQUNELE9BSEQ7O0FBS0E7QUFDQVYsUUFBRSx1REFBRixFQUEyRFEsS0FBM0QsQ0FBaUUsVUFBVUcsQ0FBVixFQUFhO0FBQzVFQSxVQUFFQyxjQUFGO0FBQ0EsWUFBSUgsT0FBTyxXQUFYO0FBQ0FULFVBQUUsdUJBQXVCUyxJQUF2QixHQUE4QixJQUFoQyxFQUFzQ0MsT0FBdEMsQ0FBOEMsT0FBOUM7QUFDQUcsZUFBT0MsUUFBUCxDQUFnQkwsSUFBaEIsR0FBdUIsdUJBQXZCO0FBQ0QsT0FMRDtBQU9EO0FBaEJrQyxHQUF2QztBQW1CSCxDQXZCRCxFQXVCR00sTUF2QkgsRUF1QldkLE1BdkJYLEVBdUJtQkMsY0F2Qm5CIiwiZmlsZSI6Im5vZGUtLXV3bS1jbGluaWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFNjcmlwdGluZyBmb3IgY2xpbmljLXR5cGUgbm9kZXMuXG4gKi9cblxuXG4oZnVuY3Rpb24gKCQsIERydXBhbCwgZHJ1cGFsU2V0dGluZ3MpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIERydXBhbC5iZWhhdmlvcnMuY2xpbmljRXh0cmFUYWJMaW5rcyA9IHtcbiAgICAgICAgYXR0YWNoOiBmdW5jdGlvbiAoY29udGV4dCwgc2V0dGluZ3MpIHtcblxuICAgICAgICAgICQoJ3NlY3Rpb24uY2xpbmljLWhlYWRlciBhW2hyZWY9XCIjZGlyZWN0aW9ucy1qdW1wXCJdJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGhyZWYgPSAnI2RpcmVjdGlvbnMtdGFiJztcbiAgICAgICAgICAgICQoJy5uYXYtdGFicyBhW2hyZWY9XCInICsgaHJlZiArICdcIl0nKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gdHJpZ2dlciBtYWluIHRhYiB3aGVuIHVzZXIgY2xpY2tzIG9uIGNsaW5pYyBvdmVydmlldywgdGhlbiBqdW1wXG4gICAgICAgICAgJCgnc2VjdGlvbi5jbGluaWMtaGVhZGVyIGFbaHJlZj1cIiNjbGluaWMtb3ZlcnZpZXctanVtcFwiXScpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgaHJlZiA9IFwiI21haW4tdGFiXCI7XG4gICAgICAgICAgICAkKCcubmF2LXRhYnMgYVtocmVmPVwiJyArIGhyZWYgKyAnXCJdJykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJyNjbGluaWMtb3ZlcnZpZXctanVtcCc7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIH07XG5cbn0pKGpRdWVyeSwgRHJ1cGFsLCBkcnVwYWxTZXR0aW5ncyk7Il19
