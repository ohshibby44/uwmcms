/**
 * @file
 * Shows the clinic wait-times.
 *
 * Fetches results from ClockwiseMd.com and appends
 * a formatted wait-time to our container tag. Note
 * ClockwiseMd has id's for clinics that Drupal doesn't
 * know about. To use this code, include the library in
 * your template and add the attribute to a HTML tag.
 *
 * @example
 * {{ attach_library('uwmed/clinic-hours') }}
 * <p class="hiddendata-uwm-clockwise-wait-time="{{ _cli.clinicName }}"></p>
 *
 *
 */

(function ($, Drupal) {

    'use strict';

    /**
     * Map of Drupal nodes to Clockwise clinics.
     */
    var options = {
        timeBuffer: 0,
        displayStyle: 'plain',
        refreshInterval: (1000 * 60 * 5),
        clinics: [
            // {i: 1461, u: 'ravenna'},
            // {i: 1463, u: 'issaquah'},
            // {i: 1464, u: 'federal'},
            // {i: 1465, u: 'shoreline'},
            // {i: 1466, u: 'ballard'},
            // {i: 1462, u: 'woodinville'},
            // // {i: 1909, u: 'factoria'}, // No longer has Urgent Care
            // {i: 1909, u: 'olympia'}
        ]
    };


    Drupal.behaviors.uwmShowClockwiseTime = {

        attach: function (context, settings) {

            window.Clockwise = window.Clockwise || {};
            window.Clockwise.Waits = window.Clockwise.Waits || {};

            $('[data-uwm-clockwise-wait-time]', context).each(function () {

                var id = $(this).attr('data-uwm-clockwise-wait-time');

                if (id > 0) {

                    $(this).attr('data-uwm-clockwise-wait-time', id)
                        .attr('data-uwm-clockwise-refresh-start', new Date().toLocaleString());
                    startClockwiseRepeatingCheck(id);

                }

            });

            // ClockwiseMd.com triggers a jsonp event. When it fires,
            // update element's wait string:
            $('body').on('clockwise_waits_loaded', function (e, data) {

                var id = cleanNumber(data);
                var $elm = $('[data-uwm-clockwise-wait-time=' + id + ']');

                if ($elm.length && window.Clockwise.Waits[id] !== 'undefined') {

                    var snippet = getClockwiseWaitTime(
                        window.Clockwise.Waits[id].toLowerCase());

                    if (snippet.length > 0) {

                        $elm.find('.wait-text').html(snippet);
                        $elm.find('a').attr('href', getClockwiseWaitUri(id));
                        $elm.attr('data-uwm-clockwise-refresh-end', new Date().toLocaleString())
                            .removeClass('fade-out invisible hidden');

                    }


                }


            });

        }

    };


    /**
     * Behavior helpers.
     */

    function startClockwiseRepeatingCheck(id) {

        if (!id || typeof window.Clockwise.CurrentWait !== 'function') {
            return;
        }

        // Execute global ClockWise Md callback function:
        window.Clockwise.CurrentWait(id, 'html'); // 'json' : 'html'

        setTimeout(function () {
            startClockwiseRepeatingCheck(id);
        }, options.refreshInterval);

    }


    function getClockwiseWaitUri(id) {

        return 'https://www.clockwisemd.com/hospitals/' +
            id + '/appointments/new';

    }


    function getClockwiseWaitTime(cwResult) {

        var formattedTime = 'Please call';

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

    function getClockwiseIdByName(searchWord) {

        var arr = searchWord.toLowerCase().split(' ');

        for (var k in options.clinics) {
            for (var d in arr) {
                if (arr[d].indexOf(options.clinics[k].u) > -1) {
                    return options.clinics[k].i;
                }
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
            return minutes + ' minute wait';
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
            return hours + ' hour ' + remainder + ' minute wait';
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
        return hours + ' hours ' + remainder + ' minute wait';

    }


})(jQuery, Drupal);



