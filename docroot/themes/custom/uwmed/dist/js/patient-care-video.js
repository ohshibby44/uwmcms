'use strict';

(function ($, Drupal) {
  Drupal.behaviors.patientCareVideo = {
    attach: function attach() {

      var video = $('#patientCareVideoPlayer')[0];
      var touchEvents = 'ontouchstart' in document.documentElement;

      // if(typeof(video.play) === "undefined" || (!video.duration > 0)) {
      //   if(typeof(video.duration !== "undefined")) {
      //     // hide the play button because this browser can't play this video
      //     $(".homepage-section__story-link").hide();
      //     $("#patientCarePlayButton").hide();
      //   }
      // }

      if (screenfull.enabled && touchEvents) {
        // we can play full screen and this device has touch events, likely a mobile
        screenfull.on('change', function () {
          if (!screenfull.isFullscreen) {
            video.pause();
            $('#patientCareVideo').parents().first().hide();
          }
        });

        $('#patientCarePlayButton').on('click', function () {
          $('#patientCareVideo').parents().first().show();
          screenfull.request(video);
          video.play();
        });
      } else if (typeof video.webkitEnterFullscreen === "function" && touchEvents) {
        // some iOS devices are not covered by screenfull
        $(video).on('webkitendfullscreen', function () {
          video.pause();
          $('#patientCareVideo').parents().first().hide();
        });

        $('#patientCarePlayButton').on('click', function () {
          $('#patientCareVideo').parents().first().show();
          video.webkitEnterFullscreen();
          video.play();
        });
      } else {
        // we're on a desktop or this device doesn't support full screen,
        // let's display the video in a colorbox

        jQuery('#patientCarePlayButton').colorbox({
          inline: true,
          width: '75%',
          height: 'auto',
          href: '#patientCareVideo',
          scrolling: false,
          onOpen: function onOpen() {
            $('.page-node-type-homepage .homepage-section__story-link .faa-burst.animated').css('animation-play-state', 'paused');
            video.focus();
          },
          onClosed: function onClosed() {
            $('.page-node-type-homepage .homepage-section__story-link .faa-burst.animated').css('animation-play-state', 'running');
          },
          onComplete: function onComplete() {
            video.play();
          },
          onCleanup: function onCleanup() {
            video.pause();
          }
        });
      }
    }
  };
})(jQuery, Drupal);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhdGllbnQtY2FyZS12aWRlby5qcyJdLCJuYW1lcyI6WyIkIiwiRHJ1cGFsIiwiYmVoYXZpb3JzIiwicGF0aWVudENhcmVWaWRlbyIsImF0dGFjaCIsInZpZGVvIiwidG91Y2hFdmVudHMiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsInNjcmVlbmZ1bGwiLCJlbmFibGVkIiwib24iLCJpc0Z1bGxzY3JlZW4iLCJwYXVzZSIsInBhcmVudHMiLCJmaXJzdCIsImhpZGUiLCJzaG93IiwicmVxdWVzdCIsInBsYXkiLCJ3ZWJraXRFbnRlckZ1bGxzY3JlZW4iLCJqUXVlcnkiLCJjb2xvcmJveCIsImlubGluZSIsIndpZHRoIiwiaGVpZ2h0IiwiaHJlZiIsInNjcm9sbGluZyIsIm9uT3BlbiIsImNzcyIsImZvY3VzIiwib25DbG9zZWQiLCJvbkNvbXBsZXRlIiwib25DbGVhbnVwIl0sIm1hcHBpbmdzIjoiOztBQUFBLENBQUMsVUFBVUEsQ0FBVixFQUFhQyxNQUFiLEVBQXFCO0FBQ3BCQSxTQUFPQyxTQUFQLENBQWlCQyxnQkFBakIsR0FBb0M7QUFDbENDLFlBQVEsa0JBQVk7O0FBRWxCLFVBQUlDLFFBQVFMLEVBQUUseUJBQUYsRUFBNkIsQ0FBN0IsQ0FBWjtBQUNBLFVBQUlNLGNBQWUsa0JBQWtCQyxTQUFTQyxlQUE5Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxVQUFHQyxXQUFXQyxPQUFYLElBQXNCSixXQUF6QixFQUFzQztBQUNwQztBQUNBRyxtQkFBV0UsRUFBWCxDQUFjLFFBQWQsRUFBd0IsWUFBWTtBQUNsQyxjQUFJLENBQUNGLFdBQVdHLFlBQWhCLEVBQThCO0FBQzVCUCxrQkFBTVEsS0FBTjtBQUNBYixjQUFFLG1CQUFGLEVBQXVCYyxPQUF2QixHQUFpQ0MsS0FBakMsR0FBeUNDLElBQXpDO0FBQ0Q7QUFDRixTQUxEOztBQU9BaEIsVUFBRSx3QkFBRixFQUE0QlcsRUFBNUIsQ0FBK0IsT0FBL0IsRUFBd0MsWUFBWTtBQUNsRFgsWUFBRSxtQkFBRixFQUF1QmMsT0FBdkIsR0FBaUNDLEtBQWpDLEdBQXlDRSxJQUF6QztBQUNBUixxQkFBV1MsT0FBWCxDQUFtQmIsS0FBbkI7QUFDQUEsZ0JBQU1jLElBQU47QUFDRCxTQUpEO0FBS0QsT0FkRCxNQWNPLElBQUksT0FBT2QsTUFBTWUscUJBQWIsS0FBd0MsVUFBeEMsSUFBc0RkLFdBQTFELEVBQXdFO0FBQzdFO0FBQ0FOLFVBQUVLLEtBQUYsRUFBU00sRUFBVCxDQUFZLHFCQUFaLEVBQWtDLFlBQVc7QUFDM0NOLGdCQUFNUSxLQUFOO0FBQ0FiLFlBQUUsbUJBQUYsRUFBdUJjLE9BQXZCLEdBQWlDQyxLQUFqQyxHQUF5Q0MsSUFBekM7QUFDRCxTQUhEOztBQUtBaEIsVUFBRSx3QkFBRixFQUE0QlcsRUFBNUIsQ0FBK0IsT0FBL0IsRUFBd0MsWUFBVTtBQUNoRFgsWUFBRSxtQkFBRixFQUF1QmMsT0FBdkIsR0FBaUNDLEtBQWpDLEdBQXlDRSxJQUF6QztBQUNBWixnQkFBTWUscUJBQU47QUFDQWYsZ0JBQU1jLElBQU47QUFDRCxTQUpEO0FBS0QsT0FaTSxNQVlBO0FBQ0w7QUFDQTs7QUFFQUUsZUFBTyx3QkFBUCxFQUFpQ0MsUUFBakMsQ0FDRTtBQUNFQyxrQkFBUSxJQURWO0FBRUVDLGlCQUFPLEtBRlQ7QUFHRUMsa0JBQVEsTUFIVjtBQUlFQyxnQkFBTSxtQkFKUjtBQUtFQyxxQkFBVyxLQUxiO0FBTUVDLGtCQUFRLGtCQUFZO0FBQ2xCNUIsY0FBRSw0RUFBRixFQUFnRjZCLEdBQWhGLENBQW9GLHNCQUFwRixFQUE0RyxRQUE1RztBQUNBeEIsa0JBQU15QixLQUFOO0FBQ0QsV0FUSDtBQVVFQyxvQkFBVSxvQkFBWTtBQUNwQi9CLGNBQUUsNEVBQUYsRUFBZ0Y2QixHQUFoRixDQUFvRixzQkFBcEYsRUFBNEcsU0FBNUc7QUFDRCxXQVpIO0FBYUVHLHNCQUFZLHNCQUFZO0FBQ3RCM0Isa0JBQU1jLElBQU47QUFDRCxXQWZIO0FBZ0JFYyxxQkFBVyxxQkFBWTtBQUNyQjVCLGtCQUFNUSxLQUFOO0FBQ0Q7QUFsQkgsU0FERjtBQXNCRDtBQUNGO0FBbkVpQyxHQUFwQztBQXFFRCxDQXRFRCxFQXNFR1EsTUF0RUgsRUFzRVdwQixNQXRFWCIsImZpbGUiOiJwYXRpZW50LWNhcmUtdmlkZW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCQsIERydXBhbCkge1xuICBEcnVwYWwuYmVoYXZpb3JzLnBhdGllbnRDYXJlVmlkZW8gPSB7XG4gICAgYXR0YWNoOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgIHZhciB2aWRlbyA9ICQoJyNwYXRpZW50Q2FyZVZpZGVvUGxheWVyJylbMF07XG4gICAgICB2YXIgdG91Y2hFdmVudHMgPSAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcblxuICAgICAgLy8gaWYodHlwZW9mKHZpZGVvLnBsYXkpID09PSBcInVuZGVmaW5lZFwiIHx8ICghdmlkZW8uZHVyYXRpb24gPiAwKSkge1xuICAgICAgLy8gICBpZih0eXBlb2YodmlkZW8uZHVyYXRpb24gIT09IFwidW5kZWZpbmVkXCIpKSB7XG4gICAgICAvLyAgICAgLy8gaGlkZSB0aGUgcGxheSBidXR0b24gYmVjYXVzZSB0aGlzIGJyb3dzZXIgY2FuJ3QgcGxheSB0aGlzIHZpZGVvXG4gICAgICAvLyAgICAgJChcIi5ob21lcGFnZS1zZWN0aW9uX19zdG9yeS1saW5rXCIpLmhpZGUoKTtcbiAgICAgIC8vICAgICAkKFwiI3BhdGllbnRDYXJlUGxheUJ1dHRvblwiKS5oaWRlKCk7XG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH1cblxuICAgICAgaWYoc2NyZWVuZnVsbC5lbmFibGVkICYmIHRvdWNoRXZlbnRzKSB7XG4gICAgICAgIC8vIHdlIGNhbiBwbGF5IGZ1bGwgc2NyZWVuIGFuZCB0aGlzIGRldmljZSBoYXMgdG91Y2ggZXZlbnRzLCBsaWtlbHkgYSBtb2JpbGVcbiAgICAgICAgc2NyZWVuZnVsbC5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghc2NyZWVuZnVsbC5pc0Z1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIHZpZGVvLnBhdXNlKCk7XG4gICAgICAgICAgICAkKCcjcGF0aWVudENhcmVWaWRlbycpLnBhcmVudHMoKS5maXJzdCgpLmhpZGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJyNwYXRpZW50Q2FyZVBsYXlCdXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJCgnI3BhdGllbnRDYXJlVmlkZW8nKS5wYXJlbnRzKCkuZmlyc3QoKS5zaG93KCk7XG4gICAgICAgICAgc2NyZWVuZnVsbC5yZXF1ZXN0KHZpZGVvKTtcbiAgICAgICAgICB2aWRlby5wbGF5KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmKCB0eXBlb2YodmlkZW8ud2Via2l0RW50ZXJGdWxsc2NyZWVuKSA9PT0gXCJmdW5jdGlvblwiICYmIHRvdWNoRXZlbnRzICkge1xuICAgICAgICAvLyBzb21lIGlPUyBkZXZpY2VzIGFyZSBub3QgY292ZXJlZCBieSBzY3JlZW5mdWxsXG4gICAgICAgICQodmlkZW8pLm9uKCd3ZWJraXRlbmRmdWxsc2NyZWVuJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICB2aWRlby5wYXVzZSgpO1xuICAgICAgICAgICQoJyNwYXRpZW50Q2FyZVZpZGVvJykucGFyZW50cygpLmZpcnN0KCkuaGlkZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcjcGF0aWVudENhcmVQbGF5QnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAkKCcjcGF0aWVudENhcmVWaWRlbycpLnBhcmVudHMoKS5maXJzdCgpLnNob3coKTtcbiAgICAgICAgICB2aWRlby53ZWJraXRFbnRlckZ1bGxzY3JlZW4oKTtcbiAgICAgICAgICB2aWRlby5wbGF5KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gd2UncmUgb24gYSBkZXNrdG9wIG9yIHRoaXMgZGV2aWNlIGRvZXNuJ3Qgc3VwcG9ydCBmdWxsIHNjcmVlbixcbiAgICAgICAgLy8gbGV0J3MgZGlzcGxheSB0aGUgdmlkZW8gaW4gYSBjb2xvcmJveFxuXG4gICAgICAgIGpRdWVyeSgnI3BhdGllbnRDYXJlUGxheUJ1dHRvbicpLmNvbG9yYm94KFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlubGluZTogdHJ1ZSxcbiAgICAgICAgICAgIHdpZHRoOiAnNzUlJyxcbiAgICAgICAgICAgIGhlaWdodDogJ2F1dG8nLFxuICAgICAgICAgICAgaHJlZjogJyNwYXRpZW50Q2FyZVZpZGVvJyxcbiAgICAgICAgICAgIHNjcm9sbGluZzogZmFsc2UsXG4gICAgICAgICAgICBvbk9wZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgJCgnLnBhZ2Utbm9kZS10eXBlLWhvbWVwYWdlIC5ob21lcGFnZS1zZWN0aW9uX19zdG9yeS1saW5rIC5mYWEtYnVyc3QuYW5pbWF0ZWQnKS5jc3MoJ2FuaW1hdGlvbi1wbGF5LXN0YXRlJywgJ3BhdXNlZCcpO1xuICAgICAgICAgICAgICB2aWRlby5mb2N1cygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uQ2xvc2VkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICQoJy5wYWdlLW5vZGUtdHlwZS1ob21lcGFnZSAuaG9tZXBhZ2Utc2VjdGlvbl9fc3RvcnktbGluayAuZmFhLWJ1cnN0LmFuaW1hdGVkJykuY3NzKCdhbmltYXRpb24tcGxheS1zdGF0ZScsICdydW5uaW5nJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2aWRlby5wbGF5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25DbGVhbnVwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZpZGVvLnBhdXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSkoalF1ZXJ5LCBEcnVwYWwpOyJdfQ==
