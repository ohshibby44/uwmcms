/**
 * @file
 * Homepage parallax for UW Medicine.
 */

(function ($, Drupal) {
   // init
    var controller = new ScrollMagic.Controller({
      globalSceneOptions: {
        triggerHook: 'onLeave'
      }
    });

  // get all slides
    var slides = document.querySelectorAll("section.homepage-section");

    // create scene for every slide
    for (var i = 0; i < slides.length; i++) {
      new ScrollMagic.Scene({
        triggerElement: slides[i],
        reverse: false,
        offset: -350
      })
          .addTo(controller)
          .on("start", function(e) {
            e.currentTarget.triggerElement().className += " animation-applied";
          })
    }
  
})(jQuery, Drupal);