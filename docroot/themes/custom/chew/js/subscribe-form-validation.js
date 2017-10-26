/**
 * @file
 * jQuery Validation for email subscribe form.
 */

(function ($, Drupal) {
  Drupal.behaviors.chewSubscribeFormValidation = {
    attach: function (context, settings) {
      $("#chewEmailSubscribeForm").validate({
        rules: {
          firstName: {
            required: true
          },
          lastName: {
            required: true
          },
          emailAddress: {
            required: true,
            email: true
          }
        },
        messages: {
          firstName: {
            required: "Please enter your first name."
          },
          lastName: {
            required: "Please enter your last name."
          },
          emailAddress: {
            required: "Please enter your email address.",
            email: "Please enter a valid email address."
          }
        },
        errorClass: "text-danger"
      });
    }
  };
})(jQuery, Drupal);