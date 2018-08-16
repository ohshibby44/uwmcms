(function ($, Drupal) {
  Drupal.behaviors.medicalServices = {
    attach: function() {
      // trigger main tab when user clicks on find a location overview, then jump
      $('div.medical-service-hero__links-with-icon__desktop a[href="#find-a-location-jump"]').off().click(function (e) {
        e.preventDefault();
        var href = "#approach";

        $('.nav-tabs a[href="' + href + '"]').trigger('click');
        window.setTimeout("window.location.href = '#find-a-location-jump';", 250);
      });

      $('a#approach-tab')
        .on('shown.bs.tab', function () {
          $('#condition-spotlight').show()
        })
        .on('hide.bs.tab', function () {
          $('#condition-spotlight').hide()
        });

    }
  }
})(jQuery, Drupal);