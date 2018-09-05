'use strict';

/**
 * Scripting for clinic-type nodes.
 */

(function ($, Drupal, drupalSettings) {

    'use strict';

    Drupal.behaviors.uwmLoadProviderPubs = {
        attach: function attach(context, settings) {

            var pubMedIds = $(context).find('article.uwm-provider').data('publication-ids');

            if (!!pubMedIds && pubMedIds.length > 0) {

                // var url = 'http://webservices.uwmedicine.org/api/publications?callback=result&ids=' + pubMedIds.join(',');
                // $.getJSON(url, function( data ) {
                //
                //     console.log(data);
                //
                //     function result( data ) {
                //
                //         var items = [];
                //         $.each(data, function (key, val) {
                //
                //             items.push("<li id='" + key + "'>" + val + "</li>");
                //
                //         });
                //
                //         $("<ul/>", {
                //             "class": "my-new-list",
                //             html: items.join("")
                //         }).appendTo("body");
                //
                //     }
                //
                // });

                $.ajax({
                    url: 'http://webservices.uwmedicine.org/api/publications',
                    // jsonp: "result",
                    dataType: "jsonp",
                    jsonpCallback: 'result',
                    data: {
                        ids: pubMedIds.join(',')
                    },
                    success: function success(data) {

                        var items = [];
                        $.each(data, function (a, b) {

                            var str = '';

                            if (b.Authors) {
                                str += b.Authors;
                            }

                            if (b.PubMedId) {

                                str += '<a href="http://www.ncbi.nlm.nih.gov/sites/' + 'entrez?cmd=retrieve&db=PubMed&tool=UWMedicine&dopt=Abstract&list_uids=' + b.PubMedId + '" ' + 'target="_blank">' + b.ArticleTitle + '</a>';
                            }

                            if (b.JournalTitle) {
                                str += '<em>' + b.JournalTitle + '</em>&nbsp;';
                            }

                            if (b.JournalYear) {
                                str += b.JournalYear + '&nbsp;';
                            }

                            if (b.JournalMonth) {
                                str += b.JournalMonth + '&nbsp;';
                            }

                            if (b.JournalVolume) {
                                str += b.JournalVolume + '&nbsp;';
                            }

                            if (b.JournalIssue) {
                                str += b.JournalIssue + '&nbsp;';
                            }

                            if (b.PagingNumber) {
                                str += b.PagingNumber + '&nbsp;';
                            }

                            items.push('<li class="pubs">' + str + '</li>');
                        });

                        $(context).find('.pubs-ajax.publications-tab').html('<ul>' + items.join('') + '</ul>');
                        $(context).find('.pubs-ajax').addClass('fade-in');
                    }
                });
            }

            function result(data) {}
        }
    };
})(jQuery, Drupal, drupalSettings);

