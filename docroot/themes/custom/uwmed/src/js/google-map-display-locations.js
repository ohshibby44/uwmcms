window.initMap = function() {}; // initialize function in time for google maps to find it

(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.googleMapDisplayLocations = {
    attach: function () {

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

        var markers = [], marker, i;
        for (i = 0; i < clinics.length; i++) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(clinics[i].latitude, clinics[i].longitude),
            map: map,
            title: clinics[i].name,
            index: i,
            icon: initialIcon,
            locationId: clinics[i].locationId
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
      var attachToggleMarkerSize = function (marker, selectedIcon, initialIcon) {
        marker.addListener('click', function () {
          if (window.lastSelectedMarker) {
            window.lastSelectedMarker.setIcon(initialIcon);
          }

          marker.setIcon(selectedIcon);
          window.lastSelectedMarker = marker;
        });
      };

      var attachClearSelectedMarker = function (map, initialIcon) {
        map.addListener('click', function () {
          if (window.lastSelectedMarker) {
            window.lastSelectedMarker.setIcon(initialIcon);
          }

          var clinicInfo = $('.find-a-location__clinic-info');
          if (clinicInfo.children().length > 0) {
            $(clinicInfo).slideUp(function () {
              $(clinicInfo).empty();
            });
          }

        });
      };

      var attachDisplayClinicInformation = function (marker) {
        marker.addListener('click', function () {
          var clinicList = $('.find-a-location__clinic-list');
          var clinicInfo = $('.find-a-location__clinic-info');
          var clinic = clinicList.find("[data-location-id='" + marker.locationId + "']");

          if (clinicInfo.children().length > 0) {
            $(clinicInfo).fadeOut("fast", function () {
              $(clinicInfo).empty();
              $(clinic).children().clone().appendTo(clinicInfo);
              $(clinicInfo).fadeIn("fast");
            });
          }
          else {
            $(clinic).children().clone().appendTo(clinicInfo);
            $(clinicInfo).slideDown();
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
            clinicList.fadeIn({queue: false});
            clinics.slideDown();
            btnTextEl.text("Hide All Locations");
            btnArrowEl.removeClass("fa-angle-down").addClass("fa-angle-up");
            break;
          case 'Hide All Locations':
            clinicList.fadeOut({queue: false});
            clinics.slideUp();
            btnTextEl.text("List All Locations");
            btnArrowEl.removeClass("fa-angle-up").addClass("fa-angle-down");
            break;
        }
      });

      var panToClosestLocation = function (map, markers) {
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

          })
        }
      };
    }
  }
})(jQuery,Drupal, drupalSettings);

// when document is ready, initMap for IE11
if(document.readyState === 'complete') {
  if(!window.initMapComplete) {
    initMap();
  }
}
else {
  document.addEventListener('readystatechange', function() {
    if (document.readyState === 'complete')
      if(!window.initMapComplete) {
        initMap();
      }
  });
}