/**
 * @file
 * Custom global JavaScript for UW Medicine.
 */

(function ($, Drupal) {


    Drupal.behaviors.uwmRedirectExternalLinks = {

        attach: function (context, settings) {

            var linkSelectors = [
                'body.page-node-type-uwm-provider div.main-container article.uwm-provider aside .block-views-blockcontent-spotlights-block-1 a'
            ].join(',');

            $(linkSelectors).each(function (a, b) {

                var $this = $(b);
                if (isExternal($this.attr('href'))) {
                    $this.attr("target", "_blank");
                }

            });

            function checkDomain (url) {
                if (url.indexOf('//') === 0) {
                    url = location.protocol + url;
                }
                return url.toLowerCase().replace(/([a-z])?:\/\//, '$1').split('/')[0];
            }

            function isExternal(url) {
                return ( ( url.indexOf(':') > -1 || url.indexOf('//') > -1 ) && checkDomain(location.href) !== checkDomain(url) );
            }

        }

    };


})(jQuery, Drupal);
