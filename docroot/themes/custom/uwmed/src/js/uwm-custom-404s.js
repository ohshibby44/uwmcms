(function ($, Drupal, drupalSettings) {

    'use strict';

    Drupal.behaviors.uwmRedirect404s = {

        attach: function (context, settings) {

            var secondsLeft = 4;
            var prodPage = 'https://uwmedicine.org' + window.location.pathname;
            var isDev = window.location.href.indexOf('https://cms') === 0;

            if (isDev) {

                $('.region-content').append('<div class="alert alert-success">' +
                    '<p>The page <code>' + window.location.pathname + '</code> could not be found on CMS.' +
                    'Redirecting to <a href="'+ prodPage +'">WWW</a> in <code class="seconds">0</code> seconds.</div>');

            }


        }
    };


    function countdown() {
        var secondsLeft = secondsLeft - 1;
        if (secondsLeft < 0) window.location = prodPage;
        else $seconds.text(secondsLeft) && window.setTimeout("countdown()", 1000);
    }


})(jQuery, Drupal, drupalSettings);
