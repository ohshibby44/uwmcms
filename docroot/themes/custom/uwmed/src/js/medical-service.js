(function ($, Drupal) {
  Drupal.behaviors.medicalServices = {
    attach: function() {
      $('.find-a-location__content a[href^="#"]').click(function () {
        var href = $(this).attr('href').slice(0, -4);
        $('.nav-tabs a[href="' + href + '"]').trigger('click');
      });

      $('a#approach-tab')
        .on('shown.bs.tab', function () {
          $('#condition-spotlight').show()
        })
        .on('hide.bs.tab', function () {
          $('#condition-spotlight').hide()
        });

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
            callback: function(index, element) {},
            transitionEnd: function(index, element) {}
          }).data('Swipe');
        } else {
          // window width is more than 1200px
          if(window.conditionSpotlightSwipe) {
            window.conditionSpotlightSwipe.kill();
          }
        }
      }

      var hideHeader = function() {
        $('.quizHeader').fadeOut(300);
        $('.nextQuestion').hide();
      };

      // set quiz options
      window.slickQuiz = $('#slickQuiz').slickQuiz({
        checkAnswerText: 'Check Answer',
        nextQuestionText: 'Next Question',
        disableRanking: true,
        tryAgainText: 'Start Over',
        events: {
          onStartQuiz: hideHeader
        }

      });
    }
  }
})(jQuery, Drupal);