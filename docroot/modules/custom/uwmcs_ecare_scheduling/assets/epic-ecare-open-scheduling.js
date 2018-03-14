/**
 * @file
 * Adds link for online scheduling.
 *
 * Utilizes scripts and iframe from MyChart‘s open scheduling widget.
 * If finding tag in bio's Information Manager content, adds widget.
 *
 * "Third-Party Open Scheduling Widget Integration MyChart August 25, 2015"
 *
 *
 */

(function ($, Drupal) {

    'use strict';

    Drupal.behaviors.addEcareTool = {

        attach: function (context, settings) {

            $elm = $('[oid]');
            if ($elm.length > 0) {

                var openSheduleId = $elm.attr('oid');


                $elm = $('[oid]');

                if ($elm.length > 0) {

                    var openSheduleId = $elm.attr('oid');

                    var $a = $('<a class="ecare-fancybox" style="float:right; padding-right:10px;" href="#openSchedulingFrame"><div data-background-icon="" class="tile-contact tile-openscheduling"><p class="title">Book now?</p><p class="description" style="font-weight:normal; line-height: 1.75em;">Schedule appointments online </p></div></a>');

                    var css = '<link href="https://devecare16.medical.washington.edu/mychartpoc/Content/EmbeddedWidget.css"';
                    css += ' rel="stylesheet" type="text/css">';

                    var div = '<div id="scheduleContainer" class="hidden"><div class="wrapper">';
                    div += '<iframe id="openSchedulingFrame" class="widgetframe" style="overflow:hidden; overflow-x:hidden; overflow-y:hidden;" frameBorder="0" scrolling="no"';
                    div += 'src="https://devecare16.medical.washington.edu/mychartpoc/OpenScheduling/SignupAndSchedule/EmbeddedSchedule';
                    div += '?id='+ openSheduleId +'&vt=9000&view=plain">';
                    div += '</iframe></div></div>';

                    $.getScript(
                        "https://devecare16.medical.washington.edu/mychartpoc/Content/EmbeddedWidgetController.js", function() {

                            $a.fancybox({
                                'autoScale': true, 'autoDimensions': true, 'centerOnScroll': true, 'padding': 0
                            });

                            $elm.html(css + div);
//$elm.prepend($a);
                            $('h1[itemprop]').append($a);

                            var EWC = new EmbeddedWidgetController({
                                hostname: "https://devecare16.medical.washington.edu/mychartpoc",
                                matchMediaString: "(max-width: 747px)", showToggleBtn: true
                            });

                        });

        }
    };


})(jQuery, Drupal);
