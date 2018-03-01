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

                var $this = $(this);

                var toggleSelector = $this.attr('data-toggle-selector');
                var toggleStyle = $this.attr('data-toggle-style');
                var parentSelector = $this.attr('data-parent-selector');
                var parentStyle = $this.attr('data-parent-style');
                var onText = $this.attr('data-on-text');
                var offText = $this.attr('data-off-text');


                if ($this.hasClass(parentStyle)) {
                    $this.removeClass(parentStyle);
                    $(toggleSelector).removeClass(toggleStyle);
                    $(parentSelector).removeClass(parentStyle);
                    $(this).html($(this).html().replace(onText, offText));
                }
                else {
                    $this.addClass(parentStyle);
                    // We remove the style on first run
                    $(toggleSelector).addClass(toggleStyle);
                    $(this).html($(this).html().replace(offText, onText));
                }

                e.preventDefault();

            });

        }
    };


})(jQuery, Drupal, drupalSettings);
