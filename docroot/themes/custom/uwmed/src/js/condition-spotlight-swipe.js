(function ($, Drupal) {
  Drupal.behaviors.conditionSpotlightSwipe = {
    attach: function () {
      // media query event handler
      if (matchMedia) {
        const mq = window.matchMedia("(max-width: 1199px)");
        mq.addListener(WidthChange);
        WidthChange(mq);
      }

      // detect media query change and turn condition spotlight swipe on/off
      function WidthChange(mq) {

        if (mq.matches) {
          // window width is less than 1200px
          window.conditionSpotlightSwipe = $('.condition-spotlight__content').Swipe({
            startSlide: 0,
            draggable: true,
            autoRestart: false,
            continuous: false,
            disableScroll: true,
            stopPropagation: true,
            callback: function (index, element) {
            },
            transitionEnd: function (index, element) {
            }
          }).data('Swipe');
        }
        else {
          // window width is more than 1200px
          if (window.conditionSpotlightSwipe) {
            window.conditionSpotlightSwipe.kill();
          }
        }
      }
    }
  }
})(jQuery, Drupal);