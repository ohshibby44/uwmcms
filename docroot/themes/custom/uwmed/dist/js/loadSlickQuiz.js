'use strict';

(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.loadSlickQuiz = {
    attach: function attach() {
      var hideHeader = function hideHeader() {
        $('.quizHeader').fadeOut(300);
        $('.nextQuestion').hide();
      };

      // load quiz json
      if (drupalSettings['formattedQuizJSON']) {
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
  };
})(jQuery, Drupal, drupalSettings);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvYWRTbGlja1F1aXouanMiXSwibmFtZXMiOlsiJCIsIkRydXBhbCIsImRydXBhbFNldHRpbmdzIiwiYmVoYXZpb3JzIiwibG9hZFNsaWNrUXVpeiIsImF0dGFjaCIsImhpZGVIZWFkZXIiLCJmYWRlT3V0IiwiaGlkZSIsIndpbmRvdyIsInF1aXpKU09OIiwic2xpY2tRdWl6IiwiY2hlY2tBbnN3ZXJUZXh0IiwibmV4dFF1ZXN0aW9uVGV4dCIsImRpc2FibGVSYW5raW5nIiwidHJ5QWdhaW5UZXh0IiwiZXZlbnRzIiwib25TdGFydFF1aXoiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQyxVQUFVQSxDQUFWLEVBQWFDLE1BQWIsRUFBcUJDLGNBQXJCLEVBQXFDO0FBQ3BDRCxTQUFPRSxTQUFQLENBQWlCQyxhQUFqQixHQUFpQztBQUMvQkMsWUFBUSxTQUFTQSxNQUFULEdBQWtCO0FBQ3hCLFVBQUlDLGFBQWEsU0FBYkEsVUFBYSxHQUFZO0FBQzNCTixVQUFFLGFBQUYsRUFBaUJPLE9BQWpCLENBQXlCLEdBQXpCO0FBQ0FQLFVBQUUsZUFBRixFQUFtQlEsSUFBbkI7QUFDRCxPQUhEOztBQUtBO0FBQ0EsVUFBR04sZUFBZSxtQkFBZixDQUFILEVBQXdDO0FBQ3RDTyxlQUFPQyxRQUFQLEdBQWtCUixlQUFlLG1CQUFmLENBQWxCOztBQUVBO0FBQ0FPLGVBQU9FLFNBQVAsR0FBbUJYLEVBQUUsWUFBRixFQUFnQlcsU0FBaEIsQ0FBMEI7QUFDM0NDLDJCQUFpQixjQUQwQjtBQUUzQ0MsNEJBQWtCLGVBRnlCO0FBRzNDQywwQkFBZ0IsSUFIMkI7QUFJM0NDLHdCQUFjLFlBSjZCO0FBSzNDQyxrQkFBUTtBQUNOQyx5QkFBYVg7QUFEUDs7QUFMbUMsU0FBMUIsQ0FBbkI7QUFVRDtBQUNGO0FBdkI4QixHQUFqQztBQXlCRCxDQTFCRCxFQTBCR1ksTUExQkgsRUEwQldqQixNQTFCWCxFQTBCbUJDLGNBMUJuQiIsImZpbGUiOiJsb2FkU2xpY2tRdWl6LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgkLCBEcnVwYWwsIGRydXBhbFNldHRpbmdzKSB7XG4gIERydXBhbC5iZWhhdmlvcnMubG9hZFNsaWNrUXVpeiA9IHtcbiAgICBhdHRhY2g6IGZ1bmN0aW9uIGF0dGFjaCgpIHtcbiAgICAgIHZhciBoaWRlSGVhZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCcucXVpekhlYWRlcicpLmZhZGVPdXQoMzAwKTtcbiAgICAgICAgJCgnLm5leHRRdWVzdGlvbicpLmhpZGUoKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIGxvYWQgcXVpeiBqc29uXG4gICAgICBpZihkcnVwYWxTZXR0aW5nc1snZm9ybWF0dGVkUXVpekpTT04nXSkge1xuICAgICAgICB3aW5kb3cucXVpekpTT04gPSBkcnVwYWxTZXR0aW5nc1snZm9ybWF0dGVkUXVpekpTT04nXTtcblxuICAgICAgICAvLyBzZXQgcXVpeiBvcHRpb25zXG4gICAgICAgIHdpbmRvdy5zbGlja1F1aXogPSAkKCcjc2xpY2tRdWl6Jykuc2xpY2tRdWl6KHtcbiAgICAgICAgICBjaGVja0Fuc3dlclRleHQ6ICdDaGVjayBBbnN3ZXInLFxuICAgICAgICAgIG5leHRRdWVzdGlvblRleHQ6ICdOZXh0IFF1ZXN0aW9uJyxcbiAgICAgICAgICBkaXNhYmxlUmFua2luZzogdHJ1ZSxcbiAgICAgICAgICB0cnlBZ2FpblRleHQ6ICdTdGFydCBPdmVyJyxcbiAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIG9uU3RhcnRRdWl6OiBoaWRlSGVhZGVyXG4gICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSkoalF1ZXJ5LCBEcnVwYWwsIGRydXBhbFNldHRpbmdzKTsiXX0=
