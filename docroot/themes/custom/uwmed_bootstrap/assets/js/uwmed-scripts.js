/**
 * @file
 * A JavaScript file for the theme.
 */

(function ($, Drupal, window, document) {

  'use strict';

  Drupal.behaviors.uwmed_custom = {
    attach: function (context, settings) {
      // Only fire on document load.
      if (typeof context['location'] !== 'undefined') {
        // Mobile Nav / Search Toggle.
        $(".header-button").on("click", function () {
          $(this).toggleClass('active');
        });
        $('.carousel').carousel({
          pause: true,
          interval: false
        });
        // Calendar datepicker.
        $('#edit-submit-uwm-events').unbind('click');
        $('.dpbar-cal').click(function (e) {
          e.preventDefault();
          $('#dpbar-dpui').datepicker({
            dateFormat: 'yy-mm-dd',
            onClose: function () {
              if ($('#dpbar-dpui').val()) {
                $('#edit-date').val($('#dpbar-dpui').val());
                $('#views-exposed-form-uwm-events-page-events-main, #views-exposed-form-uwm-events-page-events-subpages').submit();
              }
            }
          });
          $('#dpbar-dpui').datepicker('show');
        });
        // Article Sidebar height.
        var sidebar_height = $('.article-sidebar').height();
        var article_sections_height = $('.article.full .field--name-field-sections').height();
        if (sidebar_height > article_sections_height) {
          $('.article.full .field--name-field-sections').height(sidebar_height);
        }
        // Article Featured H1 hover effect for image.
        $('.article.featured header').hover(
          function () {
            $('.article.featured .image-overlay').addClass('overlay-hover');
          },
          function () {
            $('.article.featured .image-overlay').removeClass('overlay-hover');
          }
        );
        $('.article.featured .image-overlay').hover(
          function () {
            $('.article.featured header h1 a').addClass('hover-over');
          },
          function () {
            $('.article.featured header h1 a').removeClass('hover-over');
          }
        );
        // Article Teaser H2 hover effect for image.
        $('.article.teaser').hover(
          function () {
            $('header h2 a', this).addClass('hover-over');
            $('.image-overlay', this).addClass('overlay-hover');
          },
          function () {
            $('header h2 a', this).removeClass('hover-over');
            $('.image-overlay', this).removeClass('overlay-hover');
          }
        );
        // Gallery Featured H1 hover effect for image.
        $('.gallery.featured-content-2 header').hover(
          function () {
            $('.gallery.featured-content-2 .image-overlay').addClass('overlay-hover');
          },
          function () {
            $('.gallery.featured-content-2 .image-overlay').removeClass('overlay-hover');
          }
        );
        $('.gallery.featured-content-2 .image-overlay').hover(
          function () {
            $('.gallery.featured-content-2 header h1 a').addClass('hover-over');
          },
          function () {
            $('.gallery.featured-content-2 header h1 a').removeClass('hover-over');
          }
        );
        // Gallery Teaser H2 hover effect for image.
        $('.gallery.teaser').hover(
          function () {
            $('header h2 a', this).addClass('hover-over');
            $('.image-overlay, .video-overlay', this).addClass('overlay-hover');
          },
          function () {
            $('header h2 a', this).removeClass('hover-over');
            $('.image-overlay, .video-overlay', this).removeClass('overlay-hover');
          }
        );
        // Bookshelf H1 hover effect for image.
        $('.bookshelf.featured header').hover(
          function () {
            $('.bookshelf.featured .image-overlay').addClass('overlay-hover');
          },
          function () {
            $('.bookshelf.featured .image-overlay').removeClass('overlay-hover');
          }
        );
        $('.bookshelf.featured .image-overlay').hover(
          function () {
            $('.bookshelf.featured header h1 a').addClass('hover-over');
          },
          function () {
            $('.bookshelf.featured header h1 a').removeClass('hover-over');
          }
        );
        // Article Teaser H2 hover effect for image.
        $('.bookshelf.teaser').hover(
          function () {
            $('header h2 a', this).addClass('hover-over');
            $('.image-overlay', this).addClass('overlay-hover');
          },
          function () {
            $('header h2 a', this).removeClass('hover-over');
            $('.image-overlay', this).removeClass('overlay-hover');
          }
        );
      }
    }
  };
})(jQuery, Drupal, this, this.document);
