/**
 * Scripting for clinic-type nodes.
 */


(function ($, Drupal, drupalSettings) {

    'use strict';


    Drupal.behaviors.showCurrentHours = {

        attach: function (context, settings) {

            var $elm = $('[data-uwm-opens-at]', context);

            $elm.each(function (a, b) {

                var $this = $(b);
                var data = $this.data('uwm-opens-at');
                var markup = hoursMarkup(data, $this.is('[data-show-brief]'));

                $this.find('em').html(markup);

            });

        }

    };


    function uwf() {

        var s = arguments[0],
            i = arguments.length;

        while (i--) {
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
        }
        return s;

    }


    function hoursMarkup(data, showBrief) {

        var now = moment().format('X') * 1;
        var opens = now > data.closes ? data.nextOpens : data.opens;
        var closes = now > data.closes ? data.nextCloses : data.closes;
        var dayToday = moment().format('dddd');
        var dayOpens = moment.unix(opens).format('dddd');

        var markup = '';

        // Opens later:
        if (now < opens) {

            if (showBrief) {
                markup = uwf('<strong>Closed -</strong> Opens {1} at {2}',
                    moment.unix(opens).format('ddd'),
                    moment.unix(opens).format('h:mm')
                );
            } else {
                markup = uwf('<strong>Closed:</strong> Opens {1} at {2}',
                    moment.unix(opens).format('dddd'),
                    moment.unix(opens).format('h:mm a')
                );
            }

        }

        // Opens today:
        if (now < opens && dayOpens === dayToday && showBrief) {

            markup = uwf('<strong>Closed -</strong> Opens today at {1}',
                moment.unix(opens).format('h:mm')
            );

        }
        // Opens soon:
        if (now < opens && now + 3600 > opens) {

            if (showBrief) {
                markup = uwf('<strong>Opens soon -</strong> {1}',
                    moment.unix(opens).toNow()
                );
            } else {
                markup = uwf('<strong>Opens soon:</strong> <em>{1} - {2}</em>',
                    moment.unix(opens).format('h:mm a'),
                    moment.unix(closes).format('h:mm a')
                );
            }

        }
        // Open now:
        if (now > opens && now < closes) {

            if (showBrief) {
                markup = uwf('<strong>Open -</strong> Closes at {1}',
                    moment.unix(closes).format('h:mm a')
                );
            }
            else {
                markup = uwf('<strong>Open now:</strong> <em>Closes at {1}</em>',
                    moment.unix(closes).format('h:mm a')
                );

            }

        }
        // Closes soon:
        else if (now > opens && now < closes && now + 3600 > closes) {

            if (showBrief) {
                markup = uwf('<strong>Closes soon -</strong> {0}',
                    moment.unix(closes).toNow()
                );
            }
            else {
                markup = uwf('<strong>Closes soon: </strong> <em>{0}</em>',
                    moment.unix(closes).toNow()
                );
            }

        }

        return markup;

    }


})(jQuery, Drupal, drupalSettings);
