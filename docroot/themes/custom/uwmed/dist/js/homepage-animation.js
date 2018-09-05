"use strict";

/**
 * @file
 * Homepage parallax for UW Medicine.
 */

(function ($, Drupal) {
  // media query event handler
  if (matchMedia) {
    var mq = window.matchMedia("(min-width: 1200px)");
    mq.addListener(WidthChange);
    WidthChange(mq);
  }

  // detect media query change and turn scrollmagic controller on/off
  function WidthChange(mq) {
    if (mq.matches) {
      // screen size is 1200px
      if (window.controller && window.controller.enabled() === false) {
        // there's already a controller but it's disabled
        window.controller.enabled(true);
      } else {
        // there's no controller so let's create one and add scenes
        window.controller = new ScrollMagic.Controller({
          globalSceneOptions: {
            triggerHook: 'onLeave'
          }
        });

        // get all slides
        var slides = document.querySelectorAll("section.homepage-section");

        // create scene for every slide
        for (var i = 0; i < slides.length; i++) {
          new ScrollMagic.Scene({
            triggerElement: slides[i],
            reverse: false,
            offset: -350
          }).addTo(controller).on("start", function (e) {
            e.currentTarget.triggerElement().className += " animation-applied";
          });
        }
      }
    } else {
      // screen size is less than 1200px
      if (window.controller && window.controller.enabled() === true) {
        // there's a controller, let's disable it
        window.controller = controller.enabled(false);
      }
    }
  }
})(jQuery, Drupal);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWVwYWdlLWFuaW1hdGlvbi5qcyJdLCJuYW1lcyI6WyIkIiwiRHJ1cGFsIiwibWF0Y2hNZWRpYSIsIm1xIiwid2luZG93IiwiYWRkTGlzdGVuZXIiLCJXaWR0aENoYW5nZSIsIm1hdGNoZXMiLCJjb250cm9sbGVyIiwiZW5hYmxlZCIsIlNjcm9sbE1hZ2ljIiwiQ29udHJvbGxlciIsImdsb2JhbFNjZW5lT3B0aW9ucyIsInRyaWdnZXJIb29rIiwic2xpZGVzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaSIsImxlbmd0aCIsIlNjZW5lIiwidHJpZ2dlckVsZW1lbnQiLCJyZXZlcnNlIiwib2Zmc2V0IiwiYWRkVG8iLCJvbiIsImUiLCJjdXJyZW50VGFyZ2V0IiwiY2xhc3NOYW1lIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztBQUtBLENBQUMsVUFBVUEsQ0FBVixFQUFhQyxNQUFiLEVBQXFCO0FBQ3BCO0FBQ0EsTUFBSUMsVUFBSixFQUFnQjtBQUNkLFFBQU1DLEtBQUtDLE9BQU9GLFVBQVAsQ0FBa0IscUJBQWxCLENBQVg7QUFDQUMsT0FBR0UsV0FBSCxDQUFlQyxXQUFmO0FBQ0FBLGdCQUFZSCxFQUFaO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFTRyxXQUFULENBQXFCSCxFQUFyQixFQUF5QjtBQUN2QixRQUFJQSxHQUFHSSxPQUFQLEVBQWdCO0FBQ2Q7QUFDQSxVQUFJSCxPQUFPSSxVQUFQLElBQXFCSixPQUFPSSxVQUFQLENBQWtCQyxPQUFsQixPQUFnQyxLQUF6RCxFQUFnRTtBQUM5RDtBQUNBTCxlQUFPSSxVQUFQLENBQWtCQyxPQUFsQixDQUEwQixJQUExQjtBQUNELE9BSEQsTUFJSztBQUNIO0FBQ0FMLGVBQU9JLFVBQVAsR0FBb0IsSUFBSUUsWUFBWUMsVUFBaEIsQ0FBMkI7QUFDN0NDLDhCQUFvQjtBQUNsQkMseUJBQWE7QUFESztBQUR5QixTQUEzQixDQUFwQjs7QUFNQTtBQUNBLFlBQUlDLFNBQVNDLFNBQVNDLGdCQUFULENBQTBCLDBCQUExQixDQUFiOztBQUVBO0FBQ0EsYUFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILE9BQU9JLE1BQTNCLEVBQW1DRCxHQUFuQyxFQUF3QztBQUN0QyxjQUFJUCxZQUFZUyxLQUFoQixDQUFzQjtBQUNwQkMsNEJBQWdCTixPQUFPRyxDQUFQLENBREk7QUFFcEJJLHFCQUFTLEtBRlc7QUFHcEJDLG9CQUFRLENBQUM7QUFIVyxXQUF0QixFQUtLQyxLQUxMLENBS1dmLFVBTFgsRUFNS2dCLEVBTkwsQ0FNUSxPQU5SLEVBTWlCLFVBQVVDLENBQVYsRUFBYTtBQUN4QkEsY0FBRUMsYUFBRixDQUFnQk4sY0FBaEIsR0FBaUNPLFNBQWpDLElBQThDLG9CQUE5QztBQUNELFdBUkw7QUFTRDtBQUNGO0FBQ0YsS0E5QkQsTUErQks7QUFDSDtBQUNBLFVBQUl2QixPQUFPSSxVQUFQLElBQXFCSixPQUFPSSxVQUFQLENBQWtCQyxPQUFsQixPQUFnQyxJQUF6RCxFQUErRDtBQUM3RDtBQUNBTCxlQUFPSSxVQUFQLEdBQW9CQSxXQUFXQyxPQUFYLENBQW1CLEtBQW5CLENBQXBCO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YsQ0FqREQsRUFpREdtQixNQWpESCxFQWlEVzNCLE1BakRYIiwiZmlsZSI6ImhvbWVwYWdlLWFuaW1hdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIEhvbWVwYWdlIHBhcmFsbGF4IGZvciBVVyBNZWRpY2luZS5cbiAqL1xuXG4oZnVuY3Rpb24gKCQsIERydXBhbCkge1xuICAvLyBtZWRpYSBxdWVyeSBldmVudCBoYW5kbGVyXG4gIGlmIChtYXRjaE1lZGlhKSB7XG4gICAgY29uc3QgbXEgPSB3aW5kb3cubWF0Y2hNZWRpYShcIihtaW4td2lkdGg6IDEyMDBweClcIik7XG4gICAgbXEuYWRkTGlzdGVuZXIoV2lkdGhDaGFuZ2UpO1xuICAgIFdpZHRoQ2hhbmdlKG1xKTtcbiAgfVxuXG4gIC8vIGRldGVjdCBtZWRpYSBxdWVyeSBjaGFuZ2UgYW5kIHR1cm4gc2Nyb2xsbWFnaWMgY29udHJvbGxlciBvbi9vZmZcbiAgZnVuY3Rpb24gV2lkdGhDaGFuZ2UobXEpIHtcbiAgICBpZiAobXEubWF0Y2hlcykge1xuICAgICAgLy8gc2NyZWVuIHNpemUgaXMgMTIwMHB4XG4gICAgICBpZiAod2luZG93LmNvbnRyb2xsZXIgJiYgd2luZG93LmNvbnRyb2xsZXIuZW5hYmxlZCgpID09PSBmYWxzZSkge1xuICAgICAgICAvLyB0aGVyZSdzIGFscmVhZHkgYSBjb250cm9sbGVyIGJ1dCBpdCdzIGRpc2FibGVkXG4gICAgICAgIHdpbmRvdy5jb250cm9sbGVyLmVuYWJsZWQodHJ1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gdGhlcmUncyBubyBjb250cm9sbGVyIHNvIGxldCdzIGNyZWF0ZSBvbmUgYW5kIGFkZCBzY2VuZXNcbiAgICAgICAgd2luZG93LmNvbnRyb2xsZXIgPSBuZXcgU2Nyb2xsTWFnaWMuQ29udHJvbGxlcih7XG4gICAgICAgICAgZ2xvYmFsU2NlbmVPcHRpb25zOiB7XG4gICAgICAgICAgICB0cmlnZ2VySG9vazogJ29uTGVhdmUnXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBnZXQgYWxsIHNsaWRlc1xuICAgICAgICB2YXIgc2xpZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInNlY3Rpb24uaG9tZXBhZ2Utc2VjdGlvblwiKTtcblxuICAgICAgICAvLyBjcmVhdGUgc2NlbmUgZm9yIGV2ZXJ5IHNsaWRlXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbmV3IFNjcm9sbE1hZ2ljLlNjZW5lKHtcbiAgICAgICAgICAgIHRyaWdnZXJFbGVtZW50OiBzbGlkZXNbaV0sXG4gICAgICAgICAgICByZXZlcnNlOiBmYWxzZSxcbiAgICAgICAgICAgIG9mZnNldDogLTM1MFxuICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hZGRUbyhjb250cm9sbGVyKVxuICAgICAgICAgICAgICAub24oXCJzdGFydFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUuY3VycmVudFRhcmdldC50cmlnZ2VyRWxlbWVudCgpLmNsYXNzTmFtZSArPSBcIiBhbmltYXRpb24tYXBwbGllZFwiO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gc2NyZWVuIHNpemUgaXMgbGVzcyB0aGFuIDEyMDBweFxuICAgICAgaWYgKHdpbmRvdy5jb250cm9sbGVyICYmIHdpbmRvdy5jb250cm9sbGVyLmVuYWJsZWQoKSA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyB0aGVyZSdzIGEgY29udHJvbGxlciwgbGV0J3MgZGlzYWJsZSBpdFxuICAgICAgICB3aW5kb3cuY29udHJvbGxlciA9IGNvbnRyb2xsZXIuZW5hYmxlZChmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KShqUXVlcnksIERydXBhbCk7Il19
