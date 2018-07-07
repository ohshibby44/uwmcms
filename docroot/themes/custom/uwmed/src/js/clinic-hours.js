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
        var markup = hoursMarkup(data, $this.is('data-show-brief'));

        $this.html(markup);

      });

    }

  };

  function hoursMarkup(data, showBrief) {

    var now = moment().format('X');
    var opens = now > data.closes ? data.opensNext : data.opens;
    var closes = now > data.closes ? data.closesNext : data.closes;
    var markup = '';

    // Opens later:
    if (now < opens) {

      markup = '<em><strong>Closed - </strong> Opens %day at %time</em>'.tx(
        moment.unix(opens).toNow('ddd'),
        moment.unix(opens).toNow('hh:mm a')
      );

    }
    // Opens soon:
    if (now < opens && now + 3600 > opens) {

      markup = '<em><strong>Opens soon - </strong> %time</em>'.tx(
        moment.unix(opens).toNow('hh:mm a')
      );

    }
    // Open now
    if (now > opens && now < closes) {

      markup = '<em><strong>Open - </strong> Closes at %time</em>'.tx(
        moment.unix(closes).toNow('hh:mm a')
      );

    }
    // Closes soon: 
    else if (now > opens && now < closes && now + 3600 > closes) {

      markup = '<em><strong>Closes soon</strong> %time</em>'.tx(
        moment.unix(closes).toNow()
      );

    }

    return markup;

  }


  String.prototype.format = tx() {
    var a = this,
      b;
    for (b in arguments) {
      a = a.replace(/%[a-z]/, arguments[b]);
    }
    return a; // Make chainable
  };


})(jQuery, Drupal, drupalSettings);
