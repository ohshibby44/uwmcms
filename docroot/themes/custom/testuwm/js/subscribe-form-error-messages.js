/**
 * @file
 * Check for URL Parameters from ExactTarget and display an appropriate error
 * message if needed.
 */
  (function ($, Drupal) {
    Drupal.behaviors.testuwmSubscribeFormErrorMessage = {
      attach: function (context, settings) {

        function getUrlParameter(name) {
          name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
          var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
          var results = regex.exec(location.search);
          return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }

        var errorCode = getUrlParameter("errorcode");
        var errorControl = getUrlParameter("errorcontrol");
        var strError = "";

        switch (errorCode) {
          case "1" :
            strError = "An error has occurred while attempting to save your subscriber information. Please try again. If you see this error multiple times, please <a href='/contactus'>contact us</a>. We apologize for the inconvenience.";
            break;
          case "2" :
            strError = "The list provided does not exist. Please <a href='/contactus'>contact us</a> to alert us of this error. We apologize for the inconvenience.";
            break;
          case "3" :
            strError = "Information was not provided for the " + errorControl + " field, which is mandatory. Please try again.";
            break;
          case "4" :
            strError = "Invalid information was provided for the " + errorControl + " field. Please try again.";
            break;
          case "5" :
            strError = "Information provided is not unique for the " + errorControl + " field. Please <a href='/contactus'>contact us</a> to alert us of this error. We apologize for the inconvenience.";
            break;
          case "6" :
            strError = "An error has occurred while attempting to save your subscriber information. Please try again.";
            break;
          case "7" :
            strError = "An error has occurred while attempting to save your subscriber information. Please try again.";
            break;
          case "8" :
            strError = "You are already subscribed! Thank you!";
            break;
          case "9" :
            strError = "An error has occurred while attempting to save your subscriber information. Please try again.";
            break;
          case "10" :
            strError = "An error has occurred while attempting to save your subscriber information. Please try again.";
            break;
          case "12" :
            strError = "Unfortunately, you are on our master unsubscribe list or the global unsubscribe list. Please <a href='/contactus'>contact us</a> if you would like to re-subscribe. We apologize for the inconvenience.";
            break;
        }
        if (strError !== "") {
          $("#testuwmEmailSubscribeErrorMessage").removeClass("hidden").
          addClass("alert alert-danger").
          attr("role", "alert").
          html("<p><strong>There was a problem with your submission</strong>: " + strError + "</p>");
        }
      }
    }
  })(jQuery, Drupal);
