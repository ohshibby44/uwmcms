/**
 * @file
 * jQuery Validation for email subscribe form.
 */

(function ($, Drupal) {
  Drupal.behaviors.chewSubscribeFormValidation = {
    attach: function (context, settings) {
      $("#chewEmailSubscribeForm").validate({
        rules: {
          "First Name": {
            required: true
          },
          "Last Name": {
            required: true
          },
          "Email Address": {
            required: true,
            email: true
          }
        },
        messages: {
          "First Name": {
            required: "Please enter your first name."
          },
          "Last Name": {
            required: "Please enter your last name."
          },
          "Email Address": {
            required: "Please enter your email address.",
            email: "Please enter a valid email address."
          }
        },
        errorClass: "text-danger"
      });
    }
  };
})(jQuery, Drupal);