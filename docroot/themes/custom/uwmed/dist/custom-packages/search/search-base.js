'use strict';

/**
 * @file
 * Custom JavaScript for UW Medicine.
 */

(function ($, Drupal) {

    Drupal.behaviors.uwmSearchLayout = {

        attach: function attach(context, settings) {

            var $searchField = $('.content-header form .form-group', context).eq(0);
            var $searchFacet = $('.content-header section div.facets-widget', context).clone(true);

            $searchField.once('rearrange').each(function () {
                $(this).after($searchFacet);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlYXJjaC9zZWFyY2gtYmFzZS5qcyJdLCJuYW1lcyI6WyIkIiwiRHJ1cGFsIiwiYmVoYXZpb3JzIiwidXdtU2VhcmNoTGF5b3V0IiwiYXR0YWNoIiwiY29udGV4dCIsInNldHRpbmdzIiwiJHNlYXJjaEZpZWxkIiwiZXEiLCIkc2VhcmNoRmFjZXQiLCJjbG9uZSIsIm9uY2UiLCJlYWNoIiwiYWZ0ZXIiLCJ1d21TZWFyY2hSZWRpcmVjdCIsInRlcm1zIiwidmFsIiwiY2xpY2siLCJlIiwid2luZG93IiwibG9jYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsImpRdWVyeSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7QUFLQSxDQUFDLFVBQVVBLENBQVYsRUFBYUMsTUFBYixFQUFxQjs7QUFHbEJBLFdBQU9DLFNBQVAsQ0FBaUJDLGVBQWpCLEdBQW1DOztBQUUvQkMsZ0JBQVEsZ0JBQVVDLE9BQVYsRUFBbUJDLFFBQW5CLEVBQTZCOztBQUVqQyxnQkFBSUMsZUFBZVAsRUFBRSxrQ0FBRixFQUFzQ0ssT0FBdEMsRUFBK0NHLEVBQS9DLENBQWtELENBQWxELENBQW5CO0FBQ0EsZ0JBQUlDLGVBQWVULEVBQUUsMkNBQUYsRUFBK0NLLE9BQS9DLEVBQXdESyxLQUF4RCxDQUE4RCxJQUE5RCxDQUFuQjs7QUFFQUgseUJBQWFJLElBQWIsQ0FBa0IsV0FBbEIsRUFBK0JDLElBQS9CLENBQW9DLFlBQVk7QUFDNUNaLGtCQUFFLElBQUYsRUFBUWEsS0FBUixDQUFjSixZQUFkO0FBQ0gsYUFGRDtBQUlIOztBQVg4QixLQUFuQzs7QUFlQVIsV0FBT0MsU0FBUCxDQUFpQlksaUJBQWpCLEdBQXFDOztBQUVqQ1YsZ0JBQVEsZ0JBQVVDLE9BQVYsRUFBbUJDLFFBQW5CLEVBQTZCOztBQUVqQyxnQkFBSVMsUUFBUWYsRUFBRSxnQ0FBRixFQUFvQ2dCLEdBQXBDLEVBQVo7O0FBRUFoQixjQUFFLHNDQUFGLEVBQTBDSyxPQUExQyxFQUFtRFksS0FBbkQsQ0FBeUQsVUFBVUMsQ0FBVixFQUFhO0FBQ2xFQyx1QkFBT0MsUUFBUCxHQUFrQix3QkFBd0JMLEtBQTFDO0FBQ0FHLGtCQUFFRyxjQUFGO0FBQ0gsYUFIRDtBQUlBckIsY0FBRSxzQ0FBRixFQUEwQ0ssT0FBMUMsRUFBbURZLEtBQW5ELENBQXlELFVBQVVDLENBQVYsRUFBYTtBQUNsRUMsdUJBQU9DLFFBQVAsR0FBa0Isd0JBQXdCTCxLQUExQztBQUNBRyxrQkFBRUcsY0FBRjtBQUNILGFBSEQ7QUFLSDs7QUFmZ0MsS0FBckM7QUFvQkgsQ0F0Q0QsRUFzQ0dDLE1BdENILEVBc0NXckIsTUF0Q1giLCJmaWxlIjoic2VhcmNoL3NlYXJjaC1iYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZVxuICogQ3VzdG9tIEphdmFTY3JpcHQgZm9yIFVXIE1lZGljaW5lLlxuICovXG5cbihmdW5jdGlvbiAoJCwgRHJ1cGFsKSB7XG5cblxuICAgIERydXBhbC5iZWhhdmlvcnMudXdtU2VhcmNoTGF5b3V0ID0ge1xuXG4gICAgICAgIGF0dGFjaDogZnVuY3Rpb24gKGNvbnRleHQsIHNldHRpbmdzKSB7XG5cbiAgICAgICAgICAgIHZhciAkc2VhcmNoRmllbGQgPSAkKCcuY29udGVudC1oZWFkZXIgZm9ybSAuZm9ybS1ncm91cCcsIGNvbnRleHQpLmVxKDApO1xuICAgICAgICAgICAgdmFyICRzZWFyY2hGYWNldCA9ICQoJy5jb250ZW50LWhlYWRlciBzZWN0aW9uIGRpdi5mYWNldHMtd2lkZ2V0JywgY29udGV4dCkuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgICAgICRzZWFyY2hGaWVsZC5vbmNlKCdyZWFycmFuZ2UnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFmdGVyKCRzZWFyY2hGYWNldCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgRHJ1cGFsLmJlaGF2aW9ycy51d21TZWFyY2hSZWRpcmVjdCA9IHtcblxuICAgICAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0LCBzZXR0aW5ncykge1xuXG4gICAgICAgICAgICB2YXIgdGVybXMgPSAkKCdpbnB1dCNlZGl0LXNlYXJjaC1hcGktZnVsbHRleHQnKS52YWwoKTtcblxuICAgICAgICAgICAgJCgnLmNvbnRlbnQtaGVhZGVyIGFbaHJlZio9XCJMb2NhdGlvbnNcIl0nLCBjb250ZXh0KS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvc2VhcmNoL2xvY2F0aW9ucy8/JyArIHRlcm1zO1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLmNvbnRlbnQtaGVhZGVyIGFbaHJlZio9XCJQcm92aWRlcnNcIl0nLCBjb250ZXh0KS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvc2VhcmNoL3Byb3ZpZGVycy8/JyArIHRlcm1zO1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cblxufSkoalF1ZXJ5LCBEcnVwYWwpO1xuIl19
