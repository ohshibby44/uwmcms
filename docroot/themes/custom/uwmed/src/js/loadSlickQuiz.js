(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.loadSlickQuiz = {
    attach: function attach() {
      var hideHeader = function () {
        $('.quizHeader').fadeOut(300);
        $('.nextQuestion').hide();
      };

      // load quiz json
      if(drupalSettings['formattedQuizJSON']) {
        window.quizJSON = drupalSettings['formattedQuizJSON'];

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
  }
})(jQuery, Drupal, drupalSettings);