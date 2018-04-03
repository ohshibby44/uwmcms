(function ($, Drupal) {
  Drupal.behaviors.patientCareVideo = {
    attach: function () {

      var video = $('#patientCareVideoPlayer')[0];
      var touchEvents = ('ontouchstart' in document.documentElement);

      // if(typeof(video.play) === "undefined" || (!video.duration > 0)) {
      //   if(typeof(video.duration !== "undefined")) {
      //     // hide the play button because this browser can't play this video
      //     $(".homepage-section__story-link").hide();
      //     $("#patientCarePlayButton").hide();
      //   }
      // }

      if(screenfull.enabled && touchEvents) {
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
      } else if( typeof(video.webkitEnterFullscreen) === "function" && touchEvents ) {
        // some iOS devices are not covered by screenfull
        $(video).on('webkitendfullscreen',function() {
          video.pause();
          $('#patientCareVideo').parents().first().hide();
        });

        $('#patientCarePlayButton').on('click', function(){
          $('#patientCareVideo').parents().first().show();
          video.webkitEnterFullscreen();
          video.play();
        });
      } else {
        // we're on a desktop or this device doesn't support full screen,
        // let's display the video in a colorbox

        jQuery('#patientCarePlayButton').colorbox(
          {
            inline: true,
            width: '75%',
            height: 'auto',
            href: '#patientCareVideo',
            scrolling: false,
            onOpen: function () {
              $('.page-node-type-homepage .homepage-section__story-link .faa-burst.animated').css('animation-play-state', 'paused');
              video.focus();
            },
            onClosed: function () {
              $('.page-node-type-homepage .homepage-section__story-link .faa-burst.animated').css('animation-play-state', 'running');
            },
            onComplete: function () {
              video.play();
            },
            onCleanup: function () {
              video.pause();
            }
          }
        );
      }
    }
  }
})(jQuery, Drupal);