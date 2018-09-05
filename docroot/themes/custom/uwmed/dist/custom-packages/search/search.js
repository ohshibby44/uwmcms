'use strict';

/**
 * @file
 * Custom JavaScript for UW Medicine.
 */

(function ($, Drupal) {

    Drupal.behaviors.uwmSearchLayout = {

        attach: function attach(context, settings) {

            var $searchField = $('.content-header .form-item-search.form-group', context);
            var $searchFacet = $('.content-header section div.facets-widget', context).clone(true);

            $searchField.once('rearrange').each(function () {
                $searchField.after($searchFacet);
            });
        }

    };

    Drupal.behaviors.uwmSearchRedirect = {

        attach: function attach(context, settings) {

            var terms = $('input#edit-search-api-fulltext').val();

            $('.content-header a[href*="Locations"]', context).click(function (e) {
                window.location = '/search/locations/?' + terms;
                e.preventDefault();
            });
            $('.content-header a[href*="Providers"]', context).click(function (e) {
                window.location = '/search/providers/?' + terms;
                e.preventDefault();
            });
        }

    };
})(jQuery, Drupal);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlYXJjaC9zZWFyY2guanMiXSwibmFtZXMiOlsiJCIsIkRydXBhbCIsImJlaGF2aW9ycyIsInV3bVNlYXJjaExheW91dCIsImF0dGFjaCIsImNvbnRleHQiLCJzZXR0aW5ncyIsIiRzZWFyY2hGaWVsZCIsIiRzZWFyY2hGYWNldCIsImNsb25lIiwib25jZSIsImVhY2giLCJhZnRlciIsInV3bVNlYXJjaFJlZGlyZWN0IiwidGVybXMiLCJ2YWwiLCJjbGljayIsImUiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInByZXZlbnREZWZhdWx0IiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztBQUtBLENBQUMsVUFBVUEsQ0FBVixFQUFhQyxNQUFiLEVBQXFCOztBQUdsQkEsV0FBT0MsU0FBUCxDQUFpQkMsZUFBakIsR0FBbUM7O0FBRS9CQyxnQkFBUSxnQkFBVUMsT0FBVixFQUFtQkMsUUFBbkIsRUFBNkI7O0FBRWpDLGdCQUFJQyxlQUFlUCxFQUFFLDhDQUFGLEVBQWtESyxPQUFsRCxDQUFuQjtBQUNBLGdCQUFJRyxlQUFlUixFQUFFLDJDQUFGLEVBQStDSyxPQUEvQyxFQUF3REksS0FBeEQsQ0FBOEQsSUFBOUQsQ0FBbkI7O0FBRUFGLHlCQUFhRyxJQUFiLENBQWtCLFdBQWxCLEVBQStCQyxJQUEvQixDQUFvQyxZQUFZO0FBQzVDSiw2QkFBYUssS0FBYixDQUFtQkosWUFBbkI7QUFDSCxhQUZEO0FBSUg7O0FBWDhCLEtBQW5DOztBQWVBUCxXQUFPQyxTQUFQLENBQWlCVyxpQkFBakIsR0FBcUM7O0FBRWpDVCxnQkFBUSxnQkFBVUMsT0FBVixFQUFtQkMsUUFBbkIsRUFBNkI7O0FBRWpDLGdCQUFJUSxRQUFRZCxFQUFFLGdDQUFGLEVBQW9DZSxHQUFwQyxFQUFaOztBQUVBZixjQUFFLHNDQUFGLEVBQTBDSyxPQUExQyxFQUFtRFcsS0FBbkQsQ0FBeUQsVUFBVUMsQ0FBVixFQUFhO0FBQ2xFQyx1QkFBT0MsUUFBUCxHQUFrQix3QkFBd0JMLEtBQTFDO0FBQ0FHLGtCQUFFRyxjQUFGO0FBQ0gsYUFIRDtBQUlBcEIsY0FBRSxzQ0FBRixFQUEwQ0ssT0FBMUMsRUFBbURXLEtBQW5ELENBQXlELFVBQVVDLENBQVYsRUFBYTtBQUNsRUMsdUJBQU9DLFFBQVAsR0FBa0Isd0JBQXdCTCxLQUExQztBQUNBRyxrQkFBRUcsY0FBRjtBQUNILGFBSEQ7QUFLSDs7QUFmZ0MsS0FBckM7QUFvQkgsQ0F0Q0QsRUFzQ0dDLE1BdENILEVBc0NXcEIsTUF0Q1giLCJmaWxlIjoic2VhcmNoL3NlYXJjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIEN1c3RvbSBKYXZhU2NyaXB0IGZvciBVVyBNZWRpY2luZS5cbiAqL1xuXG4oZnVuY3Rpb24gKCQsIERydXBhbCkge1xuXG5cbiAgICBEcnVwYWwuYmVoYXZpb3JzLnV3bVNlYXJjaExheW91dCA9IHtcblxuICAgICAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0LCBzZXR0aW5ncykge1xuXG4gICAgICAgICAgICB2YXIgJHNlYXJjaEZpZWxkID0gJCgnLmNvbnRlbnQtaGVhZGVyIC5mb3JtLWl0ZW0tc2VhcmNoLmZvcm0tZ3JvdXAnLCBjb250ZXh0KTtcbiAgICAgICAgICAgIHZhciAkc2VhcmNoRmFjZXQgPSAkKCcuY29udGVudC1oZWFkZXIgc2VjdGlvbiBkaXYuZmFjZXRzLXdpZGdldCcsIGNvbnRleHQpLmNsb25lKHRydWUpO1xuXG4gICAgICAgICAgICAkc2VhcmNoRmllbGQub25jZSgncmVhcnJhbmdlJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNlYXJjaEZpZWxkLmFmdGVyKCRzZWFyY2hGYWNldCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgRHJ1cGFsLmJlaGF2aW9ycy51d21TZWFyY2hSZWRpcmVjdCA9IHtcblxuICAgICAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0LCBzZXR0aW5ncykge1xuXG4gICAgICAgICAgICB2YXIgdGVybXMgPSAkKCdpbnB1dCNlZGl0LXNlYXJjaC1hcGktZnVsbHRleHQnKS52YWwoKTtcblxuICAgICAgICAgICAgJCgnLmNvbnRlbnQtaGVhZGVyIGFbaHJlZio9XCJMb2NhdGlvbnNcIl0nLCBjb250ZXh0KS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvc2VhcmNoL2xvY2F0aW9ucy8/JyArIHRlcm1zO1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLmNvbnRlbnQtaGVhZGVyIGFbaHJlZio9XCJQcm92aWRlcnNcIl0nLCBjb250ZXh0KS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvc2VhcmNoL3Byb3ZpZGVycy8/JyArIHRlcm1zO1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cblxufSkoalF1ZXJ5LCBEcnVwYWwpO1xuIl19
