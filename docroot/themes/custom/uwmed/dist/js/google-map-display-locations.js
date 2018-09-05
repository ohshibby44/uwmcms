"use strict";

window.initMap = function () {}; // initialize function in time for google maps to find it

(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.googleMapDisplayLocations = {
    attach: function attach() {

      window.initMap = function () {
        var clinics = drupalSettings['uwmcms_reader_medical_service_clinics'];

        var initialIcon = {
          url: "/themes/custom/uwmed/dist/assets/map-marker-purple.svg",
          scaledSize: new google.maps.Size(30, 30)
        };

        var selectedIcon = {
          url: "/themes/custom/uwmed/dist/assets/map-marker-purple-selected.svg",
          scaledSize: new google.maps.Size(35, 35)
        };

        window.map = new google.maps.Map(document.getElementById('locationMap'));

        var markers = [],
            marker,
            i;
        for (i = 0; i < clinics.length; i++) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(clinics[i].latitude, clinics[i].longitude),
            map: map,
            title: clinics[i].name,
            index: i,
            icon: initialIcon,
            locationId: clinics[i].locationId,
            clinicId: clinics[i].clinicId
          });
          markers.push(marker);
          // attach event listeners to marker
          attachToggleMarkerSize(marker, selectedIcon, initialIcon);
          attachDisplayClinicInformation(marker, clinics);
        }

        // calculate bounds of markers, then center and zoom to fit
        var bounds = new google.maps.LatLngBounds();
        for (i = 0; i < markers.length; i++) {
          bounds.extend(markers[i].getPosition());
        }
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds, 0);

        // attach event listeners to map
        attachClearSelectedMarker(map, initialIcon);

        // if we have a device's location, pan to closest location
        panToClosestLocation(map, markers);

        // create a global variable to indicate map was loaded,
        // if initMap didn't trigger and set this variable, we'll trigger
        // it below
        window.initMapComplete = true;
      };

      // marker event handlers
      window.lastSelectedMarker = null;
      var attachToggleMarkerSize = function attachToggleMarkerSize(marker, selectedIcon, initialIcon) {
        marker.addListener('click', function () {
          if (window.lastSelectedMarker) {
            window.lastSelectedMarker.setIcon(initialIcon);
          }

          if (!marker.isClosestLocation) {
            $('.find-a-location__closest-indicator').hide();
            $('.find-a-location__selected-indicator').show();
          } else {
            $('.find-a-location__selected-indicator').hide();
            $('.find-a-location__closest-indicator').show();
          }

          marker.setIcon(selectedIcon);
          window.lastSelectedMarker = marker;
        });
      };

      var attachClearSelectedMarker = function attachClearSelectedMarker(map, initialIcon) {
        map.addListener('click', function () {
          if (window.lastSelectedMarker) {
            window.lastSelectedMarker.setIcon(initialIcon);
          }

          var clinicInfo = $('.find-a-location__clinic-info');
          if (clinicInfo.children().length > 0) {

            $(clinicInfo).fadeOut();
            $('.find-a-location__heading').fadeOut();
          }
        });
      };

      var attachDisplayClinicInformation = function attachDisplayClinicInformation(marker) {
        marker.addListener('click', function () {
          var clinicList = $('.find-a-location__clinic-list');
          var clinicInfo = $('.find-a-location__clinic-info');
          var clinic = clinicList.find("[data-location-id='" + marker.locationId + "']");

          if (clinicInfo.children().length > 0) {
            $('.find-a-location__heading').fadeOut("fast");
            $(clinicInfo).fadeOut("fast", function () {
              $(clinicInfo).empty();
              $(clinic).children().clone().appendTo(clinicInfo);
              $(clinicInfo).fadeIn("fast");
              $('.find-a-location__heading').fadeIn("fast");
            });
          } else {
            $(clinic).children().clone().appendTo(clinicInfo);
            $('.find-a-location__heading').fadeIn();
            $(clinicInfo).fadeIn();
          }
        });
      };

      $('#viewAllLocations').unbind('click').click(function (e) {
        e.preventDefault();
        var btnTextEl = $(this).find('#label');
        var btnArrowEl = $(this).find('#arrow');
        var clinicList = $('.find-a-location__clinic-list');
        var clinics = clinicList.children();

        switch (btnTextEl.text()) {
          case 'List All Locations':
            clinicList.fadeIn({ queue: false });
            clinics.fadeIn();
            btnTextEl.text("Hide All Locations");
            btnArrowEl.removeClass("fa-angle-down").addClass("fa-angle-up");
            break;
          case 'Hide All Locations':
            clinicList.fadeOut({ queue: false });
            clinics.fadeOut();
            btnTextEl.text("List All Locations");
            btnArrowEl.removeClass("fa-angle-up").addClass("fa-angle-down");
            break;
        }
      });

      var panToClosestLocation = function panToClosestLocation(map, markers) {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(function (position) {
            var browserLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var shortestDistance, closestLocation, i;
            for (i = 0; i < markers.length; i++) {
              var distance = google.maps.geometry.spherical.computeDistanceBetween(browserLoc, markers[i].getPosition());

              if (!shortestDistance || distance < shortestDistance) {
                shortestDistance = distance;
                closestLocation = markers[i];
              }
            }

            closestLocation.isClosestLocation = true;

            var browserLocMarker = new google.maps.Marker({
              position: browserLoc,
              map: map,
              title: 'Your Location',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#6f3178',
                fillOpacity: 1,
                scale: 8,
                strokeColor: 'white',
                strokeWeight: 2
              }
            });

            // set bounds to show browserLoc and closest location
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(closestLocation.getPosition());
            bounds.extend(browserLocMarker.getPosition());
            map.setCenter(bounds.getCenter());
            shortestDistance < 10000 ? map.fitBounds(bounds) : map.fitBounds(bounds, 90);

            // click on closest location so it's highlighted and info is displayed
            google.maps.event.trigger(closestLocation, 'click');

            $('.find-a-location__no-geolocation').hide();
            // $('.find-a-location__closest-indicator').removeClass('hidden');
            // $('.find-a-location__selected-indicator').addClass('hidden');
          });
        }
      };
    }
  };
})(jQuery, Drupal, drupalSettings);

