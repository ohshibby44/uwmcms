/**
 * Scripting for clinic-type nodes.
 */


(function ($, Drupal, drupalSettings) {

    'use strict';

    Drupal.behaviors.uwmLoadProviderPubs = {
        attach: function (context, settings) {

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

                $.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=' + pubMedIds.join(','), function (data) {
                        var items = [];
                        var results = data['result'];
                        $.each(results, function (a, b) {

                            var str = '';

                            if (b.authors) {
                                var authors = [];
                                $.each(b.authors, function(a, b) {
                                    authors.push(b.name);
                                });
                                str += authors.join(", ") + ' ';
                            }

                            if (b.uid) {

                                str += '<a href="http://www.ncbi.nlm.nih.gov/sites/' +
                                    'entrez?cmd=retrieve&db=PubMed&tool=UWMedicine&dopt=Abstract&list_uids=' + b.uid + '" ' +
                                    'target="_blank">' + b.title + '</a> ';

                            }

                            if (b.fulljournalname) {
                                str += '<em>' + b.fulljournalname + '</em> ';
                            }

                            if (b.pubdate) {
                                str += b.pubdate + '; ';
                            }

                            if (b.volume) {
                                str += b.volume + '; ';
                            }

                            if (b.issue) {
                                str += b.issue + '; ';
                            }

                            if (b.pages) {
                                str += b.pages + ';';
                            }

                            if(str !== '') {
                              items.push('<li class="pubs">' + str + '</li>');
                            }
                        });

                        items = items.reverse();
                        $(context).find('.pubs-ajax.publications-tab').html('<ul>' + items.join('') + '</ul>');
                        $(context).find('.pubs-ajax').removeClass('disabled');

                });

            }


            function result(data) {
            }

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
