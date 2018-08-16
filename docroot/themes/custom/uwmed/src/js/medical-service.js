(function ($, Drupal) {
  Drupal.behaviors.medicalServices = {
    attach: function() {
      $('.find-a-location__content a[href^="#"]').click(function () {
        var href = $(this).attr('href').slice(0, -4);
        $('.nav-tabs a[href="' + href + '"]').trigger('click');
      });

      // add a hash to the URL when the user clicks on a tab
      // $('a[data-toggle="tab"]').on('click', function(e) {
      //   history.pushState(null, "hello", $(this).attr('href'));
      // });

      // navigate to a tab when the history changes
      // window.addEventListener("popstate", function(e) {
      //   var activeTab = $('[href="' + location.hash + '"]');
      //   if (activeTab.length) {
      //     activeTab.tab('show');
      //   }
      // });

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