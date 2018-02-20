(function ($, Drupal) {

    /**
     * Show a clinic wait-times after getting a
     * time result from ClockwiseMd.com.
     *
     */
    Drupal.behaviors.uwmShowClockwiseTime = {

        attach: function (context, settings) {

            var $widgetBlock = $('article.uwm-clinic .get-in-line');
            if ($widgetBlock.length && clinicClockwiseId() > 0) {

                $.getScript('https://www.clockwisemd.com/hospitals/clockwise_api.js', function () {
                    startClockwiseRepeatingCheck();
                });

                // When clockwisemd.com JSONP fires, update our page wait-time:
                $('body').off('clockwise_waits_loaded')
                    .on('clockwise_waits_loaded', function () {

                        $widgetBlock.find('p.wait').html(getFormattedClockwiseTime());
                        $widgetBlock.find('h4 a').attr('href', 'https://www.clockwisemd.com/hospitals/' +
                            clinicClockwiseId() + '/appointments/new');
                        $widgetBlock.fadeIn();

                    });
            }
        }
    };

    /**
     * Map of Drupal nodes to Clockwise clinics.
     */
    var options = {

        timeBuffer: 0,
        displayStyle: 'plain',
        refreshInterval: (1000 * 60 * 5),
        clinics: [
            {i: 1461, u: 'primary-care-ravenna'},
            {i: 1463, u: 'primary-care-issaquah'},
            {i: 1464, u: 'primary-care-federal-way'},
            {i: 1465, u: 'primary-care-shoreline'},
            {i: 1466, u: 'primary-care-ballard'},
            {i: 1462, u: 'primary-care-woodinville'}
            //{0: 'factoria'},
            //{0: 'olympia'}
        ]
    };


    /**
     * Behavior helpers.
     */
    function startClockwiseRepeatingCheck() {

        // Execute global ClockWise Md callback function:
        Clockwise.CurrentWait(clinicClockwiseId(), 'html'); // 'json' : 'html'

        setTimeout(function () {

            startClockwiseRepeatingCheck();

        }, options.refreshInterval);

    }


    function getFormattedClockwiseTime(e, id) {

        var formattedTime = 'Please call';

        var cwResult = Clockwise.Waits[clinicClockwiseId()].toLowerCase();
        var tt = cleanNumber($(cwResult).text()),
            tp = cleanNumber(0);

        if (options.displayStyle == 'plain') {

            if (!cwResult) {
                formattedTime = 'Please call for wait-times';
            }
            else if (cwResult.indexOf('n/a') > -1) {
                formattedTime = 'Please call for wait-times';
            }
            else if (cwResult.indexOf('closed') > -1) {
                formattedTime = 'Closed';
            }
            else if (tt === 0) {
                formattedTime = makeHoursAndMinutes(tt);
            }
            else if (tt >= 0 && tp > 0) {
                formattedTime = makeHoursAndMinutes(tt) +
                    ' - ' + makeHoursAndMinutes((tt + tp));
            }
            else if (tt >= 0) {
                formattedTime = makeHoursAndMinutes(tt);
            }
            else {
                formattedTime = 'Please call for wait-times';
            }

            return formattedTime;

        }

    }

    function clinicClockwiseId() {

        var url = window.location.href.toLowerCase();

        for (var k in options.clinics) {
            if (url.indexOf(options.clinics[k].u) > 0) {
                return options.clinics[k].i;
            }
        }

    }

    function cleanNumber(value) {

        if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) {
            return Number(value);
        }
        return 0;

    }

    function makeHoursAndMinutes(minutes, shortFormat) {

        var minutes = cleanNumber(minutes),
            remainder = cleanNumber(minutes % 60),
            hours = (minutes - remainder) / 60;

        // 45 mins
        if (minutes < 60) {
            if (shortFormat) {
                return minutes + ' mins';
            }
            return minutes + ' minutes wait';
        }

        // 1 hr
        if (minutes === 60) {
            if (shortFormat) {
                return '1 hr';
            }
            return '1 hour';
        }

        // 1 hr 45 mins
        if (minutes > 60 && minutes < 120) {
            if (shortFormat) {
                return hours + ' hr ' + remainder + ' mins';
            }
            return hours + ' hour ' + remainder + ' minutes wait';
        }

        // 4 hrs
        if (minutes > 60 && remainder === 0) {
            if (shortFormat) {
                return hours + ' hrs';
            }
            return hours + ' hours';
        }

        // 2 hrs 25 mins
        if (shortFormat) {
            return hours + ' hrs ' + remainder + ' mins';
        }
        return hours + ' hours ' + remainder + ' minutes wait';

    }


})(jQuery, Drupal);



