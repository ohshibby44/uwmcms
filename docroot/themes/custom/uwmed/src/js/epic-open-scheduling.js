var o = (function () {

  'use strict';

  return {

    drupal_unhide_selectors: ['div#some-dom-element-id', '.if-open-scheduling', '.paragraph#ppg-1166', '#ecare-iframe-0'],
    transform_provider_link_selectors: ['a[href="#provider-open-scheduling-link"]'],
    os_provider_iframe: 'https://ecare.uwmedicine.org/mychartprod01/OpenScheduling/SignupAndSchedule/EmbeddedSchedule?id=2059652&vt=9000&view=plain',

    os_enabled_providers: [
      {
        EOS_Id: 2089024,
        NPI: 1639626880,
        Name: 'Linda Whittlesey',
        Slug: '/bios/linda-whittlesey'
      },
      {
        EOS_Id: 505181,
        NPI: 1306267885,
        Name: 'Laura Montour',
        Slug: '/bios/laura-montour'
      },
      {
        EOS_Id: 505877,
        NPI: 1144236753,
        Name: 'Tiffany Snyder',
        Slug: '/bios/tiffany-snyder'
      },
      {
        EOS_Id: 508611,
        NPI: 1720180219,
        Name: 'Quratel Cheema',
        Slug: '/bios/quratul-cheema'
      },
      {
        EOS_Id: 2079273,
        NPI: 1952606477,
        Name: 'Mark Damberg',
        Slug: '/bios/mark-damberg'
      },
      {
        EOS_Id: 2089021,
        NPI: 1689047714,
        Name: 'Emily Ryan',
        Slug: '/bios/emily-ryan'
      },
      {
        EOS_Id: 504479,
        NPI: 1225353063,
        Name: 'Sonia Bhatti',
        Slug: '/bios/sona-bhatti'
      },
      {
        EOS_Id: 253780,
        NPI: 1659451631,
        Name: 'Michelle Vierra',
        Slug: '/bios/michelle-vierra'
      },
      {
        EOS_Id: 308520,
        NPI: 1144359209,
        Name: 'Seema Diddee',
        Slug: '/bios/seema-diddee'
      },
      {
        EOS_Id: 500600,
        NPI: 1245659788,
        Name: 'Jessie Wang',
        Slug: '/bios/jessie-wang'
      },
      {
        EOS_Id: 508925,
        NPI: 1770954653,
        Name: 'Amy Ly',
        Slug: '/bios/amy-ly'
      },
      {
        EOS_Id: 2059652,
        NPI: 1811132178,
        Name: 'Kerry Meyer',
        Slug: '/bios/kerry-meyer'
      },
      {
        EOS_Id: 373240,
        NPI: 1417091802,
        Name: 'Yunyu Cao',
        Slug: '/bios/yunyu-cao'
      },
      {
        EOS_Id: 468498,
        NPI: 1073504007,
        Name: 'Pamela Pentin',
        Slug: '/bios/pamela-pentin'
      },
      {
        EOS_Id: 503893,
        NPI: 1174866354,
        Name: 'David Siebert',
        Slug: '/bios/david-siebert'
      },
      {
        EOS_Id: 505126,
        NPI: 1063845006,
        Name: 'Emily Hilderman',
        Slug: '/bios/emily-hilderman'
      },
      {
        EOS_Id: 508325,
        NPI: 1992740518,
        Name: 'Ian Bennett',
        Slug: '/bios/ian-bennett'
      },
      {
        EOS_Id: 508496,
        NPI: 1083935803,
        Name: 'Tomoko Sairenji',
        Slug: '/bios/tomoko-sairenji'
      },
      {
        EOS_Id: 511260,
        NPI: 1851555866,
        Name: 'Morhaf Al Achkar',
        Slug: '/bios/morhaf-al-achkar'
      },
      {
        EOS_Id: 511519,
        NPI: 1366438947,
        Name: 'James. Paul',
        Slug: '/bios/paul-james'
      },
      {
        EOS_Id: 2081432,
        NPI: 1124131784,
        Name: 'Grace Shih',
        Slug: '/bios/grace-shih'
      }
    ]
  };


})();


