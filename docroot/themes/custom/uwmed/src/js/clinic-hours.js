/**
 * Scripting for clinic-type nodes.
 */


(function($, Drupal, drupalSettings) {

  'use strict';


  Drupal.behaviors.showCurrentHours = {

    attach: function(context, settings) {

      var $elm = $('[data-uwm-opens-at]', context);

      $elm.each(function(a, b) {

        var $this = $(b);
        var data = $this.data('uwm-opens-at');
        var markup = hoursMarkup(data, $this.is('[data-show-brief]'));

        $this.html(markup);

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
    var markup = '';

    // Opens later:
    if (now < opens) {

      if (showBrief) {
        markup = uwf(
          '<em><strong>Closed - </strong> Opens {1} at {2}</em>',
          moment.unix(opens).format('ddd'),
          moment.unix(opens).format('h:mm')
        );
      } else {
        markup = uwf(
          '<em><strong>Closed - </strong> Opens {1} at {2}</em>',
          moment.unix(opens).format('dddd'),
          moment.unix(opens).format('h:mm a')
        );
      }

    }
    // Opens soon:
    if (now < opens && now + 3600 > opens) {

      markup = uwf(
        '<em><strong>Opens soon - </strong> {1}</em>',
        moment.unix(opens).toNow()
      );

    }
    // Open now
    if (now > opens && now < closes) {

      markup = uwf(
        '<em><strong>Open - </strong> Closes at {1}</em>',
        moment.unix(closes).format('h:mm a')
      );

    }
    // Closes soon: 
    else if (now > opens && now < closes && now + 3600 > closes) {

      markup = uwf(
        '<em><strong>Closes soon</strong> {0}</em>',
        moment.unix(closes).toNow()
      );

    }

    return markup;

  }




})(jQuery, Drupal, drupalSettings);
