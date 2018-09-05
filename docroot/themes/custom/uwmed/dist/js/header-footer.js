'use strict';

/**
 * @file
 * Custom global JavaScript for UW Medicine.
 */

(function ($, Drupal) {

    Drupal.behaviors.uwmedNavHover = {

        attach: function attach(context, settings) {

            var $menu = $('header .desktop-main-navigation .navbar-collapse > ul.nav');
            var $primaryMenus = $menu.find('> li.dropdown');
            var $secondaryMenus = $primaryMenus.find('li.dropdown-submenu');

            /**
             *
             *
             * Attach menu behavior
             *
             */

            // Toggle main drop-downs:
            $primaryMenus.hover(function (e) {

                closeHoverMenus();
                openHoverMenu($(this));
            }, function () {

                closeHoverMenus();
            });

            // Hold open when clicked:
            $primaryMenus.click(function (e) {

                if (!isMenuClick($(e.target))) {
                    return;
                }

                e.stopPropagation(); // Prevent bubling to window close event
                e.preventDefault();

                closeHoverMenus();

                // Tablets bind hover as touch, so don't duplicate:
                if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
                    return;
                }

                closeClickMenus($(this));
                openClickMenu($(this));
            });

            // Open 3rd level menus:
            $secondaryMenus.click(function (e) {

                if (!isMenuClick($(e.target))) {
                    return;
                }

                e.stopPropagation(); // Prevent bubling to window close event
                e.preventDefault();

                openClickMenu($(this));
            });

            // Close all menus:
            $(window).click(function (e) {
                closeClickMenus();
                closeHoverMenus();
            });

            /**
             *
             *
             * Show/ hide functions
             *
             */
            function openClickMenu($item) {

                $item.toggleClass('uw-hold-open');
            }

            function closeClickMenus($exceptThis) {

                $menu.find('ul, li').not($exceptThis).removeClass('uw-hold-open');
            }

            function openHoverMenu($item) {

                $item.stop(true, true).addClass('uw-open');
            }

            function closeHoverMenus($exceptThis) {

                $menu.find('ul, li').not($exceptThis).removeClass('open uw-open');
            }

            function isMenuClick($item) {

                if ($item.hasClass('dropdown-toggle') || $item.is($primaryMenus) || $item.is($secondaryMenus)) {
                    return true;
                }

                return false;
            }
        }

    };

    Drupal.behaviors.uwHeaderSearchClick = {

        attach: function attach(context, settings) {

            $('header form i.fa.fa-search').click(function (e) {

                $(this).parents('form').first().submit();
            });

            $('header.mobile button[data-target=".search-collapse"]').click(function (e) {

                $('header.mobile input[name="k"]').val('');
            });
        }
    };
})(jQuery, Drupal);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlYWRlci1mb290ZXIuanMiXSwibmFtZXMiOlsiJCIsIkRydXBhbCIsImJlaGF2aW9ycyIsInV3bWVkTmF2SG92ZXIiLCJhdHRhY2giLCJjb250ZXh0Iiwic2V0dGluZ3MiLCIkbWVudSIsIiRwcmltYXJ5TWVudXMiLCJmaW5kIiwiJHNlY29uZGFyeU1lbnVzIiwiaG92ZXIiLCJlIiwiY2xvc2VIb3Zlck1lbnVzIiwib3BlbkhvdmVyTWVudSIsImNsaWNrIiwiaXNNZW51Q2xpY2siLCJ0YXJnZXQiLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsIm5hdmlnYXRvciIsInBsYXRmb3JtIiwidGVzdCIsImNsb3NlQ2xpY2tNZW51cyIsIm9wZW5DbGlja01lbnUiLCJ3aW5kb3ciLCIkaXRlbSIsInRvZ2dsZUNsYXNzIiwiJGV4Y2VwdFRoaXMiLCJub3QiLCJyZW1vdmVDbGFzcyIsInN0b3AiLCJhZGRDbGFzcyIsImhhc0NsYXNzIiwiaXMiLCJ1d0hlYWRlclNlYXJjaENsaWNrIiwicGFyZW50cyIsImZpcnN0Iiwic3VibWl0IiwidmFsIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztBQUtBLENBQUMsVUFBVUEsQ0FBVixFQUFhQyxNQUFiLEVBQXFCOztBQUdsQkEsV0FBT0MsU0FBUCxDQUFpQkMsYUFBakIsR0FBaUM7O0FBRTdCQyxnQkFBUSxnQkFBVUMsT0FBVixFQUFtQkMsUUFBbkIsRUFBNkI7O0FBRWpDLGdCQUFJQyxRQUFRUCxFQUFFLDJEQUFGLENBQVo7QUFDQSxnQkFBSVEsZ0JBQWdCRCxNQUFNRSxJQUFOLENBQVcsZUFBWCxDQUFwQjtBQUNBLGdCQUFJQyxrQkFBa0JGLGNBQWNDLElBQWQsQ0FBbUIscUJBQW5CLENBQXRCOztBQUdBOzs7Ozs7O0FBT0E7QUFDQUQsMEJBQWNHLEtBQWQsQ0FBb0IsVUFBVUMsQ0FBVixFQUFhOztBQUU3QkM7QUFDQUMsOEJBQWNkLEVBQUUsSUFBRixDQUFkO0FBRUgsYUFMRCxFQUtHLFlBQVk7O0FBRVhhO0FBRUgsYUFURDs7QUFXQTtBQUNBTCwwQkFBY08sS0FBZCxDQUFvQixVQUFVSCxDQUFWLEVBQWE7O0FBRTdCLG9CQUFJLENBQUNJLFlBQVloQixFQUFFWSxFQUFFSyxNQUFKLENBQVosQ0FBTCxFQUErQjtBQUMzQjtBQUNIOztBQUVETCxrQkFBRU0sZUFBRixHQU42QixDQU1SO0FBQ3JCTixrQkFBRU8sY0FBRjs7QUFFQU47O0FBRUE7QUFDQSxvQkFBSSxDQUFDLENBQUNPLFVBQVVDLFFBQVosSUFBd0IsbUJBQW1CQyxJQUFuQixDQUF3QkYsVUFBVUMsUUFBbEMsQ0FBNUIsRUFBeUU7QUFDckU7QUFDSDs7QUFFREUsZ0NBQWdCdkIsRUFBRSxJQUFGLENBQWhCO0FBQ0F3Qiw4QkFBY3hCLEVBQUUsSUFBRixDQUFkO0FBR0gsYUFwQkQ7O0FBc0JBO0FBQ0FVLDRCQUFnQkssS0FBaEIsQ0FBc0IsVUFBVUgsQ0FBVixFQUFhOztBQUUvQixvQkFBSSxDQUFDSSxZQUFZaEIsRUFBRVksRUFBRUssTUFBSixDQUFaLENBQUwsRUFBK0I7QUFDM0I7QUFDSDs7QUFFREwsa0JBQUVNLGVBQUYsR0FOK0IsQ0FNVjtBQUNyQk4sa0JBQUVPLGNBQUY7O0FBRUFLLDhCQUFjeEIsRUFBRSxJQUFGLENBQWQ7QUFFSCxhQVhEOztBQWFBO0FBQ0FBLGNBQUV5QixNQUFGLEVBQVVWLEtBQVYsQ0FBZ0IsVUFBVUgsQ0FBVixFQUFhO0FBQ3pCVztBQUNBVjtBQUNILGFBSEQ7O0FBTUE7Ozs7OztBQU1BLHFCQUFTVyxhQUFULENBQXVCRSxLQUF2QixFQUE4Qjs7QUFFMUJBLHNCQUFNQyxXQUFOLENBQWtCLGNBQWxCO0FBRUg7O0FBRUQscUJBQVNKLGVBQVQsQ0FBeUJLLFdBQXpCLEVBQXNDOztBQUVsQ3JCLHNCQUFNRSxJQUFOLENBQVcsUUFBWCxFQUFxQm9CLEdBQXJCLENBQXlCRCxXQUF6QixFQUNLRSxXQURMLENBQ2lCLGNBRGpCO0FBRUg7O0FBRUQscUJBQVNoQixhQUFULENBQXVCWSxLQUF2QixFQUE4Qjs7QUFFMUJBLHNCQUFNSyxJQUFOLENBQVcsSUFBWCxFQUFpQixJQUFqQixFQUF1QkMsUUFBdkIsQ0FBZ0MsU0FBaEM7QUFFSDs7QUFFRCxxQkFBU25CLGVBQVQsQ0FBeUJlLFdBQXpCLEVBQXNDOztBQUVsQ3JCLHNCQUFNRSxJQUFOLENBQVcsUUFBWCxFQUFxQm9CLEdBQXJCLENBQXlCRCxXQUF6QixFQUNLRSxXQURMLENBQ2lCLGNBRGpCO0FBR0g7O0FBRUQscUJBQVNkLFdBQVQsQ0FBcUJVLEtBQXJCLEVBQTRCOztBQUV4QixvQkFBSUEsTUFBTU8sUUFBTixDQUFlLGlCQUFmLEtBQXFDUCxNQUFNUSxFQUFOLENBQVMxQixhQUFULENBQXJDLElBQWdFa0IsTUFBTVEsRUFBTixDQUFTeEIsZUFBVCxDQUFwRSxFQUErRjtBQUMzRiwyQkFBTyxJQUFQO0FBQ0g7O0FBRUQsdUJBQU8sS0FBUDtBQUVIO0FBRUo7O0FBakg0QixLQUFqQzs7QUFzSEFULFdBQU9DLFNBQVAsQ0FBaUJpQyxtQkFBakIsR0FBdUM7O0FBRW5DL0IsZ0JBQVEsZ0JBQVVDLE9BQVYsRUFBbUJDLFFBQW5CLEVBQTZCOztBQUVqQ04sY0FBRSw0QkFBRixFQUFnQ2UsS0FBaEMsQ0FBc0MsVUFBVUgsQ0FBVixFQUFhOztBQUUvQ1osa0JBQUUsSUFBRixFQUFRb0MsT0FBUixDQUFnQixNQUFoQixFQUF3QkMsS0FBeEIsR0FBZ0NDLE1BQWhDO0FBRUgsYUFKRDs7QUFNQXRDLGNBQUUsc0RBQUYsRUFBMERlLEtBQTFELENBQWdFLFVBQVVILENBQVYsRUFBYTs7QUFFekVaLGtCQUFFLCtCQUFGLEVBQW1DdUMsR0FBbkMsQ0FBdUMsRUFBdkM7QUFFSCxhQUpEO0FBS0g7QUFma0MsS0FBdkM7QUFtQkgsQ0E1SUQsRUE0SUdDLE1BNUlILEVBNElXdkMsTUE1SVgiLCJmaWxlIjoiaGVhZGVyLWZvb3Rlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIEN1c3RvbSBnbG9iYWwgSmF2YVNjcmlwdCBmb3IgVVcgTWVkaWNpbmUuXG4gKi9cblxuKGZ1bmN0aW9uICgkLCBEcnVwYWwpIHtcblxuXG4gICAgRHJ1cGFsLmJlaGF2aW9ycy51d21lZE5hdkhvdmVyID0ge1xuXG4gICAgICAgIGF0dGFjaDogZnVuY3Rpb24gKGNvbnRleHQsIHNldHRpbmdzKSB7XG5cbiAgICAgICAgICAgIHZhciAkbWVudSA9ICQoJ2hlYWRlciAuZGVza3RvcC1tYWluLW5hdmlnYXRpb24gLm5hdmJhci1jb2xsYXBzZSA+IHVsLm5hdicpO1xuICAgICAgICAgICAgdmFyICRwcmltYXJ5TWVudXMgPSAkbWVudS5maW5kKCc+IGxpLmRyb3Bkb3duJyk7XG4gICAgICAgICAgICB2YXIgJHNlY29uZGFyeU1lbnVzID0gJHByaW1hcnlNZW51cy5maW5kKCdsaS5kcm9wZG93bi1zdWJtZW51Jyk7XG5cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEF0dGFjaCBtZW51IGJlaGF2aW9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIC8vIFRvZ2dsZSBtYWluIGRyb3AtZG93bnM6XG4gICAgICAgICAgICAkcHJpbWFyeU1lbnVzLmhvdmVyKGZ1bmN0aW9uIChlKSB7XG5cbiAgICAgICAgICAgICAgICBjbG9zZUhvdmVyTWVudXMoKTtcbiAgICAgICAgICAgICAgICBvcGVuSG92ZXJNZW51KCQodGhpcykpO1xuXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBjbG9zZUhvdmVyTWVudXMoKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEhvbGQgb3BlbiB3aGVuIGNsaWNrZWQ6XG4gICAgICAgICAgICAkcHJpbWFyeU1lbnVzLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWlzTWVudUNsaWNrKCQoZS50YXJnZXQpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTsgLy8gUHJldmVudCBidWJsaW5nIHRvIHdpbmRvdyBjbG9zZSBldmVudFxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGNsb3NlSG92ZXJNZW51cygpO1xuXG4gICAgICAgICAgICAgICAgLy8gVGFibGV0cyBiaW5kIGhvdmVyIGFzIHRvdWNoLCBzbyBkb24ndCBkdXBsaWNhdGU6XG4gICAgICAgICAgICAgICAgaWYgKCEhbmF2aWdhdG9yLnBsYXRmb3JtICYmIC9pUGFkfGlQaG9uZXxpUG9kLy50ZXN0KG5hdmlnYXRvci5wbGF0Zm9ybSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNsb3NlQ2xpY2tNZW51cygkKHRoaXMpKTtcbiAgICAgICAgICAgICAgICBvcGVuQ2xpY2tNZW51KCQodGhpcykpO1xuXG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBPcGVuIDNyZCBsZXZlbCBtZW51czpcbiAgICAgICAgICAgICRzZWNvbmRhcnlNZW51cy5jbGljayhmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCFpc01lbnVDbGljaygkKGUudGFyZ2V0KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7IC8vIFByZXZlbnQgYnVibGluZyB0byB3aW5kb3cgY2xvc2UgZXZlbnRcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBvcGVuQ2xpY2tNZW51KCQodGhpcykpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQ2xvc2UgYWxsIG1lbnVzOlxuICAgICAgICAgICAgJCh3aW5kb3cpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgY2xvc2VDbGlja01lbnVzKCk7XG4gICAgICAgICAgICAgICAgY2xvc2VIb3Zlck1lbnVzKCk7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogU2hvdy8gaGlkZSBmdW5jdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIG9wZW5DbGlja01lbnUoJGl0ZW0pIHtcblxuICAgICAgICAgICAgICAgICRpdGVtLnRvZ2dsZUNsYXNzKCd1dy1ob2xkLW9wZW4nKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjbG9zZUNsaWNrTWVudXMoJGV4Y2VwdFRoaXMpIHtcblxuICAgICAgICAgICAgICAgICRtZW51LmZpbmQoJ3VsLCBsaScpLm5vdCgkZXhjZXB0VGhpcylcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCd1dy1ob2xkLW9wZW4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gb3BlbkhvdmVyTWVudSgkaXRlbSkge1xuXG4gICAgICAgICAgICAgICAgJGl0ZW0uc3RvcCh0cnVlLCB0cnVlKS5hZGRDbGFzcygndXctb3BlbicpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsb3NlSG92ZXJNZW51cygkZXhjZXB0VGhpcykge1xuXG4gICAgICAgICAgICAgICAgJG1lbnUuZmluZCgndWwsIGxpJykubm90KCRleGNlcHRUaGlzKVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ29wZW4gdXctb3BlbicpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGlzTWVudUNsaWNrKCRpdGVtKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoJGl0ZW0uaGFzQ2xhc3MoJ2Ryb3Bkb3duLXRvZ2dsZScpIHx8ICRpdGVtLmlzKCRwcmltYXJ5TWVudXMpIHx8ICRpdGVtLmlzKCRzZWNvbmRhcnlNZW51cykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuXG4gICAgRHJ1cGFsLmJlaGF2aW9ycy51d0hlYWRlclNlYXJjaENsaWNrID0ge1xuXG4gICAgICAgIGF0dGFjaDogZnVuY3Rpb24gKGNvbnRleHQsIHNldHRpbmdzKSB7XG5cbiAgICAgICAgICAgICQoJ2hlYWRlciBmb3JtIGkuZmEuZmEtc2VhcmNoJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygnZm9ybScpLmZpcnN0KCkuc3VibWl0KCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCdoZWFkZXIubW9iaWxlIGJ1dHRvbltkYXRhLXRhcmdldD1cIi5zZWFyY2gtY29sbGFwc2VcIl0nKS5jbGljayhmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICAgICAgJCgnaGVhZGVyLm1vYmlsZSBpbnB1dFtuYW1lPVwia1wiXScpLnZhbCgnJyk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuXG59KShqUXVlcnksIERydXBhbCk7XG4iXX0=