// when document is ready, initMap for IE11
if (document.readyState === 'complete') {
  if (!window.initMapComplete) {
    initMap();
  }
} else {
  document.addEventListener('readystatechange', function () {
    if (document.readyState === 'complete') if (!window.initMapComplete) {
      initMap();
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdvb2dsZS1tYXAtZGlzcGxheS1sb2NhdGlvbnMuanMiXSwibmFtZXMiOlsid2luZG93IiwiaW5pdE1hcCIsIiQiLCJEcnVwYWwiLCJkcnVwYWxTZXR0aW5ncyIsImJlaGF2aW9ycyIsImdvb2dsZU1hcERpc3BsYXlMb2NhdGlvbnMiLCJhdHRhY2giLCJjbGluaWNzIiwiaW5pdGlhbEljb24iLCJ1cmwiLCJzY2FsZWRTaXplIiwiZ29vZ2xlIiwibWFwcyIsIlNpemUiLCJzZWxlY3RlZEljb24iLCJtYXAiLCJNYXAiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwibWFya2VycyIsIm1hcmtlciIsImkiLCJsZW5ndGgiLCJNYXJrZXIiLCJwb3NpdGlvbiIsIkxhdExuZyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwidGl0bGUiLCJuYW1lIiwiaW5kZXgiLCJpY29uIiwibG9jYXRpb25JZCIsImNsaW5pY0lkIiwicHVzaCIsImF0dGFjaFRvZ2dsZU1hcmtlclNpemUiLCJhdHRhY2hEaXNwbGF5Q2xpbmljSW5mb3JtYXRpb24iLCJib3VuZHMiLCJMYXRMbmdCb3VuZHMiLCJleHRlbmQiLCJnZXRQb3NpdGlvbiIsInNldENlbnRlciIsImdldENlbnRlciIsImZpdEJvdW5kcyIsImF0dGFjaENsZWFyU2VsZWN0ZWRNYXJrZXIiLCJwYW5Ub0Nsb3Nlc3RMb2NhdGlvbiIsImluaXRNYXBDb21wbGV0ZSIsImxhc3RTZWxlY3RlZE1hcmtlciIsImFkZExpc3RlbmVyIiwic2V0SWNvbiIsImlzQ2xvc2VzdExvY2F0aW9uIiwiaGlkZSIsInNob3ciLCJjbGluaWNJbmZvIiwiY2hpbGRyZW4iLCJmYWRlT3V0IiwiY2xpbmljTGlzdCIsImNsaW5pYyIsImZpbmQiLCJlbXB0eSIsImNsb25lIiwiYXBwZW5kVG8iLCJmYWRlSW4iLCJ1bmJpbmQiLCJjbGljayIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImJ0blRleHRFbCIsImJ0bkFycm93RWwiLCJ0ZXh0IiwicXVldWUiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwibmF2aWdhdG9yIiwiZ2VvbG9jYXRpb24iLCJnZXRDdXJyZW50UG9zaXRpb24iLCJicm93c2VyTG9jIiwiY29vcmRzIiwic2hvcnRlc3REaXN0YW5jZSIsImNsb3Nlc3RMb2NhdGlvbiIsImRpc3RhbmNlIiwiZ2VvbWV0cnkiLCJzcGhlcmljYWwiLCJjb21wdXRlRGlzdGFuY2VCZXR3ZWVuIiwiYnJvd3NlckxvY01hcmtlciIsInBhdGgiLCJTeW1ib2xQYXRoIiwiQ0lSQ0xFIiwiZmlsbENvbG9yIiwiZmlsbE9wYWNpdHkiLCJzY2FsZSIsInN0cm9rZUNvbG9yIiwic3Ryb2tlV2VpZ2h0IiwiZXZlbnQiLCJ0cmlnZ2VyIiwialF1ZXJ5IiwicmVhZHlTdGF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiXSwibWFwcGluZ3MiOiI7O0FBQUFBLE9BQU9DLE9BQVAsR0FBaUIsWUFBVyxDQUFFLENBQTlCLEMsQ0FBZ0M7O0FBRWhDLENBQUMsVUFBVUMsQ0FBVixFQUFhQyxNQUFiLEVBQXFCQyxjQUFyQixFQUFxQztBQUNwQ0QsU0FBT0UsU0FBUCxDQUFpQkMseUJBQWpCLEdBQTZDO0FBQzNDQyxZQUFRLGtCQUFZOztBQUVsQlAsYUFBT0MsT0FBUCxHQUFpQixZQUFZO0FBQzNCLFlBQUlPLFVBQVVKLGVBQWUsdUNBQWYsQ0FBZDs7QUFFQSxZQUFJSyxjQUFjO0FBQ2hCQyxlQUFLLHdEQURXO0FBRWhCQyxzQkFBWSxJQUFJQyxPQUFPQyxJQUFQLENBQVlDLElBQWhCLENBQXFCLEVBQXJCLEVBQXlCLEVBQXpCO0FBRkksU0FBbEI7O0FBS0EsWUFBSUMsZUFBZTtBQUNqQkwsZUFBSyxpRUFEWTtBQUVqQkMsc0JBQVksSUFBSUMsT0FBT0MsSUFBUCxDQUFZQyxJQUFoQixDQUFxQixFQUFyQixFQUF5QixFQUF6QjtBQUZLLFNBQW5COztBQUtBZCxlQUFPZ0IsR0FBUCxHQUFhLElBQUlKLE9BQU9DLElBQVAsQ0FBWUksR0FBaEIsQ0FBb0JDLFNBQVNDLGNBQVQsQ0FBd0IsYUFBeEIs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LFNBQUosQ0FBY04sTUFBZCxDQUEzQixHQUFtRHRCLElBQUk0QixTQUFKLENBQWNOLE1BQWQsRUFBc0IsRUFBdEIsQ0FBbkQ7O0FBRUE7QUFDQTFCLG1CQUFPQyxJQUFQLENBQVlpRixLQUFaLENBQWtCQyxPQUFsQixDQUEwQmYsZUFBMUIsRUFBMkMsT0FBM0M7O0FBRUE5RSxjQUFFLGtDQUFGLEVBQXNDa0QsSUFBdEM7QUFDQTtBQUNBO0FBRUQsV0E1Q0Q7QUE2Q0Q7QUFDRixPQWhERDtBQWlERDtBQTVMMEMsR0FBN0M7QUE4TEQsQ0EvTEQsRUErTEc0QyxNQS9MSCxFQStMVTdGLE1BL0xWLEVBK0xrQkMsY0EvTGxCOztBQWlNQTtBQUNBLElBQUdjLFNBQVMrRSxVQUFULEtBQXdCLFVBQTNCLEVBQXVDO0FBQ3JDLE1BQUcsQ0FBQ2pHLE9BQU8rQyxlQUFYLEVBQTRCO0FBQzFCOUM7QUFDRDtBQUNGLENBSkQsTUFLSztBQUNIaUIsV0FBU2dGLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxZQUFXO0FBQ3ZELFFBQUloRixTQUFTK0UsVUFBVCxLQUF3QixVQUE1QixFQUNFLElBQUcsQ0FBQ2pHLE9BQU8rQyxlQUFYLEVBQTRCO0FBQzFCOUM7QUFDRDtBQUNKLEdBTEQ7QUFNRCIsImZpbGUiOiJnb29nbGUtbWFwLWRpc3BsYXktbG9jYXRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsid2luZG93LmluaXRNYXAgPSBmdW5jdGlvbigpIHt9OyAvLyBpbml0aWFsaXplIGZ1bmN0aW9uIGluIHRpbWUgZm9yIGdvb2dsZSBtYXBzIHRvIGZpbmQgaXRcblxuKGZ1bmN0aW9uICgkLCBEcnVwYWwsIGRydXBhbFNldHRpbmdzKSB7XG4gIERydXBhbC5iZWhhdmlvcnMuZ29vZ2xlTWFwRGlzcGxheUxvY2F0aW9ucyA9IHtcbiAgICBhdHRhY2g6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgd2luZG93LmluaXRNYXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjbGluaWNzID0gZHJ1cGFsU2V0dGluZ3NbJ3V3bWNtc19yZWFkZXJfbWVkaWNhbF9zZXJ2aWNlX2NsaW5pY3MnXTtcblxuICAgICAgICB2YXIgaW5pdGlhbEljb24gPSB7XG4gICAgICAgICAgdXJsOiBcIi90aGVtZXMvY3VzdG9tL3V3bWVkL2Rpc3QvYXNzZXRzL21hcC1tYXJrZXItcHVycGxlLnN2Z1wiLFxuICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDMwLCAzMClcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgc2VsZWN0ZWRJY29uID0ge1xuICAgICAgICAgIHVybDogXCIvdGhlbWVzL2N1c3RvbS91d21lZC9kaXN0L2Fzc2V0cy9tYXAtbWFya2VyLXB1cnBsZS1zZWxlY3RlZC5zdmdcIixcbiAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgzNSwgMzUpXG4gICAgICAgIH07XG5cbiAgICAgICAgd2luZG93Lm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvY2F0aW9uTWFwJykpO1xuXG4gICAgICAgIHZhciBtYXJrZXJzID0gW10sIG1hcmtlciwgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNsaW5pY3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGNsaW5pY3NbaV0ubGF0aXR1ZGUsIGNsaW5pY3NbaV0ubG9uZ2l0dWRlKSxcbiAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgdGl0bGU6IGNsaW5pY3NbaV0ubmFtZSxcbiAgICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgICAgaWNvbjogaW5pdGlhbEljb24sXG4gICAgICAgICAgICBsb2NhdGlvbklkOiBjbGluaWNzW2ldLmxvY2F0aW9uSWQsXG4gICAgICAgICAgICBjbGluaWNJZDogY2xpbmljc1tpXS5jbGluaWNJZFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG1hcmtlcnMucHVzaChtYXJrZXIpO1xuICAgICAgICAgIC8vIGF0dGFjaCBldmVudCBsaXN0ZW5lcnMgdG8gbWFya2VyXG4gICAgICAgICAgYXR0YWNoVG9nZ2xlTWFya2VyU2l6ZShtYXJrZXIsIHNlbGVjdGVkSWNvbiwgaW5pdGlhbEljb24pO1xuICAgICAgICAgIGF0dGFjaERpc3BsYXlDbGluaWNJbmZvcm1hdGlvbihtYXJrZXIsIGNsaW5pY3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2FsY3VsYXRlIGJvdW5kcyBvZiBtYXJrZXJzLCB0aGVuIGNlbnRlciBhbmQgem9vbSB0byBmaXRcbiAgICAgICAgdmFyIGJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBib3VuZHMuZXh0ZW5kKG1hcmtlcnNbaV0uZ2V0UG9zaXRpb24oKSk7XG4gICAgICAgIH1cbiAgICAgICAgbWFwLnNldENlbnRlcihib3VuZHMuZ2V0Q2VudGVyKCkpO1xuICAgICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcywgMCk7XG5cbiAgICAgICAgLy8gYXR0YWNoIGV2ZW50IGxpc3RlbmVycyB0byBtYXBcbiAgICAgICAgYXR0YWNoQ2xlYXJTZWxlY3RlZE1hcmtlcihtYXAsIGluaXRpYWxJY29uKTtcblxuICAgICAgICAvLyBpZiB3ZSBoYXZlIGEgZGV2aWNlJ3MgbG9jYXRpb24sIHBhbiB0byBjbG9zZXN0IGxvY2F0aW9uXG4gICAgICAgIHBhblRvQ2xvc2VzdExvY2F0aW9uKG1hcCwgbWFya2Vycyk7XG5cbiAgICAgICAgLy8gY3JlYXRlIGEgZ2xvYmFsIHZhcmlhYmxlIHRvIGluZGljYXRlIG1hcCB3YXMgbG9hZGVkLFxuICAgICAgICAvLyBpZiBpbml0TWFwIGRpZG4ndCB0cmlnZ2VyIGFuZCBzZXQgdGhpcyB2YXJpYWJsZSwgd2UnbGwgdHJpZ2dlclxuICAgICAgICAvLyBpdCBiZWxvd1xuICAgICAgICB3aW5kb3cuaW5pdE1hcENvbXBsZXRlID0gdHJ1ZTtcbiAgICAgIH07XG5cbiAgICAgIC8vIG1hcmtlciBldmVudCBoYW5kbGVyc1xuICAgICAgd2luZG93Lmxhc3RTZWxlY3RlZE1hcmtlciA9IG51bGw7XG4gICAgICB2YXIgYXR0YWNoVG9nZ2xlTWFya2VyU2l6ZSA9IGZ1bmN0aW9uIChtYXJrZXIsIHNlbGVjdGVkSWNvbiwgaW5pdGlhbEljb24pIHtcbiAgICAgICAgbWFya2VyLmFkZExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAod2luZG93Lmxhc3RTZWxlY3RlZE1hcmtlcikge1xuICAgICAgICAgICAgd2luZG93Lmxhc3RTZWxlY3RlZE1hcmtlci5zZXRJY29uKGluaXRpYWxJY29uKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZighbWFya2VyLmlzQ2xvc2VzdExvY2F0aW9uKSB7XG4gICAgICAgICAgICAkKCcuZmluZC1hLWxvY2F0aW9uX19jbG9zZXN0LWluZGljYXRvcicpLmhpZGUoKTtcbiAgICAgICAgICAgICQoJy5maW5kLWEtbG9jYXRpb25fX3NlbGVjdGVkLWluZGljYXRvcicpLnNob3coKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuZmluZC1hLWxvY2F0aW9uX19zZWxlY3RlZC1pbmRpY2F0b3InKS5oaWRlKCk7XG4gICAgICAgICAgICAkKCcuZmluZC1hLWxvY2F0aW9uX19jbG9zZXN0LWluZGljYXRvcicpLnNob3coKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtYXJrZXIuc2V0SWNvbihzZWxlY3RlZEljb24pO1xuICAgICAgICAgIHdpbmRvdy5sYXN0U2VsZWN0ZWRNYXJrZXIgPSBtYXJrZXI7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgdmFyIGF0dGFjaENsZWFyU2VsZWN0ZWRNYXJrZXIgPSBmdW5jdGlvbiAobWFwLCBpbml0aWFsSWNvbikge1xuICAgICAgICBtYXAuYWRkTGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh3aW5kb3cubGFzdFNlbGVjdGVkTWFya2VyKSB7XG4gICAgICAgICAgICB3aW5kb3cubGFzdFNlbGVjdGVkTWFya2VyLnNldEljb24oaW5pdGlhbEljb24pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBjbGluaWNJbmZvID0gJCgnLmZpbmQtYS1sb2NhdGlvbl9fY2xpbmljLWluZm8nKTtcbiAgICAgICAgICBpZiAoY2xpbmljSW5mby5jaGlsZHJlbigpLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgJChjbGluaWNJbmZvKS5mYWRlT3V0KCk7XG4gICAgICAgICAgICAkKCcuZmluZC1hLWxvY2F0aW9uX19oZWFkaW5nJykuZmFkZU91dCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBhdHRhY2hEaXNwbGF5Q2xpbmljSW5mb3JtYXRpb24gPSBmdW5jdGlvbiAobWFya2VyKSB7XG4gICAgICAgIG1hcmtlci5hZGRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGNsaW5pY0xpc3QgPSAkKCcuZmluZC1hLWxvY2F0aW9uX19jbGluaWMtbGlzdCcpO1xuICAgICAgICAgIHZhciBjbGluaWNJbmZvID0gJCgnLmZpbmQtYS1sb2NhdGlvbl9fY2xpbmljLWluZm8nKTtcbiAgICAgICAgICB2YXIgY2xpbmljID0gY2xpbmljTGlzdC5maW5kKFwiW2RhdGEtbG9jYXRpb24taWQ9J1wiICsgbWFya2VyLmxvY2F0aW9uSWQgKyBcIiddXCIpO1xuXG4gICAgICAgICAgaWYgKGNsaW5pY0luZm8uY2hpbGRyZW4oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkKCcuZmluZC1hLWxvY2F0aW9uX19oZWFkaW5nJykuZmFkZU91dChcImZhc3RcIik7XG4gICAgICAgICAgICAkKGNsaW5pY0luZm8pLmZhZGVPdXQoXCJmYXN0XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgJChjbGluaWNJbmZvKS5lbXB0eSgpO1xuICAgICAgICAgICAgICAkKGNsaW5pYykuY2hpbGRyZW4oKS5jbG9uZSgpLmFwcGVuZFRvKGNsaW5pY0luZm8pO1xuICAgICAgICAgICAgICAkKGNsaW5pY0luZm8pLmZhZGVJbihcImZhc3RcIik7XG4gICAgICAgICAgICAgICQoJy5maW5kLWEtbG9jYXRpb25fX2hlYWRpbmcnKS5mYWRlSW4oXCJmYXN0XCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJChjbGluaWMpLmNoaWxkcmVuKCkuY2xvbmUoKS5hcHBlbmRUbyhjbGluaWNJbmZvKTtcbiAgICAgICAgICAgICQoJy5maW5kLWEtbG9jYXRpb25fX2hlYWRpbmcnKS5mYWRlSW4oKTtcbiAgICAgICAgICAgICQoY2xpbmljSW5mbykuZmFkZUluKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgICQoJyN2aWV3QWxsTG9jYXRpb25zJykudW5iaW5kKCdjbGljaycpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGJ0blRleHRFbCA9ICQodGhpcykuZmluZCgnI2xhYmVsJyk7XG4gICAgICAgIHZhciBidG5BcnJvd0VsID0gJCh0aGlzKS5maW5kKCcjYXJyb3cnKTtcbiAgICAgICAgdmFyIGNsaW5pY0xpc3QgPSAkKCcuZmluZC1hLWxvY2F0aW9uX19jbGluaWMtbGlzdCcpO1xuICAgICAgICB2YXIgY2xpbmljcyA9IGNsaW5pY0xpc3QuY2hpbGRyZW4oKTtcblxuICAgICAgICBzd2l0Y2ggKGJ0blRleHRFbC50ZXh0KCkpIHtcbiAgICAgICAgICBjYXNlICdMaXN0IEFsbCBMb2NhdGlvbnMnOlxuICAgICAgICAgICAgY2xpbmljTGlzdC5mYWRlSW4oe3F1ZXVlOiBmYWxzZX0pO1xuICAgICAgICAgICAgY2xpbmljcy5mYWRlSW4oKTtcbiAgICAgICAgICAgIGJ0blRleHRFbC50ZXh0KFwiSGlkZSBBbGwgTG9jYXRpb25zXCIpO1xuICAgICAgICAgICAgYnRuQXJyb3dFbC5yZW1vdmVDbGFzcyhcImZhLWFuZ2xlLWRvd25cIikuYWRkQ2xhc3MoXCJmYS1hbmdsZS11cFwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ0hpZGUgQWxsIExvY2F0aW9ucyc6XG4gICAgICAgICAgICBjbGluaWNMaXN0LmZhZGVPdXQoe3F1ZXVlOiBmYWxzZX0pO1xuICAgICAgICAgICAgY2xpbmljcy5mYWRlT3V0KCk7XG4gICAgICAgICAgICBidG5UZXh0RWwudGV4dChcIkxpc3QgQWxsIExvY2F0aW9uc1wiKTtcbiAgICAgICAgICAgIGJ0bkFycm93RWwucmVtb3ZlQ2xhc3MoXCJmYS1hbmdsZS11cFwiKS5hZGRDbGFzcyhcImZhLWFuZ2xlLWRvd25cIik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBwYW5Ub0Nsb3Nlc3RMb2NhdGlvbiA9IGZ1bmN0aW9uIChtYXAsIG1hcmtlcnMpIHtcbiAgICAgICAgaWYgKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IpIHtcbiAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgICAgICAgICAgdmFyIGJyb3dzZXJMb2MgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSk7XG5cbiAgICAgICAgICAgIHZhciBzaG9ydGVzdERpc3RhbmNlLCBjbG9zZXN0TG9jYXRpb24sIGk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBnb29nbGUubWFwcy5nZW9tZXRyeS5zcGhlcmljYWwuY29tcHV0ZURpc3RhbmNlQmV0d2Vlbihicm93c2VyTG9jLCBtYXJrZXJzW2ldLmdldFBvc2l0aW9uKCkpO1xuXG4gICAgICAgICAgICAgIGlmICghc2hvcnRlc3REaXN0YW5jZSB8fCBkaXN0YW5jZSA8IHNob3J0ZXN0RGlzdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBzaG9ydGVzdERpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgY2xvc2VzdExvY2F0aW9uID0gbWFya2Vyc1tpXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbG9zZXN0TG9jYXRpb24uaXNDbG9zZXN0TG9jYXRpb24gPSB0cnVlO1xuXG5cbiAgICAgICAgICAgIHZhciBicm93c2VyTG9jTWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBicm93c2VyTG9jLFxuICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgdGl0bGU6ICdZb3VyIExvY2F0aW9uJyxcbiAgICAgICAgICAgICAgaWNvbjoge1xuICAgICAgICAgICAgICAgIHBhdGg6IGdvb2dsZS5tYXBzLlN5bWJvbFBhdGguQ0lSQ0xFLFxuICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogJyM2ZjMxNzgnLFxuICAgICAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgIHNjYWxlOiA4LFxuICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgICAgICAgIHN0cm9rZVdlaWdodDogMlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc2V0IGJvdW5kcyB0byBzaG93IGJyb3dzZXJMb2MgYW5kIGNsb3Nlc3QgbG9jYXRpb25cbiAgICAgICAgICAgIHZhciBib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XG4gICAgICAgICAgICBib3VuZHMuZXh0ZW5kKGNsb3Nlc3RMb2NhdGlvbi5nZXRQb3NpdGlvbigpKTtcbiAgICAgICAgICAgIGJvdW5kcy5leHRlbmQoYnJvd3NlckxvY01hcmtlci5nZXRQb3NpdGlvbigpKTtcbiAgICAgICAgICAgIG1hcC5zZXRDZW50ZXIoYm91bmRzLmdldENlbnRlcigpKTtcbiAgICAgICAgICAgIHNob3J0ZXN0RGlzdGFuY2UgPCAxMDAwMCA/IG1hcC5maXRCb3VuZHMoYm91bmRzKSA6IG1hcC5maXRCb3VuZHMoYm91bmRzLCA5MCk7XG5cbiAgICAgICAgICAgIC8vIGNsaWNrIG9uIGNsb3Nlc3QgbG9jYXRpb24gc28gaXQncyBoaWdobGlnaHRlZCBhbmQgaW5mbyBpcyBkaXNwbGF5ZWRcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIoY2xvc2VzdExvY2F0aW9uLCAnY2xpY2snKTtcblxuICAgICAgICAgICAgJCgnLmZpbmQtYS1sb2NhdGlvbl9fbm8tZ2VvbG9jYXRpb24nKS5oaWRlKCk7XG4gICAgICAgICAgICAvLyAkKCcuZmluZC1hLWxvY2F0aW9uX19jbG9zZXN0LWluZGljYXRvcicpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIC8vICQoJy5maW5kLWEtbG9jYXRpb25fX3NlbGVjdGVkLWluZGljYXRvcicpLmFkZENsYXNzKCdoaWRkZW4nKTtcblxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9XG59KShqUXVlcnksRHJ1cGFsLCBkcnVwYWxTZXR0aW5ncyk7XG5cbi8vIHdoZW4gZG9jdW1lbnQgaXMgcmVhZHksIGluaXRNYXAgZm9yIElFMTFcbmlmKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgaWYoIXdpbmRvdy5pbml0TWFwQ29tcGxldGUpIHtcbiAgICBpbml0TWFwKCk7XG4gIH1cbn1cbmVsc2Uge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpXG4gICAgICBpZighd2luZG93LmluaXRNYXBDb21wbGV0ZSkge1xuICAgICAgICBpbml0TWFwKCk7XG4gICAgICB9XG4gIH0pO1xufSJdfQ==
