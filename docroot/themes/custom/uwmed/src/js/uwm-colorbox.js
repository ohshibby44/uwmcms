/**
 * @file
 * Opens any link in a Colorbox modal.
 *
 *
 */

(function ($, Drupal, drupalSettings) {

    'use strict';

    Drupal.behaviors.uwmColorboxLinks = {

        attach: function (context, settings) {


            // Colorbox class links
            $('a.colorbox').on('click', handleColorbox);
            // In-page call-to-action links
            $('.field--name-field-link a[href^="#"]').on('click', handleColorbox);


            function handleColorbox(e) {

                var colorboxFunction = doModalIframe,
                    $this = $(this), $target = null,
                    href = $this.attr('href');

                //
                //
                // Choose best Colorbox style:
                //
                if (href.indexOf('http') === 0) {
                    colorboxFunction = doModalIframe;
                }

                if (href.indexOf('#') === 0) {

                    colorboxFunction = doModalInline;
                    $target = $('#' + href.substr(1));

                }

                if (href.indexOf('#') === 0 && $target.is('video') || $target.hasClass('colorbox-video')) {

                    colorboxFunction = handleVideo;

                }


                colorboxFunction($this, $target);

            }


            function handleVideo($link, $target) {

                var $video = $target.is('video') ? $target : $target.find('video');
                var touchEvents = ('ontouchstart' in document.documentElement);

                //
                //
                // Choose phone, tablet or default:
                //
                if (touchEvents && !!window.screenfull && !!window.screenfull.enabled) {

                    doScreenfullVideo($video);

                }
                else if (touchEvents && typeof ($video[0].webkitEnterFullscreen) === 'function') {

                    doWebkitFullScreen($video);

                }
                else {

                    doModalVideo($link, $video);
                }


            }


            /**
             *
             * Different Colorbox modal styles:
             *
             *
             */

            function doModalInline($link) {

                $link.colorbox({
                    inline: true,
                    width: '50%'
                });

            }


            function doModalIframe($link) {

                $link.colorbox({
                    iframe: true,
                    width: '80%',
                    height: '80%'
                });

            }


            function doModalVideo($link, $video) {

                $link.colorbox(
                    {
                        inline: true,
                        width: 'auto',
                        height: 'auto',
                        scrolling: false,
                        onOpen: function () {
                            $link.css('animation-play-state', 'paused');
                            $video[0].focus();
                        },
                        onClosed: function () {
                            $link.css('animation-play-state', 'running');
                        },
                        onComplete: function () {
                            $video[0].play();
                        },
                        onCleanup: function () {
                            // $video[0].pause();
                        }
                    }
                );

            }


            function doScreenfullVideo($video) {

                // we can play full screen and this device has touch events, likely a mobile
                window.screenfull.request($video[0]);
                $video[0].play();

                window.screenfull.on('change', function () {
                    if (!window.screenfull.isFullscreen) {
                        $video[0].pause();
                    }
                });
            }


            function doWebkitFullScreen($video) {

                // we can play full screen and this device has touch events, likely a mobile
                // some iOS devices are not covered by screenfull
                $video[0].webkitEnterFullscreen();
                $video[0].play();

                $video.on('webkitendfullscreen', function () {
                    $video[0].pause();
                });
            }


        }
    };


})(jQuery, Drupal, drupalSettings);
