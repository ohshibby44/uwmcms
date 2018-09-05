'use strict';

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
        refreshInterval: 1000 * 60 * 5,
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

        attach: function attach(context, settings) {

            window.Clockwise = window.Clockwise || {};
            window.Clockwise.Waits = window.Clockwise.Waits || {};

            $('[data-uwm-clockwise-wait-time]', context).each(function () {

                var id = $(this).attr('data-uwm-clockwise-wait-time');

                if (id > 0) {

                    $(this).attr('data-uwm-clockwise-wait-time', id).attr('data-uwm-clockwise-refresh-start', new Date().toLocaleString());
                    startClockwiseRepeatingCheck(id);
                }
            });

            // ClockwiseMd.com triggers a jsonp event. When it fires,
            // update element's wait string:
            $('body').on('clockwise_waits_loaded', function (e, data) {

                var id = cleanNumber(data);
                var $elm = $('[data-uwm-clockwise-wait-time=' + id + ']');

                if ($elm.length && window.Clockwise.Waits[id] !== 'undefined') {

                    var snippet = getClockwiseWaitTime(window.Clockwise.Waits[id].toLowerCase());

                    if (snippet.length > 0) {

                        $elm.find('.wait-text').html(snippet);
                        $elm.find('.wait-link, .wait-link a').attr('href', getClockwiseWaitUri(id));
                        $elm.attr('data-uwm-clockwise-refresh-end', new Date().toLocaleString()).removeClass('fade-out invisible hidden');
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

        return 'https://www.clockwisemd.com/hospitals/' + id + '/appointments/new';
    }

    function getClockwiseWaitTime(cwResult) {

        var formattedTime = 'Please call';

        var tt = cleanNumber($(cwResult).text()),
            tp = cleanNumber(0);

        if (options.displayStyle == 'plain') {

            if (!cwResult) {
                formattedTime = 'Please call for wait-times';
            } else if (cwResult.indexOf('n/a') > -1) {
                formattedTime = 'Please call for wait-times';
            } else if (cwResult.indexOf('closed') > -1) {
                formattedTime = 'Closed';
            } else if (tt === 0) {
                formattedTime = makeHoursAndMinutes(tt);
            } else if (tt >= 0 && tp > 0) {
                formattedTime = makeHoursAndMinutes(tt) + ' - ' + makeHoursAndMinutes(tt + tp);
            } else if (tt >= 0) {
                formattedTime = makeHoursAndMinutes(tt);
            } else {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaW5pYy1jbG9ja3dpc2Utd2FpdC10aW1lcy5qcyJdLCJuYW1lcyI6WyIkIiwiRHJ1cGFsIiwib3B0aW9ucyIsInRpbWVCdWZmZXIiLCJkaXNwbGF5U3R5bGUiLCJyZWZyZXNoSW50ZXJ2YWwiLCJjbGluaWNzIiwiYmVoYXZpb3JzIiwidXdtU2hvd0Nsb2Nrd2lzZVRpbWUiLCJhdHRhY2giLCJjb250ZXh0Iiwic2V0dGluZ3MiLCJ3aW5kb3ciLCJDbG9ja3dpc2UiLCJXYWl0cyIsImVhY2giLCJpZCIsImF0dHIiLCJEYXRlIiwidG9Mb2NhbGVTdHJpbmciLCJzdGFydENsb2Nrd2lzZVJlcGVhdGluZ0NoZWNrIiwib24iLCJlIiwiZGF0YSIsImNsZWFuTnVtYmVyIiwiJGVsbSIsImxlbmd0aCIsInNuaXBwZXQiLCJnZXRDbG9ja3dpc2VXYWl0VGltZSIsInRvTG93ZXJDYXNlIiwiZmluZCIsImh0bWwiLCJnZXRDbG9ja3dpc2VXYWl0VXJpIiwicmVtb3ZlQ2xhc3MiLCJDdXJyZW50V2FpdCIsInNldFRpbWVvdXQiLCJjd1Jlc3VsdCIsImZvcm1hdHRlZFRpbWUiLCJ0dCIsInRleHQiLCJ0cCIsImluZGV4T2YiLCJtYWtlSG91cnNBbmRNaW51dGVzIiwiZ2V0Q2xvY2t3aXNlSWRCeU5hbWUiLCJzZWFyY2hXb3JkIiwiYXJyIiwic3BsaXQiLCJrIiwiZCIsInUiLCJpIiwidmFsdWUiLCJ0ZXN0IiwiTnVtYmVyIiwibWludXRlcyIsInNob3J0Rm9ybWF0IiwicmVtYWluZGVyIiwiaG91cnMiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLENBQUMsVUFBVUEsQ0FBVixFQUFhQyxNQUFiLEVBQXFCOztBQUVsQjs7QUFFQTs7OztBQUdBLFFBQUlDLFVBQVU7QUFDVkMsb0JBQVksQ0FERjtBQUVWQyxzQkFBYyxPQUZKO0FBR1ZDLHlCQUFrQixPQUFPLEVBQVAsR0FBWSxDQUhwQjtBQUlWQyxpQkFBUztBQUNMO0FBQ0E7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UUFBUSxTQUFSLEdBQW9CRCxTQUFwQixHQUFnQyxjQUF2QztBQUVIO0FBR0osQ0FyTkQsRUFxTkdFLE1Bck5ILEVBcU5XekQsTUFyTlgiLCJmaWxlIjoiY2xpbmljLWNsb2Nrd2lzZS13YWl0LXRpbWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZVxuICogU2hvd3MgdGhlIGNsaW5pYyB3YWl0LXRpbWVzLlxuICpcbiAqIEZldGNoZXMgcmVzdWx0cyBmcm9tIENsb2Nrd2lzZU1kLmNvbSBhbmQgYXBwZW5kc1xuICogYSBmb3JtYXR0ZWQgd2FpdC10aW1lIHRvIG91ciBjb250YWluZXIgdGFnLiBOb3RlXG4gKiBDbG9ja3dpc2VNZCBoYXMgaWQncyBmb3IgY2xpbmljcyB0aGF0IERydXBhbCBkb2Vzbid0XG4gKiBrbm93IGFib3V0LiBUbyB1c2UgdGhpcyBjb2RlLCBpbmNsdWRlIHRoZSBsaWJyYXJ5IGluXG4gKiB5b3VyIHRlbXBsYXRlIGFuZCBhZGQgdGhlIGF0dHJpYnV0ZSB0byBhIEhUTUwgdGFnLlxuICpcbiAqIEBleGFtcGxlXG4gKiB7eyBhdHRhY2hfbGlicmFyeSgndXdtZWQvY2xpbmljLWhvdXJzJykgfX1cbiAqIDxwIGNsYXNzPVwiaGlkZGVuZGF0YS11d20tY2xvY2t3aXNlLXdhaXQtdGltZT1cInt7IF9jbGkuY2xpbmljTmFtZSB9fVwiPjwvcD5cbiAqXG4gKlxuICovXG5cbihmdW5jdGlvbiAoJCwgRHJ1cGFsKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKipcbiAgICAgKiBNYXAgb2YgRHJ1cGFsIG5vZGVzIHRvIENsb2Nrd2lzZSBjbGluaWNzLlxuICAgICAqL1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICB0aW1lQnVmZmVyOiAwLFxuICAgICAgICBkaXNwbGF5U3R5bGU6ICdwbGFpbicsXG4gICAgICAgIHJlZnJlc2hJbnRlcnZhbDogKDEwMDAgKiA2MCAqIDUpLFxuICAgICAgICBjbGluaWNzOiBbXG4gICAgICAgICAgICAvLyB7aTogMTQ2MSwgdTogJ3JhdmVubmEnfSxcbiAgICAgICAgICAgIC8vIHtpOiAxNDYzLCB1OiAnaXNzYXF1YWgnfSxcbiAgICAgICAgICAgIC8vIHtpOiAxNDY0LCB1OiAnZmVkZXJhbCd9LFxuICAgICAgICAgICAgLy8ge2k6IDE0NjUsIHU6ICdzaG9yZWxpbmUnfSxcbiAgICAgICAgICAgIC8vIHtpOiAxNDY2LCB1OiAnYmFsbGFyZCd9LFxuICAgICAgICAgICAgLy8ge2k6IDE0NjIsIHU6ICd3b29kaW52aWxsZSd9LFxuICAgICAgICAgICAgLy8gLy8ge2k6IDE5MDksIHU6ICdmYWN0b3JpYSd9LCAvLyBObyBsb25nZXIgaGFzIFVyZ2VudCBDYXJlXG4gICAgICAgICAgICAvLyB7aTogMTkwOSwgdTogJ29seW1waWEnfVxuICAgICAgICBdXG4gICAgfTtcblxuXG4gICAgRHJ1cGFsLmJlaGF2aW9ycy51d21TaG93Q2xvY2t3aXNlVGltZSA9IHtcblxuICAgICAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0LCBzZXR0aW5ncykge1xuXG4gICAgICAgICAgICB3aW5kb3cuQ2xvY2t3aXNlID0gd2luZG93LkNsb2Nrd2lzZSB8fCB7fTtcbiAgICAgICAgICAgIHdpbmRvdy5DbG9ja3dpc2UuV2FpdHMgPSB3aW5kb3cuQ2xvY2t3aXNlLldhaXRzIHx8IHt9O1xuXG4gICAgICAgICAgICAkKCdbZGF0YS11d20tY2xvY2t3aXNlLXdhaXQtdGltZV0nLCBjb250ZXh0KS5lYWNoKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHZhciBpZCA9ICQodGhpcykuYXR0cignZGF0YS11d20tY2xvY2t3aXNlLXdhaXQtdGltZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlkID4gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignZGF0YS11d20tY2xvY2t3aXNlLXdhaXQtdGltZScsIGlkKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtdXdtLWNsb2Nrd2lzZS1yZWZyZXNoLXN0YXJ0JywgbmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRDbG9ja3dpc2VSZXBlYXRpbmdDaGVjayhpZCk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBDbG9ja3dpc2VNZC5jb20gdHJpZ2dlcnMgYSBqc29ucCBldmVudC4gV2hlbiBpdCBmaXJlcyxcbiAgICAgICAgICAgIC8vIHVwZGF0ZSBlbGVtZW50J3Mgd2FpdCBzdHJpbmc6XG4gICAgICAgICAgICAkKCdib2R5Jykub24oJ2Nsb2Nrd2lzZV93YWl0c19sb2FkZWQnLCBmdW5jdGlvbiAoZSwgZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gY2xlYW5OdW1iZXIoZGF0YSk7XG4gICAgICAgICAgICAgICAgdmFyICRlbG0gPSAkKCdbZGF0YS11d20tY2xvY2t3aXNlLXdhaXQtdGltZT0nICsgaWQgKyAnXScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRlbG0ubGVuZ3RoICYmIHdpbmRvdy5DbG9ja3dpc2UuV2FpdHNbaWRdICE9PSAndW5kZWZpbmVkJykge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzbmlwcGV0ID0gZ2V0Q2xvY2t3aXNlV2FpdFRpbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuQ2xvY2t3aXNlLldhaXRzW2lkXS50b0xvd2VyQ2FzZSgpKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc25pcHBldC5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRlbG0uZmluZCgnLndhaXQtdGV4dCcpLmh0bWwoc25pcHBldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxtLmZpbmQoJy53YWl0LWxpbmssIC53YWl0LWxpbmsgYScpLmF0dHIoJ2hyZWYnLCBnZXRDbG9ja3dpc2VXYWl0VXJpKGlkKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxtLmF0dHIoJ2RhdGEtdXdtLWNsb2Nrd2lzZS1yZWZyZXNoLWVuZCcsIG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2ZhZGUtb3V0IGludmlzaWJsZSBoaWRkZW4nKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBCZWhhdmlvciBoZWxwZXJzLlxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gc3RhcnRDbG9ja3dpc2VSZXBlYXRpbmdDaGVjayhpZCkge1xuXG4gICAgICAgIGlmICghaWQgfHwgdHlwZW9mIHdpbmRvdy5DbG9ja3dpc2UuQ3VycmVudFdhaXQgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEV4ZWN1dGUgZ2xvYmFsIENsb2NrV2lzZSBNZCBjYWxsYmFjayBmdW5jdGlvbjpcbiAgICAgICAgd2luZG93LkNsb2Nrd2lzZS5DdXJyZW50V2FpdChpZCwgJ2h0bWwnKTsgLy8gJ2pzb24nIDogJ2h0bWwnXG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzdGFydENsb2Nrd2lzZVJlcGVhdGluZ0NoZWNrKGlkKTtcbiAgICAgICAgfSwgb3B0aW9ucy5yZWZyZXNoSW50ZXJ2YWwpO1xuXG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBnZXRDbG9ja3dpc2VXYWl0VXJpKGlkKSB7XG5cbiAgICAgICAgcmV0dXJuICdodHRwczovL3d3dy5jbG9ja3dpc2VtZC5jb20vaG9zcGl0YWxzLycgK1xuICAgICAgICAgICAgaWQgKyAnL2FwcG9pbnRtZW50cy9uZXcnO1xuXG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBnZXRDbG9ja3dpc2VXYWl0VGltZShjd1Jlc3VsdCkge1xuXG4gICAgICAgIHZhciBmb3JtYXR0ZWRUaW1lID0gJ1BsZWFzZSBjYWxsJztcblxuICAgICAgICB2YXIgdHQgPSBjbGVhbk51bWJlcigkKGN3UmVzdWx0KS50ZXh0KCkpLFxuICAgICAgICAgICAgdHAgPSBjbGVhbk51bWJlcigwKTtcblxuICAgICAgICBpZiAob3B0aW9ucy5kaXNwbGF5U3R5bGUgPT0gJ3BsYWluJykge1xuXG4gICAgICAgICAgICBpZiAoIWN3UmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgZm9ybWF0dGVkVGltZSA9ICdQbGVhc2UgY2FsbCBmb3Igd2FpdC10aW1lcyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjd1Jlc3VsdC5pbmRleE9mKCduL2EnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgZm9ybWF0dGVkVGltZSA9ICdQbGVhc2UgY2FsbCBmb3Igd2FpdC10aW1lcyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjd1Jlc3VsdC5pbmRleE9mKCdjbG9zZWQnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgZm9ybWF0dGVkVGltZSA9ICdDbG9zZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHQgPT09IDApIHtcbiAgICAgICAgICAgICAgICBmb3JtYXR0ZWRUaW1lID0gbWFrZUhvdXJzQW5kTWludXRlcyh0dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0dCA+PSAwICYmIHRwID4gMCkge1xuICAgICAgICAgICAgICAgIGZvcm1hdHRlZFRpbWUgPSBtYWtlSG91cnNBbmRNaW51dGVzKHR0KSArXG4gICAgICAgICAgICAgICAgICAgICcgLSAnICsgbWFrZUhvdXJzQW5kTWludXRlcygodHQgKyB0cCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHQgPj0gMCkge1xuICAgICAgICAgICAgICAgIGZvcm1hdHRlZFRpbWUgPSBtYWtlSG91cnNBbmRNaW51dGVzKHR0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvcm1hdHRlZFRpbWUgPSAnUGxlYXNlIGNhbGwgZm9yIHdhaXQtdGltZXMnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0dGVkVGltZTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDbG9ja3dpc2VJZEJ5TmFtZShzZWFyY2hXb3JkKSB7XG5cbiAgICAgICAgdmFyIGFyciA9IHNlYXJjaFdvcmQudG9Mb3dlckNhc2UoKS5zcGxpdCgnICcpO1xuXG4gICAgICAgIGZvciAodmFyIGsgaW4gb3B0aW9ucy5jbGluaWNzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBkIGluIGFycikge1xuICAgICAgICAgICAgICAgIGlmIChhcnJbZF0uaW5kZXhPZihvcHRpb25zLmNsaW5pY3Nba10udSkgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5jbGluaWNzW2tdLmk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhbk51bWJlcih2YWx1ZSkge1xuXG4gICAgICAgIGlmICgvXihcXC18XFwrKT8oWzAtOV0rfEluZmluaXR5KSQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VIb3Vyc0FuZE1pbnV0ZXMobWludXRlcywgc2hvcnRGb3JtYXQpIHtcblxuICAgICAgICB2YXIgbWludXRlcyA9IGNsZWFuTnVtYmVyKG1pbnV0ZXMpLFxuICAgICAgICAgICAgcmVtYWluZGVyID0gY2xlYW5OdW1iZXIobWludXRlcyAlIDYwKSxcbiAgICAgICAgICAgIGhvdXJzID0gKG1pbnV0ZXMgLSByZW1haW5kZXIpIC8gNjA7XG5cbiAgICAgICAgLy8gNDUgbWluc1xuICAgICAgICBpZiAobWludXRlcyA8IDYwKSB7XG4gICAgICAgICAgICBpZiAoc2hvcnRGb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWludXRlcyArICcgbWlucyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWludXRlcyArICcgbWludXRlIHdhaXQnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gMSBoclxuICAgICAgICBpZiAobWludXRlcyA9PT0gNjApIHtcbiAgICAgICAgICAgIGlmIChzaG9ydEZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnMSBocic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJzEgaG91cic7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAxIGhyIDQ1IG1pbnNcbiAgICAgICAgaWYgKG1pbnV0ZXMgPiA2MCAmJiBtaW51dGVzIDwgMTIwKSB7XG4gICAgICAgICAgICBpZiAoc2hvcnRGb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaG91cnMgKyAnIGhyICcgKyByZW1haW5kZXIgKyAnIG1pbnMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhvdXJzICsgJyBob3VyICcgKyByZW1haW5kZXIgKyAnIG1pbnV0ZSB3YWl0JztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDQgaHJzXG4gICAgICAgIGlmIChtaW51dGVzID4gNjAgJiYgcmVtYWluZGVyID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoc2hvcnRGb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaG91cnMgKyAnIGhycyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaG91cnMgKyAnIGhvdXJzJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDIgaHJzIDI1IG1pbnNcbiAgICAgICAgaWYgKHNob3J0Rm9ybWF0KSB7XG4gICAgICAgICAgICByZXR1cm4gaG91cnMgKyAnIGhycyAnICsgcmVtYWluZGVyICsgJyBtaW5zJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaG91cnMgKyAnIGhvdXJzICcgKyByZW1haW5kZXIgKyAnIG1pbnV0ZSB3YWl0JztcblxuICAgIH1cblxuXG59KShqUXVlcnksIERydXBhbCk7XG5cblxuXG4iXX0=
