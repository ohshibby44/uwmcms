/**
 * @file
 * Toggles classes on elements.
 *
 * Use by setting a selector and on and off states for the matched
 * elements. For example, to toggle ".on" for a list of li's,
 * and set the clicked element class to ".active", use:
 *
 * @example
 * <div class="uw-more">
 *     <a href="#"
 *      data-uwm-toggle
 *      data-on-text="{{ 'View less'|t }}"
 *      data-off-text="{{ 'View more'|t }}"
 *      data-toggle-selector=".some-class > li"
 *      data-toggle-style="on"
 *      data-parent-style="active">{{ 'View more'|t }}
 *          <i class="fa fa-angle-down" aria-hidden="true"></i>
 *          </a></div>
 *
 */

 (function ($, Drupal, drupalSettings) {

    'use strict';

    Drupal.behaviors.uwmToggleCssClass = {

        attach: function (context, settings) {

            var $toggleControl = $('[data-uwm-toggle]', context);

            $toggleControl.on('click', function (e) {

                var $this = $(this),
                    toggleTarget = $this.attr('data-toggle-target'),
                    toggleClass = $this.attr('data-toggle-class'),
                    onText = $this.attr('data-on-text'),
                    offText = $this.attr('data-off-text');


                $(toggleTarget).toggleClass(toggleClass);

                if (onText && $(toggleTarget).hasClass(toggleClass)) {

                    var h = $this.html(),
                        t = $this.text();
                    $(this).html(h.replace(t, onText));

                }
                if (offText && !$(toggleTarget).hasClass(toggleClass)) {

                    var h = $this.html(),
                        t = $this.text();
                    $(this).html(h.replace(t, offText));

                }

                e.preventDefault();

            });

        }
    };


})(jQuery, Drupal, drupalSettings);
