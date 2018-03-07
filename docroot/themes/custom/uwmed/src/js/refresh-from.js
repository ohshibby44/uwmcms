/**
 * @file
 * Refreshes an element from AJAX callback.
 *
 * Used to fetch non-cached, fresh version of div (or any element)
 * from another page. An example is below, where we refresh contents of
 * the "test-example-123" by replacing it from the same div found
 * at "/views/no-cache-content/123".
 *==-
 * @example
 * <div data-uwm-refresh-from=
 *      "/views/no-cache-content/123"
 *      data-uwm-refresh-id="test-example-123">abc
 * </div>
 *
 */

(function ($, Drupal, drupalSettings) {

    'use strict';

    Drupal.behaviors.uwmRefreshElementFrom = {

        attach: function (context, settings) {

            var $elm = $('[data-uwm-refresh-from]', context);

            $elm.each(function (a, b) {

                var $this = $(b);
                var refreshFromUri = $this.attr('data-uwm-refresh-from');
                var refreshSelectorMatch = $this.attr('data-uwm-refresh-id');
                $this.attr('data-uwm-refresh-start', new Date().toLocaleString());

                $.get(refreshFromUri, function (data) {

                    var $target = $('[data-uwm-refresh-id=' + refreshSelectorMatch + ']', document);
                    var $replacement = $('[data-uwm-refresh-id=' + refreshSelectorMatch + ']', data);

                    if ($replacement.length > 0) {
                        $target.html($replacement.html())
                            .removeClass('fade-out hidden')
                            .attr('data-uwm-refresh-end', new Date().toLocaleString());

                    }


                });


            });


        }
    };


})(jQuery, Drupal, drupalSettings);
