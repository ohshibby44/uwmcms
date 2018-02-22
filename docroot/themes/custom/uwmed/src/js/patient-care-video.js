(function ($, Drupal) {
  Drupal.behaviors.patientCareVideo = {
    attach: function () {
      jQuery('#patientCarePlayButton').colorbox(
          {
            inline: true,
            width: '60%',
            height: 'auto',
            href: '#patientCareVideo',
            scrolling: false,
            onOpen: function () {
              $('.page-node-type-homepage .homepage-section__story-link .faa-burst.animated').css('animation-play-state', 'paused')
            },
            onClosed: function () {
              $('.page-node-type-homepage .homepage-section__story-link .faa-burst.animated').css('animation-play-state', 'running')
            },
            onComplete: function () {
              document.getElementById('patientCareVideoPlayer').play();
            },
            onCleanup: function () {
              document.getElementById('patientCareVideoPlayer').pause();
            }
          }
      );
    }
  }
})(jQuery, Drupal);