(function ($, Drupal, drupalSettings) {

  'use strict';

  Drupal.behaviors.enableEpicOpenSchedule = {

    attach: function (context, settings) {

      transformProviderLinks();

    }

  };

  function transformProviderLinks() {
    if (testVariableAssignments()) {
      var opts = window.uwm_epic_open_scheduling_options;
      var providerSlug = document.referrer.replace(document.location.origin, '');
      var providerMatch = findObjectItem(opts.os_enabled_providers, providerSlug);


      if (!!providerMatch) {
        var providerHref = formatProviderUrl(providerMatch.EOS_Id, opts.os_provider_iframe);
        var providerName = providerMatch.Name;

        if (!!providerHref) {
          $.each(opts.transform_provider_link_selectors, function (a, b) {

            var $this = $(b);
            // Found element to transform href:
            if ($this.length) {
              $this.attr('href', providerHref);
              $this.removeClass('hidden').addClass('uwm-os-matched');
            }

            if (!!providerName && $this.hasClass(opts.append_provider_name_class)) {
              $this.append(" with " + providerName);
            }
          });

          $('body').addClass('open-scheduling-enabled');
        }

      }

    } else {
      setTimeout(transformProviderLinks, 100);
    }
  }

  function transformProviderIFrameSources() {
    if (testVariableAssignments()) {
      var opts = window.uwm_epic_open_scheduling_options;
      var providerSlug = document.referrer.replace(document.location.origin, '');
      var providerMatch = findObjectItem(opts.os_enabled_providers, providerSlug);
      var providerHref = formatProviderUrl(providerMatch.EOS_Id, opts.os_provider_iframe);

      if (!!providerMatch && !!providerHref) {

        $.each(opts.drupal_unhide_selectors, function (a, b) {

          var $this = $(b);
          // Found element to unhide:
          if ($this.length) {

            var $iframe = $this.find('iframe');

            // Found iframe to reformat:
            if ($iframe.length) {

              $iframe.attr('src', providerHref);
            }

            $this.removeClass('hidden').addClass('uwm-os-matched');
          }

        });

        $('body').addClass('open-scheduling-enabled');
      }
    } else {
      setTimeout(transformProviderIFrameSources, 100);
    }
  }

  function testVariableAssignments() {
    if (!!window.uwm_epic_open_scheduling_options
        && !!window.uwm_epic_open_scheduling_options.os_enabled_providers
        && !!window.uwm_epic_open_scheduling_options.os_enabled_providers[0]
        && !!window.uwm_epic_open_scheduling_options.os_enabled_providers[0].Slug
    ) {
      return true;
    }
  }

  function findObjectItem(arr, s) {
    var i, key;
    for (i = arr.length; i--;) {
      for (key in arr[i]) {
        if (arr[i].hasOwnProperty(key)
            && typeof arr[i][key] === 'string'
            && arr[i][key] === s) {
          return arr[i];
        }
      }
    }
  }

  function formatProviderUrl(providerId, defaultUrl) {
    var idParam = 'id=' + providerId;
    return '' + defaultUrl.replace(/(id=)[^&]+/, idParam);
  }

})(jQuery, Drupal, drupalSettings);

/** *
 From: Phillip Hull <phull@uw.edu>
 Sent: Thursday, April 5, 2018 2:49 PM
 To: wolfkate; Heather Bennett; Brian Tofte-Schumacher; Lance McGuire; Mary M. Pearce
 Cc: John N Meyer; Chithra Nair
 Subject: RE: Three requests for Open Scheduling Impelmentation

 Hi Brian,



 Here is the URL for our POC environment where the rebranding has been put in. Please review the color scheme to confirm this matches the color scheme of your site.

 https://devecare16.medical.washington.edu/mychartpoc/openscheduling





 Here is the URL for our TST environment where we will be doing the UAT testing. However the rebranding will not be applied to this environment until Thursday afternoon once it goes through our approval committee.

 https://testecare16.medical.washington.edu/mycharttst/openscheduling





 Here is the URL for our PRD environment where we will have the button linked to:

 https://ecare.uwmedicine.org/mychartprod01/openscheduling







 For TST, the endpoint URL for UAT is https://testecare16.medical.washington.edu/mycharttst/OpenScheduling/SignupAndSchedule/EmbeddedSchedule?id=2059652&vt=9000&view=plain for that particular provider and visit type.



 For PRD, the URL will be: https://ecare.uwmedicine.org/mychartprod01/OpenScheduling/SignupAndSchedule/EmbeddedSchedule?id=2059652&vt=9000&view=plain







 Let me know if you have any questions!



 Thanks,



 Phil



 Fro

 ***/
