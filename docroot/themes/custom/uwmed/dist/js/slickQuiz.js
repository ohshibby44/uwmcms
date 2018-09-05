'use strict';

/*!
 * SlickQuiz jQuery Plugin
 * http://github.com/jewlofthelotus/SlickQuiz
 *
 * @updated October 25, 2014
 * @version 1.5.20
 *
 * @author Julie Cameron - http://www.juliecameron.com
 * @copyright (c) 2013 Quicken Loans - http://www.quickenloans.com
 * @license MIT
 */

(function ($) {
  $.slickQuiz = function (element, options) {
    var plugin = this,
        $element = $(element),
        _element = '#' + $element.attr('id'),
        defaults = {
      checkAnswerText: 'Check My Answer!',
      nextQuestionText: 'Next &raquo;',
      backButtonText: '',
      completeQuizText: '',
      tryAgainText: '',
      questionCountText: 'Question %current of %total',
      preventUnansweredText: 'You must select at least one answer.',
      questionTemplateText: '%count. %text',
      scoreTemplateText: '%score / %total',
      nameTemplateText: '<span>Quiz: </span>%name',
      skipStartButton: false,
      numberOfQuestions: null,
      randomSortQuestions: false,
      randomSortAnswers: false,
      preventUnanswered: false,
      disableScore: false,
      disableRanking: false,
      scoreAsPercentage: false,
      perQuestionResponseMessaging: true,
      perQuestionResponseAnswers: false,
      completionResponseMessaging: false,
      displayQuestionCount: true, // Deprecate?
      displayQuestionNumber: true, // Deprecate?
      animationCallbacks: { // only for the methods that have jQuery animations offering callback
        setupQuiz: function setupQuiz() {},
        startQuiz: function startQuiz() {},
        resetQuiz: function resetQuiz() {},
        checkAnswer: function checkAnswer() {},
        nextQuestion: function nextQuestion() {},
        backToQuestion: function backToQuestion() {},
        completeQuiz: function completeQuiz() {}
      },
      events: {
        onStartQuiz: function onStartQuiz(options) {},
        onCompleteQuiz: function onCompleteQuiz(options) {} // reserved: options.questionCount, options.score
      }
    },


    // Class Name Strings (Used for building quiz and for selectors)
    questionCountClass = 'questionCount',
        questionGroupClass = 'questions',
        questionClass = 'question',
        answersClass = 'answers',
        responsesClass = 'responses',
        completeClass = 'complete',
        correctClass = 'correctResponse',
        incorrectClass = 'incorrectResponse',
        correctResponseClass = 'correct',
        incorrectResponseClass = 'incorrect',
        checkAnswerClass = 'checkAnswer',
        nextQuestionClass = 'nextQuestion',
        lastQuestionClass = 'lastQuestion',
        backToQuestionClass = 'backToQuestion',
        tryAgainClass = 'tryAgain',


    // Sub-Quiz / Sub-Question Class Selectors
    _questionCount = '.' + questionCountClass,
        _questions = '.' + questionGroupClass,
        _question = '.' + questionClass,
        _answers = '.' + answersClass,
        _answer = '.' + answersClass + ' li',
        _responses = '.' + responsesClass,
        _response = '.' + responsesClass + ' li',
        _correct = '.' + correctClass,
        _correctResponse = '.' + correctResponseClass,
        _incorrectResponse = '.' + incorrectResponseClass,
        _checkAnswerBtn = '.' + checkAnswerClass,
        _nextQuestionBtn = '.' + nextQuestionClass,
        _prevQuestionBtn = '.' + backToQuestionClass,
        _tryAgainBtn = '.' + tryAgainClass,


    // Top Level Quiz Element Class Selectors
    _quizStarter = _element + ' .startQuiz',
        _quizName = _element + ' .quizName',
        _quizArea = _element + ' .quizArea',
        _quizResults = _element + ' .quizResults',
        _quizResultsCopy = _element + ' .quizResultsCopy',
        _quizHeader = _element + ' .quizHeader',
        _quizScore = _element + ' .quizScore',
        _quizLevel = _element + ' .quizLevel',


    // Top Level Quiz Element Objects
    $quizStarter = $(_quizStarter),
        $quizName = $(_quizName),
        $quizArea = $(_quizArea),
        $quizResults = $(_quizResults),
        $quizResultsCopy = $(_quizResultsCopy),
        $quizHeader = $(_quizHeader),
        $quizScore = $(_quizScore),
        $quizLevel = $(_quizLevel);

    // Reassign user-submitted deprecated options
    var depMsg = '';

    if (options && typeof options.disableNext != 'undefined') {
      if (typeof options.preventUnanswered == 'undefined') {
        options.preventUnanswered = options.disableNext;
      }
      depMsg += 'The \'disableNext\' option has been deprecated, please use \'preventUnanswered\' in it\'s place.\n\n';
    }

    if (options && typeof options.disableResponseMessaging != 'undefined') {
      if (typeof options.preventUnanswered == 'undefined') {
        options.perQuestionResponseMessaging = options.disableResponseMessaging;
      }
      depMsg += 'The \'disableResponseMessaging\' option has been deprecated, please use' + ' \'perQuestionResponseMessaging\' and \'completionResponseMessaging\' in it\'s place.\n\n';
    }

    if (options && typeof options.randomSort != 'undefined') {
      if (typeof options.randomSortQuestions == 'undefined') {
        options.randomSortQuestions = options.randomSort;
      }
      if (typeof options.randomSortAnswers == 'undefined') {
        options.randomSortAnswers = options.randomSort;
      }
      depMsg += 'The \'randomSort\' option has been deprecated, please use' + ' \'randomSortQuestions\' and \'randomSortAnswers\' in it\'s place.\n\n';
    }

    if (depMsg !== '') {
      if (typeof console != 'undefined') {
        console.warn(depMsg);
      } else {
        alert(depMsg);
      }
    }
    // End of deprecation reassignment


    plugin.config = $.extend(defaults, options);

    // Set via json option or quizJSON variable (see slickQuiz-config.js)
    var quizValues = plugin.config.json ? plugin.config.json : typeof quizJSON != 'undefined' ? quizJSON : null;

    // Get questions, possibly sorted randomly
    var questions = plugin.config.randomSortQuestions ? quizValues.questions.sort(function () {
      return Math.round(Math.random()) - 0.5;
    }) : quizValues.questions;

    // Count the number of questions
    var questionCount = questions.length;

    // Select X number of questions to load if options is set
    if (plugin.config.numberOfQuestions && questionCount >= plugin.config.numberOfQuestions) {
      questions = questions.slice(0, plugin.config.numberOfQuestions);
      questionCount = questions.length;
    }

    // some special private/internal methods
    var internal = { method: {
        // get a key whose notches are "resolved jQ deferred" objects; one per notch on the key
        // think of the key as a house key with notches on it
        getKey: function getKey(notches) {
          // returns [], notches >= 1
          var key = [];
          for (var i = 0; i < notches; i++) {
            key[i] = $.Deferred();
          }return key;
        },

        // put the key in the door, if all the notches pass then you can turn the key and "go"
        turnKeyAndGo: function turnKeyAndGo(key, go) {
          // key = [], go = function ()
          // when all the notches of the key are accepted (resolved) then the key turns and the engine (callback/go) starts
          $.when.apply(null, key).then(function () {
            go();
          });
        },

        // get one jQ
        getKeyNotch: function getKeyNotch(key, notch) {
          // notch >= 1, key = []
          // key has several notches, numbered as 1, 2, 3, ... (no zero notch)
          // we resolve and return the "jQ deferred" object at specified notch
          return function () {
            key[notch - 1].resolve(); // it is ASSUMED that you initiated the key with enough notches
          };
        }
      } };

    plugin.method = {
      // Sets up the questions and answers based on above array
      setupQuiz: function setupQuiz(options) {
        // use 'options' object to pass args
        var key, keyNotch, kN;
        key = internal.method.getKey(3); // how many notches == how many jQ animations you will run
        keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
        kN = keyNotch; // you specify the notch, you get a callback function for your animation

        $quizName.hide().html(plugin.config.nameTemplateText.replace('%name', quizValues.info.name)).fadeIn(1000, kN(key, 1));
        $quizHeader.hide().prepend($('<div class="quizDescription">' + quizValues.info.main + '</div>')).fadeIn(1000, kN(key, 2));
        $quizResultsCopy.append(quizValues.info.results);

        // add retry button to results view, if enabled
        if (plugin.config.tryAgainText && plugin.config.tryAgainText !== '') {
          $quizResultsCopy.append('<p><a class="button ' + tryAgainClass + '" href="#">' + plugin.config.tryAgainText + '</a></p>');
        }

        // Setup questions
        var quiz = $('<ol class="' + questionGroupClass + '"></ol>'),
            count = 1;

        // Loop through questions object
        for (var i in questions) {
          if (questions.hasOwnProperty(i)) {
            var question = questions[i];

            var questionHTML = $('<li class="' + questionClass + '" id="question' + (count - 1) + '"></li>');

            if (plugin.config.displayQuestionCount) {
              questionHTML.append('<div class="' + questionCountClass + '">' + plugin.config.questionCountText.replace('%current', '<span class="current">' + count + '</span>').replace('%total', '<span class="total">' + questionCount + '</span>') + '</div>');
            }

            var formatQuestion = '';
            if (plugin.config.displayQuestionNumber) {
              formatQuestion = plugin.config.questionTemplateText.replace('%count', count).replace('%text', question.q);
            } else {
              formatQuestion = question.q;
            }
            questionHTML.append('<h3>' + formatQuestion + '</h3>');

            // Count the number of true values
            var truths = 0;
            for (var i in question.a) {
              if (question.a.hasOwnProperty(i)) {
                var answer = question.a[i];
                if (answer.correct) {
                  truths++;
                }
              }
            }

            // Now let's append the answers with checkboxes or radios depending on truth count
            var answerHTML = $('<ul class="' + answersClass + '"></ul>');

            // Get the answers
            var answers = plugin.config.randomSortAnswers ? question.a.sort(function () {
              return Math.round(Math.random()) - 0.5;
            }) : question.a;

            // prepare a name for the answer inputs based on the question
            var selectAny = question.select_any ? question.select_any : false,
                forceCheckbox = question.force_checkbox ? question.force_checkbox : false,
                checkbox = truths > 1 && !selectAny || forceCheckbox,
                inputName = $element.attr('id') + '_question' + (count - 1),
                inputType = checkbox ? 'checkbox' : 'radio';

            if (count == quizValues.questions.length) {
              nextQuestionClass = nextQuestionClass + ' ' + lastQuestionClass;
            }

            for (var i in answers) {
              if (answers.hasOwnProperty(i)) {
                var optionId;
                answer = answers[i];
                optionId = inputName + '_' + i.toString();

                // If question has >1 true answers and is not a select any, use checkboxes; otherwise, radios
                var input = '<input id="' + optionId + '" name="' + inputName + '" type="' + inputType + '" /> ';

                var optionLabel = '<label for="' + optionId + '">' + answer.option + '</label>';

                var answerContent = $('<li></li>').append(input).append(optionLabel);
                answerHTML.append(answerContent);
              }
            }

            // Append answers to question
            questionHTML.append(answerHTML);

            // If response messaging is NOT disabled, add it
            if (plugin.config.perQuestionResponseMessaging || plugin.config.completionResponseMessaging) {
              // Now let's append the correct / incorrect response messages
              var responseHTML = $('<ul class="' + responsesClass + '"></ul>');
              responseHTML.append('<li class="' + correctResponseClass + '">' + question.correct + '</li>');
              responseHTML.append('<li class="' + incorrectResponseClass + '">' + question.incorrect + '</li>');

              // Append responses to question
              questionHTML.append(responseHTML);
            }

            // Appends check answer / back / next question buttons
            if (plugin.config.backButtonText && plugin.config.backButtonText !== '') {
              questionHTML.append('<a href="#" class="button ' + backToQuestionClass + '">' + plugin.config.backButtonText + '</a>');
            }

            var nextText = plugin.config.nextQuestionText;
            if (plugin.config.completeQuizText && count == questionCount) {
              nextText = plugin.config.completeQuizText;
            }

            // If we're not showing responses per question, show next question button and make it check the answer too
            if (!plugin.config.perQuestionResponseMessaging) {
              questionHTML.append('<a href="#" class="button ' + nextQuestionClass + ' ' + checkAnswerClass + '">' + nextText + '</a>');
            } else {
              questionHTML.append('<a href="#" class="button ' + nextQuestionClass + '">' + nextText + '</a>');
              questionHTML.append('<a href="#" class="button ' + checkAnswerClass + '">' + plugin.config.checkAnswerText + '</a>');
            }

            // Append question & answers to quiz
            quiz.append(questionHTML);

            count++;
          }
        }

        // Add the quiz content to the page
        $quizArea.append(quiz);

        // Toggle the start button OR start the quiz if start button is disabled
        if (plugin.config.skipStartButton || $quizStarter.length == 0) {
          $quizStarter.hide();
          plugin.method.startQuiz.apply(this, [{ callback: plugin.config.animationCallbacks.startQuiz }]); // TODO: determine why 'this' is being passed as arg to startQuiz method
          kN(key, 3).apply(null, []);
        } else {
          $quizStarter.fadeIn(500, kN(key, 3)); // 3d notch on key must be on both sides of if/else, otherwise key won't turn
        }

        internal.method.turnKeyAndGo(key, options && options.callback ? options.callback : function () {});
      },

      // Starts the quiz (hides start button and displays first question)
      startQuiz: function startQuiz(options) {
        var key, keyNotch, kN;
        key = internal.method.getKey(1); // how many notches == how many jQ animations you will run
        keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
        kN = keyNotch; // you specify the notch, you get a callback function for your animation

        function start(options) {
          var firstQuestion = $(_element + ' ' + _questions + ' li').first();
          if (firstQuestion.length) {
            firstQuestion.fadeIn(500, function () {
              if (options && options.callback) options.callback();
            });
          }
        }

        if (plugin.config.skipStartButton || $quizStarter.length == 0) {
          start({ callback: kN(key, 1) });
        } else {
          $quizStarter.fadeOut(300, function () {
            start({ callback: kN(key, 1) }); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
          });
        }

        internal.method.turnKeyAndGo(key, options && options.callback ? options.callback : function () {});

        if (plugin.config.events && plugin.config.events.onStartQuiz) {
          plugin.config.events.onStartQuiz.apply(null, []);
        }
      },

      // Resets (restarts) the quiz (hides results, resets inputs, and displays first question)
      resetQuiz: function resetQuiz(startButton, options) {
        var key, keyNotch, kN;
        key = internal.method.getKey(1); // how many notches == how many jQ animations you will run
        keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
        kN = keyNotch; // you specify the notch, you get a callback function for your animation

        $quizResults.fadeOut(300, function () {
          $(_element + ' input').prop('checked', false).prop('disabled', false);

          $quizLevel.attr('class', 'quizLevel');
          $(_element + ' ' + _question).removeClass(correctClass).removeClass(incorrectClass).remove(completeClass);
          $(_element + ' ' + _answer).removeClass(correctResponseClass).removeClass(incorrectResponseClass);

          $(_element + ' ' + _question + ',' + _element + ' ' + _responses + ',' + _element + ' ' + _response + ',' + _element + ' ' + _nextQuestionBtn + ',' + _element + ' ' + _prevQuestionBtn).hide();

          $(_element + ' ' + _questionCount + ',' + _element + ' ' + _answers + ',' + _element + ' ' + _checkAnswerBtn).show();

          $quizArea.append($(_element + ' ' + _questions)).show();

          kN(key, 1).apply(null, []);

          plugin.method.startQuiz({ callback: plugin.config.animationCallbacks.startQuiz }, $quizResults); // TODO: determine why $quizResults is being passed
        });

        internal.method.turnKeyAndGo(key, options && options.callback ? options.callback : function () {});
      },

      // Validates the response selection(s), displays explanations & next question button
      checkAnswer: function checkAnswer(checkButton, options) {
        var key, keyNotch, kN;
        key = internal.method.getKey(2); // how many notches == how many jQ animations you will run
        keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
        kN = keyNotch; // you specify the notch, you get a callback function for your animation

        var questionLI = $($(checkButton).parents(_question)[0]),
            answerLIs = questionLI.find(_answers + ' li'),
            answerSelects = answerLIs.find('input:checked'),
            questionIndex = parseInt(questionLI.attr('id').replace(/(question)/, ''), 10),
            answers = questions[questionIndex].a,
            selectAny = questions[questionIndex].select_any ? questions[questionIndex].select_any : false;

        answerLIs.addClass(incorrectResponseClass);

        // Collect the true answers needed for a correct response
        var trueAnswers = [];
        for (var i in answers) {
          if (answers.hasOwnProperty(i)) {
            var answer = answers[i],
                index = parseInt(i, 10);

            if (answer.correct) {
              trueAnswers.push(index);
              answerLIs.eq(index).removeClass(incorrectResponseClass).addClass(correctResponseClass);
            }
          }
        }

        // TODO: Now that we're marking answer LIs as correct / incorrect, we might be able
        // to do all our answer checking at the same time

        // NOTE: Collecting answer index for comparison aims to ensure that HTML entities
        // and HTML elements that may be modified by the browser / other scrips match up

        // Collect the answers submitted
        var selectedAnswers = [];
        answerSelects.each(function () {
          var id = $(this).attr('id');
          selectedAnswers.push(parseInt(id.replace(/(.*\_question\d{1,}_)/, ''), 10));
        });

        if (plugin.config.preventUnanswered && selectedAnswers.length === 0) {
          alert(plugin.config.preventUnansweredText);
          return false;
        }

        // Verify all/any true answers (and no false ones) were submitted
        var correctResponse = plugin.method.compareAnswers(trueAnswers, selectedAnswers, selectAny);

        if (correctResponse) {
          questionLI.addClass(correctClass);
        } else {
          questionLI.addClass(incorrectClass);
        }

        // Toggle appropriate response (either for display now and / or on completion)
        questionLI.find(correctResponse ? _correctResponse : _incorrectResponse).show();

        // If perQuestionResponseMessaging is enabled, toggle response and navigation now
        if (plugin.config.perQuestionResponseMessaging) {
          $(checkButton).hide();
          if (!plugin.config.perQuestionResponseAnswers) {
            // Make sure answers don't highlight for a split second before they hide
            questionLI.find(_answers).hide({
              duration: 0,
              complete: function complete() {
                questionLI.addClass(completeClass);
              }
            });
          } else {
            questionLI.addClass(completeClass);
          }
          questionLI.find('input').prop('disabled', true);
          questionLI.find(_responses).show();
          questionLI.find(_nextQuestionBtn).fadeIn(300, kN(key, 1));
          questionLI.find(_prevQuestionBtn).fadeIn(300, kN(key, 2));
          if (!questionLI.find(_prevQuestionBtn).length) kN(key, 2).apply(null, []); // 2nd notch on key must be passed even if there's no "back" button
        } else {
          kN(key, 1).apply(null, []); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
          kN(key, 2).apply(null, []); // 2nd notch on key must be on both sides of if/else, otherwise key won't turn
        }

        internal.method.turnKeyAndGo(key, options && options.callback ? options.callback : function () {});
      },

      // Moves to the next question OR completes the quiz if on last question
      nextQuestion: function nextQuestion(nextButton, options) {
        var key, keyNotch, kN;
        key = internal.method.getKey(1); // how many notches == how many jQ animations you will run
        keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
        kN = keyNotch; // you specify the notch, you get a callback function for your animation

        var currentQuestion = $($(nextButton).parents(_question)[0]),
            nextQuestion = currentQuestion.next(_question),
            answerInputs = currentQuestion.find('input:checked');

        // If response messaging has been disabled or moved to completion,
        // make sure we have an answer if we require it, let checkAnswer handle the alert messaging
        if (plugin.config.preventUnanswered && answerInputs.length === 0) {
          return false;
        }

        if (nextQuestion.length) {
          currentQuestion.fadeOut(300, function () {
            nextQuestion.find(_prevQuestionBtn).show().end().fadeIn(500, kN(key, 1));
            if (!nextQuestion.find(_prevQuestionBtn).show().end().length) kN(key, 1).apply(null, []); // 1st notch on key must be passed even if there's no "back" button
          });
        } else {
          kN(key, 1).apply(null, []); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
          plugin.method.completeQuiz({ callback: plugin.config.animationCallbacks.completeQuiz });
        }

        internal.method.turnKeyAndGo(key, options && options.callback ? options.callback : function () {});
      },

      // Go back to the last question
      backToQuestion: function backToQuestion(backButton, options) {
        var key, keyNotch, kN;
        key = internal.method.getKey(2); // how many notches == how many jQ animations you will run
        keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
        kN = keyNotch; // you specify the notch, you get a callback function for your animation

        var questionLI = $($(backButton).parents(_question)[0]),
            responses = questionLI.find(_responses);

        // Back to question from responses
        if (responses.css('display') === 'block') {
          questionLI.find(_responses).fadeOut(300, function () {
            questionLI.removeClass(correctClass).removeClass(incorrectClass).removeClass(completeClass);
            questionLI.find(_responses + ', ' + _response).hide();
            questionLI.find(_answers).show();
            questionLI.find(_answer).removeClass(correctResponseClass).removeClass(incorrectResponseClass);
            questionLI.find('input').prop('disabled', false);
            questionLI.find(_answers).fadeIn(500, kN(key, 1)); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
            questionLI.find(_checkAnswerBtn).fadeIn(500, kN(key, 2));
            questionLI.find(_nextQuestionBtn).hide();

            // if question is first, don't show back button on question
            if (questionLI.attr('id') != 'question0') {
              questionLI.find(_prevQuestionBtn).show();
            } else {
              questionLI.find(_prevQuestionBtn).hide();
            }
          });

          // Back to previous question
        } else {
          var prevQuestion = questionLI.prev(_question);

          questionLI.fadeOut(300, function () {
            prevQuestion.removeClass(correctClass).removeClass(incorrectClass).removeClass(completeClass);
            prevQuestion.find(_responses + ', ' + _response).hide();
            prevQuestion.find(_answers).show();
            prevQuestion.find(_answer).removeClass(correctResponseClass).removeClass(incorrectResponseClass);
            prevQuestion.find('input').prop('disabled', false);
            prevQuestion.find(_nextQuestionBtn).hide();
            prevQuestion.find(_checkAnswerBtn).show();

            if (prevQuestion.attr('id') != 'question0') {
              prevQuestion.find(_prevQuestionBtn).show();
            } else {
              prevQuestion.find(_prevQuestionBtn).hide();
            }

            prevQuestion.fadeIn(500, kN(key, 1));
            kN(key, 2).apply(null, []); // 2nd notch on key must be on both sides of if/else, otherwise key won't turn
          });
        }

        internal.method.turnKeyAndGo(key, options && options.callback ? options.callback : function () {});
      },

      // Hides all questions, displays the final score and some conclusive information
      completeQuiz: function completeQuiz(options) {
        var key, keyNotch, kN;
        key = internal.method.getKey(1); // how many notches == how many jQ animations you will run
        keyNotch = internal.method.getKeyNotch; // a function that returns a jQ animation callback function
        kN = keyNotch; // you specify the notch, you get a callback function for your animation

        var score = $(_element + ' ' + _correct).length,
            displayScore = score;
        if (plugin.config.scoreAsPercentage) {
          displayScore = (score / questionCount).toFixed(2) * 100 + "%";
        }

        if (plugin.config.disableScore) {
          $(_quizScore).remove();
        } else {
          $(_quizScore + ' span').html(plugin.config.scoreTemplateText.replace('%score', displayScore).replace('%total', questionCount));
        }

        if (plugin.config.disableRanking) {
          $(_quizLevel).remove();
        } else {
          var levels = [quizValues.info.level1, // 80-100%
          quizValues.info.level2, // 60-79%
          quizValues.info.level3, // 40-59%
          quizValues.info.level4, // 20-39%
          quizValues.info.level5 // 0-19%
          ],
              levelRank = plugin.method.calculateLevel(score),
              levelText = $.isNumeric(levelRank) ? levels[levelRank] : '';

          $(_quizLevel + ' span').html(levelText);
          $(_quizLevel).addClass('level' + levelRank);
        }

        $quizArea.fadeOut(300, function () {
          // If response messaging is set to show upon quiz completion, show it now
          if (plugin.config.completionResponseMessaging) {
            $(_element + ' .button:not(' + _tryAgainBtn + '), ' + _element + ' ' + _questionCount).hide();
            $(_element + ' ' + _question + ', ' + _element + ' ' + _answers + ', ' + _element + ' ' + _responses).show();
            $quizResults.append($(_element + ' ' + _questions)).fadeIn(500, kN(key, 1));
          } else {
            $quizResults.fadeIn(500, kN(key, 1)); // 1st notch on key must be on both sides of if/else, otherwise key won't turn
          }
        });

        internal.method.turnKeyAndGo(key, options && options.callback ? options.callback : function () {});

        if (plugin.config.events && plugin.config.events.onCompleteQuiz) {
          plugin.config.events.onCompleteQuiz.apply(null, [{
            questionCount: questionCount,
            score: score
          }]);
        }
      },

      // Compares selected responses with true answers, returns true if they match exactly
      compareAnswers: function compareAnswers(trueAnswers, selectedAnswers, selectAny) {
        if (selectAny) {
          return $.inArray(selectedAnswers[0], trueAnswers) > -1;
        } else {
          // crafty array comparison (http://stackoverflow.com/a/7726509)
          return $(trueAnswers).not(selectedAnswers).length === 0 && $(selectedAnswers).not(trueAnswers).length === 0;
        }
      },

      // Calculates knowledge level based on number of correct answers
      calculateLevel: function calculateLevel(correctAnswers) {
        var percent = (correctAnswers / questionCount).toFixed(2),
            level = null;

        if (plugin.method.inRange(0, 0.20, percent)) {
          level = 4;
        } else if (plugin.method.inRange(0.21, 0.40, percent)) {
          level = 3;
        } else if (plugin.method.inRange(0.41, 0.60, percent)) {
          level = 2;
        } else if (plugin.method.inRange(0.61, 0.80, percent)) {
          level = 1;
        } else if (plugin.method.inRange(0.81, 1.00, percent)) {
          level = 0;
        }

        return level;
      },

      // Determines if percentage of correct values is within a level range
      inRange: function inRange(start, end, value) {
        return value >= start && value <= end;
      }
    };

    plugin.init = function () {
      // Setup quiz
      plugin.method.setupQuiz.apply(null, [{ callback: plugin.config.animationCallbacks.setupQuiz }]);

      // Bind "start" button
      $quizStarter.on('click', function (e) {
        e.preventDefault();

        if (!this.disabled && !$(this).hasClass('disabled')) {
          plugin.method.startQuiz.apply(null, [{ callback: plugin.config.animationCallbacks.startQuiz }]);
        }
      });

      // Bind "try again" button
      $(_element + ' ' + _tryAgainBtn).on('click', function (e) {
        e.preventDefault();
        plugin.method.resetQuiz(this, { callback: plugin.config.animationCallbacks.resetQuiz });
      });

      // Bind "check answer" buttons
      $(_element + ' ' + _checkAnswerBtn).on('click', function (e) {
        e.preventDefault();
        plugin.method.checkAnswer(this, { callback: plugin.config.animationCallbacks.checkAnswer });
      });

      // Bind "back" buttons
      $(_element + ' ' + _prevQuestionBtn).on('click', function (e) {
        e.preventDefault();
        plugin.method.backToQuestion(this, { callback: plugin.config.animationCallbacks.backToQuestion });
      });

      // Bind "next" buttons
      $(_element + ' ' + _nextQuestionBtn).on('click', function (e) {
        e.preventDefault();
        plugin.method.nextQuestion(this, { callback: plugin.config.animationCallbacks.nextQuestion });
      });

      // Accessibility (WAI-ARIA).
      var _qnid = $element.attr('id') + '-name';
      $quizName.attr('id', _qnid);
      $element.attr({
        'aria-labelledby': _qnid,
        'aria-live': 'polite',
        'aria-relevant': 'additions',
        'role': 'form'
      });
      $(_quizStarter + ', [href = "#"]').attr('role', 'button');
    };

    plugin.init();
  };

  $.fn.slickQuiz = function (options) {
    return this.each(function () {
      if (undefined === $(this).data('slickQuiz')) {
        var plugin = new $.slickQuiz(this, options);
        $(this).data('slickQuiz', plugin);
      }
    });
  };
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWNrUXVpei5qcyJdLCJuYW1lcyI6WyIkIiwic2xpY2tRdWl6IiwiZWxlbWVudCIsIm9wdGlvbnMiLCJwbHVnaW4iLCIkZWxlbWVudCIsIl9lbGVtZW50IiwiYXR0ciIsImRlZmF1bHRzIiwiY2hlY2tBbnN3ZXJUZXh0IiwibmV4dFF1ZXN0aW9uVGV4dCIsImJhY2tCdXR0b25UZXh0IiwiY29tcGxldGVRdWl6VGV4dCIsInRyeUFnYWluVGV4dCIsInF1ZXN0aW9uQ291bnRUZXh0IiwicHJldmVudFVuYW5zd2VyZWRUZXh0IiwicXVlc3Rpb25UZW1wbGF0ZVRleHQiLCJzY29yZVRlbXBsYXRlVGV4dCIsIm5hbWVUZW1wbGF0ZVRleHQiLCJza2lwU3RhcnRCdXR0b24iLCJudW1iZXJPZlF1ZXN0aW9ucyIsInJhbmRvbVNvcnRRdWVzdGlvbnMiLCJyYW5kb21Tb3J0QW5zd2VycyIsInByZXZlbnRVbmFuc3dlcmVkIiwiZGlzYWJsZVNjb3JlIiwiZGlzYWJsZVJhbmtpbmciLCJzY29yZUFzUGVyY2VudGFnZSIsInBlclF1ZXN0aW9uUmVzcG9uc2VNZXNzYWdpbmciLCJwZXJRdWVzdGlvblJlc3BvbnNlQW5zd2VycyIsImNvbXBsZXRpb25SZXNwb25zZU1lc3NhZ2luZyIsImRpc3BsYXlRdWVzdGlvbkNvdW50IiwiZGlzcGxheVF1ZXN0aW9uTnVtYmVyIiwiYW5pbWF0aW9uQ2FsbGJhY2tzIiwic2V0dXBRdWl6Iiwic3RhcnRRdWl6IiwicmVzZXRRdWl6IiwiY2hlY2tBbnN3ZXIiLCJuZXh0UXVlc3Rpb24iLCJiYWNrVG9RdWVzdGlvbiIsImNvbXBsZXRlUXVpeiIsImV2ZW50cyIsIm9uU3RhcnRRdWl6Iiwib25Db21wbGV0ZVF1aXoiLCJxdWVzdGlvbkNvdW50Q2xhc3MiLCJxdWVzdGlvbkdyb3VwQ2xhc3MiLCJxdWVzdGlvbkNsYXNzIiwiYW5zd2Vyc0NsYXNzIiwicmVzcG9uc2VzQ2xhc3MiLCJjb21wbGV0ZUNsYXNzIiwiY29ycmVjdENsYXNzIiwiaW5jb3JyZWN0Q2xhc3MiLCJjb3JyZWN0UmVzcG9uc2VDbGFzcyIsImluY29ycmVjdFJlc3BvbnNlQ2xhc3MiLCJjaGVja0Fuc3dlckNsYXNzIiwibmV4dFF1ZXN0aW9uQ2xhc3MiLCJsYXN0UXVlc3Rpb25DbGFzcyIsImJhY2tUb1F1ZXN0aW9uQ2xhc3MiLCJ0cnlBZ2FpbkNsYXNzIiwiX3F1ZXN0aW9uQ291bnQiLCJfcXVlc3Rpb25zIiwiX3F1ZXN0aW9uIiwiX2Fuc3dlcnMiLCJfYW5zd2VyIiwiX3Jlc3BvbnNlcyIsIl9yZXNwb25zZSIsIl9jb3JyZWN0IiwiX2NvcnJlY3RSZXNwb25zZSIsIl9pbmNvcnJlY3RSZXNwb25zZSIsIl9jaGVja0Fuc3dlckJ0biIsIl9uZXh0UXVlc3Rpb25CdG4iLCJfcHJldlF1ZXN0aW9uQnRuIiwiX3RyeUFnYWluQnRuIiwiX3F1aXpTdGFydGVyIiwiX3F1aXpOYW1lIiwiX3F1aXpBcmVhIiwiX3F1aXpSZXN1bHRzIiwiX3F1aXpSZXN1bHRzQ29weSIsIl9xdWl6SGVhZGVyIiwiX3F1aXpTY29yZSIsIl9xdWl6TGV2ZWwiLCIkcXVpelN0YXJ0ZXIiLCIkcXVpek5hbWUiLCIkcXVpekFyZWEiLCIkcXVpelJlc3VsdHMiLCIkcXVpelJlc3VsdHNDb3B5IiwiJHF1aXpIZWFkZXIiLCIkcXVpelNjb3JlIiwiJHF1aXpMZXZlbCIsImRlcE1zZyIsImRpc2FibGVOZXh0IiwiZGlzYWJsZVJlc3BvbnNlTWVzc2FnaW5nIiwicmFuZG9tU29ydCIsImNvbnNvbGUiLCJ3YXJuIiwiYWxlcnQiLCJjb25maWciLCJleHRlbmQiLCJxdWl6VmFsdWVzIiwianNvbiIsInF1aXpKU09OIiwicXVlc3Rpb25zIiwic29ydCIsIk1hdGgiLCJyb3VuZCIsInJhbmRvbSIsInF1ZXN0aW9uQ291bnQiLCJsZW5ndGgiLCJzbGljZSIsImludGVybmFsIiwibWV0aG9kIiwiZ2V0S2V5Iiwibm90Y2hlcyIsImtleSIsImkiLCJEZWZlcnJlZCIsInR1cm5LZXlBbmRHbyIsImdvIiwid2hlbiIsImFwcGx5IiwidGhlbiIsImdldEtleU5vdGNoIiwibm90Y2giLCJyZXNvbHZlIiwia2V5Tm90Y2giLCJrTiIsImhpZGUiLCJodG1sIiwicmVwbGFjZSIsImluZm8iLCJuYW1lIiwiZmFkZUluIiwicHJlcGVuZCIsIm1haW4iLCJhcHBlbmQiLCJyZXN1bHRzIiwicXVpeiIsImNvdW50IiwiaGFzT3duUHJvcGVydHkiLCJxdWVzdGlvbiIsInF1ZXN0aW9uSFRNTCIsImZvcm1hdFF1ZXN0aW9uIiwicSIsInRydXRocyIsImEiLCJhbnN3ZXIiLCJjb3JyZWN0IiwiYW5zd2VySFRNTCIsImFuc3dlcnMiLCJzZWxlY3RBbnkiLCJzZWxlY3RfYW55IiwiZm9yY2VDaGVja2JveCIsImZvcmNlX2NoZWNrYm94IiwiY2hlY2tib3giLCJpbnB1dE5hbWUiLCJpbnB1dFR5cGUiLCJvcHRpb25JZCIsInRvU3RyaW5nIiwiaW5wdXQiLCJvcHRpb25MYWJlbCIsIm9wdGlvbiIsImFuc3dlckNvbnRlbnQiLCJyZXNwb25zZUhUTUwiLCJpbmNvcnJlY3QiLCJuZXh0VGV4dCIsImNhbGxiYWNrIiwic3RhcnQiLCJmaXJzdFF1ZXN0aW9uIiwiZmlyc3QiLCJmYWRlT3V0Iiwic3RhcnRCdXR0b24iLCJwcm9wIiwicmVtb3ZlQ2xhc3MiLCJyZW1vdmUiLCJzaG93IiwiY2hlY2tCdXR0b24iLCJxdWVzdGlvbkxJIiwicGFyZW50cyIsImFuc3dlckxJcyIsImZpbmQiLCJhbnN3ZXJTZWxlY3RzIiwicXVlc3Rpb25JbmRleCIsInBhcnNlSW50IiwiYWRkQ2xhc3MiLCJ0cnVlQW5zd2VycyIsImluZGV4IiwicHVzaCIsImVxIiwic2VsZWN0ZWRBbnN3ZXJzIiwiZWFjaCIsImlkIiwiY29ycmVjdFJlc3BvbnNlIiwiY29tcGFyZUFuc3dlcnMiLCJkdXJhdGlvbiIsImNvbXBsZXRlIiwibmV4dEJ1dHRvbiIsImN1cnJlbnRRdWVzdGlvbiIsIm5leHQiLCJhbnN3ZXJJbnB1dHMiLCJlbmQiLCJiYWNrQnV0dG9uIiwicmVzcG9uc2VzIiwiY3NzIiwicHJldlF1ZXN0aW9uIiwicHJldiIsInNjb3JlIiwiZGlzcGxheVNjb3JlIiwidG9GaXhlZCIsImxldmVscyIsImxldmVsMSIsImxldmVsMiIsImxldmVsMyIsImxldmVsNCIsImxldmVsNSIsImxldmVsUmFuayIsImNhbGN1bGF0ZUxldmVsIiwibGV2ZWxUZXh0IiwiaXNOdW1lcmljIiwiaW5BcnJheSIsIm5vdCIsImNvcnJlY3RBbnN3ZXJzIiwicGVyY2VudCIsImxldmVsIiwiaW5SYW5nZSIsInZhbHVlIiwiaW5pdCIsIm9uIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZGlzYWJsZWQiLCJoYXNDbGFzcyIsIl9xbmlkIiwiZm4iLCJ1bmRlZmluZWQiLCJkYXRhIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7Ozs7QUFZQSxDQUFDLFVBQVNBLENBQVQsRUFBVztBQUNWQSxJQUFFQyxTQUFGLEdBQWMsVUFBU0MsT0FBVCxFQUFrQkMsT0FBbEIsRUFBMkI7QUFDdkMsUUFBSUMsU0FBVyxJQUFmO0FBQUEsUUFDSUMsV0FBV0wsRUFBRUUsT0FBRixDQURmO0FBQUEsUUFFSUksV0FBVyxNQUFNRCxTQUFTRSxJQUFULENBQWMsSUFBZCxDQUZyQjtBQUFBLFFBSUlDLFdBQVc7QUFDVEMsdUJBQWtCLGtCQURUO0FBRVRDLHdCQUFrQixjQUZUO0FBR1RDLHNCQUFnQixFQUhQO0FBSVRDLHdCQUFrQixFQUpUO0FBS1RDLG9CQUFjLEVBTEw7QUFNVEMseUJBQW1CLDZCQU5WO0FBT1RDLDZCQUF1QixzQ0FQZDtBQVFUQyw0QkFBdUIsZUFSZDtBQVNUQyx5QkFBbUIsaUJBVFY7QUFVVEMsd0JBQW1CLDBCQVZWO0FBV1RDLHVCQUFpQixLQVhSO0FBWVRDLHlCQUFtQixJQVpWO0FBYVRDLDJCQUFxQixLQWJaO0FBY1RDLHlCQUFtQixLQWRWO0FBZVRDLHlCQUFtQixLQWZWO0FBZ0JUQyxvQkFBYyxLQWhCTDtBQWlCVEMsc0JBQWdCLEtBakJQO0FBa0JUQyx5QkFBbUIsS0FsQlY7QUFtQlRDLG9DQUE4QixJQW5CckI7QUFvQlRDLGtDQUE0QixLQXBCbkI7QUFxQlRDLG1DQUE2QixLQXJCcEI7QUFzQlRDLDRCQUFzQixJQXRCYixFQXNCcUI7QUFDOUJDLDZCQUF1QixJQXZCZCxFQXVCcUI7QUFDOUJDLDBCQUFvQixFQUFFO0FBQ3BCQyxtQkFBVyxxQkFBWSxDQUFFLENBRFA7QUFFbEJDLG1CQUFXLHFCQUFZLENBQUUsQ0FGUDtBQUdsQkMsbUJBQVcscUJBQVksQ0FBRSxDQUhQO0FBSWxCQyxxQkFBYSx1QkFBWSxDQUFFLENBSlQ7QUFLbEJDLHNCQUFjLHdCQUFZLENBQUUsQ0FMVjtBQU1sQkMsd0JBQWdCLDBCQUFZLENBQUUsQ0FOWjtBQU9sQkMsc0JBQWMsd0JBQVksQ0FBRTtBQVBWLE9BeEJYO0FBaUNUQyxjQUFRO0FBQ05DLHFCQUFhLHFCQUFVdEMsT0FBVixFQUFtQixDQUFFLENBRDVCO0FBRU51Qyx3QkFBZ0Isd0JBQVV2QyxPQUFWLEVBQW1CLENBQUUsQ0FGL0IsQ0FFaUM7QUFGakM7QUFqQ0MsS0FKZjs7O0FBMkNJO0FBQ0F3Qyx5QkFBeUIsZUE1QzdCO0FBQUEsUUE2Q0lDLHFCQUF5QixXQTdDN0I7QUFBQSxRQThDSUMsZ0JBQXlCLFVBOUM3QjtBQUFBLFFBK0NJQyxlQUF5QixTQS9DN0I7QUFBQSxRQWdESUMsaUJBQXlCLFdBaEQ3QjtBQUFBLFFBaURJQyxnQkFBeUIsVUFqRDdCO0FBQUEsUUFrRElDLGVBQXlCLGlCQWxEN0I7QUFBQSxRQW1ESUMsaUJBQXlCLG1CQW5EN0I7QUFBQSxRQW9ESUMsdUJBQXlCLFNBcEQ3QjtBQUFBLFFBcURJQyx5QkFBeUIsV0FyRDdCO0FBQUEsUUFzRElDLG1CQUF5QixhQXREN0I7QUFBQSxRQXVESUMsb0JBQXlCLGNBdkQ3QjtBQUFBLFFBd0RJQyxvQkFBeUIsY0F4RDdCO0FBQUEsUUF5RElDLHNCQUF5QixnQkF6RDdCO0FBQUEsUUEwRElDLGdCQUF5QixVQTFEN0I7OztBQTRESTtBQUNBQyxxQkFBeUIsTUFBTWYsa0JBN0RuQztBQUFBLFFBOERJZ0IsYUFBeUIsTUFBTWYsa0JBOURuQztBQUFBLFFBK0RJZ0IsWUFBeUIsTUFBTWYsYUEvRG5DO0FBQUEsUUFnRUlnQixXQUF5QixNQUFNZixZQWhFbkM7QUFBQSxRQWlFSWdCLFVBQXlCLE1BQU1oQixZQUFOLEdBQXFCLEtBakVsRDtBQUFBLFFBa0VJaUIsYUFBeUIsTUFBTWhCLGNBbEVuQztBQUFBLFFBbUVJaUIsWUFBeUIsTUFBTWpCLGNBQU4sR0FBdUIsS0FuRXBEO0FBQUEsUUFvRUlrQixXQUF5QixNQUFNaEIsWUFwRW5DO0FBQUEsUUFxRUlpQixtQkFBeUIsTUFBTWYsb0JBckVuQztBQUFBLFFBc0VJZ0IscUJBQXlCLE1BQU1mLHNCQXRFbkM7QUFBQSxRQXVFSWdCLGtCQUF5QixNQUFNZixnQkF2RW5DO0FBQUEsUUF3RUlnQixtQkFBeUIsTUFBTWYsaUJBeEVuQztBQUFBLFFBeUVJZ0IsbUJBQXlCLE1BQU1kLG1CQXpFbkM7QUFBQSxRQTBFSWUsZUFBeUIsTUFBTWQsYUExRW5DOzs7QUE0RUk7QUFDQWUsbUJBQXlCbEUsV0FBVyxhQTdFeEM7QUFBQSxRQThFSW1FLFlBQXlCbkUsV0FBVyxZQTlFeEM7QUFBQSxRQStFSW9FLFlBQXlCcEUsV0FBVyxZQS9FeEM7QUFBQSxRQWdGSXFFLGVBQXlCckUsV0FBVyxlQWhGeEM7QUFBQSxRQWlGSXNFLG1CQUF5QnRFLFdBQVcsbUJBakZ4QztBQUFBLFFBa0ZJdUUsY0FBeUJ2RSxXQUFXLGNBbEZ4QztBQUFBLFFBbUZJd0UsYUFBeUJ4RSxXQUFXLGFBbkZ4QztBQUFBLFFBb0ZJeUUsYUFBeUJ6RSxXQUFXLGFBcEZ4Qzs7O0FBc0ZJO0FBQ0EwRSxtQkFBeUJoRixFQUFFd0UsWUFBRixDQXZGN0I7QUFBQSxRQXdGSVMsWUFBeUJqRixFQUFFeUUsU0FBRixDQXhGN0I7QUFBQSxRQXlGSVMsWUFBeUJsRixFQUFFMEUsU0FBRixDQXpGN0I7QUFBQSxRQTBGSVMsZUFBeUJuRixFQUFFMkUsWUFBRixDQTFGN0I7QUFBQSxRQTJGSVMsbUJBQXlCcEYsRUFBRTRFLGdCQUFGLENBM0Y3QjtBQUFBLFFBNEZJUyxjQUF5QnJGLEVBQUU2RSxXQUFGLENBNUY3QjtBQUFBLFFBNkZJUyxhQUF5QnRGLEVBQUU4RSxVQUFGLENBN0Y3QjtBQUFBLFFBOEZJUyxhQUF5QnZGLEVBQUUrRSxVQUFGLENBOUY3Qjs7QUFrR0E7QUFDQSxRQUFJUyxTQUFTLEVBQWI7O0FBRUEsUUFBSXJGLFdBQVcsT0FBT0EsUUFBUXNGLFdBQWYsSUFBOEIsV0FBN0MsRUFBMEQ7QUFDeEQsVUFBSSxPQUFPdEYsUUFBUW9CLGlCQUFmLElBQW9DLFdBQXhDLEVBQXFEO0FBQ25EcEIsZ0JBQVFvQixpQkFBUixHQUE0QnBCLFFBQVFzRixXQUFwQztBQUNEO0FBQ0RELGdCQUFVLHNHQUFWO0FBQ0Q7O0FBRUQsUUFBSXJGLFdBQVcsT0FBT0EsUUFBUXVGLHdCQUFmLElBQTJDLFdBQTFELEVBQXVFO0FBQ3JFLFVBQUksT0FBT3ZGLFFBQVFvQixpQkFBZixJQUFvQyxXQUF4QyxFQUFxRDtBQUNuRHBCLGdCQUFRd0IsNEJBQVIsR0FBdUN4QixRQUFRdUYsd0JBQS9DO0FBQ0Q7QUFDREYsZ0JBQVUsNEVBQ04sMkZBREo7QUFFRDs7QUFFRCxRQUFJckYsV0FBVyxPQUFPQSxRQUFRd0YsVUFBZixJQUE2QixXQUE1QyxFQUF5RDtBQUN2RCxVQUFJLE9BQU94RixRQUFRa0IsbUJBQWYsSUFBc0MsV0FBMUMsRUFBdUQ7QUFDckRsQixnQkFBUWtCLG1CQUFSLEdBQThCbEIsUUFBUXdGLFVBQXRDO0FBQ0Q7QUFDRCxVQUFJLE9BQU94RixRQUFRbUIsaUJBQWYsSUFBb0MsV0FBeEMsRUFBcUQ7QUFDbkRuQixnQkFBUW1CLGlCQUFSLEdBQTRCbkIsUUFBUXdGLFVBQXBDO0FBQ0Q7QUFDREgsZ0JBQVUsOERBQ04sd0VBREo7QUFFRDs7QUFFRCxRQUFJQSxXQUFXLEVBQWYsRUFBbUI7QUFDakIsVUFBSSxPQUFPSSxPQUFQLElBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDQSxnQkFBUUMsSUFBUixDQUFhTCxNQUFiO0FBQ0QsT0FGRCxNQUVPO0FBQ0xNLGNBQU1OLE1BQU47QUFDRDtBQUNGO0FBQ0Q7OztBQUdBcEYsV0FBTzJGLE1BQVAsR0FBZ0IvRixFQUFFZ0csTUFBRixDQUFTeEYsUUFBVCxFQUFtQkwsT0FBbkIsQ0FBaEI7O0FBRUE7QUFDQSxRQUFJOEYsYUFBYzdGLE9BQU8yRixNQUFQLENBQWNHLElBQWQsR0FBcUI5RixPQUFPMkYsTUFBUCxDQUFjRyxJQUFuQyxHQUEwQyxPQUFPQyxRQUFQLElBQW1CLFdBQW5CLEdBQWlDQSxRQUFqQyxHQUE0QyxJQUF4Rzs7QUFFQTtBQUNBLFFBQUlDLFlBQVloRyxPQUFPMkYsTUFBUCxDQUFjMUUsbUJBQWQsR0FDWjRFLFdBQVdHLFNBQVgsQ0FBcUJDLElBQXJCLENBQTBCLFlBQVc7QUFBRSxhQUFRQyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsRUFBWCxJQUEwQixHQUFsQztBQUF5QyxLQUFoRixDQURZLEdBRVpQLFdBQVdHLFNBRmY7O0FBSUE7QUFDQSxRQUFJSyxnQkFBZ0JMLFVBQVVNLE1BQTlCOztBQUVBO0FBQ0EsUUFBSXRHLE9BQU8yRixNQUFQLENBQWMzRSxpQkFBZCxJQUFtQ3FGLGlCQUFpQnJHLE9BQU8yRixNQUFQLENBQWMzRSxpQkFBdEUsRUFBeUY7QUFDdkZnRixrQkFBWUEsVUFBVU8sS0FBVixDQUFnQixDQUFoQixFQUFtQnZHLE9BQU8yRixNQUFQLENBQWMzRSxpQkFBakMsQ0FBWjtBQUNBcUYsc0JBQWdCTCxVQUFVTSxNQUExQjtBQUNEOztBQUVEO0FBQ0EsUUFBSUUsV0FBVyxFQUFDQyxRQUFRO0FBQ3RCO0FBQ0E7QUFDQUMsZ0JBQVEsZ0JBQVVDLE9BQVYsRUFBbUI7QUFBRTtBQUMzQixjQUFJQyxNQUFNLEVBQVY7QUFDQSxlQUFLLElBQUlDLElBQUUsQ0FBWCxFQUFjQSxJQUFFRixPQUFoQixFQUF5QkUsR0FBekI7QUFBOEJELGdCQUFJQyxDQUFKLElBQVNqSCxFQUFFa0gsUUFBRixFQUFUO0FBQTlCLFdBQ0EsT0FBT0YsR0FBUDtBQUNELFNBUHFCOztBQVN0QjtBQUNBRyxzQkFBYyxzQkFBVUgsR0FBVixFQUFlSSxFQUFmLEVBQW1CO0FBQUU7QUFDakM7QUFDQXBILFlBQUVxSCxJQUFGLENBQU9DLEtBQVAsQ0FBYyxJQUFkLEVBQW9CTixHQUFwQixFQUEwQk8sSUFBMUIsQ0FBZ0MsWUFBWTtBQUMxQ0g7QUFDRCxXQUZEO0FBR0QsU0FmcUI7O0FBaUJ0QjtBQUNBSSxxQkFBYSxxQkFBVVIsR0FBVixFQUFlUyxLQUFmLEVBQXNCO0FBQUU7QUFDbkM7QUFDQTtBQUNBLGlCQUFPLFlBQVk7QUFDakJULGdCQUFJUyxRQUFNLENBQVYsRUFBYUMsT0FBYixHQURpQixDQUNRO0FBQzFCLFdBRkQ7QUFHRDtBQXhCcUIsT0FBVCxFQUFmOztBQTJCQXRILFdBQU95RyxNQUFQLEdBQWdCO0FBQ2Q7QUFDQTVFLGlCQUFXLG1CQUFTOUIsT0FBVCxFQUFrQjtBQUFFO0FBQzdCLFlBQUk2RyxHQUFKLEVBQVNXLFFBQVQsRUFBbUJDLEVBQW5CO0FBQ0FaLGNBQU1KLFNBQVNDLE1BQVQsQ0FBZ0JDLE1BQWhCLENBQXdCLENBQXhCLENBQU4sQ0FGMkIsQ0FFTztBQUNsQ2EsbUJBQVdmLFNBQVNDLE1BQVQsQ0FBZ0JXLFdBQTNCLENBSDJCLENBR2E7QUFDeENJLGFBQUtELFFBQUwsQ0FKMkIsQ0FJWjs7QUFFZjFDLGtCQUFVNEMsSUFBVixHQUFpQkMsSUFBakIsQ0FBc0IxSCxPQUFPMkYsTUFBUCxDQUFjN0UsZ0JBQWQsQ0FDakI2RyxPQURpQixDQUNULE9BRFMsRUFDQTlCLFdBQVcrQixJQUFYLENBQWdCQyxJQURoQixDQUF0QixFQUM4Q0MsTUFEOUMsQ0FDcUQsSUFEckQsRUFDMkROLEdBQUdaLEdBQUgsRUFBTyxDQUFQLENBRDNEO0FBRUEzQixvQkFBWXdDLElBQVosR0FBbUJNLE9BQW5CLENBQTJCbkksRUFBRSxrQ0FBa0NpRyxXQUFXK0IsSUFBWCxDQUFnQkksSUFBbEQsR0FBeUQsUUFBM0QsQ0FBM0IsRUFBaUdGLE1BQWpHLENBQXdHLElBQXhHLEVBQThHTixHQUFHWixHQUFILEVBQU8sQ0FBUCxDQUE5RztBQUNBNUIseUJBQWlCaUQsTUFBakIsQ0FBd0JwQyxXQUFXK0IsSUFBWCxDQUFnQk0sT0FBeEM7O0FBRUE7QUFDQSxZQUFJbEksT0FBTzJGLE1BQVAsQ0FBY2xGLFlBQWQsSUFBOEJULE9BQU8yRixNQUFQLENBQWNsRixZQUFkLEtBQStCLEVBQWpFLEVBQXFFO0FBQ25FdUUsMkJBQWlCaUQsTUFBakIsQ0FBd0IseUJBQXlCNUUsYUFBekIsR0FBeUMsYUFBekMsR0FBeURyRCxPQUFPMkYsTUFBUCxDQUFjbEYsWUFBdkUsR0FBc0YsVUFBOUc7QUFDRDs7QUFFRDtBQUNBLFlBQUkwSCxPQUFRdkksRUFBRSxnQkFBZ0I0QyxrQkFBaEIsR0FBcUMsU0FBdkMsQ0FBWjtBQUFBLFlBQ0k0RixRQUFRLENBRFo7O0FBR0E7QUFDQSxhQUFLLElBQUl2QixDQUFULElBQWNiLFNBQWQsRUFBeUI7QUFDdkIsY0FBSUEsVUFBVXFDLGNBQVYsQ0FBeUJ4QixDQUF6QixDQUFKLEVBQWlDO0FBQy9CLGdCQUFJeUIsV0FBV3RDLFVBQVVhLENBQVYsQ0FBZjs7QUFFQSxnQkFBSTBCLGVBQWUzSSxFQUFFLGdCQUFnQjZDLGFBQWhCLEdBQStCLGdCQUEvQixJQUFtRDJGLFFBQVEsQ0FBM0QsSUFBZ0UsU0FBbEUsQ0FBbkI7O0FBRUEsZ0JBQUlwSSxPQUFPMkYsTUFBUCxDQUFjakUsb0JBQWxCLEVBQXdDO0FBQ3RDNkcsMkJBQWFOLE1BQWIsQ0FBb0IsaUJBQWlCMUYsa0JBQWpCLEdBQXNDLElBQXRDLEdBQ2hCdkMsT0FBTzJGLE1BQVAsQ0FBY2pGLGlCQUFkLENBQ0tpSCxPQURMLENBQ2EsVUFEYixFQUN5QiwyQkFBMkJTLEtBQTNCLEdBQW1DLFNBRDVELEVBRUtULE9BRkwsQ0FFYSxRQUZiLEVBRXVCLHlCQUNmdEIsYUFEZSxHQUNDLFNBSHhCLENBRGdCLEdBSXFCLFFBSnpDO0FBS0Q7O0FBRUQsZ0JBQUltQyxpQkFBaUIsRUFBckI7QUFDQSxnQkFBSXhJLE9BQU8yRixNQUFQLENBQWNoRSxxQkFBbEIsRUFBeUM7QUFDdkM2RywrQkFBaUJ4SSxPQUFPMkYsTUFBUCxDQUFjL0Usb0JBQWQsQ0FDWitHLE9BRFksQ0FDSixRQURJLEVBQ01TLEtBRE4sRUFDYVQsT0FEYixDQUNxQixPQURyQixFQUM4QlcsU0FBU0csQ0FEdkMsQ0FBakI7QUFFRCxhQUhELE1BR087QUFDTEQsK0JBQWlCRixTQUFTRyxDQUExQjtBQUNEO0FBQ0RGLHlCQUFhTixNQUFiLENBQW9CLFNBQVNPLGNBQVQsR0FBMEIsT0FBOUM7O0FBRUE7QUFDQSxnQkFBSUUsU0FBUyxDQUFiO0FBQ0EsaUJBQUssSUFBSTdCLENBQVQsSUFBY3lCLFNBQVNLLENBQXZCLEVBQTBCO0FBQ3hCLGtCQUFJTCxTQUFTSyxDQUFULENBQVdOLGNBQVgsQ0FBMEJ4QixDQUExQixDQUFKLEVBQWtDO0FBQ2hDLG9CQUFJK0IsU0FBU04sU0FBU0ssQ0FBVCxDQUFXOUIsQ0FBWCxDQUFiO0FBQ0Esb0JBQUkrQixPQUFPQyxPQUFYLEVBQW9CO0FBQ2xCSDtBQUNEO0FBQ0Y7QUFDRjs7QUFFRDtBQUNBLGdCQUFJSSxhQUFhbEosRUFBRSxnQkFBZ0I4QyxZQUFoQixHQUErQixTQUFqQyxDQUFqQjs7QUFFQTtBQUNBLGdCQUFJcUcsVUFBVS9JLE9BQU8yRixNQUFQLENBQWN6RSxpQkFBZCxHQUNWb0gsU0FBU0ssQ0FBVCxDQUFXMUMsSUFBWCxDQUFnQixZQUFXO0FBQUUscUJBQVFDLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsTUFBTCxFQUFYLElBQTBCLEdBQWxDO0FBQXlDLGFBQXRFLENBRFUsR0FFVmtDLFNBQVNLLENBRmI7O0FBSUE7QUFDQSxnQkFBSUssWUFBZ0JWLFNBQVNXLFVBQVQsR0FBc0JYLFNBQVNXLFVBQS9CLEdBQTRDLEtBQWhFO0FBQUEsZ0JBQ0lDLGdCQUFnQlosU0FBU2EsY0FBVCxHQUEwQmIsU0FBU2EsY0FBbkMsR0FBb0QsS0FEeEU7QUFBQSxnQkFFSUMsV0FBaUJWLFNBQVMsQ0FBVCxJQUFjLENBQUNNLFNBQWhCLElBQThCRSxhQUZsRDtBQUFBLGdCQUdJRyxZQUFnQnBKLFNBQVNFLElBQVQsQ0FBYyxJQUFkLElBQXNCLFdBQXRCLElBQXFDaUksUUFBUSxDQUE3QyxDQUhwQjtBQUFBLGdCQUlJa0IsWUFBZ0JGLFdBQVcsVUFBWCxHQUF3QixPQUo1Qzs7QUFNQSxnQkFBSWhCLFNBQVN2QyxXQUFXRyxTQUFYLENBQXFCTSxNQUFsQyxFQUEyQztBQUN6Q3BELGtDQUFvQkEsb0JBQW9CLEdBQXBCLEdBQTBCQyxpQkFBOUM7QUFDRDs7QUFFRCxpQkFBSyxJQUFJMEQsQ0FBVCxJQUFja0MsT0FBZCxFQUF1QjtBQUNyQixrQkFBSUEsUUFBUVYsY0FBUixDQUF1QnhCLENBQXZCLENBQUosRUFBK0I7QUFDN0Isb0JBQUkwQyxRQUFKO0FBQ0FYLHlCQUFXRyxRQUFRbEMsQ0FBUixDQUFYO0FBQ0EwQywyQkFBV0YsWUFBWSxHQUFaLEdBQWtCeEMsRUFBRTJDLFFBQUYsRUFBN0I7O0FBRUE7QUFDQSxvQkFBSUMsUUFBUSxnQkFBZ0JGLFFBQWhCLEdBQTJCLFVBQTNCLEdBQXdDRixTQUF4QyxHQUNSLFVBRFEsR0FDS0MsU0FETCxHQUNpQixPQUQ3Qjs7QUFHQSxvQkFBSUksY0FBYyxpQkFBaUJILFFBQWpCLEdBQTRCLElBQTVCLEdBQW1DWCxPQUFPZSxNQUExQyxHQUFtRCxVQUFyRTs7QUFFQSxvQkFBSUMsZ0JBQWdCaEssRUFBRSxXQUFGLEVBQ2ZxSSxNQURlLENBQ1J3QixLQURRLEVBRWZ4QixNQUZlLENBRVJ5QixXQUZRLENBQXBCO0FBR0FaLDJCQUFXYixNQUFYLENBQWtCMkIsYUFBbEI7QUFDRDtBQUNGOztBQUVEO0FBQ0FyQix5QkFBYU4sTUFBYixDQUFvQmEsVUFBcEI7O0FBRUE7QUFDQSxnQkFBSTlJLE9BQU8yRixNQUFQLENBQWNwRSw0QkFBZCxJQUE4Q3ZCLE9BQU8yRixNQUFQLENBQWNsRSwyQkFBaEUsRUFBNkY7QUFDM0Y7QUFDQSxrQkFBSW9JLGVBQWVqSyxFQUFFLGdCQUFnQitDLGNBQWhCLEdBQWlDLFNBQW5DLENBQW5CO0FBQ0FrSCwyQkFBYTVCLE1BQWIsQ0FBb0IsZ0JBQWdCbEYsb0JBQWhCLEdBQXVDLElBQXZDLEdBQThDdUYsU0FBU08sT0FBdkQsR0FBaUUsT0FBckY7QUFDQWdCLDJCQUFhNUIsTUFBYixDQUFvQixnQkFBZ0JqRixzQkFBaEIsR0FBeUMsSUFBekMsR0FBZ0RzRixTQUFTd0IsU0FBekQsR0FBcUUsT0FBekY7O0FBRUE7QUFDQXZCLDJCQUFhTixNQUFiLENBQW9CNEIsWUFBcEI7QUFDRDs7QUFFRDtBQUNBLGdCQUFJN0osT0FBTzJGLE1BQVAsQ0FBY3BGLGNBQWQsSUFBZ0NQLE9BQU8yRixNQUFQLENBQWNwRixjQUFkLEtBQWlDLEVBQXJFLEVBQXlFO0FBQ3ZFZ0ksMkJBQWFOLE1BQWIsQ0FBb0IsK0JBQStCN0UsbUJBQS9CLEdBQXFELElBQXJELEdBQTREcEQsT0FBTzJGLE1BQVAsQ0FBY3BGLGNBQTFFLEdBQTJGLE1BQS9HO0FBQ0Q7O0FBRUQsZ0JBQUl3SixXQUFXL0osT0FBTzJGLE1BQVAsQ0FBY3JGLGdCQUE3QjtBQUNBLGdCQUFJTixPQUFPMkYsTUFBUCxDQUFjbkYsZ0JBQWQsSUFBa0M0SCxTQUFTL0IsYUFBL0MsRUFBOEQ7QUFDNUQwRCx5QkFBVy9KLE9BQU8yRixNQUFQLENBQWNuRixnQkFBekI7QUFDRDs7QUFFRDtBQUNBLGdCQUFJLENBQUNSLE9BQU8yRixNQUFQLENBQWNwRSw0QkFBbkIsRUFBaUQ7QUFDL0NnSCwyQkFBYU4sTUFBYixDQUFvQiwrQkFBK0IvRSxpQkFBL0IsR0FBbUQsR0FBbkQsR0FBeURELGdCQUF6RCxHQUE0RSxJQUE1RSxHQUFtRjhHLFFBQW5GLEdBQThGLE1BQWxIO0FBQ0QsYUFGRCxNQUVPO0FBQ0x4QiwyQkFBYU4sTUFBYixDQUFvQiwrQkFBK0IvRSxpQkFBL0IsR0FBbUQsSUFBbkQsR0FBMEQ2RyxRQUExRCxHQUFxRSxNQUF6RjtBQUNBeEIsMkJBQWFOLE1BQWIsQ0FBb0IsK0JBQStCaEYsZ0JBQS9CLEdBQWtELElBQWxELEdBQXlEakQsT0FBTzJGLE1BQVAsQ0FBY3RGLGVBQXZFLEdBQXlGLE1BQTdHO0FBQ0Q7O0FBRUQ7QUFDQThILGlCQUFLRixNQUFMLENBQVlNLFlBQVo7O0FBRUFIO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBdEQsa0JBQVVtRCxNQUFWLENBQWlCRSxJQUFqQjs7QUFFQTtBQUNBLFlBQUluSSxPQUFPMkYsTUFBUCxDQUFjNUUsZUFBZCxJQUFpQzZELGFBQWEwQixNQUFiLElBQXVCLENBQTVELEVBQStEO0FBQzdEMUIsdUJBQWE2QyxJQUFiO0FBQ0F6SCxpQkFBT3lHLE1BQVAsQ0FBYzNFLFNBQWQsQ0FBd0JvRixLQUF4QixDQUErQixJQUEvQixFQUFxQyxDQUFDLEVBQUM4QyxVQUFVaEssT0FBTzJGLE1BQVAsQ0FBYy9ELGtCQUFkLENBQWlDRSxTQUE1QyxFQUFELENBQXJDLEVBRjZELENBRW1DO0FBQ2hHMEYsYUFBR1osR0FBSCxFQUFPLENBQVAsRUFBVU0sS0FBVixDQUFpQixJQUFqQixFQUF1QixFQUF2QjtBQUNELFNBSkQsTUFJTztBQUNMdEMsdUJBQWFrRCxNQUFiLENBQW9CLEdBQXBCLEVBQXlCTixHQUFHWixHQUFILEVBQU8sQ0FBUCxDQUF6QixFQURLLENBQ2dDO0FBQ3RDOztBQUVESixpQkFBU0MsTUFBVCxDQUFnQk0sWUFBaEIsQ0FBOEJILEdBQTlCLEVBQW1DN0csV0FBV0EsUUFBUWlLLFFBQW5CLEdBQThCakssUUFBUWlLLFFBQXRDLEdBQWlELFlBQVksQ0FBRSxDQUFsRztBQUNELE9BbkphOztBQXFKZDtBQUNBbEksaUJBQVcsbUJBQVMvQixPQUFULEVBQWtCO0FBQzNCLFlBQUk2RyxHQUFKLEVBQVNXLFFBQVQsRUFBbUJDLEVBQW5CO0FBQ0FaLGNBQU1KLFNBQVNDLE1BQVQsQ0FBZ0JDLE1BQWhCLENBQXdCLENBQXhCLENBQU4sQ0FGMkIsQ0FFTztBQUNsQ2EsbUJBQVdmLFNBQVNDLE1BQVQsQ0FBZ0JXLFdBQTNCLENBSDJCLENBR2E7QUFDeENJLGFBQUtELFFBQUwsQ0FKMkIsQ0FJWjs7QUFFZixpQkFBUzBDLEtBQVQsQ0FBZWxLLE9BQWYsRUFBd0I7QUFDdEIsY0FBSW1LLGdCQUFnQnRLLEVBQUVNLFdBQVcsR0FBWCxHQUFpQnFELFVBQWpCLEdBQThCLEtBQWhDLEVBQXVDNEcsS0FBdkMsRUFBcEI7QUFDQSxjQUFJRCxjQUFjNUQsTUFBbEIsRUFBMEI7QUFDeEI0RCwwQkFBY3BDLE1BQWQsQ0FBcUIsR0FBckIsRUFBMEIsWUFBWTtBQUNwQyxrQkFBSS9ILFdBQVdBLFFBQVFpSyxRQUF2QixFQUFpQ2pLLFFBQVFpSyxRQUFSO0FBQ2xDLGFBRkQ7QUFHRDtBQUNGOztBQUVELFlBQUloSyxPQUFPMkYsTUFBUCxDQUFjNUUsZUFBZCxJQUFpQzZELGFBQWEwQixNQUFiLElBQXVCLENBQTVELEVBQStEO0FBQzdEMkQsZ0JBQU0sRUFBQ0QsVUFBVXhDLEdBQUdaLEdBQUgsRUFBTyxDQUFQLENBQVgsRUFBTjtBQUNELFNBRkQsTUFFTztBQUNMaEMsdUJBQWF3RixPQUFiLENBQXFCLEdBQXJCLEVBQTBCLFlBQVU7QUFDbENILGtCQUFNLEVBQUNELFVBQVV4QyxHQUFHWixHQUFILEVBQU8sQ0FBUCxDQUFYLEVBQU4sRUFEa0MsQ0FDSjtBQUMvQixXQUZEO0FBR0Q7O0FBRURKLGlCQUFTQyxNQUFULENBQWdCTSxZQUFoQixDQUE4QkgsR0FBOUIsRUFBbUM3RyxXQUFXQSxRQUFRaUssUUFBbkIsR0FBOEJqSyxRQUFRaUssUUFBdEMsR0FBaUQsWUFBWSxDQUFFLENBQWxHOztBQUVBLFlBQUloSyxPQUFPMkYsTUFBUCxDQUFjdkQsTUFBZCxJQUNBcEMsT0FBTzJGLE1BQVAsQ0FBY3ZELE1BQWQsQ0FBcUJDLFdBRHpCLEVBQ3NDO0FBQ3BDckMsaUJBQU8yRixNQUFQLENBQWN2RCxNQUFkLENBQXFCQyxXQUFyQixDQUFpQzZFLEtBQWpDLENBQXdDLElBQXhDLEVBQThDLEVBQTlDO0FBQ0Q7QUFDRixPQW5MYTs7QUFxTGQ7QUFDQW5GLGlCQUFXLG1CQUFTc0ksV0FBVCxFQUFzQnRLLE9BQXRCLEVBQStCO0FBQ3hDLFlBQUk2RyxHQUFKLEVBQVNXLFFBQVQsRUFBbUJDLEVBQW5CO0FBQ0FaLGNBQU1KLFNBQVNDLE1BQVQsQ0FBZ0JDLE1BQWhCLENBQXdCLENBQXhCLENBQU4sQ0FGd0MsQ0FFTjtBQUNsQ2EsbUJBQVdmLFNBQVNDLE1BQVQsQ0FBZ0JXLFdBQTNCLENBSHdDLENBR0E7QUFDeENJLGFBQUtELFFBQUwsQ0FKd0MsQ0FJekI7O0FBRWZ4QyxxQkFBYXFGLE9BQWIsQ0FBcUIsR0FBckIsRUFBMEIsWUFBVztBQUNuQ3hLLFlBQUVNLFdBQVcsUUFBYixFQUF1Qm9LLElBQXZCLENBQTRCLFNBQTVCLEVBQXVDLEtBQXZDLEVBQThDQSxJQUE5QyxDQUFtRCxVQUFuRCxFQUErRCxLQUEvRDs7QUFFQW5GLHFCQUFXaEYsSUFBWCxDQUFnQixPQUFoQixFQUF5QixXQUF6QjtBQUNBUCxZQUFFTSxXQUFXLEdBQVgsR0FBaUJzRCxTQUFuQixFQUE4QitHLFdBQTlCLENBQTBDMUgsWUFBMUMsRUFBd0QwSCxXQUF4RCxDQUFvRXpILGNBQXBFLEVBQW9GMEgsTUFBcEYsQ0FBMkY1SCxhQUEzRjtBQUNBaEQsWUFBRU0sV0FBVyxHQUFYLEdBQWlCd0QsT0FBbkIsRUFBNEI2RyxXQUE1QixDQUF3Q3hILG9CQUF4QyxFQUE4RHdILFdBQTlELENBQTBFdkgsc0JBQTFFOztBQUVBcEQsWUFBRU0sV0FBVyxHQUFYLEdBQWlCc0QsU0FBakIsR0FBc0MsR0FBdEMsR0FDRXRELFFBREYsR0FDYSxHQURiLEdBQ21CeUQsVUFEbkIsR0FDd0MsR0FEeEMsR0FFRXpELFFBRkYsR0FFYSxHQUZiLEdBRW1CMEQsU0FGbkIsR0FFd0MsR0FGeEMsR0FHRTFELFFBSEYsR0FHYSxHQUhiLEdBR21CK0QsZ0JBSG5CLEdBR3dDLEdBSHhDLEdBSUUvRCxRQUpGLEdBSWEsR0FKYixHQUltQmdFLGdCQUpyQixFQUtFdUQsSUFMRjs7QUFPQTdILFlBQUVNLFdBQVcsR0FBWCxHQUFpQm9ELGNBQWpCLEdBQWtDLEdBQWxDLEdBQ0VwRCxRQURGLEdBQ2EsR0FEYixHQUNtQnVELFFBRG5CLEdBQzhCLEdBRDlCLEdBRUV2RCxRQUZGLEdBRWEsR0FGYixHQUVtQjhELGVBRnJCLEVBR0V5RyxJQUhGOztBQUtBM0Ysb0JBQVVtRCxNQUFWLENBQWlCckksRUFBRU0sV0FBVyxHQUFYLEdBQWlCcUQsVUFBbkIsQ0FBakIsRUFBaURrSCxJQUFqRDs7QUFFQWpELGFBQUdaLEdBQUgsRUFBTyxDQUFQLEVBQVVNLEtBQVYsQ0FBaUIsSUFBakIsRUFBdUIsRUFBdkI7O0FBRUFsSCxpQkFBT3lHLE1BQVAsQ0FBYzNFLFNBQWQsQ0FBd0IsRUFBQ2tJLFVBQVVoSyxPQUFPMkYsTUFBUCxDQUFjL0Qsa0JBQWQsQ0FBaUNFLFNBQTVDLEVBQXhCLEVBQStFaUQsWUFBL0UsRUF2Qm1DLENBdUIyRDtBQUMvRixTQXhCRDs7QUEwQkF5QixpQkFBU0MsTUFBVCxDQUFnQk0sWUFBaEIsQ0FBOEJILEdBQTlCLEVBQW1DN0csV0FBV0EsUUFBUWlLLFFBQW5CLEdBQThCakssUUFBUWlLLFFBQXRDLEdBQWlELFlBQVksQ0FBRSxDQUFsRztBQUNELE9Bdk5hOztBQXlOZDtBQUNBaEksbUJBQWEscUJBQVMwSSxXQUFULEVBQXNCM0ssT0FBdEIsRUFBK0I7QUFDMUMsWUFBSTZHLEdBQUosRUFBU1csUUFBVCxFQUFtQkMsRUFBbkI7QUFDQVosY0FBTUosU0FBU0MsTUFBVCxDQUFnQkMsTUFBaEIsQ0FBd0IsQ0FBeEIsQ0FBTixDQUYwQyxDQUVSO0FBQ2xDYSxtQkFBV2YsU0FBU0MsTUFBVCxDQUFnQlcsV0FBM0IsQ0FIMEMsQ0FHRjtBQUN4Q0ksYUFBS0QsUUFBTCxDQUowQyxDQUkzQjs7QUFFZixZQUFJb0QsYUFBZ0IvSyxFQUFFQSxFQUFFOEssV0FBRixFQUFlRSxPQUFmLENBQXVCcEgsU0FBdkIsRUFBa0MsQ0FBbEMsQ0FBRixDQUFwQjtBQUFBLFlBQ0lxSCxZQUFnQkYsV0FBV0csSUFBWCxDQUFnQnJILFdBQVcsS0FBM0IsQ0FEcEI7QUFBQSxZQUVJc0gsZ0JBQWdCRixVQUFVQyxJQUFWLENBQWUsZUFBZixDQUZwQjtBQUFBLFlBR0lFLGdCQUFnQkMsU0FBU04sV0FBV3hLLElBQVgsQ0FBZ0IsSUFBaEIsRUFBc0J3SCxPQUF0QixDQUE4QixZQUE5QixFQUE0QyxFQUE1QyxDQUFULEVBQTBELEVBQTFELENBSHBCO0FBQUEsWUFJSW9CLFVBQWdCL0MsVUFBVWdGLGFBQVYsRUFBeUJyQyxDQUo3QztBQUFBLFlBS0lLLFlBQWdCaEQsVUFBVWdGLGFBQVYsRUFBeUIvQixVQUF6QixHQUFzQ2pELFVBQVVnRixhQUFWLEVBQXlCL0IsVUFBL0QsR0FBNEUsS0FMaEc7O0FBT0E0QixrQkFBVUssUUFBVixDQUFtQmxJLHNCQUFuQjs7QUFFQTtBQUNBLFlBQUltSSxjQUFjLEVBQWxCO0FBQ0EsYUFBSyxJQUFJdEUsQ0FBVCxJQUFja0MsT0FBZCxFQUF1QjtBQUNyQixjQUFJQSxRQUFRVixjQUFSLENBQXVCeEIsQ0FBdkIsQ0FBSixFQUErQjtBQUM3QixnQkFBSStCLFNBQVNHLFFBQVFsQyxDQUFSLENBQWI7QUFBQSxnQkFDSXVFLFFBQVNILFNBQVNwRSxDQUFULEVBQVksRUFBWixDQURiOztBQUdBLGdCQUFJK0IsT0FBT0MsT0FBWCxFQUFvQjtBQUNsQnNDLDBCQUFZRSxJQUFaLENBQWlCRCxLQUFqQjtBQUNBUCx3QkFBVVMsRUFBVixDQUFhRixLQUFiLEVBQW9CYixXQUFwQixDQUFnQ3ZILHNCQUFoQyxFQUF3RGtJLFFBQXhELENBQWlFbkksb0JBQWpFO0FBQ0Q7QUFDRjtBQUNGOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFlBQUl3SSxrQkFBa0IsRUFBdEI7QUFDQVIsc0JBQWNTLElBQWQsQ0FBb0IsWUFBVztBQUM3QixjQUFJQyxLQUFLN0wsRUFBRSxJQUFGLEVBQVFPLElBQVIsQ0FBYSxJQUFiLENBQVQ7QUFDQW9MLDBCQUFnQkYsSUFBaEIsQ0FBcUJKLFNBQVNRLEdBQUc5RCxPQUFILENBQVcsdUJBQVgsRUFBb0MsRUFBcEMsQ0FBVCxFQUFrRCxFQUFsRCxDQUFyQjtBQUNELFNBSEQ7O0FBS0EsWUFBSTNILE9BQU8yRixNQUFQLENBQWN4RSxpQkFBZCxJQUFtQ29LLGdCQUFnQmpGLE1BQWhCLEtBQTJCLENBQWxFLEVBQXFFO0FBQ25FWixnQkFBTTFGLE9BQU8yRixNQUFQLENBQWNoRixxQkFBcEI7QUFDQSxpQkFBTyxLQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFJK0ssa0JBQWtCMUwsT0FBT3lHLE1BQVAsQ0FBY2tGLGNBQWQsQ0FBNkJSLFdBQTdCLEVBQTBDSSxlQUExQyxFQUEyRHZDLFNBQTNELENBQXRCOztBQUVBLFlBQUkwQyxlQUFKLEVBQXFCO0FBQ25CZixxQkFBV08sUUFBWCxDQUFvQnJJLFlBQXBCO0FBQ0QsU0FGRCxNQUVPO0FBQ0w4SCxxQkFBV08sUUFBWCxDQUFvQnBJLGNBQXBCO0FBQ0Q7O0FBRUQ7QUFDQTZILG1CQUFXRyxJQUFYLENBQWdCWSxrQkFBa0I1SCxnQkFBbEIsR0FBcUNDLGtCQUFyRCxFQUF5RTBHLElBQXpFOztBQUVBO0FBQ0EsWUFBSXpLLE9BQU8yRixNQUFQLENBQWNwRSw0QkFBbEIsRUFBZ0Q7QUFDOUMzQixZQUFFOEssV0FBRixFQUFlakQsSUFBZjtBQUNBLGNBQUksQ0FBQ3pILE9BQU8yRixNQUFQLENBQWNuRSwwQkFBbkIsRUFBK0M7QUFDN0M7QUFDQW1KLHVCQUFXRyxJQUFYLENBQWdCckgsUUFBaEIsRUFBMEJnRSxJQUExQixDQUErQjtBQUM3Qm1FLHdCQUFVLENBRG1CO0FBRTdCQyx3QkFBVSxvQkFBVztBQUNuQmxCLDJCQUFXTyxRQUFYLENBQW9CdEksYUFBcEI7QUFDRDtBQUo0QixhQUEvQjtBQU1ELFdBUkQsTUFRTztBQUNMK0gsdUJBQVdPLFFBQVgsQ0FBb0J0SSxhQUFwQjtBQUNEO0FBQ0QrSCxxQkFBV0csSUFBWCxDQUFnQixPQUFoQixFQUF5QlIsSUFBekIsQ0FBOEIsVUFBOUIsRUFBMEMsSUFBMUM7QUFDQUsscUJBQVdHLElBQVgsQ0FBZ0JuSCxVQUFoQixFQUE0QjhHLElBQTVCO0FBQ0FFLHFCQUFXRyxJQUFYLENBQWdCN0csZ0JBQWhCLEVBQWtDNkQsTUFBbEMsQ0FBeUMsR0FBekMsRUFBOENOLEdBQUdaLEdBQUgsRUFBTyxDQUFQLENBQTlDO0FBQ0ErRCxxQkFBV0csSUFBWCxDQUFnQjVHLGdCQUFoQixFQUFrQzRELE1BQWxDLENBQXlDLEdBQXpDLEVBQThDTixHQUFHWixHQUFILEVBQU8sQ0FBUCxDQUE5QztBQUNBLGNBQUksQ0FBQytELFdBQVdHLElBQVgsQ0FBZ0I1RyxnQkFBaEIsRUFBa0NvQyxNQUF2QyxFQUErQ2tCLEdBQUdaLEdBQUgsRUFBTyxDQUFQLEVBQVVNLEtBQVYsQ0FBaUIsSUFBakIsRUFBdUIsRUFBdkIsRUFqQkQsQ0FpQjZCO0FBQzVFLFNBbEJELE1Ba0JPO0FBQ0xNLGFBQUdaLEdBQUgsRUFBTyxDQUFQLEVBQVVNLEtBQVYsQ0FBaUIsSUFBakIsRUFBdUIsRUFBdkIsRUFESyxDQUN1QjtBQUM1Qk0sYUFBR1osR0FBSCxFQUFPLENBQVAsRUFBVU0sS0FBVixDQUFpQixJQUFqQixFQUF1QixFQUF2QixFQUZLLENBRXVCO0FBQzdCOztBQUVEVixpQkFBU0MsTUFBVCxDQUFnQk0sWUFBaEIsQ0FBOEJILEdBQTlCLEVBQW1DN0csV0FBV0EsUUFBUWlLLFFBQW5CLEdBQThCakssUUFBUWlLLFFBQXRDLEdBQWlELFlBQVksQ0FBRSxDQUFsRztBQUNELE9BOVNhOztBQWdUZDtBQUNBL0gsb0JBQWMsc0JBQVM2SixVQUFULEVBQXFCL0wsT0FBckIsRUFBOEI7QUFDMUMsWUFBSTZHLEdBQUosRUFBU1csUUFBVCxFQUFtQkMsRUFBbkI7QUFDQVosY0FBTUosU0FBU0MsTUFBVCxDQUFnQkMsTUFBaEIsQ0FBd0IsQ0FBeEIsQ0FBTixDQUYwQyxDQUVSO0FBQ2xDYSxtQkFBV2YsU0FBU0MsTUFBVCxDQUFnQlcsV0FBM0IsQ0FIMEMsQ0FHRjtBQUN4Q0ksYUFBS0QsUUFBTCxDQUowQyxDQUkzQjs7QUFFZixZQUFJd0Usa0JBQWtCbk0sRUFBRUEsRUFBRWtNLFVBQUYsRUFBY2xCLE9BQWQsQ0FBc0JwSCxTQUF0QixFQUFpQyxDQUFqQyxDQUFGLENBQXRCO0FBQUEsWUFDSXZCLGVBQWtCOEosZ0JBQWdCQyxJQUFoQixDQUFxQnhJLFNBQXJCLENBRHRCO0FBQUEsWUFFSXlJLGVBQWtCRixnQkFBZ0JqQixJQUFoQixDQUFxQixlQUFyQixDQUZ0Qjs7QUFJQTtBQUNBO0FBQ0EsWUFBSTlLLE9BQU8yRixNQUFQLENBQWN4RSxpQkFBZCxJQUFtQzhLLGFBQWEzRixNQUFiLEtBQXdCLENBQS9ELEVBQWtFO0FBQ2hFLGlCQUFPLEtBQVA7QUFDRDs7QUFFRCxZQUFJckUsYUFBYXFFLE1BQWpCLEVBQXlCO0FBQ3ZCeUYsMEJBQWdCM0IsT0FBaEIsQ0FBd0IsR0FBeEIsRUFBNkIsWUFBVTtBQUNyQ25JLHlCQUFhNkksSUFBYixDQUFrQjVHLGdCQUFsQixFQUFvQ3VHLElBQXBDLEdBQTJDeUIsR0FBM0MsR0FBaURwRSxNQUFqRCxDQUF3RCxHQUF4RCxFQUE2RE4sR0FBR1osR0FBSCxFQUFPLENBQVAsQ0FBN0Q7QUFDQSxnQkFBSSxDQUFDM0UsYUFBYTZJLElBQWIsQ0FBa0I1RyxnQkFBbEIsRUFBb0N1RyxJQUFwQyxHQUEyQ3lCLEdBQTNDLEdBQWlENUYsTUFBdEQsRUFBOERrQixHQUFHWixHQUFILEVBQU8sQ0FBUCxFQUFVTSxLQUFWLENBQWlCLElBQWpCLEVBQXVCLEVBQXZCLEVBRnpCLENBRXFEO0FBQzNGLFdBSEQ7QUFJRCxTQUxELE1BS087QUFDTE0sYUFBR1osR0FBSCxFQUFPLENBQVAsRUFBVU0sS0FBVixDQUFpQixJQUFqQixFQUF1QixFQUF2QixFQURLLENBQ3VCO0FBQzVCbEgsaUJBQU95RyxNQUFQLENBQWN0RSxZQUFkLENBQTJCLEVBQUM2SCxVQUFVaEssT0FBTzJGLE1BQVAsQ0FBYy9ELGtCQUFkLENBQWlDTyxZQUE1QyxFQUEzQjtBQUNEOztBQUVEcUUsaUJBQVNDLE1BQVQsQ0FBZ0JNLFlBQWhCLENBQThCSCxHQUE5QixFQUFtQzdHLFdBQVdBLFFBQVFpSyxRQUFuQixHQUE4QmpLLFFBQVFpSyxRQUF0QyxHQUFpRCxZQUFZLENBQUUsQ0FBbEc7QUFDRCxPQTVVYTs7QUE4VWQ7QUFDQTlILHNCQUFnQix3QkFBU2lLLFVBQVQsRUFBcUJwTSxPQUFyQixFQUE4QjtBQUM1QyxZQUFJNkcsR0FBSixFQUFTVyxRQUFULEVBQW1CQyxFQUFuQjtBQUNBWixjQUFNSixTQUFTQyxNQUFULENBQWdCQyxNQUFoQixDQUF3QixDQUF4QixDQUFOLENBRjRDLENBRVY7QUFDbENhLG1CQUFXZixTQUFTQyxNQUFULENBQWdCVyxXQUEzQixDQUg0QyxDQUdKO0FBQ3hDSSxhQUFLRCxRQUFMLENBSjRDLENBSTdCOztBQUVmLFlBQUlvRCxhQUFhL0ssRUFBRUEsRUFBRXVNLFVBQUYsRUFBY3ZCLE9BQWQsQ0FBc0JwSCxTQUF0QixFQUFpQyxDQUFqQyxDQUFGLENBQWpCO0FBQUEsWUFDSTRJLFlBQWF6QixXQUFXRyxJQUFYLENBQWdCbkgsVUFBaEIsQ0FEakI7O0FBR0E7QUFDQSxZQUFJeUksVUFBVUMsR0FBVixDQUFjLFNBQWQsTUFBNkIsT0FBakMsRUFBMkM7QUFDekMxQixxQkFBV0csSUFBWCxDQUFnQm5ILFVBQWhCLEVBQTRCeUcsT0FBNUIsQ0FBb0MsR0FBcEMsRUFBeUMsWUFBVTtBQUNqRE8sdUJBQVdKLFdBQVgsQ0FBdUIxSCxZQUF2QixFQUFxQzBILFdBQXJDLENBQWlEekgsY0FBakQsRUFBaUV5SCxXQUFqRSxDQUE2RTNILGFBQTdFO0FBQ0ErSCx1QkFBV0csSUFBWCxDQUFnQm5ILGFBQWEsSUFBYixHQUFvQkMsU0FBcEMsRUFBK0M2RCxJQUEvQztBQUNBa0QsdUJBQVdHLElBQVgsQ0FBZ0JySCxRQUFoQixFQUEwQmdILElBQTFCO0FBQ0FFLHVCQUFXRyxJQUFYLENBQWdCcEgsT0FBaEIsRUFBeUI2RyxXQUF6QixDQUFxQ3hILG9CQUFyQyxFQUEyRHdILFdBQTNELENBQXVFdkgsc0JBQXZFO0FBQ0EySCx1QkFBV0csSUFBWCxDQUFnQixPQUFoQixFQUF5QlIsSUFBekIsQ0FBOEIsVUFBOUIsRUFBMEMsS0FBMUM7QUFDQUssdUJBQVdHLElBQVgsQ0FBZ0JySCxRQUFoQixFQUEwQnFFLE1BQTFCLENBQWlDLEdBQWpDLEVBQXNDTixHQUFHWixHQUFILEVBQU8sQ0FBUCxDQUF0QyxFQU5pRCxDQU1DO0FBQ2xEK0QsdUJBQVdHLElBQVgsQ0FBZ0I5RyxlQUFoQixFQUFpQzhELE1BQWpDLENBQXdDLEdBQXhDLEVBQTZDTixHQUFHWixHQUFILEVBQU8sQ0FBUCxDQUE3QztBQUNBK0QsdUJBQVdHLElBQVgsQ0FBZ0I3RyxnQkFBaEIsRUFBa0N3RCxJQUFsQzs7QUFFQTtBQUNBLGdCQUFJa0QsV0FBV3hLLElBQVgsQ0FBZ0IsSUFBaEIsS0FBeUIsV0FBN0IsRUFBMEM7QUFDeEN3Syx5QkFBV0csSUFBWCxDQUFnQjVHLGdCQUFoQixFQUFrQ3VHLElBQWxDO0FBQ0QsYUFGRCxNQUVPO0FBQ0xFLHlCQUFXRyxJQUFYLENBQWdCNUcsZ0JBQWhCLEVBQWtDdUQsSUFBbEM7QUFDRDtBQUNGLFdBaEJEOztBQWtCQTtBQUNELFNBcEJELE1Bb0JPO0FBQ0wsY0FBSTZFLGVBQWUzQixXQUFXNEIsSUFBWCxDQUFnQi9JLFNBQWhCLENBQW5COztBQUVBbUgscUJBQVdQLE9BQVgsQ0FBbUIsR0FBbkIsRUFBd0IsWUFBVztBQUNqQ2tDLHlCQUFhL0IsV0FBYixDQUF5QjFILFlBQXpCLEVBQXVDMEgsV0FBdkMsQ0FBbUR6SCxjQUFuRCxFQUFtRXlILFdBQW5FLENBQStFM0gsYUFBL0U7QUFDQTBKLHlCQUFheEIsSUFBYixDQUFrQm5ILGFBQWEsSUFBYixHQUFvQkMsU0FBdEMsRUFBaUQ2RCxJQUFqRDtBQUNBNkUseUJBQWF4QixJQUFiLENBQWtCckgsUUFBbEIsRUFBNEJnSCxJQUE1QjtBQUNBNkIseUJBQWF4QixJQUFiLENBQWtCcEgsT0FBbEIsRUFBMkI2RyxXQUEzQixDQUF1Q3hILG9CQUF2QyxFQUE2RHdILFdBQTdELENBQXlFdkgsc0JBQXpFO0FBQ0FzSix5QkFBYXhCLElBQWIsQ0FBa0IsT0FBbEIsRUFBMkJSLElBQTNCLENBQWdDLFVBQWhDLEVBQTRDLEtBQTVDO0FBQ0FnQyx5QkFBYXhCLElBQWIsQ0FBa0I3RyxnQkFBbEIsRUFBb0N3RCxJQUFwQztBQUNBNkUseUJBQWF4QixJQUFiLENBQWtCOUcsZUFBbEIsRUFBbUN5RyxJQUFuQzs7QUFFQSxnQkFBSTZCLGFBQWFuTSxJQUFiLENBQWtCLElBQWxCLEtBQTJCLFdBQS9CLEVBQTRDO0FBQzFDbU0sMkJBQWF4QixJQUFiLENBQWtCNUcsZ0JBQWxCLEVBQW9DdUcsSUFBcEM7QUFDRCxhQUZELE1BRU87QUFDTDZCLDJCQUFheEIsSUFBYixDQUFrQjVHLGdCQUFsQixFQUFvQ3VELElBQXBDO0FBQ0Q7O0FBRUQ2RSx5QkFBYXhFLE1BQWIsQ0FBb0IsR0FBcEIsRUFBeUJOLEdBQUdaLEdBQUgsRUFBTyxDQUFQLENBQXpCO0FBQ0FZLGVBQUdaLEdBQUgsRUFBTyxDQUFQLEVBQVVNLEtBQVYsQ0FBaUIsSUFBakIsRUFBdUIsRUFBdkIsRUFoQmlDLENBZ0JMO0FBQzdCLFdBakJEO0FBa0JEOztBQUVEVixpQkFBU0MsTUFBVCxDQUFnQk0sWUFBaEIsQ0FBOEJILEdBQTlCLEVBQW1DN0csV0FBV0EsUUFBUWlLLFFBQW5CLEdBQThCakssUUFBUWlLLFFBQXRDLEdBQWlELFlBQVksQ0FBRSxDQUFsRztBQUNELE9BcllhOztBQXVZZDtBQUNBN0gsb0JBQWMsc0JBQVNwQyxPQUFULEVBQWtCO0FBQzlCLFlBQUk2RyxHQUFKLEVBQVNXLFFBQVQsRUFBbUJDLEVBQW5CO0FBQ0FaLGNBQU1KLFNBQVNDLE1BQVQsQ0FBZ0JDLE1BQWhCLENBQXdCLENBQXhCLENBQU4sQ0FGOEIsQ0FFSTtBQUNsQ2EsbUJBQVdmLFNBQVNDLE1BQVQsQ0FBZ0JXLFdBQTNCLENBSDhCLENBR1U7QUFDeENJLGFBQUtELFFBQUwsQ0FKOEIsQ0FJZjs7QUFFZixZQUFJaUYsUUFBZTVNLEVBQUVNLFdBQVcsR0FBWCxHQUFpQjJELFFBQW5CLEVBQTZCeUMsTUFBaEQ7QUFBQSxZQUNJbUcsZUFBZUQsS0FEbkI7QUFFQSxZQUFJeE0sT0FBTzJGLE1BQVAsQ0FBY3JFLGlCQUFsQixFQUFxQztBQUNuQ21MLHlCQUFlLENBQUNELFFBQVFuRyxhQUFULEVBQXdCcUcsT0FBeEIsQ0FBZ0MsQ0FBaEMsSUFBbUMsR0FBbkMsR0FBeUMsR0FBeEQ7QUFDRDs7QUFFRCxZQUFJMU0sT0FBTzJGLE1BQVAsQ0FBY3ZFLFlBQWxCLEVBQWdDO0FBQzlCeEIsWUFBRThFLFVBQUYsRUFBYzhGLE1BQWQ7QUFDRCxTQUZELE1BRU87QUFDTDVLLFlBQUU4RSxhQUFhLE9BQWYsRUFBd0JnRCxJQUF4QixDQUE2QjFILE9BQU8yRixNQUFQLENBQWM5RSxpQkFBZCxDQUN4QjhHLE9BRHdCLENBQ2hCLFFBRGdCLEVBQ044RSxZQURNLEVBQ1E5RSxPQURSLENBQ2dCLFFBRGhCLEVBQzBCdEIsYUFEMUIsQ0FBN0I7QUFFRDs7QUFFRCxZQUFJckcsT0FBTzJGLE1BQVAsQ0FBY3RFLGNBQWxCLEVBQWtDO0FBQ2hDekIsWUFBRStFLFVBQUYsRUFBYzZGLE1BQWQ7QUFDRCxTQUZELE1BRU87QUFDTCxjQUFJbUMsU0FBWSxDQUNWOUcsV0FBVytCLElBQVgsQ0FBZ0JnRixNQUROLEVBQ2M7QUFDeEIvRyxxQkFBVytCLElBQVgsQ0FBZ0JpRixNQUZOLEVBRWM7QUFDeEJoSCxxQkFBVytCLElBQVgsQ0FBZ0JrRixNQUhOLEVBR2M7QUFDeEJqSCxxQkFBVytCLElBQVgsQ0FBZ0JtRixNQUpOLEVBSWM7QUFDeEJsSCxxQkFBVytCLElBQVgsQ0FBZ0JvRixNQUxOLENBS2M7QUFMZCxXQUFoQjtBQUFBLGNBT0lDLFlBQVlqTixPQUFPeUcsTUFBUCxDQUFjeUcsY0FBZCxDQUE2QlYsS0FBN0IsQ0FQaEI7QUFBQSxjQVFJVyxZQUFZdk4sRUFBRXdOLFNBQUYsQ0FBWUgsU0FBWixJQUF5Qk4sT0FBT00sU0FBUCxDQUF6QixHQUE2QyxFQVI3RDs7QUFVQXJOLFlBQUUrRSxhQUFhLE9BQWYsRUFBd0IrQyxJQUF4QixDQUE2QnlGLFNBQTdCO0FBQ0F2TixZQUFFK0UsVUFBRixFQUFjdUcsUUFBZCxDQUF1QixVQUFVK0IsU0FBakM7QUFDRDs7QUFFRG5JLGtCQUFVc0YsT0FBVixDQUFrQixHQUFsQixFQUF1QixZQUFXO0FBQ2hDO0FBQ0EsY0FBSXBLLE9BQU8yRixNQUFQLENBQWNsRSwyQkFBbEIsRUFBK0M7QUFDN0M3QixjQUFFTSxXQUFXLGVBQVgsR0FBNkJpRSxZQUE3QixHQUE0QyxLQUE1QyxHQUFvRGpFLFFBQXBELEdBQStELEdBQS9ELEdBQXFFb0QsY0FBdkUsRUFBdUZtRSxJQUF2RjtBQUNBN0gsY0FBRU0sV0FBVyxHQUFYLEdBQWlCc0QsU0FBakIsR0FBNkIsSUFBN0IsR0FBb0N0RCxRQUFwQyxHQUErQyxHQUEvQyxHQUFxRHVELFFBQXJELEdBQWdFLElBQWhFLEdBQXVFdkQsUUFBdkUsR0FBa0YsR0FBbEYsR0FBd0Z5RCxVQUExRixFQUFzRzhHLElBQXRHO0FBQ0ExRix5QkFBYWtELE1BQWIsQ0FBb0JySSxFQUFFTSxXQUFXLEdBQVgsR0FBaUJxRCxVQUFuQixDQUFwQixFQUFvRHVFLE1BQXBELENBQTJELEdBQTNELEVBQWdFTixHQUFHWixHQUFILEVBQU8sQ0FBUCxDQUFoRTtBQUNELFdBSkQsTUFJTztBQUNMN0IseUJBQWErQyxNQUFiLENBQW9CLEdBQXBCLEVBQXlCTixHQUFHWixHQUFILEVBQU8sQ0FBUCxDQUF6QixFQURLLENBQ2dDO0FBQ3RDO0FBQ0YsU0FURDs7QUFXQUosaUJBQVNDLE1BQVQsQ0FBZ0JNLFlBQWhCLENBQThCSCxHQUE5QixFQUFtQzdHLFdBQVdBLFFBQVFpSyxRQUFuQixHQUE4QmpLLFFBQVFpSyxRQUF0QyxHQUFpRCxZQUFZLENBQUUsQ0FBbEc7O0FBRUEsWUFBSWhLLE9BQU8yRixNQUFQLENBQWN2RCxNQUFkLElBQ0FwQyxPQUFPMkYsTUFBUCxDQUFjdkQsTUFBZCxDQUFxQkUsY0FEekIsRUFDeUM7QUFDdkN0QyxpQkFBTzJGLE1BQVAsQ0FBY3ZELE1BQWQsQ0FBcUJFLGNBQXJCLENBQW9DNEUsS0FBcEMsQ0FBMkMsSUFBM0MsRUFBaUQsQ0FBQztBQUNoRGIsMkJBQWVBLGFBRGlDO0FBRWhEbUcsbUJBQU9BO0FBRnlDLFdBQUQsQ0FBakQ7QUFJRDtBQUNGLE9BaGNhOztBQWtjZDtBQUNBYixzQkFBZ0Isd0JBQVNSLFdBQVQsRUFBc0JJLGVBQXRCLEVBQXVDdkMsU0FBdkMsRUFBa0Q7QUFDaEUsWUFBS0EsU0FBTCxFQUFpQjtBQUNmLGlCQUFPcEosRUFBRXlOLE9BQUYsQ0FBVTlCLGdCQUFnQixDQUFoQixDQUFWLEVBQThCSixXQUE5QixJQUE2QyxDQUFDLENBQXJEO0FBQ0QsU0FGRCxNQUVPO0FBQ0w7QUFDQSxpQkFBUXZMLEVBQUV1TCxXQUFGLEVBQWVtQyxHQUFmLENBQW1CL0IsZUFBbkIsRUFBb0NqRixNQUFwQyxLQUErQyxDQUEvQyxJQUFvRDFHLEVBQUUyTCxlQUFGLEVBQW1CK0IsR0FBbkIsQ0FBdUJuQyxXQUF2QixFQUFvQzdFLE1BQXBDLEtBQStDLENBQTNHO0FBQ0Q7QUFDRixPQTFjYTs7QUE0Y2Q7QUFDQTRHLHNCQUFnQix3QkFBU0ssY0FBVCxFQUF5QjtBQUN2QyxZQUFJQyxVQUFVLENBQUNELGlCQUFpQmxILGFBQWxCLEVBQWlDcUcsT0FBakMsQ0FBeUMsQ0FBekMsQ0FBZDtBQUFBLFlBQ0llLFFBQVUsSUFEZDs7QUFHQSxZQUFJek4sT0FBT3lHLE1BQVAsQ0FBY2lILE9BQWQsQ0FBc0IsQ0FBdEIsRUFBeUIsSUFBekIsRUFBK0JGLE9BQS9CLENBQUosRUFBNkM7QUFDM0NDLGtCQUFRLENBQVI7QUFDRCxTQUZELE1BRU8sSUFBSXpOLE9BQU95RyxNQUFQLENBQWNpSCxPQUFkLENBQXNCLElBQXRCLEVBQTRCLElBQTVCLEVBQWtDRixPQUFsQyxDQUFKLEVBQWdEO0FBQ3JEQyxrQkFBUSxDQUFSO0FBQ0QsU0FGTSxNQUVBLElBQUl6TixPQUFPeUcsTUFBUCxDQUFjaUgsT0FBZCxDQUFzQixJQUF0QixFQUE0QixJQUE1QixFQUFrQ0YsT0FBbEMsQ0FBSixFQUFnRDtBQUNyREMsa0JBQVEsQ0FBUjtBQUNELFNBRk0sTUFFQSxJQUFJek4sT0FBT3lHLE1BQVAsQ0FBY2lILE9BQWQsQ0FBc0IsSUFBdEIsRUFBNEIsSUFBNUIsRUFBa0NGLE9BQWxDLENBQUosRUFBZ0Q7QUFDckRDLGtCQUFRLENBQVI7QUFDRCxTQUZNLE1BRUEsSUFBSXpOLE9BQU95RyxNQUFQLENBQWNpSCxPQUFkLENBQXNCLElBQXRCLEVBQTRCLElBQTVCLEVBQWtDRixPQUFsQyxDQUFKLEVBQWdEO0FBQ3JEQyxrQkFBUSxDQUFSO0FBQ0Q7O0FBRUQsZUFBT0EsS0FBUDtBQUNELE9BOWRhOztBQWdlZDtBQUNBQyxlQUFTLGlCQUFTekQsS0FBVCxFQUFnQmlDLEdBQWhCLEVBQXFCeUIsS0FBckIsRUFBNEI7QUFDbkMsZUFBUUEsU0FBUzFELEtBQVQsSUFBa0IwRCxTQUFTekIsR0FBbkM7QUFDRDtBQW5lYSxLQUFoQjs7QUFzZUFsTSxXQUFPNE4sSUFBUCxHQUFjLFlBQVc7QUFDdkI7QUFDQTVOLGFBQU95RyxNQUFQLENBQWM1RSxTQUFkLENBQXdCcUYsS0FBeEIsQ0FBK0IsSUFBL0IsRUFBcUMsQ0FBQyxFQUFDOEMsVUFBVWhLLE9BQU8yRixNQUFQLENBQWMvRCxrQkFBZCxDQUFpQ0MsU0FBNUMsRUFBRCxDQUFyQzs7QUFFQTtBQUNBK0MsbUJBQWFpSixFQUFiLENBQWdCLE9BQWhCLEVBQXlCLFVBQVNDLENBQVQsRUFBWTtBQUNuQ0EsVUFBRUMsY0FBRjs7QUFFQSxZQUFJLENBQUMsS0FBS0MsUUFBTixJQUFrQixDQUFDcE8sRUFBRSxJQUFGLEVBQVFxTyxRQUFSLENBQWlCLFVBQWpCLENBQXZCLEVBQXFEO0FBQ25Eak8saUJBQU95RyxNQUFQLENBQWMzRSxTQUFkLENBQXdCb0YsS0FBeEIsQ0FBK0IsSUFBL0IsRUFBcUMsQ0FBQyxFQUFDOEMsVUFBVWhLLE9BQU8yRixNQUFQLENBQWMvRCxrQkFBZCxDQUFpQ0UsU0FBNUMsRUFBRCxDQUFyQztBQUNEO0FBQ0YsT0FORDs7QUFRQTtBQUNBbEMsUUFBRU0sV0FBVyxHQUFYLEdBQWlCaUUsWUFBbkIsRUFBaUMwSixFQUFqQyxDQUFvQyxPQUFwQyxFQUE2QyxVQUFTQyxDQUFULEVBQVk7QUFDdkRBLFVBQUVDLGNBQUY7QUFDQS9OLGVBQU95RyxNQUFQLENBQWMxRSxTQUFkLENBQXdCLElBQXhCLEVBQThCLEVBQUNpSSxVQUFVaEssT0FBTzJGLE1BQVAsQ0FBYy9ELGtCQUFkLENBQWlDRyxTQUE1QyxFQUE5QjtBQUNELE9BSEQ7O0FBS0E7QUFDQW5DLFFBQUVNLFdBQVcsR0FBWCxHQUFpQjhELGVBQW5CLEVBQW9DNkosRUFBcEMsQ0FBdUMsT0FBdkMsRUFBZ0QsVUFBU0MsQ0FBVCxFQUFZO0FBQzFEQSxVQUFFQyxjQUFGO0FBQ0EvTixlQUFPeUcsTUFBUCxDQUFjekUsV0FBZCxDQUEwQixJQUExQixFQUFnQyxFQUFDZ0ksVUFBVWhLLE9BQU8yRixNQUFQLENBQWMvRCxrQkFBZCxDQUFpQ0ksV0FBNUMsRUFBaEM7QUFDRCxPQUhEOztBQUtBO0FBQ0FwQyxRQUFFTSxXQUFXLEdBQVgsR0FBaUJnRSxnQkFBbkIsRUFBcUMySixFQUFyQyxDQUF3QyxPQUF4QyxFQUFpRCxVQUFTQyxDQUFULEVBQVk7QUFDM0RBLFVBQUVDLGNBQUY7QUFDQS9OLGVBQU95RyxNQUFQLENBQWN2RSxjQUFkLENBQTZCLElBQTdCLEVBQW1DLEVBQUM4SCxVQUFVaEssT0FBTzJGLE1BQVAsQ0FBYy9ELGtCQUFkLENBQWlDTSxjQUE1QyxFQUFuQztBQUNELE9BSEQ7O0FBS0E7QUFDQXRDLFFBQUVNLFdBQVcsR0FBWCxHQUFpQitELGdCQUFuQixFQUFxQzRKLEVBQXJDLENBQXdDLE9BQXhDLEVBQWlELFVBQVNDLENBQVQsRUFBWTtBQUMzREEsVUFBRUMsY0FBRjtBQUNBL04sZUFBT3lHLE1BQVAsQ0FBY3hFLFlBQWQsQ0FBMkIsSUFBM0IsRUFBaUMsRUFBQytILFVBQVVoSyxPQUFPMkYsTUFBUCxDQUFjL0Qsa0JBQWQsQ0FBaUNLLFlBQTVDLEVBQWpDO0FBQ0QsT0FIRDs7QUFLQTtBQUNBLFVBQUlpTSxRQUFRak8sU0FBU0UsSUFBVCxDQUFjLElBQWQsSUFBc0IsT0FBbEM7QUFDQTBFLGdCQUFVMUUsSUFBVixDQUFlLElBQWYsRUFBcUIrTixLQUFyQjtBQUNBak8sZUFBU0UsSUFBVCxDQUFjO0FBQ1osMkJBQW1CK04sS0FEUDtBQUVaLHFCQUFhLFFBRkQ7QUFHWix5QkFBaUIsV0FITDtBQUlaLGdCQUFRO0FBSkksT0FBZDtBQU1BdE8sUUFBRXdFLGVBQWUsZ0JBQWpCLEVBQW1DakUsSUFBbkMsQ0FBd0MsTUFBeEMsRUFBZ0QsUUFBaEQ7QUFDRCxLQS9DRDs7QUFpREFILFdBQU80TixJQUFQO0FBQ0QsR0FqdEJEOztBQW10QkFoTyxJQUFFdU8sRUFBRixDQUFLdE8sU0FBTCxHQUFpQixVQUFTRSxPQUFULEVBQWtCO0FBQ2pDLFdBQU8sS0FBS3lMLElBQUwsQ0FBVSxZQUFXO0FBQzFCLFVBQUk0QyxjQUFjeE8sRUFBRSxJQUFGLEVBQVF5TyxJQUFSLENBQWEsV0FBYixDQUFsQixFQUE2QztBQUMzQyxZQUFJck8sU0FBUyxJQUFJSixFQUFFQyxTQUFOLENBQWdCLElBQWhCLEVBQXNCRSxPQUF0QixDQUFiO0FBQ0FILFVBQUUsSUFBRixFQUFReU8sSUFBUixDQUFhLFdBQWIsRUFBMEJyTyxNQUExQjtBQUNEO0FBQ0YsS0FMTSxDQUFQO0FBTUQsR0FQRDtBQVFELENBNXRCRCxFQTR0QkdzTyxNQTV0QkgiLCJmaWxlIjoic2xpY2tRdWl6LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBTbGlja1F1aXogalF1ZXJ5IFBsdWdpblxuICogaHR0cDovL2dpdGh1Yi5jb20vamV3bG9mdGhlbG90dXMvU2xpY2tRdWl6XG4gKlxuICogQHVwZGF0ZWQgT2N0b2JlciAyNSwgMjAxNFxuICogQHZlcnNpb24gMS41LjIwXG4gKlxuICogQGF1dGhvciBKdWxpZSBDYW1lcm9uIC0gaHR0cDovL3d3dy5qdWxpZWNhbWVyb24uY29tXG4gKiBAY29weXJpZ2h0IChjKSAyMDEzIFF1aWNrZW4gTG9hbnMgLSBodHRwOi8vd3d3LnF1aWNrZW5sb2Fucy5jb21cbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbihmdW5jdGlvbigkKXtcbiAgJC5zbGlja1F1aXogPSBmdW5jdGlvbihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdmFyIHBsdWdpbiAgID0gdGhpcyxcbiAgICAgICAgJGVsZW1lbnQgPSAkKGVsZW1lbnQpLFxuICAgICAgICBfZWxlbWVudCA9ICcjJyArICRlbGVtZW50LmF0dHIoJ2lkJyksXG5cbiAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgY2hlY2tBbnN3ZXJUZXh0OiAgJ0NoZWNrIE15IEFuc3dlciEnLFxuICAgICAgICAgIG5leHRRdWVzdGlvblRleHQ6ICdOZXh0ICZyYXF1bzsnLFxuICAgICAgICAgIGJhY2tCdXR0b25UZXh0OiAnJyxcbiAgICAgICAgICBjb21wbGV0ZVF1aXpUZXh0OiAnJyxcbiAgICAgICAgICB0cnlBZ2FpblRleHQ6ICcnLFxuICAgICAgICAgIHF1ZXN0aW9uQ291bnRUZXh0OiAnUXVlc3Rpb24gJWN1cnJlbnQgb2YgJXRvdGFsJyxcbiAgICAgICAgICBwcmV2ZW50VW5hbnN3ZXJlZFRleHQ6ICdZb3UgbXVzdCBzZWxlY3QgYXQgbGVhc3Qgb25lIGFuc3dlci4nLFxuICAgICAgICAgIHF1ZXN0aW9uVGVtcGxhdGVUZXh0OiAgJyVjb3VudC4gJXRleHQnLFxuICAgICAgICAgIHNjb3JlVGVtcGxhdGVUZXh0OiAnJXNjb3JlIC8gJXRvdGFsJyxcbiAgICAgICAgICBuYW1lVGVtcGxhdGVUZXh0OiAgJzxzcGFuPlF1aXo6IDwvc3Bhbj4lbmFtZScsXG4gICAgICAgICAgc2tpcFN0YXJ0QnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICBudW1iZXJPZlF1ZXN0aW9uczogbnVsbCxcbiAgICAgICAgICByYW5kb21Tb3J0UXVlc3Rpb25zOiBmYWxzZSxcbiAgICAgICAgICByYW5kb21Tb3J0QW5zd2VyczogZmFsc2UsXG4gICAgICAgICAgcHJldmVudFVuYW5zd2VyZWQ6IGZhbHNlLFxuICAgICAgICAgIGRpc2FibGVTY29yZTogZmFsc2UsXG4gICAgICAgICAgZGlzYWJsZVJhbmtpbmc6IGZhbHNlLFxuICAgICAgICAgIHNjb3JlQXNQZXJjZW50YWdlOiBmYWxzZSxcbiAgICAgICAgICBwZXJRdWVzdGlvblJlc3BvbnNlTWVzc2FnaW5nOiB0cnVlLFxuICAgICAgICAgIHBlclF1ZXN0aW9uUmVzcG9uc2VBbnN3ZXJzOiBmYWxzZSxcbiAgICAgICAgICBjb21wbGV0aW9uUmVzcG9uc2VNZXNzYWdpbmc6IGZhbHNlLFxuICAgICAgICAgIGRpc3BsYXlRdWVzdGlvbkNvdW50OiB0cnVlLCAgIC8vIERlcHJlY2F0ZT9cbiAgICAgICAgICBkaXNwbGF5UXVlc3Rpb25OdW1iZXI6IHRydWUsICAvLyBEZXByZWNhdGU/XG4gICAgICAgICAgYW5pbWF0aW9uQ2FsbGJhY2tzOiB7IC8vIG9ubHkgZm9yIHRoZSBtZXRob2RzIHRoYXQgaGF2ZSBqUXVlcnkgYW5pbWF0aW9ucyBvZmZlcmluZyBjYWxsYmFja1xuICAgICAgICAgICAgc2V0dXBRdWl6OiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgICAgIHN0YXJ0UXVpejogZnVuY3Rpb24gKCkge30sXG4gICAgICAgICAgICByZXNldFF1aXo6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgICAgICAgY2hlY2tBbnN3ZXI6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgICAgICAgbmV4dFF1ZXN0aW9uOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgICAgIGJhY2tUb1F1ZXN0aW9uOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgICAgIGNvbXBsZXRlUXVpejogZnVuY3Rpb24gKCkge31cbiAgICAgICAgICB9LFxuICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgb25TdGFydFF1aXo6IGZ1bmN0aW9uIChvcHRpb25zKSB7fSxcbiAgICAgICAgICAgIG9uQ29tcGxldGVRdWl6OiBmdW5jdGlvbiAob3B0aW9ucykge30gIC8vIHJlc2VydmVkOiBvcHRpb25zLnF1ZXN0aW9uQ291bnQsIG9wdGlvbnMuc2NvcmVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gQ2xhc3MgTmFtZSBTdHJpbmdzIChVc2VkIGZvciBidWlsZGluZyBxdWl6IGFuZCBmb3Igc2VsZWN0b3JzKVxuICAgICAgICBxdWVzdGlvbkNvdW50Q2xhc3MgICAgID0gJ3F1ZXN0aW9uQ291bnQnLFxuICAgICAgICBxdWVzdGlvbkdyb3VwQ2xhc3MgICAgID0gJ3F1ZXN0aW9ucycsXG4gICAgICAgIHF1ZXN0aW9uQ2xhc3MgICAgICAgICAgPSAncXVlc3Rpb24nLFxuICAgICAgICBhbnN3ZXJzQ2xhc3MgICAgICAgICAgID0gJ2Fuc3dlcnMnLFxuICAgICAgICByZXNwb25zZXNDbGFzcyAgICAgICAgID0gJ3Jlc3BvbnNlcycsXG4gICAgICAgIGNvbXBsZXRlQ2xhc3MgICAgICAgICAgPSAnY29tcGxldGUnLFxuICAgICAgICBjb3JyZWN0Q2xhc3MgICAgICAgICAgID0gJ2NvcnJlY3RSZXNwb25zZScsXG4gICAgICAgIGluY29ycmVjdENsYXNzICAgICAgICAgPSAnaW5jb3JyZWN0UmVzcG9uc2UnLFxuICAgICAgICBjb3JyZWN0UmVzcG9uc2VDbGFzcyAgID0gJ2NvcnJlY3QnLFxuICAgICAgICBpbmNvcnJlY3RSZXNwb25zZUNsYXNzID0gJ2luY29ycmVjdCcsXG4gICAgICAgIGNoZWNrQW5zd2VyQ2xhc3MgICAgICAgPSAnY2hlY2tBbnN3ZXInLFxuICAgICAgICBuZXh0UXVlc3Rpb25DbGFzcyAgICAgID0gJ25leHRRdWVzdGlvbicsXG4gICAgICAgIGxhc3RRdWVzdGlvbkNsYXNzICAgICAgPSAnbGFzdFF1ZXN0aW9uJyxcbiAgICAgICAgYmFja1RvUXVlc3Rpb25DbGFzcyAgICA9ICdiYWNrVG9RdWVzdGlvbicsXG4gICAgICAgIHRyeUFnYWluQ2xhc3MgICAgICAgICAgPSAndHJ5QWdhaW4nLFxuXG4gICAgICAgIC8vIFN1Yi1RdWl6IC8gU3ViLVF1ZXN0aW9uIENsYXNzIFNlbGVjdG9yc1xuICAgICAgICBfcXVlc3Rpb25Db3VudCAgICAgICAgID0gJy4nICsgcXVlc3Rpb25Db3VudENsYXNzLFxuICAgICAgICBfcXVlc3Rpb25zICAgICAgICAgICAgID0gJy4nICsgcXVlc3Rpb25Hcm91cENsYXNzLFxuICAgICAgICBfcXVlc3Rpb24gICAgICAgICAgICAgID0gJy4nICsgcXVlc3Rpb25DbGFzcyxcbiAgICAgICAgX2Fuc3dlcnMgICAgICAgICAgICAgICA9ICcuJyArIGFuc3dlcnNDbGFzcyxcbiAgICAgICAgX2Fuc3dlciAgICAgICAgICAgICAgICA9ICcuJyArIGFuc3dlcnNDbGFzcyArICcgbGknLFxuICAgICAgICBfcmVzcG9uc2VzICAgICAgICAgICAgID0gJy4nICsgcmVzcG9uc2VzQ2xhc3MsXG4gICAgICAgIF9yZXNwb25zZSAgICAgICAgICAgICAgPSAnLicgKyByZXNwb25zZXNDbGFzcyArICcgbGknLFxuICAgICAgICBfY29ycmVjdCAgICAgICAgICAgICAgID0gJy4nICsgY29ycmVjdENsYXNzLFxuICAgICAgICBfY29ycmVjdFJlc3BvbnNlICAgICAgID0gJy4nICsgY29ycmVjdFJlc3BvbnNlQ2xhc3MsXG4gICAgICAgIF9pbmNvcnJlY3RSZXNwb25zZSAgICAgPSAnLicgKyBpbmNvcnJlY3RSZXNwb25zZUNsYXNzLFxuICAgICAgICBfY2hlY2tBbnN3ZXJCdG4gICAgICAgID0gJy4nICsgY2hlY2tBbnN3ZXJDbGFzcyxcbiAgICAgICAgX25leHRRdWVzdGlvbkJ0biAgICAgICA9ICcuJyArIG5leHRRdWVzdGlvbkNsYXNzLFxuICAgICAgICBfcHJldlF1ZXN0aW9uQnRuICAgICAgID0gJy4nICsgYmFja1RvUXVlc3Rpb25DbGFzcyxcbiAgICAgICAgX3RyeUFnYWluQnRuICAgICAgICAgICA9ICcuJyArIHRyeUFnYWluQ2xhc3MsXG5cbiAgICAgICAgLy8gVG9wIExldmVsIFF1aXogRWxlbWVudCBDbGFzcyBTZWxlY3RvcnNcbiAgICAgICAgX3F1aXpTdGFydGVyICAgICAgICAgICA9IF9lbGVtZW50ICsgJyAuc3RhcnRRdWl6JyxcbiAgICAgICAgX3F1aXpOYW1lICAgICAgICAgICAgICA9IF9lbGVtZW50ICsgJyAucXVpek5hbWUnLFxuICAgICAgICBfcXVpekFyZWEgICAgICAgICAgICAgID0gX2VsZW1lbnQgKyAnIC5xdWl6QXJlYScsXG4gICAgICAgIF9xdWl6UmVzdWx0cyAgICAgICAgICAgPSBfZWxlbWVudCArICcgLnF1aXpSZXN1bHRzJyxcbiAgICAgICAgX3F1aXpSZXN1bHRzQ29weSAgICAgICA9IF9lbGVtZW50ICsgJyAucXVpelJlc3VsdHNDb3B5JyxcbiAgICAgICAgX3F1aXpIZWFkZXIgICAgICAgICAgICA9IF9lbGVtZW50ICsgJyAucXVpekhlYWRlcicsXG4gICAgICAgIF9xdWl6U2NvcmUgICAgICAgICAgICAgPSBfZWxlbWVudCArICcgLnF1aXpTY29yZScsXG4gICAgICAgIF9xdWl6TGV2ZWwgICAgICAgICAgICAgPSBfZWxlbWVudCArICcgLnF1aXpMZXZlbCcsXG5cbiAgICAgICAgLy8gVG9wIExldmVsIFF1aXogRWxlbWVudCBPYmplY3RzXG4gICAgICAgICRxdWl6U3RhcnRlciAgICAgICAgICAgPSAkKF9xdWl6U3RhcnRlciksXG4gICAgICAgICRxdWl6TmFtZSAgICAgICAgICAgICAgPSAkKF9xdWl6TmFtZSksXG4gICAgICAgICRxdWl6QXJlYSAgICAgICAgICAgICAgPSAkKF9xdWl6QXJlYSksXG4gICAgICAgICRxdWl6UmVzdWx0cyAgICAgICAgICAgPSAkKF9xdWl6UmVzdWx0cyksXG4gICAgICAgICRxdWl6UmVzdWx0c0NvcHkgICAgICAgPSAkKF9xdWl6UmVzdWx0c0NvcHkpLFxuICAgICAgICAkcXVpekhlYWRlciAgICAgICAgICAgID0gJChfcXVpekhlYWRlciksXG4gICAgICAgICRxdWl6U2NvcmUgICAgICAgICAgICAgPSAkKF9xdWl6U2NvcmUpLFxuICAgICAgICAkcXVpekxldmVsICAgICAgICAgICAgID0gJChfcXVpekxldmVsKVxuICAgIDtcblxuXG4gICAgLy8gUmVhc3NpZ24gdXNlci1zdWJtaXR0ZWQgZGVwcmVjYXRlZCBvcHRpb25zXG4gICAgdmFyIGRlcE1zZyA9ICcnO1xuXG4gICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuZGlzYWJsZU5leHQgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5wcmV2ZW50VW5hbnN3ZXJlZCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBvcHRpb25zLnByZXZlbnRVbmFuc3dlcmVkID0gb3B0aW9ucy5kaXNhYmxlTmV4dDtcbiAgICAgIH1cbiAgICAgIGRlcE1zZyArPSAnVGhlIFxcJ2Rpc2FibGVOZXh0XFwnIG9wdGlvbiBoYXMgYmVlbiBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIFxcJ3ByZXZlbnRVbmFuc3dlcmVkXFwnIGluIGl0XFwncyBwbGFjZS5cXG5cXG4nO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLmRpc2FibGVSZXNwb25zZU1lc3NhZ2luZyAhPSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnByZXZlbnRVbmFuc3dlcmVkID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG9wdGlvbnMucGVyUXVlc3Rpb25SZXNwb25zZU1lc3NhZ2luZyA9IG9wdGlvbnMuZGlzYWJsZVJlc3BvbnNlTWVzc2FnaW5nO1xuICAgICAgfVxuICAgICAgZGVwTXNnICs9ICdUaGUgXFwnZGlzYWJsZVJlc3BvbnNlTWVzc2FnaW5nXFwnIG9wdGlvbiBoYXMgYmVlbiBkZXByZWNhdGVkLCBwbGVhc2UgdXNlJyArXG4gICAgICAgICAgJyBcXCdwZXJRdWVzdGlvblJlc3BvbnNlTWVzc2FnaW5nXFwnIGFuZCBcXCdjb21wbGV0aW9uUmVzcG9uc2VNZXNzYWdpbmdcXCcgaW4gaXRcXCdzIHBsYWNlLlxcblxcbic7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMucmFuZG9tU29ydCAhPSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnJhbmRvbVNvcnRRdWVzdGlvbnMgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgb3B0aW9ucy5yYW5kb21Tb3J0UXVlc3Rpb25zID0gb3B0aW9ucy5yYW5kb21Tb3J0O1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnJhbmRvbVNvcnRBbnN3ZXJzID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG9wdGlvbnMucmFuZG9tU29ydEFuc3dlcnMgPSBvcHRpb25zLnJhbmRvbVNvcnQ7XG4gICAgICB9XG4gICAgICBkZXBNc2cgKz0gJ1RoZSBcXCdyYW5kb21Tb3J0XFwnIG9wdGlvbiBoYXMgYmVlbiBkZXByZWNhdGVkLCBwbGVhc2UgdXNlJyArXG4gICAgICAgICAgJyBcXCdyYW5kb21Tb3J0UXVlc3Rpb25zXFwnIGFuZCBcXCdyYW5kb21Tb3J0QW5zd2Vyc1xcJyBpbiBpdFxcJ3MgcGxhY2UuXFxuXFxuJztcbiAgICB9XG5cbiAgICBpZiAoZGVwTXNnICE9PSAnJykge1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihkZXBNc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoZGVwTXNnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRW5kIG9mIGRlcHJlY2F0aW9uIHJlYXNzaWdubWVudFxuXG5cbiAgICBwbHVnaW4uY29uZmlnID0gJC5leHRlbmQoZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgLy8gU2V0IHZpYSBqc29uIG9wdGlvbiBvciBxdWl6SlNPTiB2YXJpYWJsZSAoc2VlIHNsaWNrUXVpei1jb25maWcuanMpXG4gICAgdmFyIHF1aXpWYWx1ZXMgPSAocGx1Z2luLmNvbmZpZy5qc29uID8gcGx1Z2luLmNvbmZpZy5qc29uIDogdHlwZW9mIHF1aXpKU09OICE9ICd1bmRlZmluZWQnID8gcXVpekpTT04gOiBudWxsKTtcblxuICAgIC8vIEdldCBxdWVzdGlvbnMsIHBvc3NpYmx5IHNvcnRlZCByYW5kb21seVxuICAgIHZhciBxdWVzdGlvbnMgPSBwbHVnaW4uY29uZmlnLnJhbmRvbVNvcnRRdWVzdGlvbnMgP1xuICAgICAgICBxdWl6VmFsdWVzLnF1ZXN0aW9ucy5zb3J0KGZ1bmN0aW9uKCkgeyByZXR1cm4gKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSktMC41KTsgfSkgOlxuICAgICAgICBxdWl6VmFsdWVzLnF1ZXN0aW9ucztcblxuICAgIC8vIENvdW50IHRoZSBudW1iZXIgb2YgcXVlc3Rpb25zXG4gICAgdmFyIHF1ZXN0aW9uQ291bnQgPSBxdWVzdGlvbnMubGVuZ3RoO1xuXG4gICAgLy8gU2VsZWN0IFggbnVtYmVyIG9mIHF1ZXN0aW9ucyB0byBsb2FkIGlmIG9wdGlvbnMgaXMgc2V0XG4gICAgaWYgKHBsdWdpbi5jb25maWcubnVtYmVyT2ZRdWVzdGlvbnMgJiYgcXVlc3Rpb25Db3VudCA+PSBwbHVnaW4uY29uZmlnLm51bWJlck9mUXVlc3Rpb25zKSB7XG4gICAgICBxdWVzdGlvbnMgPSBxdWVzdGlvbnMuc2xpY2UoMCwgcGx1Z2luLmNvbmZpZy5udW1iZXJPZlF1ZXN0aW9ucyk7XG4gICAgICBxdWVzdGlvbkNvdW50ID0gcXVlc3Rpb25zLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvLyBzb21lIHNwZWNpYWwgcHJpdmF0ZS9pbnRlcm5hbCBtZXRob2RzXG4gICAgdmFyIGludGVybmFsID0ge21ldGhvZDoge1xuICAgICAgLy8gZ2V0IGEga2V5IHdob3NlIG5vdGNoZXMgYXJlIFwicmVzb2x2ZWQgalEgZGVmZXJyZWRcIiBvYmplY3RzOyBvbmUgcGVyIG5vdGNoIG9uIHRoZSBrZXlcbiAgICAgIC8vIHRoaW5rIG9mIHRoZSBrZXkgYXMgYSBob3VzZSBrZXkgd2l0aCBub3RjaGVzIG9uIGl0XG4gICAgICBnZXRLZXk6IGZ1bmN0aW9uIChub3RjaGVzKSB7IC8vIHJldHVybnMgW10sIG5vdGNoZXMgPj0gMVxuICAgICAgICB2YXIga2V5ID0gW107XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxub3RjaGVzOyBpKyspIGtleVtpXSA9ICQuRGVmZXJyZWQgKCk7XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgICB9LFxuXG4gICAgICAvLyBwdXQgdGhlIGtleSBpbiB0aGUgZG9vciwgaWYgYWxsIHRoZSBub3RjaGVzIHBhc3MgdGhlbiB5b3UgY2FuIHR1cm4gdGhlIGtleSBhbmQgXCJnb1wiXG4gICAgICB0dXJuS2V5QW5kR286IGZ1bmN0aW9uIChrZXksIGdvKSB7IC8vIGtleSA9IFtdLCBnbyA9IGZ1bmN0aW9uICgpXG4gICAgICAgIC8vIHdoZW4gYWxsIHRoZSBub3RjaGVzIG9mIHRoZSBrZXkgYXJlIGFjY2VwdGVkIChyZXNvbHZlZCkgdGhlbiB0aGUga2V5IHR1cm5zIGFuZCB0aGUgZW5naW5lIChjYWxsYmFjay9nbykgc3RhcnRzXG4gICAgICAgICQud2hlbi5hcHBseSAobnVsbCwga2V5KS4gdGhlbiAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGdvICgpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIGdldCBvbmUgalFcbiAgICAgIGdldEtleU5vdGNoOiBmdW5jdGlvbiAoa2V5LCBub3RjaCkgeyAvLyBub3RjaCA+PSAxLCBrZXkgPSBbXVxuICAgICAgICAvLyBrZXkgaGFzIHNldmVyYWwgbm90Y2hlcywgbnVtYmVyZWQgYXMgMSwgMiwgMywgLi4uIChubyB6ZXJvIG5vdGNoKVxuICAgICAgICAvLyB3ZSByZXNvbHZlIGFuZCByZXR1cm4gdGhlIFwialEgZGVmZXJyZWRcIiBvYmplY3QgYXQgc3BlY2lmaWVkIG5vdGNoXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAga2V5W25vdGNoLTFdLnJlc29sdmUgKCk7IC8vIGl0IGlzIEFTU1VNRUQgdGhhdCB5b3UgaW5pdGlhdGVkIHRoZSBrZXkgd2l0aCBlbm91Z2ggbm90Y2hlc1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH19O1xuXG4gICAgcGx1Z2luLm1ldGhvZCA9IHtcbiAgICAgIC8vIFNldHMgdXAgdGhlIHF1ZXN0aW9ucyBhbmQgYW5zd2VycyBiYXNlZCBvbiBhYm92ZSBhcnJheVxuICAgICAgc2V0dXBRdWl6OiBmdW5jdGlvbihvcHRpb25zKSB7IC8vIHVzZSAnb3B0aW9ucycgb2JqZWN0IHRvIHBhc3MgYXJnc1xuICAgICAgICB2YXIga2V5LCBrZXlOb3RjaCwga047XG4gICAgICAgIGtleSA9IGludGVybmFsLm1ldGhvZC5nZXRLZXkgKDMpOyAvLyBob3cgbWFueSBub3RjaGVzID09IGhvdyBtYW55IGpRIGFuaW1hdGlvbnMgeW91IHdpbGwgcnVuXG4gICAgICAgIGtleU5vdGNoID0gaW50ZXJuYWwubWV0aG9kLmdldEtleU5vdGNoOyAvLyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIGpRIGFuaW1hdGlvbiBjYWxsYmFjayBmdW5jdGlvblxuICAgICAgICBrTiA9IGtleU5vdGNoOyAvLyB5b3Ugc3BlY2lmeSB0aGUgbm90Y2gsIHlvdSBnZXQgYSBjYWxsYmFjayBmdW5jdGlvbiBmb3IgeW91ciBhbmltYXRpb25cblxuICAgICAgICAkcXVpek5hbWUuaGlkZSgpLmh0bWwocGx1Z2luLmNvbmZpZy5uYW1lVGVtcGxhdGVUZXh0XG4gICAgICAgICAgICAucmVwbGFjZSgnJW5hbWUnLCBxdWl6VmFsdWVzLmluZm8ubmFtZSkgKS5mYWRlSW4oMTAwMCwga04oa2V5LDEpKTtcbiAgICAgICAgJHF1aXpIZWFkZXIuaGlkZSgpLnByZXBlbmQoJCgnPGRpdiBjbGFzcz1cInF1aXpEZXNjcmlwdGlvblwiPicgKyBxdWl6VmFsdWVzLmluZm8ubWFpbiArICc8L2Rpdj4nKSkuZmFkZUluKDEwMDAsIGtOKGtleSwyKSk7XG4gICAgICAgICRxdWl6UmVzdWx0c0NvcHkuYXBwZW5kKHF1aXpWYWx1ZXMuaW5mby5yZXN1bHRzKTtcblxuICAgICAgICAvLyBhZGQgcmV0cnkgYnV0dG9uIHRvIHJlc3VsdHMgdmlldywgaWYgZW5hYmxlZFxuICAgICAgICBpZiAocGx1Z2luLmNvbmZpZy50cnlBZ2FpblRleHQgJiYgcGx1Z2luLmNvbmZpZy50cnlBZ2FpblRleHQgIT09ICcnKSB7XG4gICAgICAgICAgJHF1aXpSZXN1bHRzQ29weS5hcHBlbmQoJzxwPjxhIGNsYXNzPVwiYnV0dG9uICcgKyB0cnlBZ2FpbkNsYXNzICsgJ1wiIGhyZWY9XCIjXCI+JyArIHBsdWdpbi5jb25maWcudHJ5QWdhaW5UZXh0ICsgJzwvYT48L3A+Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXR1cCBxdWVzdGlvbnNcbiAgICAgICAgdmFyIHF1aXogID0gJCgnPG9sIGNsYXNzPVwiJyArIHF1ZXN0aW9uR3JvdXBDbGFzcyArICdcIj48L29sPicpLFxuICAgICAgICAgICAgY291bnQgPSAxO1xuXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBxdWVzdGlvbnMgb2JqZWN0XG4gICAgICAgIGZvciAodmFyIGkgaW4gcXVlc3Rpb25zKSB7XG4gICAgICAgICAgaWYgKHF1ZXN0aW9ucy5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gcXVlc3Rpb25zW2ldO1xuXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25IVE1MID0gJCgnPGxpIGNsYXNzPVwiJyArIHF1ZXN0aW9uQ2xhc3MgKydcIiBpZD1cInF1ZXN0aW9uJyArIChjb3VudCAtIDEpICsgJ1wiPjwvbGk+Jyk7XG5cbiAgICAgICAgICAgIGlmIChwbHVnaW4uY29uZmlnLmRpc3BsYXlRdWVzdGlvbkNvdW50KSB7XG4gICAgICAgICAgICAgIHF1ZXN0aW9uSFRNTC5hcHBlbmQoJzxkaXYgY2xhc3M9XCInICsgcXVlc3Rpb25Db3VudENsYXNzICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgcGx1Z2luLmNvbmZpZy5xdWVzdGlvbkNvdW50VGV4dFxuICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCclY3VycmVudCcsICc8c3BhbiBjbGFzcz1cImN1cnJlbnRcIj4nICsgY291bnQgKyAnPC9zcGFuPicpXG4gICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJyV0b3RhbCcsICc8c3BhbiBjbGFzcz1cInRvdGFsXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uQ291bnQgKyAnPC9zcGFuPicpICsgJzwvZGl2PicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZm9ybWF0UXVlc3Rpb24gPSAnJztcbiAgICAgICAgICAgIGlmIChwbHVnaW4uY29uZmlnLmRpc3BsYXlRdWVzdGlvbk51bWJlcikge1xuICAgICAgICAgICAgICBmb3JtYXRRdWVzdGlvbiA9IHBsdWdpbi5jb25maWcucXVlc3Rpb25UZW1wbGF0ZVRleHRcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCclY291bnQnLCBjb3VudCkucmVwbGFjZSgnJXRleHQnLCBxdWVzdGlvbi5xKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZvcm1hdFF1ZXN0aW9uID0gcXVlc3Rpb24ucTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHF1ZXN0aW9uSFRNTC5hcHBlbmQoJzxoMz4nICsgZm9ybWF0UXVlc3Rpb24gKyAnPC9oMz4nKTtcblxuICAgICAgICAgICAgLy8gQ291bnQgdGhlIG51bWJlciBvZiB0cnVlIHZhbHVlc1xuICAgICAgICAgICAgdmFyIHRydXRocyA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHF1ZXN0aW9uLmEpIHtcbiAgICAgICAgICAgICAgaWYgKHF1ZXN0aW9uLmEuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgYW5zd2VyID0gcXVlc3Rpb24uYVtpXTtcbiAgICAgICAgICAgICAgICBpZiAoYW5zd2VyLmNvcnJlY3QpIHtcbiAgICAgICAgICAgICAgICAgIHRydXRocysrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBOb3cgbGV0J3MgYXBwZW5kIHRoZSBhbnN3ZXJzIHdpdGggY2hlY2tib3hlcyBvciByYWRpb3MgZGVwZW5kaW5nIG9uIHRydXRoIGNvdW50XG4gICAgICAgICAgICB2YXIgYW5zd2VySFRNTCA9ICQoJzx1bCBjbGFzcz1cIicgKyBhbnN3ZXJzQ2xhc3MgKyAnXCI+PC91bD4nKTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBhbnN3ZXJzXG4gICAgICAgICAgICB2YXIgYW5zd2VycyA9IHBsdWdpbi5jb25maWcucmFuZG9tU29ydEFuc3dlcnMgP1xuICAgICAgICAgICAgICAgIHF1ZXN0aW9uLmEuc29ydChmdW5jdGlvbigpIHsgcmV0dXJuIChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpLTAuNSk7IH0pIDpcbiAgICAgICAgICAgICAgICBxdWVzdGlvbi5hO1xuXG4gICAgICAgICAgICAvLyBwcmVwYXJlIGEgbmFtZSBmb3IgdGhlIGFuc3dlciBpbnB1dHMgYmFzZWQgb24gdGhlIHF1ZXN0aW9uXG4gICAgICAgICAgICB2YXIgc2VsZWN0QW55ICAgICA9IHF1ZXN0aW9uLnNlbGVjdF9hbnkgPyBxdWVzdGlvbi5zZWxlY3RfYW55IDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZm9yY2VDaGVja2JveCA9IHF1ZXN0aW9uLmZvcmNlX2NoZWNrYm94ID8gcXVlc3Rpb24uZm9yY2VfY2hlY2tib3ggOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjaGVja2JveCAgICAgID0gKHRydXRocyA+IDEgJiYgIXNlbGVjdEFueSkgfHwgZm9yY2VDaGVja2JveCxcbiAgICAgICAgICAgICAgICBpbnB1dE5hbWUgICAgID0gJGVsZW1lbnQuYXR0cignaWQnKSArICdfcXVlc3Rpb24nICsgKGNvdW50IC0gMSksXG4gICAgICAgICAgICAgICAgaW5wdXRUeXBlICAgICA9IGNoZWNrYm94ID8gJ2NoZWNrYm94JyA6ICdyYWRpbyc7XG5cbiAgICAgICAgICAgIGlmKCBjb3VudCA9PSBxdWl6VmFsdWVzLnF1ZXN0aW9ucy5sZW5ndGggKSB7XG4gICAgICAgICAgICAgIG5leHRRdWVzdGlvbkNsYXNzID0gbmV4dFF1ZXN0aW9uQ2xhc3MgKyAnICcgKyBsYXN0UXVlc3Rpb25DbGFzcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhbnN3ZXJzKSB7XG4gICAgICAgICAgICAgIGlmIChhbnN3ZXJzLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbklkO1xuICAgICAgICAgICAgICAgIGFuc3dlciAgID0gYW5zd2Vyc1tpXTtcbiAgICAgICAgICAgICAgICBvcHRpb25JZCA9IGlucHV0TmFtZSArICdfJyArIGkudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgICAgIC8vIElmIHF1ZXN0aW9uIGhhcyA+MSB0cnVlIGFuc3dlcnMgYW5kIGlzIG5vdCBhIHNlbGVjdCBhbnksIHVzZSBjaGVja2JveGVzOyBvdGhlcndpc2UsIHJhZGlvc1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9ICc8aW5wdXQgaWQ9XCInICsgb3B0aW9uSWQgKyAnXCIgbmFtZT1cIicgKyBpbnB1dE5hbWUgK1xuICAgICAgICAgICAgICAgICAgICAnXCIgdHlwZT1cIicgKyBpbnB1dFR5cGUgKyAnXCIgLz4gJztcblxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25MYWJlbCA9ICc8bGFiZWwgZm9yPVwiJyArIG9wdGlvbklkICsgJ1wiPicgKyBhbnN3ZXIub3B0aW9uICsgJzwvbGFiZWw+JztcblxuICAgICAgICAgICAgICAgIHZhciBhbnN3ZXJDb250ZW50ID0gJCgnPGxpPjwvbGk+JylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChvcHRpb25MYWJlbCk7XG4gICAgICAgICAgICAgICAgYW5zd2VySFRNTC5hcHBlbmQoYW5zd2VyQ29udGVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQXBwZW5kIGFuc3dlcnMgdG8gcXVlc3Rpb25cbiAgICAgICAgICAgIHF1ZXN0aW9uSFRNTC5hcHBlbmQoYW5zd2VySFRNTCk7XG5cbiAgICAgICAgICAgIC8vIElmIHJlc3BvbnNlIG1lc3NhZ2luZyBpcyBOT1QgZGlzYWJsZWQsIGFkZCBpdFxuICAgICAgICAgICAgaWYgKHBsdWdpbi5jb25maWcucGVyUXVlc3Rpb25SZXNwb25zZU1lc3NhZ2luZyB8fCBwbHVnaW4uY29uZmlnLmNvbXBsZXRpb25SZXNwb25zZU1lc3NhZ2luZykge1xuICAgICAgICAgICAgICAvLyBOb3cgbGV0J3MgYXBwZW5kIHRoZSBjb3JyZWN0IC8gaW5jb3JyZWN0IHJlc3BvbnNlIG1lc3NhZ2VzXG4gICAgICAgICAgICAgIHZhciByZXNwb25zZUhUTUwgPSAkKCc8dWwgY2xhc3M9XCInICsgcmVzcG9uc2VzQ2xhc3MgKyAnXCI+PC91bD4nKTtcbiAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MLmFwcGVuZCgnPGxpIGNsYXNzPVwiJyArIGNvcnJlY3RSZXNwb25zZUNsYXNzICsgJ1wiPicgKyBxdWVzdGlvbi5jb3JyZWN0ICsgJzwvbGk+Jyk7XG4gICAgICAgICAgICAgIHJlc3BvbnNlSFRNTC5hcHBlbmQoJzxsaSBjbGFzcz1cIicgKyBpbmNvcnJlY3RSZXNwb25zZUNsYXNzICsgJ1wiPicgKyBxdWVzdGlvbi5pbmNvcnJlY3QgKyAnPC9saT4nKTtcblxuICAgICAgICAgICAgICAvLyBBcHBlbmQgcmVzcG9uc2VzIHRvIHF1ZXN0aW9uXG4gICAgICAgICAgICAgIHF1ZXN0aW9uSFRNTC5hcHBlbmQocmVzcG9uc2VIVE1MKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQXBwZW5kcyBjaGVjayBhbnN3ZXIgLyBiYWNrIC8gbmV4dCBxdWVzdGlvbiBidXR0b25zXG4gICAgICAgICAgICBpZiAocGx1Z2luLmNvbmZpZy5iYWNrQnV0dG9uVGV4dCAmJiBwbHVnaW4uY29uZmlnLmJhY2tCdXR0b25UZXh0ICE9PSAnJykge1xuICAgICAgICAgICAgICBxdWVzdGlvbkhUTUwuYXBwZW5kKCc8YSBocmVmPVwiI1wiIGNsYXNzPVwiYnV0dG9uICcgKyBiYWNrVG9RdWVzdGlvbkNsYXNzICsgJ1wiPicgKyBwbHVnaW4uY29uZmlnLmJhY2tCdXR0b25UZXh0ICsgJzwvYT4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG5leHRUZXh0ID0gcGx1Z2luLmNvbmZpZy5uZXh0UXVlc3Rpb25UZXh0O1xuICAgICAgICAgICAgaWYgKHBsdWdpbi5jb25maWcuY29tcGxldGVRdWl6VGV4dCAmJiBjb3VudCA9PSBxdWVzdGlvbkNvdW50KSB7XG4gICAgICAgICAgICAgIG5leHRUZXh0ID0gcGx1Z2luLmNvbmZpZy5jb21wbGV0ZVF1aXpUZXh0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB3ZSdyZSBub3Qgc2hvd2luZyByZXNwb25zZXMgcGVyIHF1ZXN0aW9uLCBzaG93IG5leHQgcXVlc3Rpb24gYnV0dG9uIGFuZCBtYWtlIGl0IGNoZWNrIHRoZSBhbnN3ZXIgdG9vXG4gICAgICAgICAgICBpZiAoIXBsdWdpbi5jb25maWcucGVyUXVlc3Rpb25SZXNwb25zZU1lc3NhZ2luZykge1xuICAgICAgICAgICAgICBxdWVzdGlvbkhUTUwuYXBwZW5kKCc8YSBocmVmPVwiI1wiIGNsYXNzPVwiYnV0dG9uICcgKyBuZXh0UXVlc3Rpb25DbGFzcyArICcgJyArIGNoZWNrQW5zd2VyQ2xhc3MgKyAnXCI+JyArIG5leHRUZXh0ICsgJzwvYT4nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHF1ZXN0aW9uSFRNTC5hcHBlbmQoJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidXR0b24gJyArIG5leHRRdWVzdGlvbkNsYXNzICsgJ1wiPicgKyBuZXh0VGV4dCArICc8L2E+Jyk7XG4gICAgICAgICAgICAgIHF1ZXN0aW9uSFRNTC5hcHBlbmQoJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidXR0b24gJyArIGNoZWNrQW5zd2VyQ2xhc3MgKyAnXCI+JyArIHBsdWdpbi5jb25maWcuY2hlY2tBbnN3ZXJUZXh0ICsgJzwvYT4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQXBwZW5kIHF1ZXN0aW9uICYgYW5zd2VycyB0byBxdWl6XG4gICAgICAgICAgICBxdWl6LmFwcGVuZChxdWVzdGlvbkhUTUwpO1xuXG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCB0aGUgcXVpeiBjb250ZW50IHRvIHRoZSBwYWdlXG4gICAgICAgICRxdWl6QXJlYS5hcHBlbmQocXVpeik7XG5cbiAgICAgICAgLy8gVG9nZ2xlIHRoZSBzdGFydCBidXR0b24gT1Igc3RhcnQgdGhlIHF1aXogaWYgc3RhcnQgYnV0dG9uIGlzIGRpc2FibGVkXG4gICAgICAgIGlmIChwbHVnaW4uY29uZmlnLnNraXBTdGFydEJ1dHRvbiB8fCAkcXVpelN0YXJ0ZXIubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAkcXVpelN0YXJ0ZXIuaGlkZSgpO1xuICAgICAgICAgIHBsdWdpbi5tZXRob2Quc3RhcnRRdWl6LmFwcGx5ICh0aGlzLCBbe2NhbGxiYWNrOiBwbHVnaW4uY29uZmlnLmFuaW1hdGlvbkNhbGxiYWNrcy5zdGFydFF1aXp9XSk7IC8vIFRPRE86IGRldGVybWluZSB3aHkgJ3RoaXMnIGlzIGJlaW5nIHBhc3NlZCBhcyBhcmcgdG8gc3RhcnRRdWl6IG1ldGhvZFxuICAgICAgICAgIGtOKGtleSwzKS5hcHBseSAobnVsbCwgW10pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRxdWl6U3RhcnRlci5mYWRlSW4oNTAwLCBrTihrZXksMykpOyAvLyAzZCBub3RjaCBvbiBrZXkgbXVzdCBiZSBvbiBib3RoIHNpZGVzIG9mIGlmL2Vsc2UsIG90aGVyd2lzZSBrZXkgd29uJ3QgdHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaW50ZXJuYWwubWV0aG9kLnR1cm5LZXlBbmRHbyAoa2V5LCBvcHRpb25zICYmIG9wdGlvbnMuY2FsbGJhY2sgPyBvcHRpb25zLmNhbGxiYWNrIDogZnVuY3Rpb24gKCkge30pO1xuICAgICAgfSxcblxuICAgICAgLy8gU3RhcnRzIHRoZSBxdWl6IChoaWRlcyBzdGFydCBidXR0b24gYW5kIGRpc3BsYXlzIGZpcnN0IHF1ZXN0aW9uKVxuICAgICAgc3RhcnRRdWl6OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBrZXksIGtleU5vdGNoLCBrTjtcbiAgICAgICAga2V5ID0gaW50ZXJuYWwubWV0aG9kLmdldEtleSAoMSk7IC8vIGhvdyBtYW55IG5vdGNoZXMgPT0gaG93IG1hbnkgalEgYW5pbWF0aW9ucyB5b3Ugd2lsbCBydW5cbiAgICAgICAga2V5Tm90Y2ggPSBpbnRlcm5hbC5tZXRob2QuZ2V0S2V5Tm90Y2g7IC8vIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgalEgYW5pbWF0aW9uIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICAgIGtOID0ga2V5Tm90Y2g7IC8vIHlvdSBzcGVjaWZ5IHRoZSBub3RjaCwgeW91IGdldCBhIGNhbGxiYWNrIGZ1bmN0aW9uIGZvciB5b3VyIGFuaW1hdGlvblxuXG4gICAgICAgIGZ1bmN0aW9uIHN0YXJ0KG9wdGlvbnMpIHtcbiAgICAgICAgICB2YXIgZmlyc3RRdWVzdGlvbiA9ICQoX2VsZW1lbnQgKyAnICcgKyBfcXVlc3Rpb25zICsgJyBsaScpLmZpcnN0KCk7XG4gICAgICAgICAgaWYgKGZpcnN0UXVlc3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgICAgICBmaXJzdFF1ZXN0aW9uLmZhZGVJbig1MDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5jYWxsYmFjaykgb3B0aW9ucy5jYWxsYmFjayAoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwbHVnaW4uY29uZmlnLnNraXBTdGFydEJ1dHRvbiB8fCAkcXVpelN0YXJ0ZXIubGVuZ3RoID09IDApIHtcbiAgICAgICAgICBzdGFydCh7Y2FsbGJhY2s6IGtOKGtleSwxKX0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRxdWl6U3RhcnRlci5mYWRlT3V0KDMwMCwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHN0YXJ0KHtjYWxsYmFjazoga04oa2V5LDEpfSk7IC8vIDFzdCBub3RjaCBvbiBrZXkgbXVzdCBiZSBvbiBib3RoIHNpZGVzIG9mIGlmL2Vsc2UsIG90aGVyd2lzZSBrZXkgd29uJ3QgdHVyblxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaW50ZXJuYWwubWV0aG9kLnR1cm5LZXlBbmRHbyAoa2V5LCBvcHRpb25zICYmIG9wdGlvbnMuY2FsbGJhY2sgPyBvcHRpb25zLmNhbGxiYWNrIDogZnVuY3Rpb24gKCkge30pO1xuXG4gICAgICAgIGlmIChwbHVnaW4uY29uZmlnLmV2ZW50cyAmJlxuICAgICAgICAgICAgcGx1Z2luLmNvbmZpZy5ldmVudHMub25TdGFydFF1aXopIHtcbiAgICAgICAgICBwbHVnaW4uY29uZmlnLmV2ZW50cy5vblN0YXJ0UXVpei5hcHBseSAobnVsbCwgW10pO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvLyBSZXNldHMgKHJlc3RhcnRzKSB0aGUgcXVpeiAoaGlkZXMgcmVzdWx0cywgcmVzZXRzIGlucHV0cywgYW5kIGRpc3BsYXlzIGZpcnN0IHF1ZXN0aW9uKVxuICAgICAgcmVzZXRRdWl6OiBmdW5jdGlvbihzdGFydEJ1dHRvbiwgb3B0aW9ucykge1xuICAgICAgICB2YXIga2V5LCBrZXlOb3RjaCwga047XG4gICAgICAgIGtleSA9IGludGVybmFsLm1ldGhvZC5nZXRLZXkgKDEpOyAvLyBob3cgbWFueSBub3RjaGVzID09IGhvdyBtYW55IGpRIGFuaW1hdGlvbnMgeW91IHdpbGwgcnVuXG4gICAgICAgIGtleU5vdGNoID0gaW50ZXJuYWwubWV0aG9kLmdldEtleU5vdGNoOyAvLyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIGpRIGFuaW1hdGlvbiBjYWxsYmFjayBmdW5jdGlvblxuICAgICAgICBrTiA9IGtleU5vdGNoOyAvLyB5b3Ugc3BlY2lmeSB0aGUgbm90Y2gsIHlvdSBnZXQgYSBjYWxsYmFjayBmdW5jdGlvbiBmb3IgeW91ciBhbmltYXRpb25cblxuICAgICAgICAkcXVpelJlc3VsdHMuZmFkZU91dCgzMDAsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICQoX2VsZW1lbnQgKyAnIGlucHV0JykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblxuICAgICAgICAgICRxdWl6TGV2ZWwuYXR0cignY2xhc3MnLCAncXVpekxldmVsJyk7XG4gICAgICAgICAgJChfZWxlbWVudCArICcgJyArIF9xdWVzdGlvbikucmVtb3ZlQ2xhc3MoY29ycmVjdENsYXNzKS5yZW1vdmVDbGFzcyhpbmNvcnJlY3RDbGFzcykucmVtb3ZlKGNvbXBsZXRlQ2xhc3MpO1xuICAgICAgICAgICQoX2VsZW1lbnQgKyAnICcgKyBfYW5zd2VyKS5yZW1vdmVDbGFzcyhjb3JyZWN0UmVzcG9uc2VDbGFzcykucmVtb3ZlQ2xhc3MoaW5jb3JyZWN0UmVzcG9uc2VDbGFzcyk7XG5cbiAgICAgICAgICAkKF9lbGVtZW50ICsgJyAnICsgX3F1ZXN0aW9uICAgICAgICAgICsgJywnICtcbiAgICAgICAgICAgICAgX2VsZW1lbnQgKyAnICcgKyBfcmVzcG9uc2VzICAgICAgICAgKyAnLCcgK1xuICAgICAgICAgICAgICBfZWxlbWVudCArICcgJyArIF9yZXNwb25zZSAgICAgICAgICArICcsJyArXG4gICAgICAgICAgICAgIF9lbGVtZW50ICsgJyAnICsgX25leHRRdWVzdGlvbkJ0biAgICsgJywnICtcbiAgICAgICAgICAgICAgX2VsZW1lbnQgKyAnICcgKyBfcHJldlF1ZXN0aW9uQnRuXG4gICAgICAgICAgKS5oaWRlKCk7XG5cbiAgICAgICAgICAkKF9lbGVtZW50ICsgJyAnICsgX3F1ZXN0aW9uQ291bnQgKyAnLCcgK1xuICAgICAgICAgICAgICBfZWxlbWVudCArICcgJyArIF9hbnN3ZXJzICsgJywnICtcbiAgICAgICAgICAgICAgX2VsZW1lbnQgKyAnICcgKyBfY2hlY2tBbnN3ZXJCdG5cbiAgICAgICAgICApLnNob3coKTtcblxuICAgICAgICAgICRxdWl6QXJlYS5hcHBlbmQoJChfZWxlbWVudCArICcgJyArIF9xdWVzdGlvbnMpKS5zaG93KCk7XG5cbiAgICAgICAgICBrTihrZXksMSkuYXBwbHkgKG51bGwsIFtdKTtcblxuICAgICAgICAgIHBsdWdpbi5tZXRob2Quc3RhcnRRdWl6KHtjYWxsYmFjazogcGx1Z2luLmNvbmZpZy5hbmltYXRpb25DYWxsYmFja3Muc3RhcnRRdWl6fSwkcXVpelJlc3VsdHMpOyAvLyBUT0RPOiBkZXRlcm1pbmUgd2h5ICRxdWl6UmVzdWx0cyBpcyBiZWluZyBwYXNzZWRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaW50ZXJuYWwubWV0aG9kLnR1cm5LZXlBbmRHbyAoa2V5LCBvcHRpb25zICYmIG9wdGlvbnMuY2FsbGJhY2sgPyBvcHRpb25zLmNhbGxiYWNrIDogZnVuY3Rpb24gKCkge30pO1xuICAgICAgfSxcblxuICAgICAgLy8gVmFsaWRhdGVzIHRoZSByZXNwb25zZSBzZWxlY3Rpb24ocyksIGRpc3BsYXlzIGV4cGxhbmF0aW9ucyAmIG5leHQgcXVlc3Rpb24gYnV0dG9uXG4gICAgICBjaGVja0Fuc3dlcjogZnVuY3Rpb24oY2hlY2tCdXR0b24sIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGtleSwga2V5Tm90Y2gsIGtOO1xuICAgICAgICBrZXkgPSBpbnRlcm5hbC5tZXRob2QuZ2V0S2V5ICgyKTsgLy8gaG93IG1hbnkgbm90Y2hlcyA9PSBob3cgbWFueSBqUSBhbmltYXRpb25zIHlvdSB3aWxsIHJ1blxuICAgICAgICBrZXlOb3RjaCA9IGludGVybmFsLm1ldGhvZC5nZXRLZXlOb3RjaDsgLy8gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBqUSBhbmltYXRpb24gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgICAga04gPSBrZXlOb3RjaDsgLy8geW91IHNwZWNpZnkgdGhlIG5vdGNoLCB5b3UgZ2V0IGEgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIHlvdXIgYW5pbWF0aW9uXG5cbiAgICAgICAgdmFyIHF1ZXN0aW9uTEkgICAgPSAkKCQoY2hlY2tCdXR0b24pLnBhcmVudHMoX3F1ZXN0aW9uKVswXSksXG4gICAgICAgICAgICBhbnN3ZXJMSXMgICAgID0gcXVlc3Rpb25MSS5maW5kKF9hbnN3ZXJzICsgJyBsaScpLFxuICAgICAgICAgICAgYW5zd2VyU2VsZWN0cyA9IGFuc3dlckxJcy5maW5kKCdpbnB1dDpjaGVja2VkJyksXG4gICAgICAgICAgICBxdWVzdGlvbkluZGV4ID0gcGFyc2VJbnQocXVlc3Rpb25MSS5hdHRyKCdpZCcpLnJlcGxhY2UoLyhxdWVzdGlvbikvLCAnJyksIDEwKSxcbiAgICAgICAgICAgIGFuc3dlcnMgICAgICAgPSBxdWVzdGlvbnNbcXVlc3Rpb25JbmRleF0uYSxcbiAgICAgICAgICAgIHNlbGVjdEFueSAgICAgPSBxdWVzdGlvbnNbcXVlc3Rpb25JbmRleF0uc2VsZWN0X2FueSA/IHF1ZXN0aW9uc1txdWVzdGlvbkluZGV4XS5zZWxlY3RfYW55IDogZmFsc2U7XG5cbiAgICAgICAgYW5zd2VyTElzLmFkZENsYXNzKGluY29ycmVjdFJlc3BvbnNlQ2xhc3MpO1xuXG4gICAgICAgIC8vIENvbGxlY3QgdGhlIHRydWUgYW5zd2VycyBuZWVkZWQgZm9yIGEgY29ycmVjdCByZXNwb25zZVxuICAgICAgICB2YXIgdHJ1ZUFuc3dlcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBhbnN3ZXJzKSB7XG4gICAgICAgICAgaWYgKGFuc3dlcnMuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgIHZhciBhbnN3ZXIgPSBhbnN3ZXJzW2ldLFxuICAgICAgICAgICAgICAgIGluZGV4ICA9IHBhcnNlSW50KGksIDEwKTtcblxuICAgICAgICAgICAgaWYgKGFuc3dlci5jb3JyZWN0KSB7XG4gICAgICAgICAgICAgIHRydWVBbnN3ZXJzLnB1c2goaW5kZXgpO1xuICAgICAgICAgICAgICBhbnN3ZXJMSXMuZXEoaW5kZXgpLnJlbW92ZUNsYXNzKGluY29ycmVjdFJlc3BvbnNlQ2xhc3MpLmFkZENsYXNzKGNvcnJlY3RSZXNwb25zZUNsYXNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiBOb3cgdGhhdCB3ZSdyZSBtYXJraW5nIGFuc3dlciBMSXMgYXMgY29ycmVjdCAvIGluY29ycmVjdCwgd2UgbWlnaHQgYmUgYWJsZVxuICAgICAgICAvLyB0byBkbyBhbGwgb3VyIGFuc3dlciBjaGVja2luZyBhdCB0aGUgc2FtZSB0aW1lXG5cbiAgICAgICAgLy8gTk9URTogQ29sbGVjdGluZyBhbnN3ZXIgaW5kZXggZm9yIGNvbXBhcmlzb24gYWltcyB0byBlbnN1cmUgdGhhdCBIVE1MIGVudGl0aWVzXG4gICAgICAgIC8vIGFuZCBIVE1MIGVsZW1lbnRzIHRoYXQgbWF5IGJlIG1vZGlmaWVkIGJ5IHRoZSBicm93c2VyIC8gb3RoZXIgc2NyaXBzIG1hdGNoIHVwXG5cbiAgICAgICAgLy8gQ29sbGVjdCB0aGUgYW5zd2VycyBzdWJtaXR0ZWRcbiAgICAgICAgdmFyIHNlbGVjdGVkQW5zd2VycyA9IFtdO1xuICAgICAgICBhbnN3ZXJTZWxlY3RzLmVhY2goIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBpZCA9ICQodGhpcykuYXR0cignaWQnKTtcbiAgICAgICAgICBzZWxlY3RlZEFuc3dlcnMucHVzaChwYXJzZUludChpZC5yZXBsYWNlKC8oLipcXF9xdWVzdGlvblxcZHsxLH1fKS8sICcnKSwgMTApKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHBsdWdpbi5jb25maWcucHJldmVudFVuYW5zd2VyZWQgJiYgc2VsZWN0ZWRBbnN3ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGFsZXJ0KHBsdWdpbi5jb25maWcucHJldmVudFVuYW5zd2VyZWRUZXh0KTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBWZXJpZnkgYWxsL2FueSB0cnVlIGFuc3dlcnMgKGFuZCBubyBmYWxzZSBvbmVzKSB3ZXJlIHN1Ym1pdHRlZFxuICAgICAgICB2YXIgY29ycmVjdFJlc3BvbnNlID0gcGx1Z2luLm1ldGhvZC5jb21wYXJlQW5zd2Vycyh0cnVlQW5zd2Vycywgc2VsZWN0ZWRBbnN3ZXJzLCBzZWxlY3RBbnkpO1xuXG4gICAgICAgIGlmIChjb3JyZWN0UmVzcG9uc2UpIHtcbiAgICAgICAgICBxdWVzdGlvbkxJLmFkZENsYXNzKGNvcnJlY3RDbGFzcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcXVlc3Rpb25MSS5hZGRDbGFzcyhpbmNvcnJlY3RDbGFzcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUb2dnbGUgYXBwcm9wcmlhdGUgcmVzcG9uc2UgKGVpdGhlciBmb3IgZGlzcGxheSBub3cgYW5kIC8gb3Igb24gY29tcGxldGlvbilcbiAgICAgICAgcXVlc3Rpb25MSS5maW5kKGNvcnJlY3RSZXNwb25zZSA/IF9jb3JyZWN0UmVzcG9uc2UgOiBfaW5jb3JyZWN0UmVzcG9uc2UpLnNob3coKTtcblxuICAgICAgICAvLyBJZiBwZXJRdWVzdGlvblJlc3BvbnNlTWVzc2FnaW5nIGlzIGVuYWJsZWQsIHRvZ2dsZSByZXNwb25zZSBhbmQgbmF2aWdhdGlvbiBub3dcbiAgICAgICAgaWYgKHBsdWdpbi5jb25maWcucGVyUXVlc3Rpb25SZXNwb25zZU1lc3NhZ2luZykge1xuICAgICAgICAgICQoY2hlY2tCdXR0b24pLmhpZGUoKTtcbiAgICAgICAgICBpZiAoIXBsdWdpbi5jb25maWcucGVyUXVlc3Rpb25SZXNwb25zZUFuc3dlcnMpIHtcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBhbnN3ZXJzIGRvbid0IGhpZ2hsaWdodCBmb3IgYSBzcGxpdCBzZWNvbmQgYmVmb3JlIHRoZXkgaGlkZVxuICAgICAgICAgICAgcXVlc3Rpb25MSS5maW5kKF9hbnN3ZXJzKS5oaWRlKHtcbiAgICAgICAgICAgICAgZHVyYXRpb246IDAsXG4gICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBxdWVzdGlvbkxJLmFkZENsYXNzKGNvbXBsZXRlQ2xhc3MpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcXVlc3Rpb25MSS5hZGRDbGFzcyhjb21wbGV0ZUNsYXNzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcXVlc3Rpb25MSS5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgcXVlc3Rpb25MSS5maW5kKF9yZXNwb25zZXMpLnNob3coKTtcbiAgICAgICAgICBxdWVzdGlvbkxJLmZpbmQoX25leHRRdWVzdGlvbkJ0bikuZmFkZUluKDMwMCwga04oa2V5LDEpKTtcbiAgICAgICAgICBxdWVzdGlvbkxJLmZpbmQoX3ByZXZRdWVzdGlvbkJ0bikuZmFkZUluKDMwMCwga04oa2V5LDIpKTtcbiAgICAgICAgICBpZiAoIXF1ZXN0aW9uTEkuZmluZChfcHJldlF1ZXN0aW9uQnRuKS5sZW5ndGgpIGtOKGtleSwyKS5hcHBseSAobnVsbCwgW10pOyAvLyAybmQgbm90Y2ggb24ga2V5IG11c3QgYmUgcGFzc2VkIGV2ZW4gaWYgdGhlcmUncyBubyBcImJhY2tcIiBidXR0b25cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBrTihrZXksMSkuYXBwbHkgKG51bGwsIFtdKTsgLy8gMXN0IG5vdGNoIG9uIGtleSBtdXN0IGJlIG9uIGJvdGggc2lkZXMgb2YgaWYvZWxzZSwgb3RoZXJ3aXNlIGtleSB3b24ndCB0dXJuXG4gICAgICAgICAga04oa2V5LDIpLmFwcGx5IChudWxsLCBbXSk7IC8vIDJuZCBub3RjaCBvbiBrZXkgbXVzdCBiZSBvbiBib3RoIHNpZGVzIG9mIGlmL2Vsc2UsIG90aGVyd2lzZSBrZXkgd29uJ3QgdHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaW50ZXJuYWwubWV0aG9kLnR1cm5LZXlBbmRHbyAoa2V5LCBvcHRpb25zICYmIG9wdGlvbnMuY2FsbGJhY2sgPyBvcHRpb25zLmNhbGxiYWNrIDogZnVuY3Rpb24gKCkge30pO1xuICAgICAgfSxcblxuICAgICAgLy8gTW92ZXMgdG8gdGhlIG5leHQgcXVlc3Rpb24gT1IgY29tcGxldGVzIHRoZSBxdWl6IGlmIG9uIGxhc3QgcXVlc3Rpb25cbiAgICAgIG5leHRRdWVzdGlvbjogZnVuY3Rpb24obmV4dEJ1dHRvbiwgb3B0aW9ucykge1xuICAgICAgICB2YXIga2V5LCBrZXlOb3RjaCwga047XG4gICAgICAgIGtleSA9IGludGVybmFsLm1ldGhvZC5nZXRLZXkgKDEpOyAvLyBob3cgbWFueSBub3RjaGVzID09IGhvdyBtYW55IGpRIGFuaW1hdGlvbnMgeW91IHdpbGwgcnVuXG4gICAgICAgIGtleU5vdGNoID0gaW50ZXJuYWwubWV0aG9kLmdldEtleU5vdGNoOyAvLyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIGpRIGFuaW1hdGlvbiBjYWxsYmFjayBmdW5jdGlvblxuICAgICAgICBrTiA9IGtleU5vdGNoOyAvLyB5b3Ugc3BlY2lmeSB0aGUgbm90Y2gsIHlvdSBnZXQgYSBjYWxsYmFjayBmdW5jdGlvbiBmb3IgeW91ciBhbmltYXRpb25cblxuICAgICAgICB2YXIgY3VycmVudFF1ZXN0aW9uID0gJCgkKG5leHRCdXR0b24pLnBhcmVudHMoX3F1ZXN0aW9uKVswXSksXG4gICAgICAgICAgICBuZXh0UXVlc3Rpb24gICAgPSBjdXJyZW50UXVlc3Rpb24ubmV4dChfcXVlc3Rpb24pLFxuICAgICAgICAgICAgYW5zd2VySW5wdXRzICAgID0gY3VycmVudFF1ZXN0aW9uLmZpbmQoJ2lucHV0OmNoZWNrZWQnKTtcblxuICAgICAgICAvLyBJZiByZXNwb25zZSBtZXNzYWdpbmcgaGFzIGJlZW4gZGlzYWJsZWQgb3IgbW92ZWQgdG8gY29tcGxldGlvbixcbiAgICAgICAgLy8gbWFrZSBzdXJlIHdlIGhhdmUgYW4gYW5zd2VyIGlmIHdlIHJlcXVpcmUgaXQsIGxldCBjaGVja0Fuc3dlciBoYW5kbGUgdGhlIGFsZXJ0IG1lc3NhZ2luZ1xuICAgICAgICBpZiAocGx1Z2luLmNvbmZpZy5wcmV2ZW50VW5hbnN3ZXJlZCAmJiBhbnN3ZXJJbnB1dHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHRRdWVzdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgICBjdXJyZW50UXVlc3Rpb24uZmFkZU91dCgzMDAsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXh0UXVlc3Rpb24uZmluZChfcHJldlF1ZXN0aW9uQnRuKS5zaG93KCkuZW5kKCkuZmFkZUluKDUwMCwga04oa2V5LDEpKTtcbiAgICAgICAgICAgIGlmICghbmV4dFF1ZXN0aW9uLmZpbmQoX3ByZXZRdWVzdGlvbkJ0bikuc2hvdygpLmVuZCgpLmxlbmd0aCkga04oa2V5LDEpLmFwcGx5IChudWxsLCBbXSk7IC8vIDFzdCBub3RjaCBvbiBrZXkgbXVzdCBiZSBwYXNzZWQgZXZlbiBpZiB0aGVyZSdzIG5vIFwiYmFja1wiIGJ1dHRvblxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGtOKGtleSwxKS5hcHBseSAobnVsbCwgW10pOyAvLyAxc3Qgbm90Y2ggb24ga2V5IG11c3QgYmUgb24gYm90aCBzaWRlcyBvZiBpZi9lbHNlLCBvdGhlcndpc2Uga2V5IHdvbid0IHR1cm5cbiAgICAgICAgICBwbHVnaW4ubWV0aG9kLmNvbXBsZXRlUXVpeih7Y2FsbGJhY2s6IHBsdWdpbi5jb25maWcuYW5pbWF0aW9uQ2FsbGJhY2tzLmNvbXBsZXRlUXVpen0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaW50ZXJuYWwubWV0aG9kLnR1cm5LZXlBbmRHbyAoa2V5LCBvcHRpb25zICYmIG9wdGlvbnMuY2FsbGJhY2sgPyBvcHRpb25zLmNhbGxiYWNrIDogZnVuY3Rpb24gKCkge30pO1xuICAgICAgfSxcblxuICAgICAgLy8gR28gYmFjayB0byB0aGUgbGFzdCBxdWVzdGlvblxuICAgICAgYmFja1RvUXVlc3Rpb246IGZ1bmN0aW9uKGJhY2tCdXR0b24sIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGtleSwga2V5Tm90Y2gsIGtOO1xuICAgICAgICBrZXkgPSBpbnRlcm5hbC5tZXRob2QuZ2V0S2V5ICgyKTsgLy8gaG93IG1hbnkgbm90Y2hlcyA9PSBob3cgbWFueSBqUSBhbmltYXRpb25zIHlvdSB3aWxsIHJ1blxuICAgICAgICBrZXlOb3RjaCA9IGludGVybmFsLm1ldGhvZC5nZXRLZXlOb3RjaDsgLy8gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBqUSBhbmltYXRpb24gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgICAga04gPSBrZXlOb3RjaDsgLy8geW91IHNwZWNpZnkgdGhlIG5vdGNoLCB5b3UgZ2V0IGEgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIHlvdXIgYW5pbWF0aW9uXG5cbiAgICAgICAgdmFyIHF1ZXN0aW9uTEkgPSAkKCQoYmFja0J1dHRvbikucGFyZW50cyhfcXVlc3Rpb24pWzBdKSxcbiAgICAgICAgICAgIHJlc3BvbnNlcyAgPSBxdWVzdGlvbkxJLmZpbmQoX3Jlc3BvbnNlcyk7XG5cbiAgICAgICAgLy8gQmFjayB0byBxdWVzdGlvbiBmcm9tIHJlc3BvbnNlc1xuICAgICAgICBpZiAocmVzcG9uc2VzLmNzcygnZGlzcGxheScpID09PSAnYmxvY2snICkge1xuICAgICAgICAgIHF1ZXN0aW9uTEkuZmluZChfcmVzcG9uc2VzKS5mYWRlT3V0KDMwMCwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHF1ZXN0aW9uTEkucmVtb3ZlQ2xhc3MoY29ycmVjdENsYXNzKS5yZW1vdmVDbGFzcyhpbmNvcnJlY3RDbGFzcykucmVtb3ZlQ2xhc3MoY29tcGxldGVDbGFzcyk7XG4gICAgICAgICAgICBxdWVzdGlvbkxJLmZpbmQoX3Jlc3BvbnNlcyArICcsICcgKyBfcmVzcG9uc2UpLmhpZGUoKTtcbiAgICAgICAgICAgIHF1ZXN0aW9uTEkuZmluZChfYW5zd2Vycykuc2hvdygpO1xuICAgICAgICAgICAgcXVlc3Rpb25MSS5maW5kKF9hbnN3ZXIpLnJlbW92ZUNsYXNzKGNvcnJlY3RSZXNwb25zZUNsYXNzKS5yZW1vdmVDbGFzcyhpbmNvcnJlY3RSZXNwb25zZUNsYXNzKTtcbiAgICAgICAgICAgIHF1ZXN0aW9uTEkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIHF1ZXN0aW9uTEkuZmluZChfYW5zd2VycykuZmFkZUluKDUwMCwga04oa2V5LDEpKTsgLy8gMXN0IG5vdGNoIG9uIGtleSBtdXN0IGJlIG9uIGJvdGggc2lkZXMgb2YgaWYvZWxzZSwgb3RoZXJ3aXNlIGtleSB3b24ndCB0dXJuXG4gICAgICAgICAgICBxdWVzdGlvbkxJLmZpbmQoX2NoZWNrQW5zd2VyQnRuKS5mYWRlSW4oNTAwLCBrTihrZXksMikpO1xuICAgICAgICAgICAgcXVlc3Rpb25MSS5maW5kKF9uZXh0UXVlc3Rpb25CdG4pLmhpZGUoKTtcblxuICAgICAgICAgICAgLy8gaWYgcXVlc3Rpb24gaXMgZmlyc3QsIGRvbid0IHNob3cgYmFjayBidXR0b24gb24gcXVlc3Rpb25cbiAgICAgICAgICAgIGlmIChxdWVzdGlvbkxJLmF0dHIoJ2lkJykgIT0gJ3F1ZXN0aW9uMCcpIHtcbiAgICAgICAgICAgICAgcXVlc3Rpb25MSS5maW5kKF9wcmV2UXVlc3Rpb25CdG4pLnNob3coKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHF1ZXN0aW9uTEkuZmluZChfcHJldlF1ZXN0aW9uQnRuKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBCYWNrIHRvIHByZXZpb3VzIHF1ZXN0aW9uXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHByZXZRdWVzdGlvbiA9IHF1ZXN0aW9uTEkucHJldihfcXVlc3Rpb24pO1xuXG4gICAgICAgICAgcXVlc3Rpb25MSS5mYWRlT3V0KDMwMCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBwcmV2UXVlc3Rpb24ucmVtb3ZlQ2xhc3MoY29ycmVjdENsYXNzKS5yZW1vdmVDbGFzcyhpbmNvcnJlY3RDbGFzcykucmVtb3ZlQ2xhc3MoY29tcGxldGVDbGFzcyk7XG4gICAgICAgICAgICBwcmV2UXVlc3Rpb24uZmluZChfcmVzcG9uc2VzICsgJywgJyArIF9yZXNwb25zZSkuaGlkZSgpO1xuICAgICAgICAgICAgcHJldlF1ZXN0aW9uLmZpbmQoX2Fuc3dlcnMpLnNob3coKTtcbiAgICAgICAgICAgIHByZXZRdWVzdGlvbi5maW5kKF9hbnN3ZXIpLnJlbW92ZUNsYXNzKGNvcnJlY3RSZXNwb25zZUNsYXNzKS5yZW1vdmVDbGFzcyhpbmNvcnJlY3RSZXNwb25zZUNsYXNzKTtcbiAgICAgICAgICAgIHByZXZRdWVzdGlvbi5maW5kKCdpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgcHJldlF1ZXN0aW9uLmZpbmQoX25leHRRdWVzdGlvbkJ0bikuaGlkZSgpO1xuICAgICAgICAgICAgcHJldlF1ZXN0aW9uLmZpbmQoX2NoZWNrQW5zd2VyQnRuKS5zaG93KCk7XG5cbiAgICAgICAgICAgIGlmIChwcmV2UXVlc3Rpb24uYXR0cignaWQnKSAhPSAncXVlc3Rpb24wJykge1xuICAgICAgICAgICAgICBwcmV2UXVlc3Rpb24uZmluZChfcHJldlF1ZXN0aW9uQnRuKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwcmV2UXVlc3Rpb24uZmluZChfcHJldlF1ZXN0aW9uQnRuKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHByZXZRdWVzdGlvbi5mYWRlSW4oNTAwLCBrTihrZXksMSkpO1xuICAgICAgICAgICAga04oa2V5LDIpLmFwcGx5IChudWxsLCBbXSk7IC8vIDJuZCBub3RjaCBvbiBrZXkgbXVzdCBiZSBvbiBib3RoIHNpZGVzIG9mIGlmL2Vsc2UsIG90aGVyd2lzZSBrZXkgd29uJ3QgdHVyblxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaW50ZXJuYWwubWV0aG9kLnR1cm5LZXlBbmRHbyAoa2V5LCBvcHRpb25zICYmIG9wdGlvbnMuY2FsbGJhY2sgPyBvcHRpb25zLmNhbGxiYWNrIDogZnVuY3Rpb24gKCkge30pO1xuICAgICAgfSxcblxuICAgICAgLy8gSGlkZXMgYWxsIHF1ZXN0aW9ucywgZGlzcGxheXMgdGhlIGZpbmFsIHNjb3JlIGFuZCBzb21lIGNvbmNsdXNpdmUgaW5mb3JtYXRpb25cbiAgICAgIGNvbXBsZXRlUXVpejogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIga2V5LCBrZXlOb3RjaCwga047XG4gICAgICAgIGtleSA9IGludGVybmFsLm1ldGhvZC5nZXRLZXkgKDEpOyAvLyBob3cgbWFueSBub3RjaGVzID09IGhvdyBtYW55IGpRIGFuaW1hdGlvbnMgeW91IHdpbGwgcnVuXG4gICAgICAgIGtleU5vdGNoID0gaW50ZXJuYWwubWV0aG9kLmdldEtleU5vdGNoOyAvLyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIGpRIGFuaW1hdGlvbiBjYWxsYmFjayBmdW5jdGlvblxuICAgICAgICBrTiA9IGtleU5vdGNoOyAvLyB5b3Ugc3BlY2lmeSB0aGUgbm90Y2gsIHlvdSBnZXQgYSBjYWxsYmFjayBmdW5jdGlvbiBmb3IgeW91ciBhbmltYXRpb25cblxuICAgICAgICB2YXIgc2NvcmUgICAgICAgID0gJChfZWxlbWVudCArICcgJyArIF9jb3JyZWN0KS5sZW5ndGgsXG4gICAgICAgICAgICBkaXNwbGF5U2NvcmUgPSBzY29yZTtcbiAgICAgICAgaWYgKHBsdWdpbi5jb25maWcuc2NvcmVBc1BlcmNlbnRhZ2UpIHtcbiAgICAgICAgICBkaXNwbGF5U2NvcmUgPSAoc2NvcmUgLyBxdWVzdGlvbkNvdW50KS50b0ZpeGVkKDIpKjEwMCArIFwiJVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBsdWdpbi5jb25maWcuZGlzYWJsZVNjb3JlKSB7XG4gICAgICAgICAgJChfcXVpelNjb3JlKS5yZW1vdmUoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQoX3F1aXpTY29yZSArICcgc3BhbicpLmh0bWwocGx1Z2luLmNvbmZpZy5zY29yZVRlbXBsYXRlVGV4dFxuICAgICAgICAgICAgICAucmVwbGFjZSgnJXNjb3JlJywgZGlzcGxheVNjb3JlKS5yZXBsYWNlKCcldG90YWwnLCBxdWVzdGlvbkNvdW50KSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGx1Z2luLmNvbmZpZy5kaXNhYmxlUmFua2luZykge1xuICAgICAgICAgICQoX3F1aXpMZXZlbCkucmVtb3ZlKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgbGV2ZWxzICAgID0gW1xuICAgICAgICAgICAgICAgIHF1aXpWYWx1ZXMuaW5mby5sZXZlbDEsIC8vIDgwLTEwMCVcbiAgICAgICAgICAgICAgICBxdWl6VmFsdWVzLmluZm8ubGV2ZWwyLCAvLyA2MC03OSVcbiAgICAgICAgICAgICAgICBxdWl6VmFsdWVzLmluZm8ubGV2ZWwzLCAvLyA0MC01OSVcbiAgICAgICAgICAgICAgICBxdWl6VmFsdWVzLmluZm8ubGV2ZWw0LCAvLyAyMC0zOSVcbiAgICAgICAgICAgICAgICBxdWl6VmFsdWVzLmluZm8ubGV2ZWw1ICAvLyAwLTE5JVxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBsZXZlbFJhbmsgPSBwbHVnaW4ubWV0aG9kLmNhbGN1bGF0ZUxldmVsKHNjb3JlKSxcbiAgICAgICAgICAgICAgbGV2ZWxUZXh0ID0gJC5pc051bWVyaWMobGV2ZWxSYW5rKSA/IGxldmVsc1tsZXZlbFJhbmtdIDogJyc7XG5cbiAgICAgICAgICAkKF9xdWl6TGV2ZWwgKyAnIHNwYW4nKS5odG1sKGxldmVsVGV4dCk7XG4gICAgICAgICAgJChfcXVpekxldmVsKS5hZGRDbGFzcygnbGV2ZWwnICsgbGV2ZWxSYW5rKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRxdWl6QXJlYS5mYWRlT3V0KDMwMCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgLy8gSWYgcmVzcG9uc2UgbWVzc2FnaW5nIGlzIHNldCB0byBzaG93IHVwb24gcXVpeiBjb21wbGV0aW9uLCBzaG93IGl0IG5vd1xuICAgICAgICAgIGlmIChwbHVnaW4uY29uZmlnLmNvbXBsZXRpb25SZXNwb25zZU1lc3NhZ2luZykge1xuICAgICAgICAgICAgJChfZWxlbWVudCArICcgLmJ1dHRvbjpub3QoJyArIF90cnlBZ2FpbkJ0biArICcpLCAnICsgX2VsZW1lbnQgKyAnICcgKyBfcXVlc3Rpb25Db3VudCkuaGlkZSgpO1xuICAgICAgICAgICAgJChfZWxlbWVudCArICcgJyArIF9xdWVzdGlvbiArICcsICcgKyBfZWxlbWVudCArICcgJyArIF9hbnN3ZXJzICsgJywgJyArIF9lbGVtZW50ICsgJyAnICsgX3Jlc3BvbnNlcykuc2hvdygpO1xuICAgICAgICAgICAgJHF1aXpSZXN1bHRzLmFwcGVuZCgkKF9lbGVtZW50ICsgJyAnICsgX3F1ZXN0aW9ucykpLmZhZGVJbig1MDAsIGtOKGtleSwxKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRxdWl6UmVzdWx0cy5mYWRlSW4oNTAwLCBrTihrZXksMSkpOyAvLyAxc3Qgbm90Y2ggb24ga2V5IG11c3QgYmUgb24gYm90aCBzaWRlcyBvZiBpZi9lbHNlLCBvdGhlcndpc2Uga2V5IHdvbid0IHR1cm5cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGludGVybmFsLm1ldGhvZC50dXJuS2V5QW5kR28gKGtleSwgb3B0aW9ucyAmJiBvcHRpb25zLmNhbGxiYWNrID8gb3B0aW9ucy5jYWxsYmFjayA6IGZ1bmN0aW9uICgpIHt9KTtcblxuICAgICAgICBpZiAocGx1Z2luLmNvbmZpZy5ldmVudHMgJiZcbiAgICAgICAgICAgIHBsdWdpbi5jb25maWcuZXZlbnRzLm9uQ29tcGxldGVRdWl6KSB7XG4gICAgICAgICAgcGx1Z2luLmNvbmZpZy5ldmVudHMub25Db21wbGV0ZVF1aXouYXBwbHkgKG51bGwsIFt7XG4gICAgICAgICAgICBxdWVzdGlvbkNvdW50OiBxdWVzdGlvbkNvdW50LFxuICAgICAgICAgICAgc2NvcmU6IHNjb3JlXG4gICAgICAgICAgfV0pO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvLyBDb21wYXJlcyBzZWxlY3RlZCByZXNwb25zZXMgd2l0aCB0cnVlIGFuc3dlcnMsIHJldHVybnMgdHJ1ZSBpZiB0aGV5IG1hdGNoIGV4YWN0bHlcbiAgICAgIGNvbXBhcmVBbnN3ZXJzOiBmdW5jdGlvbih0cnVlQW5zd2Vycywgc2VsZWN0ZWRBbnN3ZXJzLCBzZWxlY3RBbnkpIHtcbiAgICAgICAgaWYgKCBzZWxlY3RBbnkgKSB7XG4gICAgICAgICAgcmV0dXJuICQuaW5BcnJheShzZWxlY3RlZEFuc3dlcnNbMF0sIHRydWVBbnN3ZXJzKSA+IC0xO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGNyYWZ0eSBhcnJheSBjb21wYXJpc29uIChodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NzI2NTA5KVxuICAgICAgICAgIHJldHVybiAoJCh0cnVlQW5zd2Vycykubm90KHNlbGVjdGVkQW5zd2VycykubGVuZ3RoID09PSAwICYmICQoc2VsZWN0ZWRBbnN3ZXJzKS5ub3QodHJ1ZUFuc3dlcnMpLmxlbmd0aCA9PT0gMCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8vIENhbGN1bGF0ZXMga25vd2xlZGdlIGxldmVsIGJhc2VkIG9uIG51bWJlciBvZiBjb3JyZWN0IGFuc3dlcnNcbiAgICAgIGNhbGN1bGF0ZUxldmVsOiBmdW5jdGlvbihjb3JyZWN0QW5zd2Vycykge1xuICAgICAgICB2YXIgcGVyY2VudCA9IChjb3JyZWN0QW5zd2VycyAvIHF1ZXN0aW9uQ291bnQpLnRvRml4ZWQoMiksXG4gICAgICAgICAgICBsZXZlbCAgID0gbnVsbDtcblxuICAgICAgICBpZiAocGx1Z2luLm1ldGhvZC5pblJhbmdlKDAsIDAuMjAsIHBlcmNlbnQpKSB7XG4gICAgICAgICAgbGV2ZWwgPSA0O1xuICAgICAgICB9IGVsc2UgaWYgKHBsdWdpbi5tZXRob2QuaW5SYW5nZSgwLjIxLCAwLjQwLCBwZXJjZW50KSkge1xuICAgICAgICAgIGxldmVsID0gMztcbiAgICAgICAgfSBlbHNlIGlmIChwbHVnaW4ubWV0aG9kLmluUmFuZ2UoMC40MSwgMC42MCwgcGVyY2VudCkpIHtcbiAgICAgICAgICBsZXZlbCA9IDI7XG4gICAgICAgIH0gZWxzZSBpZiAocGx1Z2luLm1ldGhvZC5pblJhbmdlKDAuNjEsIDAuODAsIHBlcmNlbnQpKSB7XG4gICAgICAgICAgbGV2ZWwgPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKHBsdWdpbi5tZXRob2QuaW5SYW5nZSgwLjgxLCAxLjAwLCBwZXJjZW50KSkge1xuICAgICAgICAgIGxldmVsID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsZXZlbDtcbiAgICAgIH0sXG5cbiAgICAgIC8vIERldGVybWluZXMgaWYgcGVyY2VudGFnZSBvZiBjb3JyZWN0IHZhbHVlcyBpcyB3aXRoaW4gYSBsZXZlbCByYW5nZVxuICAgICAgaW5SYW5nZTogZnVuY3Rpb24oc3RhcnQsIGVuZCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuICh2YWx1ZSA+PSBzdGFydCAmJiB2YWx1ZSA8PSBlbmQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbHVnaW4uaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gU2V0dXAgcXVpelxuICAgICAgcGx1Z2luLm1ldGhvZC5zZXR1cFF1aXouYXBwbHkgKG51bGwsIFt7Y2FsbGJhY2s6IHBsdWdpbi5jb25maWcuYW5pbWF0aW9uQ2FsbGJhY2tzLnNldHVwUXVpen1dKTtcblxuICAgICAgLy8gQmluZCBcInN0YXJ0XCIgYnV0dG9uXG4gICAgICAkcXVpelN0YXJ0ZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkICYmICEkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgcGx1Z2luLm1ldGhvZC5zdGFydFF1aXouYXBwbHkgKG51bGwsIFt7Y2FsbGJhY2s6IHBsdWdpbi5jb25maWcuYW5pbWF0aW9uQ2FsbGJhY2tzLnN0YXJ0UXVpen1dKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIEJpbmQgXCJ0cnkgYWdhaW5cIiBidXR0b25cbiAgICAgICQoX2VsZW1lbnQgKyAnICcgKyBfdHJ5QWdhaW5CdG4pLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBwbHVnaW4ubWV0aG9kLnJlc2V0UXVpeih0aGlzLCB7Y2FsbGJhY2s6IHBsdWdpbi5jb25maWcuYW5pbWF0aW9uQ2FsbGJhY2tzLnJlc2V0UXVpen0pO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIEJpbmQgXCJjaGVjayBhbnN3ZXJcIiBidXR0b25zXG4gICAgICAkKF9lbGVtZW50ICsgJyAnICsgX2NoZWNrQW5zd2VyQnRuKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcGx1Z2luLm1ldGhvZC5jaGVja0Fuc3dlcih0aGlzLCB7Y2FsbGJhY2s6IHBsdWdpbi5jb25maWcuYW5pbWF0aW9uQ2FsbGJhY2tzLmNoZWNrQW5zd2VyfSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQmluZCBcImJhY2tcIiBidXR0b25zXG4gICAgICAkKF9lbGVtZW50ICsgJyAnICsgX3ByZXZRdWVzdGlvbkJ0bikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHBsdWdpbi5tZXRob2QuYmFja1RvUXVlc3Rpb24odGhpcywge2NhbGxiYWNrOiBwbHVnaW4uY29uZmlnLmFuaW1hdGlvbkNhbGxiYWNrcy5iYWNrVG9RdWVzdGlvbn0pO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIEJpbmQgXCJuZXh0XCIgYnV0dG9uc1xuICAgICAgJChfZWxlbWVudCArICcgJyArIF9uZXh0UXVlc3Rpb25CdG4pLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBwbHVnaW4ubWV0aG9kLm5leHRRdWVzdGlvbih0aGlzLCB7Y2FsbGJhY2s6IHBsdWdpbi5jb25maWcuYW5pbWF0aW9uQ2FsbGJhY2tzLm5leHRRdWVzdGlvbn0pO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIEFjY2Vzc2liaWxpdHkgKFdBSS1BUklBKS5cbiAgICAgIHZhciBfcW5pZCA9ICRlbGVtZW50LmF0dHIoJ2lkJykgKyAnLW5hbWUnO1xuICAgICAgJHF1aXpOYW1lLmF0dHIoJ2lkJywgX3FuaWQpO1xuICAgICAgJGVsZW1lbnQuYXR0cih7XG4gICAgICAgICdhcmlhLWxhYmVsbGVkYnknOiBfcW5pZCxcbiAgICAgICAgJ2FyaWEtbGl2ZSc6ICdwb2xpdGUnLFxuICAgICAgICAnYXJpYS1yZWxldmFudCc6ICdhZGRpdGlvbnMnLFxuICAgICAgICAncm9sZSc6ICdmb3JtJ1xuICAgICAgfSk7XG4gICAgICAkKF9xdWl6U3RhcnRlciArICcsIFtocmVmID0gXCIjXCJdJykuYXR0cigncm9sZScsICdidXR0b24nKTtcbiAgICB9O1xuXG4gICAgcGx1Z2luLmluaXQoKTtcbiAgfTtcblxuICAkLmZuLnNsaWNrUXVpeiA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gJCh0aGlzKS5kYXRhKCdzbGlja1F1aXonKSkge1xuICAgICAgICB2YXIgcGx1Z2luID0gbmV3ICQuc2xpY2tRdWl6KHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICAkKHRoaXMpLmRhdGEoJ3NsaWNrUXVpeicsIHBsdWdpbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59KShqUXVlcnkpO1xuIl19
