(function ($, Drupal) {
  Drupal.behaviors.medicalServices = {
    attach: function() {
      // trigger main tab when user clicks on find a location overview, then jump
      $('a[href="#find-a-location-jump"]').click(function (e) {
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