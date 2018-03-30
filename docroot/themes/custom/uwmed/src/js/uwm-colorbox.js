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

                var $this = $(this), $target = $(),
                    href = $this.attr('href');

                //
                //
                // Choose best Colorbox style:
                //
                var colorboxFunction = doModalIframe;

                if (href.indexOf('http') === 0) {

                    colorboxFunction = doModalIframe;
                }

                if (href.indexOf('#') === 0) {

                    colorboxFunction = doModalInline;
                    $target = $('#' + href.substr(1));

                }

                if ($target.length > 0 && $target.is('video')) {

                    colorboxFunction = handleMovie;

                }


                colorboxFunction($this, $target);

            }


            function handleMovie($link, $container) {

                var $video = $container.is('video') ? $container : $container.find('video');
                var touchEvents = ('ontouchstart' in document.documentElement);

                if ($video.length < 1) {

                    return;
                }


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

                $link.colorbox({
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
                            $video[0].pause();
                        }
                    });

            }


            function doScreenfullVideo($video) {

                // we can play full screen and this device has touch events, likely a mobile
                var $visibleVideo = $video.clone();
                $('html').append($visibleVideo);

                window.screenfull.request($visibleVideo[0]);
                $visibleVideo[0].play();

                window.screenfull.on('change', function () {
                    if (!window.screenfull.isFullscreen) {
                        $visibleVideo[0].pause();
                        $visibleVideo.remove();
                        $.colorbox.close();
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
                    $.colorbox.close();
                });
            }


        }
    };


})(jQuery, Drupal, drupalSettings);
