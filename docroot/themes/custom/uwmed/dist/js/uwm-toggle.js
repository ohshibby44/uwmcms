'use strict';

/**
 * @file
 * Toggles classes on elements.
 *
 * Use by setting a selector and on and off states for the matched
 * elements. For example, to toggle ".on" for a list of li's,
 * and set the clicked element class to ".active", use:
 *
 * @example
 * <div class="uw-more">
 *     <a href="#"
 *      data-uwm-toggle
 *      data-on-text="{{ 'View less'|t }}"
 *      data-off-text="{{ 'View more'|t }}"
 *      data-toggle-selector=".some-class > li"
 *      data-toggle-style="on"
 *      data-parent-style="active">{{ 'View more'|t }}
 *          <i class="fa fa-angle-down" aria-hidden="true"></i>
 *          </a></div>
 *
 */

(function ($, Drupal, drupalSettings) {

    'use strict';

    Drupal.behaviors.uwmToggleStyleLight = {

        attach: function attach(context, settings) {

            var $toggleControl = $('[data-uwm-toggle-class]', context);

            $toggleControl.on('click', function (e) {

                var $this = $(this),
                    toggleTarget = $this.attr('data-toggle-target'),
                    toggleClass = $this.attr('data-toggle-class');

                $(toggleTarget).toggleClass(toggleClass);

                e.preventDefault();
            });
        }
    };

    Drupal.behaviors.uwmToggleCssClass = {

        attach: function attach(context, settings) {

            var $toggleControl = $('[data-uwm-toggle]', context);

            $toggleControl.on('click', function (e) {

                var $this = $(this);

                var toggleSelector = $this.attr('data-toggle-selector');
                var toggleStyle = $this.attr('data-toggle-style');
                var parentSelector = $this.attr('data-parent-selector');
                var parentStyle = $this.attr('data-parent-style');
                var onText = $this.attr('data-on-text');
                var offText = $this.attr('data-off-text');

                if ($this.hasClass(parentStyle)) {
                    $this.removeClass(parentStyle);
                    $(toggleSelector).removeClass(toggleStyle);
                    $(parentSelector).removeClass(parentStyle);
                    $(this).html($(this).html().replace(onText, offText));
                } else {
                    $this.addClass(parentStyle);
                    // We remove the style on first run
                    $(toggleSelector).addClass(toggleStyle);
                    $(this).html($(this).html().replace(offText, onText));
                }

                e.preventDefault();
            });
        }
    };
})(jQuery, Drupal, drupalSettings);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV3bS10b2dnbGUuanMiXSwibmFtZXMiOlsiJCIsIkRydXBhbCIsImRydXBhbFNldHRpbmdzIiwiYmVoYXZpb3JzIiwidXdtVG9nZ2xlU3R5bGVMaWdodCIsImF0dGFjaCIsImNvbnRleHQiLCJzZXR0aW5ncyIsIiR0b2dnbGVDb250cm9sIiwib24iLCJlIiwiJHRoaXMiLCJ0b2dnbGVUYXJnZXQiLCJhdHRyIiwidG9nZ2xlQ2xhc3MiLCJwcmV2ZW50RGVmYXVsdCIsInV3bVRvZ2dsZUNzc0NsYXNzIiwidG9nZ2xlU2VsZWN0b3IiLCJ0b2dnbGVTdHlsZSIsInBhcmVudFNlbGVjdG9yIiwicGFyZW50U3R5bGUiLCJvblRleHQiLCJvZmZUZXh0IiwiaGFzQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImh0bWwiLCJyZXBsYWNlIiwiYWRkQ2xhc3MiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkEsQ0FBQyxVQUFVQSxDQUFWLEVBQWFDLE1BQWIsRUFBcUJDLGNBQXJCLEVBQXFDOztBQUVsQzs7QUFFQUQsV0FBT0UsU0FBUCxDQUFpQkMsbUJBQWpCLEdBQXVDOztBQUVuQ0MsZ0JBQVEsZ0JBQVVDLE9BQVYsRUFBbUJDLFFBQW5CLEVBQTZCOztBQUVqQyxnQkFBSUMsaUJBQWlCUixFQUFFLHlCQUFGLEVBQTZCTSxPQUE3QixDQUFyQjs7QUFFQUUsMkJBQWVDLEVBQWYsQ0FBa0IsT0FBbEIsRUFBMkIsVUFBVUMsQ0FBVixFQUFhOztBQUVwQyxvQkFBSUMsUUFBUVgsRUFBRSxJQUFGLENBQVo7QUFBQSxvQkFDSVksZUFBZUQsTUFBTUUsSUFBTixDQUFXLG9CQUFYLENBRG5CO0FBQUEsb0JBRUlDLGNBQWNILE1BQU1FLElBQU4sQ0FBVyxtQkFBWCxDQUZsQjs7QUFJQWIsa0JBQUVZLFlBQUYsRUFBZ0JFLFdBQWhCLENBQTRCQSxXQUE1Qjs7QUFFQUosa0JBQUVLLGNBQUY7QUFFSCxhQVZEO0FBWUg7QUFsQmtDLEtBQXZDOztBQXFCQWQsV0FBT0UsU0FBUCxDQUFpQmEsaUJBQWpCLEdBQXFDOztBQUVqQ1gsZ0JBQVEsZ0JBQVVDLE9BQVYsRUFBbUJDLFFBQW5CLEVBQTZCOztBQUVqQyxnQkFBSUMsaUJBQWlCUixFQUFFLG1CQUFGLEVBQXVCTSxPQUF2QixDQUFyQjs7QUFFQUUsMkJBQWVDLEVBQWYsQ0FBa0IsT0FBbEIsRUFBMkIsVUFBVUMsQ0FBVixFQUFhOztBQUVwQyxvQkFBSUMsUUFBUVgsRUFBRSxJQUFGLENBQVo7O0FBRUEsb0JBQUlpQixpQkFBaUJOLE1BQU1FLElBQU4sQ0FBVyxzQkFBWCxDQUFyQjtBQUNBLG9CQUFJSyxjQUFjUCxNQUFNRSxJQUFOLENBQVcsbUJBQVgsQ0FBbEI7QUFDQSxvQkFBSU0saUJBQWlCUixNQUFNRSxJQUFOLENBQVcsc0JBQVgsQ0FBckI7QUFDQSxvQkFBSU8sY0FBY1QsTUFBTUUsSUFBTixDQUFXLG1CQUFYLENBQWxCO0FBQ0Esb0JBQUlRLFNBQVNWLE1BQU1FLElBQU4sQ0FBVyxjQUFYLENBQWI7QUFDQSxvQkFBSVMsVUFBVVgsTUFBTUUsSUFBTixDQUFXLGVBQVgsQ0FBZDs7QUFHQSxvQkFBSUYsTUFBTVksUUFBTixDQUFlSCxXQUFmLENBQUosRUFBaUM7QUFDN0JULDBCQUFNYSxXQUFOLENBQWtCSixXQUFsQjtBQUNBcEIsc0JBQUVpQixjQUFGLEVBQWtCTyxXQUFsQixDQUE4Qk4sV0FBOUI7QUFDQWxCLHNCQUFFbUIsY0FBRixFQUFrQkssV0FBbEIsQ0FBOEJKLFdBQTlCO0FBQ0FwQixzQkFBRSxJQUFGLEVBQVF5QixJQUFSLENBQWF6QixFQUFFLElBQUYsRUFBUXlCLElBQVIsR0FBZUMsT0FBZixDQUF1QkwsTUFBdkIsRUFBK0JDLE9BQS9CLENBQWI7QUFDSCxpQkFMRCxNQU1LO0FBQ0RYLDBCQUFNZ0IsUUFBTixDQUFlUCxXQUFmO0FBQ0E7QUFDQXBCLHNCQUFFaUIsY0FBRixFQUFrQlUsUUFBbEIsQ0FBMkJULFdBQTNCO0FBQ0FsQixzQkFBRSxJQUFGLEVBQVF5QixJQUFSLENBQWF6QixFQUFFLElBQUYsRUFBUXlCLElBQVIsR0FBZUMsT0FBZixDQUF1QkosT0FBdkIsRUFBZ0NELE1BQWhDLENBQWI7QUFDSDs7QUFFRFgsa0JBQUVLLGNBQUY7QUFFSCxhQTNCRDtBQTZCSDtBQW5DZ0MsS0FBckM7QUF1Q0gsQ0FoRUQsRUFnRUdhLE1BaEVILEVBZ0VXM0IsTUFoRVgsRUFnRW1CQyxjQWhFbkIiLCJmaWxlIjoidXdtLXRvZ2dsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIFRvZ2dsZXMgY2xhc3NlcyBvbiBlbGVtZW50cy5cbiAqXG4gKiBVc2UgYnkgc2V0dGluZyBhIHNlbGVjdG9yIGFuZCBvbiBhbmQgb2ZmIHN0YXRlcyBmb3IgdGhlIG1hdGNoZWRcbiAqIGVsZW1lbnRzLiBGb3IgZXhhbXBsZSwgdG8gdG9nZ2xlIFwiLm9uXCIgZm9yIGEgbGlzdCBvZiBsaSdzLFxuICogYW5kIHNldCB0aGUgY2xpY2tlZCBlbGVtZW50IGNsYXNzIHRvIFwiLmFjdGl2ZVwiLCB1c2U6XG4gKlxuICogQGV4YW1wbGVcbiAqIDxkaXYgY2xhc3M9XCJ1dy1tb3JlXCI+XG4gKiAgICAgPGEgaHJlZj1cIiNcIlxuICogICAgICBkYXRhLXV3bS10b2dnbGVcbiAqICAgICAgZGF0YS1vbi10ZXh0PVwie3sgJ1ZpZXcgbGVzcyd8dCB9fVwiXG4gKiAgICAgIGRhdGEtb2ZmLXRleHQ9XCJ7eyAnVmlldyBtb3JlJ3x0IH19XCJcbiAqICAgICAgZGF0YS10b2dnbGUtc2VsZWN0b3I9XCIuc29tZS1jbGFzcyA+IGxpXCJcbiAqICAgICAgZGF0YS10b2dnbGUtc3R5bGU9XCJvblwiXG4gKiAgICAgIGRhdGEtcGFyZW50LXN0eWxlPVwiYWN0aXZlXCI+e3sgJ1ZpZXcgbW9yZSd8dCB9fVxuICogICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICogICAgICAgICAgPC9hPjwvZGl2PlxuICpcbiAqL1xuXG4oZnVuY3Rpb24gKCQsIERydXBhbCwgZHJ1cGFsU2V0dGluZ3MpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIERydXBhbC5iZWhhdmlvcnMudXdtVG9nZ2xlU3R5bGVMaWdodCA9IHtcblxuICAgICAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0LCBzZXR0aW5ncykge1xuXG4gICAgICAgICAgICB2YXIgJHRvZ2dsZUNvbnRyb2wgPSAkKCdbZGF0YS11d20tdG9nZ2xlLWNsYXNzXScsIGNvbnRleHQpO1xuXG4gICAgICAgICAgICAkdG9nZ2xlQ29udHJvbC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlVGFyZ2V0ID0gJHRoaXMuYXR0cignZGF0YS10b2dnbGUtdGFyZ2V0JyksXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZUNsYXNzID0gJHRoaXMuYXR0cignZGF0YS10b2dnbGUtY2xhc3MnKTtcblxuICAgICAgICAgICAgICAgICQodG9nZ2xlVGFyZ2V0KS50b2dnbGVDbGFzcyh0b2dnbGVDbGFzcyk7XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRHJ1cGFsLmJlaGF2aW9ycy51d21Ub2dnbGVDc3NDbGFzcyA9IHtcblxuICAgICAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0LCBzZXR0aW5ncykge1xuXG4gICAgICAgICAgICB2YXIgJHRvZ2dsZUNvbnRyb2wgPSAkKCdbZGF0YS11d20tdG9nZ2xlXScsIGNvbnRleHQpO1xuXG4gICAgICAgICAgICAkdG9nZ2xlQ29udHJvbC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIHZhciB0b2dnbGVTZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2RhdGEtdG9nZ2xlLXNlbGVjdG9yJyk7XG4gICAgICAgICAgICAgICAgdmFyIHRvZ2dsZVN0eWxlID0gJHRoaXMuYXR0cignZGF0YS10b2dnbGUtc3R5bGUnKTtcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50U2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdkYXRhLXBhcmVudC1zZWxlY3RvcicpO1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnRTdHlsZSA9ICR0aGlzLmF0dHIoJ2RhdGEtcGFyZW50LXN0eWxlJyk7XG4gICAgICAgICAgICAgICAgdmFyIG9uVGV4dCA9ICR0aGlzLmF0dHIoJ2RhdGEtb24tdGV4dCcpO1xuICAgICAgICAgICAgICAgIHZhciBvZmZUZXh0ID0gJHRoaXMuYXR0cignZGF0YS1vZmYtdGV4dCcpO1xuXG5cbiAgICAgICAgICAgICAgICBpZiAoJHRoaXMuaGFzQ2xhc3MocGFyZW50U3R5bGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLnJlbW92ZUNsYXNzKHBhcmVudFN0eWxlKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0b2dnbGVTZWxlY3RvcikucmVtb3ZlQ2xhc3ModG9nZ2xlU3R5bGUpO1xuICAgICAgICAgICAgICAgICAgICAkKHBhcmVudFNlbGVjdG9yKS5yZW1vdmVDbGFzcyhwYXJlbnRTdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuaHRtbCgkKHRoaXMpLmh0bWwoKS5yZXBsYWNlKG9uVGV4dCwgb2ZmVGV4dCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MocGFyZW50U3R5bGUpO1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSByZW1vdmUgdGhlIHN0eWxlIG9uIGZpcnN0IHJ1blxuICAgICAgICAgICAgICAgICAgICAkKHRvZ2dsZVNlbGVjdG9yKS5hZGRDbGFzcyh0b2dnbGVTdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuaHRtbCgkKHRoaXMpLmh0bWwoKS5yZXBsYWNlKG9mZlRleHQsIG9uVGV4dCkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIH07XG5cblxufSkoalF1ZXJ5LCBEcnVwYWwsIGRydXBhbFNldHRpbmdzKTtcbiJdfQ==