// http://webservices.uwmedicine.org/api/publications?ids=10993853,18316842,19628184,20406239,21041160,21304092,22419555,22457158,24446326
//
// result (
// [
// {
// "PubMedId": 24446326,
// "ArticleTitle": "Have we found the ideal plug for post-TAVR paravalvular leaks?",
// "JournalTitle": "Catheterization and cardiovascular interventions : official journal of the Society for Cardiac Angiography & Interventions",
// "JournalVolume": "83",
// "JournalIssue": "2",
// "JournalYear": "2014",
// "JournalMonth": "Feb",
// "PagingNumber": "289-90",
// "Authors": "Don CW, Dean LS",
// "University": "University of Washington"
// },
// {
// "PubMedId": 22419555,
// "ArticleTitle": "Rapid-exchange guide catheter extension for extending the reach of an AL3 guide in a patient with a long, dilated ascending aorta.",
// "JournalTitle": "Catheterization and cardiovascular interventions : official journal of the Society for Cardiac Angiography & Interventions",
// "JournalVolume": "80",
// "JournalIssue": "7",
// "JournalYear": "2012",
// "JournalMonth": "Dec",
// "PagingNumber": "1218-20",
// "Authors": "Roth GA, Dean LS, Don CW",
// "University": "University of Washington"
// },
//
//
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGUtLXV3bS1wcm92aWRlci5qcyJdLCJuYW1lcyI6WyIkIiwiRHJ1cGFsIiwiZHJ1cGFsU2V0dGluZ3MiLCJiZWhhdmlvcnMiLCJ1d21Mb2FkUHJvdmlkZXJQdWJzIiwiYXR0YWNoIiwiY29udGV4dCIsInNldHRpbmdzIiwicHViTWVkSWRzIiwiZmluZCIsImRhdGEiLCJsZW5ndGgiLCJhamF4IiwidXJsIiwiZGF0YVR5cGUiLCJqc29ucENhbGxiYWNrIiwiaWRzIiwiam9pbiIsInN1Y2Nlc3MiLCJpdGVtcyIsImVhY2giLCJhIiwiYiIsInN0ciIsIkF1dGhvcnMiLCJQdWJNZWRJZCIsIkFydGljbGVUaXRsZSIsIkpvdXJuYWxUaXRsZSIsIkpvdXJuYWxZZWFyIiwiSm91cm5hbE1vbnRoIiwiSm91cm5hbFZvbHVtZSIsIkpvdXJuYWxJc3N1ZSIsIlBhZ2luZ051bWJlciIsInB1c2giLCJodG1sIiwiYWRkQ2xhc3MiLCJyZXN1bHQiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFLQSxDQUFDLFVBQVVBLENBQVYsRUFBYUMsTUFBYixFQUFxQkMsY0FBckIsRUFBcUM7O0FBRWxDOztBQUVBRCxXQUFPRSxTQUFQLENBQWlCQyxtQkFBakIsR0FBdUM7QUFDbkNDLGdCQUFRLGdCQUFVQyxPQUFWLEVBQW1CQyxRQUFuQixFQUE2Qjs7QUFFakMsZ0JBQUlDLFlBQVlSLEVBQUVNLE9BQUYsRUFBV0csSUFBWCxDQUFnQixzQkFBaEIsRUFBd0NDLElBQXhDLENBQTZDLGlCQUE3QyxDQUFoQjs7QUFFQSxnQkFBSSxDQUFDLENBQUNGLFNBQUYsSUFBZUEsVUFBVUcsTUFBVixHQUFtQixDQUF0QyxFQUF5Qzs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFYLGtCQUFFWSxJQUFGLENBQU87QUFDSEMseUJBQUssb0RBREY7QUFFSDtBQUNBQyw4QkFBVSxPQUhQO0FBSUhDLG1DQUFlLFFBSlo7QUFLSEwsMEJBQU07QUFDRk0sNkJBQUtSLFVBQVVTLElBQVYsQ0FBZSxHQUFmO0FBREgscUJBTEg7QUFRSEMsNkJBQVMsaUJBQVVSLElBQVYsRUFBZ0I7O0FBRXJCLDRCQUFJUyxRQUFRLEVBQVo7QUFDQW5CLDBCQUFFb0IsSUFBRixDQUFPVixJQUFQLEVBQWEsVUFBVVcsQ0FBVixFQUFhQyxDQUFiLEVBQWdCOztBQUV6QixnQ0FBSUMsTUFBTSxFQUFWOztBQUVBLGdDQUFJRCxFQUFFRSxPQUFOLEVBQWU7QUFDWEQsdUNBQU9ELEVBQUVFLE9BQVQ7QUFDSDs7QUFFRCxnQ0FBSUYsRUFBRUcsUUFBTixFQUFnQjs7QUFFWkYsdUNBQU8sZ0RBQ0gsd0VBREcsR0FDd0VELEVBQUVHLFFBRDFFLEdBQ3FGLElBRHJGLEdBRUgsa0JBRkcsR0FFa0JILEVBQUVJLFlBRnBCLEdBRW1DLE1BRjFDO0FBSUg7O0FBRUQsZ0NBQUlKLEVBQUVLLFlBQU4sRUFBb0I7QUFDaEJKLHVDQUFPLFNBQVNELEVBQUVLLFlBQVgsR0FBMEIsYUFBakM7QUFDSDs7QUFFRCxnQ0FBSUwsRUFBRU0sV0FBTixFQUFtQjtBQUNmTCx1Q0FBT0QsRUFBRU0sV0FBRixHQUFnQixRQUF2QjtBQUNIOztBQUVELGdDQUFJTixFQUFFTyxZQUFOLEVBQW9CO0FBQ2hCTix1Q0FBT0QsRUFBRU8sWUFBRixHQUFpQixRQUF4QjtBQUNIOztBQUVELGdDQUFJUCxFQUFFUSxhQUFOLEVBQXFCO0FBQ2pCUCx1Q0FBT0QsRUFBRVEsYUFBRixHQUFrQixRQUF6QjtBQUNIOztBQUVELGdDQUFJUixFQUFFUyxZQUFOLEVBQW9CO0FBQ2hCUix1Q0FBT0QsRUFBRVMsWUFBRixHQUFpQixRQUF4QjtBQUNIOztBQUVELGdDQUFJVCxFQUFFVSxZQUFOLEVBQW9CO0FBQ2hCVCx1Q0FBT0QsRUFBRVUsWUFBRixHQUFpQixRQUF4QjtBQUNIOztBQUVEYixrQ0FBTWMsSUFBTixDQUFXLHNCQUFzQlYsR0FBdEIsR0FBNEIsT0FBdkM7QUFDSCx5QkF6Q0Q7O0FBMkNBdkIsMEJBQUVNLE9BQUYsRUFBV0csSUFBWCxDQUFnQiw2QkFBaEIsRUFBK0N5QixJQUEvQyxDQUFvRCxTQUFTZixNQUFNRixJQUFOLENBQVcsRUFBWCxDQUFULEdBQTBCLE9BQTlFO0FBQ0FqQiwwQkFBRU0sT0FBRixFQUFXRyxJQUFYLENBQWdCLFlBQWhCLEVBQThCMEIsUUFBOUIsQ0FBdUMsU0FBdkM7QUFHSDtBQTFERSxpQkFBUDtBQTZESDs7QUFHRCxxQkFBU0MsTUFBVCxDQUFnQjFCLElBQWhCLEVBQXNCLENBQ3JCO0FBRUo7QUFqR2tDLEtBQXZDO0FBb0dILENBeEdELEVBd0dHMkIsTUF4R0gsRUF3R1dwQyxNQXhHWCxFQXdHbUJDLGNBeEduQjs7QUEyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im5vZGUtLXV3bS1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU2NyaXB0aW5nIGZvciBjbGluaWMtdHlwZSBub2Rlcy5cbiAqL1xuXG5cbihmdW5jdGlvbiAoJCwgRHJ1cGFsLCBkcnVwYWxTZXR0aW5ncykge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgRHJ1cGFsLmJlaGF2aW9ycy51d21Mb2FkUHJvdmlkZXJQdWJzID0ge1xuICAgICAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0LCBzZXR0aW5ncykge1xuXG4gICAgICAgICAgICB2YXIgcHViTWVkSWRzID0gJChjb250ZXh0KS5maW5kKCdhcnRpY2xlLnV3bS1wcm92aWRlcicpLmRhdGEoJ3B1YmxpY2F0aW9uLWlkcycpO1xuXG4gICAgICAgICAgICBpZiAoISFwdWJNZWRJZHMgJiYgcHViTWVkSWRzLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgICAgIC8vIHZhciB1cmwgPSAnaHR0cDovL3dlYnNlcnZpY2VzLnV3bWVkaWNpbmUub3JnL2FwaS9wdWJsaWNhdGlvbnM/Y2FsbGJhY2s9cmVzdWx0Jmlkcz0nICsgcHViTWVkSWRzLmpvaW4oJywnKTtcbiAgICAgICAgICAgICAgICAvLyAkLmdldEpTT04odXJsLCBmdW5jdGlvbiggZGF0YSApIHtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vICAgICBmdW5jdGlvbiByZXN1bHQoIGRhdGEgKSB7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHZhciBpdGVtcyA9IFtdO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJC5lYWNoKGRhdGEsIGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaXRlbXMucHVzaChcIjxsaSBpZD0nXCIgKyBrZXkgKyBcIic+XCIgKyB2YWwgKyBcIjwvbGk+XCIpO1xuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJChcIjx1bC8+XCIsIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBcImNsYXNzXCI6IFwibXktbmV3LWxpc3RcIixcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBodG1sOiBpdGVtcy5qb2luKFwiXCIpXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9KS5hcHBlbmRUbyhcImJvZHlcIik7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vd2Vic2VydmljZXMudXdtZWRpY2luZS5vcmcvYXBpL3B1YmxpY2F0aW9ucycsXG4gICAgICAgICAgICAgICAgICAgIC8vIGpzb25wOiBcInJlc3VsdFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29ucFwiLFxuICAgICAgICAgICAgICAgICAgICBqc29ucENhbGxiYWNrOiAncmVzdWx0JyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWRzOiBwdWJNZWRJZHMuam9pbignLCcpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGRhdGEsIGZ1bmN0aW9uIChhLCBiKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RyID0gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYi5BdXRob3JzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBiLkF1dGhvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYi5QdWJNZWRJZCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSAnPGEgaHJlZj1cImh0dHA6Ly93d3cubmNiaS5ubG0ubmloLmdvdi9zaXRlcy8nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdlbnRyZXo/Y21kPXJldHJpZXZlJmRiPVB1Yk1lZCZ0b29sPVVXTWVkaWNpbmUmZG9wdD1BYnN0cmFjdCZsaXN0X3VpZHM9JyArIGIuUHViTWVkSWQgKyAnXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndGFyZ2V0PVwiX2JsYW5rXCI+JyArIGIuQXJ0aWNsZVRpdGxlICsgJzwvYT4nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuSm91cm5hbFRpdGxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSAnPGVtPicgKyBiLkpvdXJuYWxUaXRsZSArICc8L2VtPiZuYnNwOyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuSm91cm5hbFllYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGIuSm91cm5hbFllYXIgKyAnJm5ic3A7JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYi5Kb3VybmFsTW9udGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGIuSm91cm5hbE1vbnRoICsgJyZuYnNwOyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuSm91cm5hbFZvbHVtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gYi5Kb3VybmFsVm9sdW1lICsgJyZuYnNwOyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuSm91cm5hbElzc3VlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBiLkpvdXJuYWxJc3N1ZSArICcmbmJzcDsnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiLlBhZ2luZ051bWJlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gYi5QYWdpbmdOdW1iZXIgKyAnJm5ic3A7JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKCc8bGkgY2xhc3M9XCJwdWJzXCI+JyArIHN0ciArICc8L2xpPicpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJChjb250ZXh0KS5maW5kKCcucHVicy1hamF4LnB1YmxpY2F0aW9ucy10YWInKS5odG1sKCc8dWw+JyArIGl0ZW1zLmpvaW4oJycpICsgJzwvdWw+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKGNvbnRleHQpLmZpbmQoJy5wdWJzLWFqYXgnKS5hZGRDbGFzcygnZmFkZS1pbicpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgZnVuY3Rpb24gcmVzdWx0KGRhdGEpIHtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfTtcblxufSkoalF1ZXJ5LCBEcnVwYWwsIGRydXBhbFNldHRpbmdzKTtcblxuXG4vLyBodHRwOi8vd2Vic2VydmljZXMudXdtZWRpY2luZS5vcmcvYXBpL3B1YmxpY2F0aW9ucz9pZHM9MTA5OTM4NTMsMTgzMTY4NDIsMTk2MjgxODQsMjA0MDYyMzksMjEwNDExNjAsMjEzMDQwOTIsMjI0MTk1NTUsMjI0NTcxNTgsMjQ0NDYzMjZcbi8vXG4vLyByZXN1bHQgKFxuLy8gW1xuLy8ge1xuLy8gXCJQdWJNZWRJZFwiOiAyNDQ0NjMyNixcbi8vIFwiQXJ0aWNsZVRpdGxlXCI6IFwiSGF2ZSB3ZSBmb3VuZCB0aGUgaWRlYWwgcGx1ZyBmb3IgcG9zdC1UQVZSIHBhcmF2YWx2dWxhciBsZWFrcz9cIixcbi8vIFwiSm91cm5hbFRpdGxlXCI6IFwiQ2F0aGV0ZXJpemF0aW9uIGFuZCBjYXJkaW92YXNjdWxhciBpbnRlcnZlbnRpb25zIDogb2ZmaWNpYWwgam91cm5hbCBvZiB0aGUgU29jaWV0eSBmb3IgQ2FyZGlhYyBBbmdpb2dyYXBoeSAmIEludGVydmVudGlvbnNcIixcbi8vIFwiSm91cm5hbFZvbHVtZVwiOiBcIjgzXCIsXG4vLyBcIkpvdXJuYWxJc3N1ZVwiOiBcIjJcIixcbi8vIFwiSm91cm5hbFllYXJcIjogXCIyMDE0XCIsXG4vLyBcIkpvdXJuYWxNb250aFwiOiBcIkZlYlwiLFxuLy8gXCJQYWdpbmdOdW1iZXJcIjogXCIyODktOTBcIixcbi8vIFwiQXV0aG9yc1wiOiBcIkRvbiBDVywgRGVhbiBMU1wiLFxuLy8gXCJVbml2ZXJzaXR5XCI6IFwiVW5pdmVyc2l0eSBvZiBXYXNoaW5ndG9uXCJcbi8vIH0sXG4vLyB7XG4vLyBcIlB1Yk1lZElkXCI6IDIyNDE5NTU1LFxuLy8gXCJBcnRpY2xlVGl0bGVcIjogXCJSYXBpZC1leGNoYW5nZSBndWlkZSBjYXRoZXRlciBleHRlbnNpb24gZm9yIGV4dGVuZGluZyB0aGUgcmVhY2ggb2YgYW4gQUwzIGd1aWRlIGluIGEgcGF0aWVudCB3aXRoIGEgbG9uZywgZGlsYXRlZCBhc2NlbmRpbmcgYW9ydGEuXCIsXG4vLyBcIkpvdXJuYWxUaXRsZVwiOiBcIkNhdGhldGVyaXphdGlvbiBhbmQgY2FyZGlvdmFzY3VsYXIgaW50ZXJ2ZW50aW9ucyA6IG9mZmljaWFsIGpvdXJuYWwgb2YgdGhlIFNvY2lldHkgZm9yIENhcmRpYWMgQW5naW9ncmFwaHkgJiBJbnRlcnZlbnRpb25zXCIsXG4vLyBcIkpvdXJuYWxWb2x1bWVcIjogXCI4MFwiLFxuLy8gXCJKb3VybmFsSXNzdWVcIjogXCI3XCIsXG4vLyBcIkpvdXJuYWxZZWFyXCI6IFwiMjAxMlwiLFxuLy8gXCJKb3VybmFsTW9udGhcIjogXCJEZWNcIixcbi8vIFwiUGFnaW5nTnVtYmVyXCI6IFwiMTIxOC0yMFwiLFxuLy8gXCJBdXRob3JzXCI6IFwiUm90aCBHQSwgRGVhbiBMUywgRG9uIENXXCIsXG4vLyBcIlVuaXZlcnNpdHlcIjogXCJVbml2ZXJzaXR5IG9mIFdhc2hpbmd0b25cIlxuLy8gfSxcbi8vXG4vL1xuIl19
