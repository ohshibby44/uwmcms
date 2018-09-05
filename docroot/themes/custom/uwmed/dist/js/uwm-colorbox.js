'use strict';

/**
 * @file
 * Opens any link in a Colorbox modal.
 *
 *
 */

(function ($, Drupal, drupalSettings) {

    'use strict';

    Drupal.behaviors.uwmColorboxLinks = {

        attach: function attach(context, settings) {

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

                var $this = $(this),
                    $target = $(),
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
                var touchEvents = 'ontouchstart' in document.documentElement;

                if ($video.length < 1) {

                    return;
                }

                if (touchEvents && !!window.screenfull && !!window.screenfull.enabled) {

                    doScreenfullVideo($video);
                } else if (touchEvents && typeof $video[0].webkitEnterFullscreen === 'function') {

                    doWebkitFullScreen($video);
                } else {

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
                    width: '75%',
                    closeButton: true
                });
            }

            function doModalIframe($link) {

                $link.colorbox({
                    iframe: true,
                    width: '90%',
                    height: '80%',
                    closeButton: true
                });
            }

            function doModalVideo($link, $video) {

                $link.colorbox({
                    inline: true,
                    width: 'auto',
                    height: 'auto',
                    scrolling: false,
                    onOpen: function onOpen() {
                        $link.css('animation-play-state', 'paused');
                        $video[0].focus();
                    },
                    onClosed: function onClosed() {
                        $link.css('animation-play-state', 'running');
                    },
                    onComplete: function onComplete() {
                        $video[0].play();
                    },
                    onCleanup: function onCleanup() {
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
                        $.colorbox.resize({ width: '100%' });
                    }
                }

                $(window).resize(fitWidth);
                $(document).bind('cbox_complete', fitWidth);
            }

            function setCleanup() {

                function unsetFocus() {
                    $(window).trigger('focus').trigger('blur');
                }

                $(document).bind('cbox_closed', unsetFocus);
            }
        }
    };
})(jQuery, Drupal, drupalSettings);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV3bS1jb2xvcmJveC5qcyJdLCJuYW1lcyI6WyIkIiwiRHJ1cGFsIiwiZHJ1cGFsU2V0dGluZ3MiLCJiZWhhdmlvcnMiLCJ1d21Db2xvcmJveExpbmtzIiwiYXR0YWNoIiwiY29udGV4dCIsInNldHRpbmdzIiwib24iLCJoYW5kbGVDb2xvcmJveCIsImUiLCIkdGhpcyIsIiR0YXJnZXQiLCJocmVmIiwiYXR0ciIsImNvbG9yYm94RnVuY3Rpb24iLCJkb01vZGFsSWZyYW1lIiwiaW5kZXhPZiIsInNldFJlc2l6ZSIsImRvTW9kYWxJbmxpbmUiLCJzdWJzdHIiLCJsZW5ndGgiLCJpcyIsImhhbmRsZU1vdmllIiwic2V0Q2xlYW51cCIsIiRsaW5rIiwiJGNvbnRhaW5lciIsIiR2aWRlbyIsImZpbmQiLCJ0b3VjaEV2ZW50cyIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50Iiwid2luZG93Iiwic2NyZWVuZnVsbCIsImVuYWJsZWQiLCJkb1NjcmVlbmZ1bGxWaWRlbyIsIndlYmtpdEVudGVyRnVsbHNjcmVlbiIsImRvV2Via2l0RnVsbFNjcmVlbiIsImRvTW9kYWxWaWRlbyIsImNvbG9yYm94IiwiaW5saW5lIiwid2lkdGgiLCJjbG9zZUJ1dHRvbiIsImlmcmFtZSIsImhlaWdodCIsInNjcm9sbGluZyIsIm9uT3BlbiIsImNzcyIsImZvY3VzIiwib25DbG9zZWQiLCJvbkNvbXBsZXRlIiwicGxheSIsIm9uQ2xlYW51cCIsInBhdXNlIiwiJG5vSGlkZVZpZGVvIiwiY2xvbmUiLCJhcHBlbmQiLCJyZXF1ZXN0IiwiaXNGdWxsc2NyZWVuIiwicmVtb3ZlIiwiY2xvc2UiLCJmaXRXaWR0aCIsImlubmVyV2lkdGgiLCJyZXNpemUiLCJiaW5kIiwidW5zZXRGb2N1cyIsInRyaWdnZXIiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFPQSxDQUFDLFVBQVVBLENBQVYsRUFBYUMsTUFBYixFQUFxQkMsY0FBckIsRUFBcUM7O0FBRWxDOztBQUVBRCxX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Qix3QkFBSTdCLE9BQU84QixVQUFQLEdBQW9CLEdBQXhCLEVBQTZCO0FBQ3pCOUQsMEJBQUV1QyxRQUFGLENBQVd3QixNQUFYLENBQWtCLEVBQUN0QixPQUFPLE1BQVIsRUFBbEI7QUFDSDtBQUNKOztBQUVEekMsa0JBQUVnQyxNQUFGLEVBQVUrQixNQUFWLENBQWlCRixRQUFqQjtBQUNBN0Qsa0JBQUU4QixRQUFGLEVBQVlrQyxJQUFaLENBQWlCLGVBQWpCLEVBQWtDSCxRQUFsQztBQUNIOztBQUdELHFCQUFTckMsVUFBVCxHQUFzQjs7QUFFbEIseUJBQVN5QyxVQUFULEdBQXNCO0FBQ2xCakUsc0JBQUVnQyxNQUFGLEVBQVVrQyxPQUFWLENBQWtCLE9BQWxCLEVBQTJCQSxPQUEzQixDQUFtQyxNQUFuQztBQUNIOztBQUVEbEUsa0JBQUU4QixRQUFGLEVBQVlrQyxJQUFaLENBQWlCLGFBQWpCLEVBQWdDQyxVQUFoQztBQUNIO0FBRUo7QUE5TStCLEtBQXBDO0FBa05ILENBdE5ELEVBc05HRSxNQXROSCxFQXNOV2xFLE1BdE5YLEVBc05tQkMsY0F0Tm5CIiwiZmlsZSI6InV3bS1jb2xvcmJveC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIE9wZW5zIGFueSBsaW5rIGluIGEgQ29sb3Jib3ggbW9kYWwuXG4gKlxuICpcbiAqL1xuXG4oZnVuY3Rpb24gKCQsIERydXBhbCwgZHJ1cGFsU2V0dGluZ3MpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIERydXBhbC5iZWhhdmlvcnMudXdtQ29sb3Jib3hMaW5rcyA9IHtcblxuICAgICAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0LCBzZXR0aW5ncykge1xuXG5cbiAgICAgICAgICAgIC8vIENvbG9yYm94IGNsYXNzIGxpbmtzXG4gICAgICAgICAgICAkKCdhLmNvbG9yYm94Jykub24oJ2NsaWNrJywgaGFuZGxlQ29sb3Jib3gpO1xuXG4gICAgICAgICAgICAvLyBJbi1wYWdlIGNhbGwtdG8tYWN0aW9uIGxpbmtzXG4gICAgICAgICAgICAkKCcuZmllbGQtLW5hbWUtZmllbGQtbGluayBhW2hyZWZePVwiI1wiXScpLm9uKCdjbGljaycsIGhhbmRsZUNvbG9yYm94KTtcblxuXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIFNldCBDb2xvcmJveCBzdHlsZSBhbmQgYXR0YWNoIHRvIGxpbmtzLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVDb2xvcmJveChlKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLCAkdGFyZ2V0ID0gJCgpLFxuICAgICAgICAgICAgICAgICAgICBocmVmID0gJHRoaXMuYXR0cignaHJlZicpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yYm94RnVuY3Rpb24gPSBkb01vZGFsSWZyYW1lO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhyZWYuaW5kZXhPZignaHR0cCcpID09PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29sb3Jib3hGdW5jdGlvbiA9IGRvTW9kYWxJZnJhbWU7XG4gICAgICAgICAgICAgICAgICAgIHNldFJlc2l6ZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChocmVmLmluZGV4T2YoJyMnKSA9PT0gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yYm94RnVuY3Rpb24gPSBkb01vZGFsSW5saW5lO1xuICAgICAgICAgICAgICAgICAgICAkdGFyZ2V0ID0gJCgnIycgKyBocmVmLnN1YnN0cigxKSk7XG4gICAgICAgICAgICAgICAgICAgIHNldFJlc2l6ZSgpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCR0YXJnZXQubGVuZ3RoID4gMCAmJiAkdGFyZ2V0LmlzKCd2aWRlbycpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29sb3Jib3hGdW5jdGlvbiA9IGhhbmRsZU1vdmllO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29sb3Jib3hGdW5jdGlvbigkdGhpcywgJHRhcmdldCk7XG4gICAgICAgICAgICAgICAgc2V0Q2xlYW51cCgpO1xuXG4gICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBTZXQgdmlkZW8gcGxheWVyIGZvciBkZXNrdG9wLCBBbmRyb2lkIG9yIGlPUy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVNb3ZpZSgkbGluaywgJGNvbnRhaW5lcikge1xuXG4gICAgICAgICAgICAgICAgdmFyICR2aWRlbyA9ICRjb250YWluZXIuaXMoJ3ZpZGVvJykgPyAkY29udGFpbmVyIDogJGNvbnRhaW5lci5maW5kKCd2aWRlbycpO1xuICAgICAgICAgICAgICAgIHZhciB0b3VjaEV2ZW50cyA9ICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCR2aWRlby5sZW5ndGggPCAxKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0b3VjaEV2ZW50cyAmJiAhIXdpbmRvdy5zY3JlZW5mdWxsICYmICEhd2luZG93LnNjcmVlbmZ1bGwuZW5hYmxlZCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGRvU2NyZWVuZnVsbFZpZGVvKCR2aWRlbyk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodG91Y2hFdmVudHMgJiYgdHlwZW9mICgkdmlkZW9bMF0ud2Via2l0RW50ZXJGdWxsc2NyZWVuKSA9PT0gJ2Z1bmN0aW9uJykge1xuXG4gICAgICAgICAgICAgICAgICAgIGRvV2Via2l0RnVsbFNjcmVlbigkdmlkZW8pO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGRvTW9kYWxWaWRlbygkbGluaywgJHZpZGVvKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIERpZmZlcmVudCBDb2xvcmJveCBtb2RhbCBzdHlsZXM6XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gZG9Nb2RhbElubGluZSgkbGluaykge1xuXG4gICAgICAgICAgICAgICAgJGxpbmsuY29sb3Jib3goe1xuICAgICAgICAgICAgICAgICAgICBpbmxpbmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnNzUlJyxcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VCdXR0b246IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRvTW9kYWxJZnJhbWUoJGxpbmspIHtcblxuICAgICAgICAgICAgICAgICRsaW5rLmNvbG9yYm94KHtcbiAgICAgICAgICAgICAgICAgICAgaWZyYW1lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzkwJScsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzgwJScsXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlQnV0dG9uOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBmdW5jdGlvbiBkb01vZGFsVmlkZW8oJGxpbmssICR2aWRlbykge1xuXG4gICAgICAgICAgICAgICAgJGxpbmsuY29sb3Jib3goe1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5saW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICdhdXRvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJ2F1dG8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uT3BlbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsaW5rLmNzcygnYW5pbWF0aW9uLXBsYXktc3RhdGUnLCAncGF1c2VkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHZpZGVvWzBdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbGluay5jc3MoJ2FuaW1hdGlvbi1wbGF5LXN0YXRlJywgJ3J1bm5pbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHZpZGVvWzBdLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsZWFudXA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdmlkZW9bMF0ucGF1c2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBmdW5jdGlvbiBkb1NjcmVlbmZ1bGxWaWRlbygkdmlkZW8pIHtcblxuICAgICAgICAgICAgICAgIC8vIHdlIGNhbiBwbGF5IGZ1bGwgc2NyZWVuIGFuZCB0aGlzIGRldmljZSBoYXMgdG91Y2ggZXZlbnRzLCBsaWtlbHkgYSBtb2JpbGVcbiAgICAgICAgICAgICAgICB2YXIgJG5vSGlkZVZpZGVvID0gJHZpZGVvLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgJCgnaHRtbCcpLmFwcGVuZCgkbm9IaWRlVmlkZW8pO1xuXG4gICAgICAgICAgICAgICAgd2luZG93LnNjcmVlbmZ1bGwucmVxdWVzdCgkbm9IaWRlVmlkZW9bMF0pO1xuICAgICAgICAgICAgICAgICRub0hpZGVWaWRlb1swXS5wbGF5KCk7XG5cbiAgICAgICAgICAgICAgICB3aW5kb3cuc2NyZWVuZnVsbC5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXdpbmRvdy5zY3JlZW5mdWxsLmlzRnVsbHNjcmVlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJG5vSGlkZVZpZGVvWzBdLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbm9IaWRlVmlkZW8ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmNvbG9yYm94LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBmdW5jdGlvbiBkb1dlYmtpdEZ1bGxTY3JlZW4oJHZpZGVvKSB7XG5cbiAgICAgICAgICAgICAgICAvLyB3ZSBjYW4gcGxheSBmdWxsIHNjcmVlbiBhbmQgdGhpcyBkZXZpY2UgaGFzIHRvdWNoIGV2ZW50cywgbGlrZWx5IGEgbW9iaWxlXG4gICAgICAgICAgICAgICAgLy8gc29tZSBpT1MgZGV2aWNlcyBhcmUgbm90IGNvdmVyZWQgYnkgc2NyZWVuZnVsbFxuICAgICAgICAgICAgICAgICR2aWRlb1swXS53ZWJraXRFbnRlckZ1bGxzY3JlZW4oKTtcbiAgICAgICAgICAgICAgICAkdmlkZW9bMF0ucGxheSgpO1xuXG4gICAgICAgICAgICAgICAgJHZpZGVvLm9uKCd3ZWJraXRlbmRmdWxsc2NyZWVuJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkdmlkZW9bMF0ucGF1c2UoKTtcbiAgICAgICAgICAgICAgICAgICAgJC5jb2xvcmJveC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG5cblxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBPdGhlciBIZWxwZXJzLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldFJlc2l6ZSgpIHtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZpdFdpZHRoKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCA5MDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQuY29sb3Jib3gucmVzaXplKHt3aWR0aDogJzEwMCUnfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGZpdFdpZHRoKTtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50KS5iaW5kKCdjYm94X2NvbXBsZXRlJywgZml0V2lkdGgpO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldENsZWFudXAoKSB7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB1bnNldEZvY3VzKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignZm9jdXMnKS50cmlnZ2VyKCdibHVyJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudCkuYmluZCgnY2JveF9jbG9zZWQnLCB1bnNldEZvY3VzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfTtcblxuXG59KShqUXVlcnksIERydXBhbCwgZHJ1cGFsU2V0dGluZ3MpO1xuIl19
