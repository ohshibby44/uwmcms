'use strict';

/**
 * @file
 * Custom global JavaScript for UW Medicine.
 */

(function ($, Drupal) {

    Drupal.behaviors.uwmRedirectExternalLinks = {

        attach: function attach(context, settings) {

            var linkSelectors = ['body.page-node-type-uwm-provider div.main-container article.uwm-provider aside .block-views-blockcontent-spotlights-block-1 a'].join(',');

            $(linkSelectors).each(function (a, b) {

                var $this = $(b);
                if (isExternal($this.attr('href'))) {
                    $this.attr("target", "_blank");
                }
            });

            function checkDomain(url) {
                if (url.indexOf('//') === 0) {
                    url = location.protocol + url;
                }
                return url.toLowerCase().replace(/([a-z])?:\/\//, '$1').split('/')[0];
            }

            function isExternal(url) {
                return (url.indexOf(':') > -1 || url.indexOf('//') > -1) && checkDomain(location.href) !== checkDomain(url);
            }
        }

    };
})(jQuery, Drupal);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdsb2JhbC5qcyJdLCJuYW1lcyI6WyIkIiwiRHJ1cGFsIiwiYmVoYXZpb3JzIiwidXdtUmVkaXJlY3RFeHRlcm5hbExpbmtzIiwiYXR0YWNoIiwiY29udGV4dCIsInNldHRpbmdzIiwibGlua1NlbGVjdG9ycyIsImpvaW4iLCJlYWNoIiwiYSIsImIiLCIkdGhpcyIsImlzRXh0ZXJuYWwiLCJhdHRyIiwiY2hlY2tEb21haW4iLCJ1cmwiLCJpbmRleE9mIiwibG9jYXRpb24iLCJwcm90b2NvbCIsInRvTG93ZXJDYXNlIiwicmVwbGFjZSIsInNwbGl0IiwiaHJlZiIsImpRdWVyeSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7QUFLQSxDQUFDLFVBQVVBLENBQVYsRUFBYUMsTUFBYixFQUFxQjs7QUFHbEJBLFdBQU9DLFNBQVAsQ0FBaUJDLHdCQUFqQixHQUE0Qzs7QUFFeENDLGdCQUFRLGdCQUFVQyxPQUFWLEVBQW1CQyxRQUFuQixFQUE2Qjs7QUFFakMsZ0JBQUlDLGdCQUFnQixDQUNoQiwrSEFEZ0IsRUFFbEJDLElBRmtCLENBRWIsR0FGYSxDQUFwQjs7QUFJQVIsY0FBRU8sYUFBRixFQUFpQkUsSUFBakIsQ0FBc0IsVUFBVUMsQ0FBVixFQUFhQyxDQUFiLEVBQWdCOztBQUVsQyxvQkFBSUMsUUFBUVosRUFBRVcsQ0FBRixDQUFaO0FBQ0Esb0JBQUlFLFdBQVdELE1BQU1FLElBQU4sQ0FBVyxNQUFYLENBQVgsQ0FBSixFQUFvQztBQUNoQ0YsMEJBQU1FLElBQU4sQ0FBVyxRQUFYLEVBQXFCLFFBQXJCO0FBQ0g7QUFFSixhQVBEOztBQVNBLHFCQUFTQyxXQUFULENBQXNCQyxHQUF0QixFQUEyQjtBQUN2QixvQkFBSUEsSUFBSUMsT0FBSixDQUFZLElBQVosTUFBc0IsQ0FBMUIsRUFBNkI7QUFDekJELDBCQUFNRSxTQUFTQyxRQUFULEdBQW9CSCxHQUExQjtBQUNIO0FBQ0QsdUJBQU9BLElBQUlJLFdBQUosR0FBa0JDLE9BQWxCLENBQTBCLGVBQTFCLEVBQTJDLElBQTNDLEVBQWlEQyxLQUFqRCxDQUF1RCxHQUF2RCxFQUE0RCxDQUE1RCxDQUFQO0FBQ0g7O0FBRUQscUJBQVNULFVBQVQsQ0FBb0JHLEdBQXBCLEVBQXlCO0FBQ3JCLHVCQUFTLENBQUVBLElBQUlDLE9BQUosQ0FBWSxHQUFaLElBQW1CLENBQUMsQ0FBcEIsSUFBeUJELElBQUlDLE9BQUosQ0FBWSxJQUFaLElBQW9CLENBQUMsQ0FBaEQsS0FBdURGLFlBQVlHLFNBQVNLLElBQXJCLE1BQStCUixZQUFZQyxHQUFaLENBQS9GO0FBQ0g7QUFFSjs7QUE1QnVDLEtBQTVDO0FBaUNILENBcENELEVBb0NHUSxNQXBDSCxFQW9DV3ZCLE1BcENYIiwiZmlsZSI6Imdsb2JhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIEN1c3RvbSBnbG9iYWwgSmF2YVNjcmlwdCBmb3IgVVcgTWVkaWNpbmUuXG4gKi9cblxuKGZ1bmN0aW9uICgkLCBEcnVwYWwpIHtcblxuXG4gICAgRHJ1cGFsLmJlaGF2aW9ycy51d21SZWRpcmVjdEV4dGVybmFsTGlua3MgPSB7XG5cbiAgICAgICAgYXR0YWNoOiBmdW5jdGlvbiAoY29udGV4dCwgc2V0dGluZ3MpIHtcblxuICAgICAgICAgICAgdmFyIGxpbmtTZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAgICAgJ2JvZHkucGFnZS1ub2RlLXR5cGUtdXdtLXByb3ZpZGVyIGRpdi5tYWluLWNvbnRhaW5lciBhcnRpY2xlLnV3bS1wcm92aWRlciBhc2lkZSAuYmxvY2stdmlld3MtYmxvY2tjb250ZW50LXNwb3RsaWdodHMtYmxvY2stMSBhJ1xuICAgICAgICAgICAgXS5qb2luKCcsJyk7XG5cbiAgICAgICAgICAgICQobGlua1NlbGVjdG9ycykuZWFjaChmdW5jdGlvbiAoYSwgYikge1xuXG4gICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJChiKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNFeHRlcm5hbCgkdGhpcy5hdHRyKCdocmVmJykpKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmF0dHIoXCJ0YXJnZXRcIiwgXCJfYmxhbmtcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY2hlY2tEb21haW4gKHVybCkge1xuICAgICAgICAgICAgICAgIGlmICh1cmwuaW5kZXhPZignLy8nKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIHVybDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVybC50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyhbYS16XSk/OlxcL1xcLy8sICckMScpLnNwbGl0KCcvJylbMF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGlzRXh0ZXJuYWwodXJsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICggKCB1cmwuaW5kZXhPZignOicpID4gLTEgfHwgdXJsLmluZGV4T2YoJy8vJykgPiAtMSApICYmIGNoZWNrRG9tYWluKGxvY2F0aW9uLmhyZWYpICE9PSBjaGVja0RvbWFpbih1cmwpICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuXG59KShqUXVlcnksIERydXBhbCk7XG4iXX0=
