/**
 * @file
 * Opens any link in a Colorbox modal.
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

            var doModalContent = function () {

                $.colorbox({
                    inline: true,
                    width: '50%'
                });

            };

            var doModalVideo = function ($modalContent) {

                $.colorbox(
                    {
                        inline: true,
                        width: '75%',
                        height: 'auto',
                        href: target,
                        scrolling: false,
                        onOpen: function () {
                            $('.page-node-type-homepage .homepage-section__story-link .faa-burst.animated').css('animation-play-state', 'paused');
                            video.focus();
                        },
                        onClosed: function () {
                            $('.page-node-type-homepage .homepage-section__story-link .faa-burst.animated').css('animation-play-state', 'running');
                        },
                        onComplete: function () {
                            video.play();
                        },
                        onCleanup: function () {
                            video.pause();
                        }
                    }
                );

            };

            var doModalIframe = function () {

                $.colorbox({
                    iframe: true,
                    width: '80%',
                    height: '80%'
                });

            };


            $('a.colorbox').on('click', function (e) {


                var target = $(this).attr('href');


                e.preventDefault();


            });


        }
    };


})(jQuery, Drupal, drupalSettings);
