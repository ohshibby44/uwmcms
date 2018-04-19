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



            /**
             *
             * Set Colorbox style and attach to links.
             *
             *
             *
             */
            function handleColorbox(e) {

                var $this = $(this), $target = $(),
                    href = $this.attr('href');

                var colorboxFunction = doModalIframe;

                if (href.indexOf('http') === 0) {

                    colorboxFunction = doModalIframe;
                    setResize();
                }

                if (href.indexOf('#') === 0) {

                    colorboxFunction = doModalInline;
                    $target = $('#' + href.substr(1));
                    setResize();

                }

                if ($target.length > 0 && $target.is('video')) {

                    colorboxFunction = handleMovie;

                }

                colorboxFunction($this, $target);
                setCleanup();

            }



            /**
             *
             * Set video player for desktop, Android or iOS.
             *
             *
             */
            function handleMovie($link, $container) {

                var $video = $container.is('video') ? $container : $container.find('video');
                var touchEvents = ('ontouchstart' in document.documentElement);

                if ($video.length < 1) {

                    return;
                }

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
                    width: '75%'
                });

            }


            function doModalIframe($link) {

                $link.colorbox({
                    iframe: true,
                    width: '90%',
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
                var $noHideVideo = $video.clone();
                $('html').append($noHideVideo);

                window.screenfull.request($noHideVideo[0]);
                $noHideVideo[0].play();

                window.screenfull.on('change', function () {
                    if (!window.screenfull.isFullscreen) {
                        $noHideVideo[0].pause();
                        $noHideVideo.remove();
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




            /**
             *
             * Other Helpers.
             *
             *
             */
            function setResize() {

                function fitWidth() {
                    if (window.innerWidth < 900) {
                        $.colorbox.resize({width: '100%'});
                    }
                }

                $(window).resize(fitWidth);
                $(document).bind('cbox_complete', fitWidth);
            }


            function setCleanup() {

                function unsetFocus() {
                    $(window).trigger('focus');
                }

                $(document).bind('cbox_closed', unsetFocus);
            }

        }
    };


})(jQuery, Drupal, drupalSettings);
