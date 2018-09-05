'use strict';

/**
 * @file
 * Refreshes an element from AJAX callback.
 *
 * Used to fetch non-cached, fresh version of div (or any element)
 * from another page. An example is below, where we refresh contents of
 * the "test-example-123" by replacing it from the same div found
 * at "/views/no-cache-content/123".
 *==-
 * @example
 * <div data-uwm-refresh-from=
 *      "/views/no-cache-content/123"
 *      data-uwm-refresh-id="test-example-123">abc
 * </div>
 *
 */

(function ($, Drupal, drupalSettings) {

    'use strict';

    Drupal.behaviors.uwmRefreshElementFrom = {

        attach: function attach(context, settings) {

            var $elm = $('[data-uwm-refresh-from]', context);

            $elm.each(function (a, b) {

                var $this = $(b);
                var refreshFromUri = $this.attr('data-uwm-refresh-from');
                var refreshSelector = $this.attr('data-uwm-refresh-match-selector');

                $this.attr('data-uwm-refresh-start', new Date().toLocaleString());

                $.get(refreshFromUri, function (data) {

                    var $target = $(refreshSelector, document);
                    var $replacement = $(refreshSelector, data);

                    if ($replacement.length > 0) {

                        $target.html($replacement.html()).removeClass('fade-out hidden invisible').attr('data-uwm-refresh-end', new Date().toLocaleString());
                    }
                });
            });
        }
    };
})(jQuery, Drupal, drupalSettings);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV3bS1yZWZyZXNoLWZyb20uanMiXSwibmFtZXMiOlsiJCIsIkRydXBhbCIsImRydXBhbFNldHRpbmdzIiwiYmVoYXZpb3JzIiwidXdtUmVmcmVzaEVsZW1lbnRGcm9tIiwiYXR0YWNoIiwiY29udGV4dCIsInNldHRpbmdzIiwiJGVsbSIsImVhY2giLCJhIiwiYiIsIiR0aGlzIiwicmVmcmVzaEZyb21VcmkiLCJhdHRyIiwicmVmcmVzaFNlbGVjdG9yIiwiRGF0ZSIsInRvTG9jYWxlU3RyaW5nIiwiZ2V0IiwiZGF0YSIsIiR0YXJnZXQiLCJkb2N1bWVudCIsIiRyZXBsYWNlbWVudCIsImxlbmd0aCIsImh0bWwiLCJyZW1vdmVDbGFzcyIsImpRdWVyeSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsQ0FBQyxVQUFVQSxDQUFWLEVBQWFDLE1BQWIsRUFBcUJDLGNBQXJCLEVBQXFDOztBQUVsQzs7QUFFQUQsV0FBT0UsU0FBUCxDQUFpQkMscUJBQWpCLEdBQXlDOztBQUVyQ0MsZ0JBQVEsZ0JBQVVDLE9BQVYsRUFBbUJDLFFBQW5CLEVBQTZCOztBQUVqQyxnQkFBSUMsT0FBT1IsRUFBRSx5QkFBRixFQUE2Qk0sT0FBN0IsQ0FBWDs7QUFFQUUsaUJBQUtDLElBQUwsQ0FBVSxVQUFVQyxDQUFWLEVBQWFDLENBQWIsRUFBZ0I7O0FBRXRCLG9CQUFJQyxRQUFRWixFQUFFVyxDQUFGLENBQVo7QUFDQSxvQkFBSUUsaUJBQWlCRCxNQUFNRSxJQUFOLENBQVcsdUJBQVgsQ0FBckI7QUFDQSxvQkFBSUMsa0JBQWtCSCxNQUFNRSxJQUFOLENBQVcsaUNBQVgsQ0FBdEI7O0FBRUFGLHNCQUFNRSxJQUFOLENBQVcsd0JBQVgsRUFBcUMsSUFBSUUsSUFBSixHQUFXQyxjQUFYLEVBQXJDOztBQUVBakIsa0JBQUVrQixHQUFGLENBQU1MLGNBQU4sRUFBc0IsVUFBVU0sSUFBVixFQUFnQjs7QUFFbEMsd0JBQUlDLFVBQVVwQixFQUFFZSxlQUFGLEVBQW1CTSxRQUFuQixDQUFkO0FBQ0Esd0JBQUlDLGVBQWV0QixFQUFFZSxlQUFGLEVBQW1CSSxJQUFuQixDQUFuQjs7QUFFQSx3QkFBSUcsYUFBYUMsTUFBYixHQUFzQixDQUExQixFQUE2Qjs7QUFFekJILGdDQUFRSSxJQUFSLENBQWFGLGFBQWFFLElBQWIsRUFBYixFQUNLQyxXQURMLENBQ2lCLDJCQURqQixFQUVLWCxJQUZMLENBRVUsc0JBRlYsRUFFa0MsSUFBSUUsSUFBSixHQUFXQyxjQUFYLEVBRmxDO0FBSUg7QUFHSixpQkFkRDtBQWlCSCxhQXpCRDtBQTRCSDtBQWxDb0MsS0FBekM7QUFzQ0gsQ0ExQ0QsRUEwQ0dTLE1BMUNILEVBMENXekIsTUExQ1gsRUEwQ21CQyxjQTFDbkIiLCJmaWxlIjoidXdtLXJlZnJlc2gtZnJvbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIFJlZnJlc2hlcyBhbiBlbGVtZW50IGZyb20gQUpBWCBjYWxsYmFjay5cbiAqXG4gKiBVc2VkIHRvIGZldGNoIG5vbi1jYWNoZWQsIGZyZXNoIHZlcnNpb24gb2YgZGl2IChvciBhbnkgZWxlbWVudClcbiAqIGZyb20gYW5vdGhlciBwYWdlLiBBbiBleGFtcGxlIGlzIGJlbG93LCB3aGVyZSB3ZSByZWZyZXNoIGNvbnRlbnRzIG9mXG4gKiB0aGUgXCJ0ZXN0LWV4YW1wbGUtMTIzXCIgYnkgcmVwbGFjaW5nIGl0IGZyb20gdGhlIHNhbWUgZGl2IGZvdW5kXG4gKiBhdCBcIi92aWV3cy9uby1jYWNoZS1jb250ZW50LzEyM1wiLlxuICo9PS1cbiAqIEBleGFtcGxlXG4gKiA8ZGl2IGRhdGEtdXdtLXJlZnJlc2gtZnJvbT1cbiAqICAgICAgXCIvdmlld3Mvbm8tY2FjaGUtY29udGVudC8xMjNcIlxuICogICAgICBkYXRhLXV3bS1yZWZyZXNoLWlkPVwidGVzdC1leGFtcGxlLTEyM1wiPmFiY1xuICogPC9kaXY+XG4gKlxuICovXG5cbihmdW5jdGlvbiAoJCwgRHJ1cGFsLCBkcnVwYWxTZXR0aW5ncykge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgRHJ1cGFsLmJlaGF2aW9ycy51d21SZWZyZXNoRWxlbWVudEZyb20gPSB7XG5cbiAgICAgICAgYXR0YWNoOiBmdW5jdGlvbiAoY29udGV4dCwgc2V0dGluZ3MpIHtcblxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKCdbZGF0YS11d20tcmVmcmVzaC1mcm9tXScsIGNvbnRleHQpO1xuXG4gICAgICAgICAgICAkZWxtLmVhY2goZnVuY3Rpb24gKGEsIGIpIHtcblxuICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9ICQoYik7XG4gICAgICAgICAgICAgICAgdmFyIHJlZnJlc2hGcm9tVXJpID0gJHRoaXMuYXR0cignZGF0YS11d20tcmVmcmVzaC1mcm9tJyk7XG4gICAgICAgICAgICAgICAgdmFyIHJlZnJlc2hTZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2RhdGEtdXdtLXJlZnJlc2gtbWF0Y2gtc2VsZWN0b3InKTtcblxuICAgICAgICAgICAgICAgICR0aGlzLmF0dHIoJ2RhdGEtdXdtLXJlZnJlc2gtc3RhcnQnLCBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCkpO1xuXG4gICAgICAgICAgICAgICAgJC5nZXQocmVmcmVzaEZyb21VcmksIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyICR0YXJnZXQgPSAkKHJlZnJlc2hTZWxlY3RvciwgZG9jdW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHJlcGxhY2VtZW50ID0gJChyZWZyZXNoU2VsZWN0b3IsIGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICgkcmVwbGFjZW1lbnQubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGFyZ2V0Lmh0bWwoJHJlcGxhY2VtZW50Lmh0bWwoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2ZhZGUtb3V0IGhpZGRlbiBpbnZpc2libGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXV3bS1yZWZyZXNoLWVuZCcsIG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgIH1cbiAgICB9O1xuXG5cbn0pKGpRdWVyeSwgRHJ1cGFsLCBkcnVwYWxTZXR0aW5ncyk7XG4iXX0=
