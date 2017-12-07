'use strict';

/**
 * @file
 * Custom global JavaScript for UW CHEW.
 */

(function ($, Drupal) {

  /**
   * Open dropdown menus on hover.
   */
  Drupal.behaviors.uwmedBootstrapDropdownHover = {
    attach: function attach(context, settings) {
      $('.navbar .dropdown').hover(function () {
        $(this).find('.dropdown-menu').first().stop(true, true).show();
      }, function () {
        $(this).find('.dropdown-menu').first().stop(true, true).hide();
      });

      $('.navbar .dropdown > a').click(function () {
        location.href = this.href;
      });
    }
  };
})(jQuery, Drupal);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdsb2JhbC9nbG9iYWwuanMiXSwibmFtZXMiOlsiJCIsIkRydXBhbCIsImJlaGF2aW9ycyIsInV3bWVkQm9vdHN0cmFwRHJvcGRvd25Ib3ZlciIsImF0dGFjaCIsImNvbnRleHQiLCJzZXR0aW5ncyIsImhvdmVyIiwiZmluZCIsImZpcnN0Iiwic3RvcCIsInNob3ciLCJoaWRlIiwiY2xpY2siLCJsb2NhdGlvbiIsImhyZWYiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7O0FBS0EsQ0FBQyxVQUFVQSxDQUFWLEVBQWFDLE1BQWIsRUFBcUI7O0FBRXBCOzs7QUFHQUEsU0FBT0MsU0FBUCxDQUFpQkMsMkJBQWpCLEdBQStDO0FBQzdDQyxZQUFRLGdCQUFVQyxPQUFWLEVBQW1CQyxRQUFuQixFQUE2QjtBQUNuQ04sUUFBRSxtQkFBRixFQUF1Qk8sS0FBdkIsQ0FBNkIsWUFBWTtBQUN2Q1AsVUFBRSxJQUFGLEVBQVFRLElBQVIsQ0FBYSxnQkFBYixFQUErQkMsS0FBL0IsR0FBdUNDLElBQXZDLENBQTRDLElBQTVDLEVBQWtELElBQWxELEVBQXdEQyxJQUF4RDtBQUNELE9BRkQsRUFFRyxZQUFZO0FBQ2JYLFVBQUUsSUFBRixFQUFRUSxJQUFSLENBQWEsZ0JBQWIsRUFBK0JDLEtBQS9CLEdBQXVDQyxJQUF2QyxDQUE0QyxJQUE1QyxFQUFrRCxJQUFsRCxFQUF3REUsSUFBeEQ7QUFFRCxPQUxEOztBQU9BWixRQUFFLHVCQUFGLEVBQTJCYSxLQUEzQixDQUFpQyxZQUFZO0FBQzNDQyxpQkFBU0MsSUFBVCxHQUFnQixLQUFLQSxJQUFyQjtBQUNELE9BRkQ7QUFHRDtBQVo0QyxHQUEvQztBQWVELENBcEJELEVBb0JHQyxNQXBCSCxFQW9CV2YsTUFwQlgiLCJmaWxlIjoiZ2xvYmFsL2dsb2JhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIEN1c3RvbSBnbG9iYWwgSmF2YVNjcmlwdCBmb3IgVVcgQ0hFVy5cbiAqL1xuXG4oZnVuY3Rpb24gKCQsIERydXBhbCkge1xuXG4gIC8qKlxuICAgKiBPcGVuIGRyb3Bkb3duIG1lbnVzIG9uIGhvdmVyLlxuICAgKi9cbiAgRHJ1cGFsLmJlaGF2aW9ycy51d21lZEJvb3RzdHJhcERyb3Bkb3duSG92ZXIgPSB7XG4gICAgYXR0YWNoOiBmdW5jdGlvbiAoY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgICQoJy5uYXZiYXIgLmRyb3Bkb3duJykuaG92ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmZpbmQoJy5kcm9wZG93bi1tZW51JykuZmlyc3QoKS5zdG9wKHRydWUsIHRydWUpLnNob3coKTtcbiAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuZHJvcGRvd24tbWVudScpLmZpcnN0KCkuc3RvcCh0cnVlLCB0cnVlKS5oaWRlKCk7XG5cbiAgICAgIH0pO1xuXG4gICAgICAkKCcubmF2YmFyIC5kcm9wZG93biA+IGEnKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxvY2F0aW9uLmhyZWYgPSB0aGlzLmhyZWY7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbn0pKGpRdWVyeSwgRHJ1cGFsKTtcbiJdfQ==
