/**
 * Scripting for clinic-type nodes.
 */


(function ($, Drupal, drupalSettings) {

    'use strict';

    Drupal.behaviors.uwmToggleCssClass = {

        attach: function (context, settings) {

            var $toggleControl = $('[data-uwm-toggle]', context);

            $toggleControl.on('click', function (e) {

                var $this = $(this);

                var toggleSelector = $this.attr('data-toggle-selector');
                var toggleStyle = $this.attr('data-toggle-style');
                var parentSelector = $this.attr('data-parent-selector');
                var parentStyle = $this.attr('data-parent-style');
                var onText = $this.attr('data-on-text');
                var offText = $this.attr('data-off-text');


                if ($this.hasClass(parentStyle)) {
                    $this.removeClass(parentStyle);
                    $(toggleSelector).addClass(toggleStyle);
                    $(parentSelector).removeClass(parentStyle);
                    $(this).children().first().text(onText);
                }
                else {
                    $this.addClass(parentStyle);
                    // We remove the style on first run
                    $(toggleSelector).removeClass(toggleStyle);
                    $(parentSelector).addClass(parentStyle);
                    $(this).children().first().text(offText);
                }

                e.preventDefault();

            });

        }
    };


})(jQuery, Drupal, drupalSettings);