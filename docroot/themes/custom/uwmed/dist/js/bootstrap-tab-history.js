'use strict';

/* ==========================================================================
 * bootstrap-tab-history.js
 * Author: Michael Narayan <mnarayan01@gmail.com>
 * Repository: https://github.com/mnarayan01/bootstrap-tab-history/
 * ==========================================================================
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain a
 * copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 * ========================================================================== */

/* ========================================================================== */
/* JSHint directives                                                          */
/*                                                                            */
/* global BootstrapTabHistory: true                                           */
/*                                                                            */
/* global document                                                            */
/* global jQuery                                                              */
/* global history                                                             */
/* global window                                                              */
/* ========================================================================== */

/**
 * Integrate [HTML5 history state tracking](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history)
 * with [`bootstrap/tab.js`](http://getbootstrap.com/javascript/#tabs). To enable tracking on a tab element, simply set
 * the `data-tab-history` attribute to true (or a string denoting a tab grouping).
 *
 * See the README for additional information.
 *
 * Functionality based upon bootstrap/tab.js v3.1.0; reference it when making any changes.
 */

var BootstrapTabHistory = {
  options: {
    /**
     * When the anchor portion of the URI is used to activate a tab, scroll down to the given offset, rather than the
     * element with the given `id` attribute. Set to null to disable. Only relevant if showTabsBasedOnAnchor is true.
     *
     * May be overriden on a per-element basis by the attribute `data-tab-history-anchor-y-offset`.
     *
     * @public
     * @type {?number}
     */
    defaultAnchorYOffset: 0,
    /**
     * Either 'push' or 'replace', for whether to use `history.pushState` or `history.replaceState`, resp.
     *
     * May be overriden on a per-element basis by the attribute `data-tab-history-changer`.
     *
     * @public
     * @type {string}
     */
    defaultChanger: 'replace',
    /**
     * If true, update the URL in onShownTab in the calls to `history.pushState` and `history.replaceState`. Otherwise,
     * `null` is passed as the third parameter to these calls.
     *
     * May be overriden on a per-element basis by the attribute `data-tab-history-update-url`.
     *
     * @public
     * @type {boolean}
     */
    defaultUpdateURL: false,
    /**
     * Should the anchor portion of the loaded URI be used to activate a single tab if no history was present on page
     * load.
     *
     * @public
     * @type {boolean}
     */
    showTabsBasedOnAnchor: true
  }
};

(function () {
  'use strict';

  jQuery(function () {
    if (history && history.pushState && history.replaceState) {
      var bootstrapTabHistory = history.state && history.state.bootstrapTabHistory;

      if (bootstrapTabHistory) {
        showTabsBasedOnState(bootstrapTabHistory);
      } else {
        showTabsBasedOnAnchor();
      }

      backfillHistoryState();

      jQuery(document).on('shown.bs.tab', onShownTab);
      jQuery(window).on('popstate', onPopState);
    } else {
      showTabsBasedOnAnchor();
    }
  });

  jQuery(window).load(function () {
    if (getUrlParameter('scrollTo') && window.scrollY === 0) {
      var scrollEvent = new UIEvent('scroll');
      window.dispatchEvent(scrollEvent);
    }
  });

  /**
   * Used to prevent onShownTab from registering shown events that we triggered via showTabsBasedOnState.
   *
   * @type {boolean}
   */
  var showingTabsBasedOnState = false;

  /**
   * Used to update `history.state` to reflect the default active tabs on initial page load. This supports proper
   * `history.back` handling when `data-tab-history-update-url` is true.
   */
  function backfillHistoryState() {
    var newState = null;

    jQuery('li.active > [data-tab-history]').each(function () {
      var $activeTabElement = jQuery(this);
      var selector = getTabSelector($activeTabElement);

      if (selector) {
        var tabGroup = getTabGroup($activeTabElement);

        if (tabGroup) {
          newState = createNewHistoryState(newState || history.state, tabGroup, selector);
        }
      }
    });

    if (newState) {
      history.replaceState(newState, '', null);
    }
  }

  /**
   * Clone the existing state, ensure its bootstrapTabHistory attribute is an Object, and add the provided tabGroup to
   * said bootstrapTabHistory attribute.
   *
   * @param {?object} existingState
   * @param {!string} tabGroup
   * @param {!string} selector
   * @returns {!object}
   */
  function createNewHistoryState(existingState, tabGroup, selector) {
    // Clone history.state and ensure it has a bootstrapTabHistory entry.
    var newState = jQuery.extend(true, {}, existingState, {
      bootstrapTabHistory: {}
    });

    newState.bootstrapTabHistory[tabGroup] = selector;

    return newState;
  }

  /**
   * @param {jQuery} $tab
   * @returns {?string}
   */
  function getTabGroup($tab) {
    return parseTruthyAttributeValue($tab.data('tab-history'));
  }

  /**
   * @param {jQuery} $tab
   * @returns {?string}
   */
  function getTabSelector($tab) {
    return $tab.data('target') || $tab.attr('href');
  }

  /**
   * Receives the `shown.bs.tab` event. Updates `history.state` as appropriate.
   *
   * @param {jQuery.Event} shownEvt
   */
  function onShownTab(shownEvt) {
    if (!showingTabsBasedOnState) {
      var $activatedTab = jQuery(shownEvt.target);
      var selector = getTabSelector($activatedTab);

      if (selector) {
        var tabGroup = getTabGroup($activatedTab);

        if (tabGroup) {
          var historyChanger = $activatedTab.data('tab-history-changer') || BootstrapTabHistory.options.defaultChanger;
          var newState = createNewHistoryState(history.state, tabGroup, selector);
          var updateURL = function ($activatedTab) {
            if (selector[0] === '#') {
              var elementUpdateURLOption = parseTruthyAttributeValue($activatedTab.data('tab-history-update-url'));

              if (elementUpdateURLOption === undefined) {
                return BootstrapTabHistory.options.defaultUpdateURL;
              } else {
                return elementUpdateURLOption;
              }
            } else {
              return false;
            }
          }($activatedTab);

          switch (historyChanger) {
            case 'push':
              history.pushState(newState, '', updateURL ? selector : null);
              break;
            case 'replace':
              history.replaceState(newState, '', updateURL ? selector : null);
              break;
            default:
              throw new Error('Unknown tab-history-changer: ' + historyChanger);
          }
        }
      }
    }
  }

  /**
   * Receives the `popstate` event. Shows tabs based on the value of `history.state` as appropriate.
   */
  function onPopState() {
    var bootstrapTabHistory = history.state && history.state.bootstrapTabHistory;

    if (bootstrapTabHistory) {
      showTabsBasedOnState(bootstrapTabHistory);
    }
  }

  /**
   * Returns the given value, _unless_ that value is an empty string, in which case `true` is returned.
   *
   * Rationale: HAML data attributes which are set to `true` are rendered as a blank string.
   *
   * @param {*} value
   * @returns {*}
   */
  function parseTruthyAttributeValue(value) {
    if (value) {
      return value;
    } else if (value === '') {
      return true;
    } else {
      return value;
    }
  }

  /**
   * Show tabs based upon the anchor component of `window.location`.
   */
  function showTabsBasedOnAnchor() {
    if (BootstrapTabHistory.options.showTabsBasedOnAnchor) {
      var anchor = window.location && window.location.hash;

      if (anchor) {
        var $tabElement = showTabForSelector(anchor);

        if ($tabElement && window.addEventListener && window.removeEventListener) {
          var anchorYOffset = function ($tabElement) {
            var elementSetting = $tabElement.data('tab-history-anchor-y-offset');

            if (elementSetting === undefined) {
              return BootstrapTabHistory.options.defaultAnchorYOffset;
            } else {
              return elementSetting;
            }
          }($tabElement);

          // HACK: This prevents scrolling to the tab on page load. This relies on the fact that we should never get
          //   here on `history.forward`, `history.back`, or `location.reload`, since in all those situations the
          //   `history.state` object should have been used (unless the browser did not support the modern History API).
          if (anchorYOffset || anchorYOffset === 0) {
            var scrollListener = function resetAnchorScroll() {
              window.removeEventListener('scroll', scrollListener);
              var scrollParam = getUrlParameter('scrollTo');

              if (scrollParam) {
                scrollToQueryAnchor('scrollTo');
              } else {
                window.scrollTo(0, anchorYOffset);
              }
            };

            window.addEventListener('scroll', scrollListener);
          }
        }
      }
    }
  }

  /**
   * Show a tab which corresponds to the provided selector.
   *
   * @param {string} selector - A CSS selector.
   * @returns {?jQuery} - The tab which was found to show (even if said tab was already active).
   */
  function showTabForSelector(selector) {
    var $tabElement = function (selector) {
      var $ret = null;

      jQuery('[data-toggle="tab"], [data-toggle="pill"]').each(function () {
        var $potentialTab = jQuery(this);

        if (($potentialTab.attr('href') === selector || $potentialTab.data('target') === selector) && getTabGroup($potentialTab)) {
          $ret = $potentialTab;

          return false;
        } else {
          return null;
        }
      });

      return $ret;
    }(selector);

    if ($tabElement) {
      $tabElement.tab('show');
    }

    return $tabElement;
  }

  /**
   * Iterate through the provided set of tab tab groups, showing the tabs based on the stored selectors.
   *
   * @param {object} bootstrapTabHistory - Each of the values is passed to showTabForSelector; the keys are actually irrelevant.
   */
  function showTabsBasedOnState(bootstrapTabHistory) {
    showingTabsBasedOnState = true;

    try {
      for (var k in bootstrapTabHistory) {
        if (bootstrapTabHistory.hasOwnProperty(k)) {
          showTabForSelector(bootstrapTabHistory[k]);
        }
      }
    } finally {
      showingTabsBasedOnState = false;
    }
  }

  /**
   * Fetch the value of a URL parameter
   */
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  /**
   * Scroll an element into view if it's on the active tab.
   */
  function scrollToQueryAnchor(paramName) {

    var parentTab = window.location && window.location.hash;
    var scrollParam = getUrlParameter(paramName);

    if (scrollParam) {
      var $scrollElement = jQuery('#' + scrollParam);

      if ($scrollElement) {
        var isScrollElementOnActiveTab = $scrollElement.closest(parentTab);
        if (isScrollElementOnActiveTab.length > 0) {
          $scrollElement[0].scrollIntoView();
        }
      }
    }
  }
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvb3RzdHJhcC10YWItaGlzdG9yeS5qcyJdLCJuYW1lcyI6WyJCb290c3RyYXBUYWJIaXN0b3J5Iiwib3B0aW9ucyIsImRlZmF1bHRBbmNob3JZT2Zmc2V0IiwiZGVmYXVsdENoYW5nZXIiLCJkZWZhdWx0VXBkYXRlVVJMIiwic2hvd1RhYnNCYXNlZE9uQW5jaG9yIiwialF1ZXJ5IiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsInJlcGxhY2VTdGF0ZSIsImJvb3RzdHJhcFRhYkhpc3RvcnkiLCJzdGF0ZSIsInNob3dUYWJzQmFzZWRPblN0YXRlIiwiYmFja2ZpbGxIaXN0b3J5U3RhdGUiLCJkb2N1bWVudCIsIm9uIiwib25TaG93blRhYiIsIndpbmRvdyIsIm9uUG9wU3RhdGUiLCJsb2FkIiwiZ2V0VXJsUGFyYW1ldGVyIiwic2Nyb2xsWSIsInNjcm9sbEV2ZW50IiwiVUlFdmVudCIsImRpc3BhdGNoRXZlbnQiLCJzaG93aW5nVGFic0Jhc2VkT25TdGF0ZSIsIm5ld1N0YXRlIiwiZWFjaCIsIiRhY3RpdmVUYWJFbGVtZW50Iiwic2VsZWN0b3IiLCJnZXRUYWJTZWxlY3RvciIsInRhYkdyb3VwIiwiZ2V0VGFiR3JvdXAiLCJjcmVhdGVOZXdIaXN0b3J5U3RhdGUiLCJleGlzdGluZ1N0YXRlIiwiZXh0ZW5kIiwiJHRhYiIsInBhcnNlVHJ1dGh5QXR0cmlidXRlVmFsdWUiLCJkYXRhIiwiYXR0ciIsInNob3duRXZ0IiwiJGFjdGl2YXRlZFRhYiIsInRhcmdldCIsImhpc3RvcnlDaGFuZ2VyIiwidXBkYXRlVVJMIiwiZWxlbWVudFVwZGF0ZVVSTE9wdGlvbiIsInVuZGVmaW5lZCIsIkVycm9yIiwidmFsdWUiLCJhbmNob3IiLCJsb2NhdGlvbiIsImhhc2giLCIkdGFiRWxlbWVudCIsInNob3dUYWJGb3JTZWxlY3RvciIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiYW5jaG9yWU9mZnNldCIsImVsZW1lbnRTZXR0aW5nIiwic2Nyb2xsTGlzdGVuZXIiLCJyZXNldEFuY2hvclNjcm9sbCIsInNjcm9sbFBhcmFtIiwic2Nyb2xsVG9RdWVyeUFuY2hvciIsInNjcm9sbFRvIiwiJHJldCIsIiRwb3RlbnRpYWxUYWIiLCJ0YWIiLCJrIiwiaGFzT3duUHJvcGVydHkiLCJuYW1lIiwicmVwbGFjZSIsInJlZ2V4IiwiUmVnRXhwIiwicmVzdWx0cyIsImV4ZWMiLCJzZWFyY2giLCJkZWNvZGVVUklDb21wb25lbnQiLCJwYXJhbU5hbWUiLCJwYXJlbnRUYWIiLCIkc2Nyb2xsRWxlbWVudCIsImlzU2Nyb2xsRWxlbWVudE9uQWN0aXZlVGFiIiwiY2xvc2VzdCIsImxlbmd0aCIsInNjcm9sbEludG9WaWV3Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUFVQSxJQUFNQSxzQkFBc0I7QUFDMUJDLFdBQVM7QUFDUDs7Ozs7Ozs7O0FBU0FDLDBCQUFzQixDQVZmO0FBV1A7Ozs7Ozs7O0FBUUFDLG9CQUFnQixTQW5CVDtBQW9CUDs7Ozs7Ozs7O0FBU0FDLHNCQUFrQixLQTdCWDtBQThCUDs7Ozs7OztBQU9BQywyQkFBdUI7QUFyQ2hCO0FBRGlCLENBQTVCOztBQTBDQSxDQUFDLFlBQVk7QUFDWDs7QUFFQUMsU0FBTyxZQUFZO0FBQ2pCLFFBQUdDLFdBQVdBLFFBQVFDLFNBQW5CLElBQWdDRCxRQUFRRSxZQUEzQyxFQUF5RDtBQUN2RCxVQUFJQyxzQkFBc0JILFFBQVFJLEtBQVIsSUFBaUJKLFFBQVFJLEtBQVIsQ0FBY0QsbUJBQXpEOztBQUVBLFVBQUdBLG1CQUFILEVBQXdCO0FBQ3RCRSw2QkFBcUJGLG1CQUFyQjtBQUNELE9BRkQsTUFFTztBQUNMTDtBQUNEOztBQUVEUTs7QUFFQVAsYUFBT1EsUUFBUCxFQUFpQkMsRUFBakIsQ0FBb0IsY0FBcEIsRUFBb0NDLFVBQXBDO0FBQ0FWLGFBQU9XLE1BQVAsRUFBZUYs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LEdBQTFCLENBQW5CLENBQS9CO0FBQ0Q7O0FBRUQ7OztBQUdBLFdBQVNSLG1CQUFULENBQTZCZSxTQUE3QixFQUF3Qzs7QUFFdEMsUUFBSUMsWUFBWTVELE9BQU9pQyxRQUFQLElBQW1CakMsT0FBT2lDLFFBQVAsQ0FBZ0JDLElBQW5EO0FBQ0EsUUFBSVMsY0FBY3hDLGdCQUFnQndELFNBQWhCLENBQWxCOztBQUVBLFFBQUdoQixXQUFILEVBQWdCO0FBQ2QsVUFBSWtCLGlCQUFpQnhFLE9BQU8sTUFBSXNELFdBQVgsQ0FBckI7O0FBRUEsVUFBR2tCLGNBQUgsRUFBbUI7QUFDakIsWUFBSUMsNkJBQTZCRCxlQUFlRSxPQUFmLENBQXVCSCxTQUF2QixDQUFqQztBQUNBLFlBQUdFLDJCQUEyQkUsTUFBM0IsR0FBb0MsQ0FBdkMsRUFBMkM7QUFDekNILHlCQUFlLENBQWYsRUFBa0JJLGNBQWxCO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7QUFDRixDQXRTRCIsImZpbGUiOiJib290c3RyYXAtdGFiLWhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogYm9vdHN0cmFwLXRhYi1oaXN0b3J5LmpzXG4gKiBBdXRob3I6IE1pY2hhZWwgTmFyYXlhbiA8bW5hcmF5YW4wMUBnbWFpbC5jb20+XG4gKiBSZXBvc2l0b3J5OiBodHRwczovL2dpdGh1Yi5jb20vbW5hcmF5YW4wMS9ib290c3RyYXAtdGFiLWhpc3RvcnkvXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYVxuICogY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVFxuICogV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlXG4gKiBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9uc1xuICogdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyogSlNIaW50IGRpcmVjdGl2ZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbi8qICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4vKiBnbG9iYWwgQm9vdHN0cmFwVGFiSGlzdG9yeTogdHJ1ZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuLyogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbi8qIGdsb2JhbCBkb2N1bWVudCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4vKiBnbG9iYWwgalF1ZXJ5ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuLyogZ2xvYmFsIGhpc3RvcnkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbi8qIGdsb2JhbCB3aW5kb3cgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIEludGVncmF0ZSBbSFRNTDUgaGlzdG9yeSBzdGF0ZSB0cmFja2luZ10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvR3VpZGUvQVBJL0RPTS9NYW5pcHVsYXRpbmdfdGhlX2Jyb3dzZXJfaGlzdG9yeSlcbiAqIHdpdGggW2Bib290c3RyYXAvdGFiLmpzYF0oaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jdGFicykuIFRvIGVuYWJsZSB0cmFja2luZyBvbiBhIHRhYiBlbGVtZW50LCBzaW1wbHkgc2V0XG4gKiB0aGUgYGRhdGEtdGFiLWhpc3RvcnlgIGF0dHJpYnV0ZSB0byB0cnVlIChvciBhIHN0cmluZyBkZW5vdGluZyBhIHRhYiBncm91cGluZykuXG4gKlxuICogU2VlIHRoZSBSRUFETUUgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKlxuICogRnVuY3Rpb25hbGl0eSBiYXNlZCB1cG9uIGJvb3RzdHJhcC90YWIuanMgdjMuMS4wOyByZWZlcmVuY2UgaXQgd2hlbiBtYWtpbmcgYW55IGNoYW5nZXMuXG4gKi9cblxuY29uc3QgQm9vdHN0cmFwVGFiSGlzdG9yeSA9IHtcbiAgb3B0aW9uczoge1xuICAgIC8qKlxuICAgICAqIFdoZW4gdGhlIGFuY2hvciBwb3J0aW9uIG9mIHRoZSBVUkkgaXMgdXNlZCB0byBhY3RpdmF0ZSBhIHRhYiwgc2Nyb2xsIGRvd24gdG8gdGhlIGdpdmVuIG9mZnNldCwgcmF0aGVyIHRoYW4gdGhlXG4gICAgICogZWxlbWVudCB3aXRoIHRoZSBnaXZlbiBgaWRgIGF0dHJpYnV0ZS4gU2V0IHRvIG51bGwgdG8gZGlzYWJsZS4gT25seSByZWxldmFudCBpZiBzaG93VGFic0Jhc2VkT25BbmNob3IgaXMgdHJ1ZS5cbiAgICAgKlxuICAgICAqIE1heSBiZSBvdmVycmlkZW4gb24gYSBwZXItZWxlbWVudCBiYXNpcyBieSB0aGUgYXR0cmlidXRlIGBkYXRhLXRhYi1oaXN0b3J5LWFuY2hvci15LW9mZnNldGAuXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICogQHR5cGUgez9udW1iZXJ9XG4gICAgICovXG4gICAgZGVmYXVsdEFuY2hvcllPZmZzZXQ6IDAsXG4gICAgLyoqXG4gICAgICogRWl0aGVyICdwdXNoJyBvciAncmVwbGFjZScsIGZvciB3aGV0aGVyIHRvIHVzZSBgaGlzdG9yeS5wdXNoU3RhdGVgIG9yIGBoaXN0b3J5LnJlcGxhY2VTdGF0ZWAsIHJlc3AuXG4gICAgICpcbiAgICAgKiBNYXkgYmUgb3ZlcnJpZGVuIG9uIGEgcGVyLWVsZW1lbnQgYmFzaXMgYnkgdGhlIGF0dHJpYnV0ZSBgZGF0YS10YWItaGlzdG9yeS1jaGFuZ2VyYC5cbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIGRlZmF1bHRDaGFuZ2VyOiAncmVwbGFjZScsXG4gICAgLyoqXG4gICAgICogSWYgdHJ1ZSwgdXBkYXRlIHRoZSBVUkwgaW4gb25TaG93blRhYiBpbiB0aGUgY2FsbHMgdG8gYGhpc3RvcnkucHVzaFN0YXRlYCBhbmQgYGhpc3RvcnkucmVwbGFjZVN0YXRlYC4gT3RoZXJ3aXNlLFxuICAgICAqIGBudWxsYCBpcyBwYXNzZWQgYXMgdGhlIHRoaXJkIHBhcmFtZXRlciB0byB0aGVzZSBjYWxscy5cbiAgICAgKlxuICAgICAqIE1heSBiZSBvdmVycmlkZW4gb24gYSBwZXItZWxlbWVudCBiYXNpcyBieSB0aGUgYXR0cmlidXRlIGBkYXRhLXRhYi1oaXN0b3J5LXVwZGF0ZS11cmxgLlxuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIGRlZmF1bHRVcGRhdGVVUkw6IGZhbHNlLFxuICAgIC8qKlxuICAgICAqIFNob3VsZCB0aGUgYW5jaG9yIHBvcnRpb24gb2YgdGhlIGxvYWRlZCBVUkkgYmUgdXNlZCB0byBhY3RpdmF0ZSBhIHNpbmdsZSB0YWIgaWYgbm8gaGlzdG9yeSB3YXMgcHJlc2VudCBvbiBwYWdlXG4gICAgICogbG9hZC5cbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBzaG93VGFic0Jhc2VkT25BbmNob3I6IHRydWVcbiAgfVxufTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGpRdWVyeShmdW5jdGlvbiAoKSB7XG4gICAgaWYoaGlzdG9yeSAmJiBoaXN0b3J5LnB1c2hTdGF0ZSAmJiBoaXN0b3J5LnJlcGxhY2VTdGF0ZSkge1xuICAgICAgdmFyIGJvb3RzdHJhcFRhYkhpc3RvcnkgPSBoaXN0b3J5LnN0YXRlICYmIGhpc3Rvcnkuc3RhdGUuYm9vdHN0cmFwVGFiSGlzdG9yeTtcblxuICAgICAgaWYoYm9vdHN0cmFwVGFiSGlzdG9yeSkge1xuICAgICAgICBzaG93VGFic0Jhc2VkT25TdGF0ZShib290c3RyYXBUYWJIaXN0b3J5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3dUYWJzQmFzZWRPbkFuY2hvcigpO1xuICAgICAgfVxuXG4gICAgICBiYWNrZmlsbEhpc3RvcnlTdGF0ZSgpO1xuXG4gICAgICBqUXVlcnkoZG9jdW1lbnQpLm9uKCdzaG93bi5icy50YWInLCBvblNob3duVGFiKTtcbiAgICAgIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIG9uUG9wU3RhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaG93VGFic0Jhc2VkT25BbmNob3IoKTtcbiAgICB9XG4gIH0pO1xuXG4gIGpRdWVyeSh3aW5kb3cpLmxvYWQoZnVuY3Rpb24gKCkge1xuICAgIGlmKGdldFVybFBhcmFtZXRlcignc2Nyb2xsVG8nKSAmJiB3aW5kb3cuc2Nyb2xsWSA9PT0gMCkge1xuICAgICAgdmFyIHNjcm9sbEV2ZW50ID0gbmV3IFVJRXZlbnQoJ3Njcm9sbCcpO1xuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoc2Nyb2xsRXZlbnQpO1xuICAgIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gcHJldmVudCBvblNob3duVGFiIGZyb20gcmVnaXN0ZXJpbmcgc2hvd24gZXZlbnRzIHRoYXQgd2UgdHJpZ2dlcmVkIHZpYSBzaG93VGFic0Jhc2VkT25TdGF0ZS5cbiAgICpcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICB2YXIgc2hvd2luZ1RhYnNCYXNlZE9uU3RhdGUgPSBmYWxzZTtcblxuICAvKipcbiAgICogVXNlZCB0byB1cGRhdGUgYGhpc3Rvcnkuc3RhdGVgIHRvIHJlZmxlY3QgdGhlIGRlZmF1bHQgYWN0aXZlIHRhYnMgb24gaW5pdGlhbCBwYWdlIGxvYWQuIFRoaXMgc3VwcG9ydHMgcHJvcGVyXG4gICAqIGBoaXN0b3J5LmJhY2tgIGhhbmRsaW5nIHdoZW4gYGRhdGEtdGFiLWhpc3RvcnktdXBkYXRlLXVybGAgaXMgdHJ1ZS5cbiAgICovXG4gIGZ1bmN0aW9uIGJhY2tmaWxsSGlzdG9yeVN0YXRlKCkge1xuICAgIHZhciBuZXdTdGF0ZSA9IG51bGw7XG5cbiAgICBqUXVlcnkoJ2xpLmFjdGl2ZSA+IFtkYXRhLXRhYi1oaXN0b3J5XScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRhY3RpdmVUYWJFbGVtZW50ID0galF1ZXJ5KHRoaXMpO1xuICAgICAgdmFyIHNlbGVjdG9yID0gZ2V0VGFiU2VsZWN0b3IoJGFjdGl2ZVRhYkVsZW1lbnQpO1xuXG4gICAgICBpZihzZWxlY3Rvcikge1xuICAgICAgICB2YXIgdGFiR3JvdXAgPSBnZXRUYWJHcm91cCgkYWN0aXZlVGFiRWxlbWVudCk7XG5cbiAgICAgICAgaWYodGFiR3JvdXApIHtcbiAgICAgICAgICBuZXdTdGF0ZSA9IGNyZWF0ZU5ld0hpc3RvcnlTdGF0ZShuZXdTdGF0ZSB8fCBoaXN0b3J5LnN0YXRlLCB0YWJHcm91cCwgc2VsZWN0b3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZihuZXdTdGF0ZSkge1xuICAgICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUobmV3U3RhdGUsICcnLCBudWxsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xvbmUgdGhlIGV4aXN0aW5nIHN0YXRlLCBlbnN1cmUgaXRzIGJvb3RzdHJhcFRhYkhpc3RvcnkgYXR0cmlidXRlIGlzIGFuIE9iamVjdCwgYW5kIGFkZCB0aGUgcHJvdmlkZWQgdGFiR3JvdXAgdG9cbiAgICogc2FpZCBib290c3RyYXBUYWJIaXN0b3J5IGF0dHJpYnV0ZS5cbiAgICpcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBleGlzdGluZ1N0YXRlXG4gICAqIEBwYXJhbSB7IXN0cmluZ30gdGFiR3JvdXBcbiAgICogQHBhcmFtIHshc3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcmV0dXJucyB7IW9iamVjdH1cbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZU5ld0hpc3RvcnlTdGF0ZShleGlzdGluZ1N0YXRlLCB0YWJHcm91cCwgc2VsZWN0b3IpIHtcbiAgICAvLyBDbG9uZSBoaXN0b3J5LnN0YXRlIGFuZCBlbnN1cmUgaXQgaGFzIGEgYm9vdHN0cmFwVGFiSGlzdG9yeSBlbnRyeS5cbiAgICB2YXIgbmV3U3RhdGUgPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBleGlzdGluZ1N0YXRlLCB7XG4gICAgICBib290c3RyYXBUYWJIaXN0b3J5OiB7fVxuICAgIH0pO1xuXG4gICAgbmV3U3RhdGUuYm9vdHN0cmFwVGFiSGlzdG9yeVt0YWJHcm91cF0gPSBzZWxlY3RvcjtcblxuICAgIHJldHVybiBuZXdTdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge2pRdWVyeX0gJHRhYlxuICAgKiBAcmV0dXJucyB7P3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGdldFRhYkdyb3VwKCR0YWIpIHtcbiAgICByZXR1cm4gcGFyc2VUcnV0aHlBdHRyaWJ1dGVWYWx1ZSgkdGFiLmRhdGEoJ3RhYi1oaXN0b3J5JykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSAkdGFiXG4gICAqIEByZXR1cm5zIHs/c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0VGFiU2VsZWN0b3IoJHRhYikge1xuICAgIHJldHVybiAkdGFiLmRhdGEoJ3RhcmdldCcpIHx8ICR0YWIuYXR0cignaHJlZicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY2VpdmVzIHRoZSBgc2hvd24uYnMudGFiYCBldmVudC4gVXBkYXRlcyBgaGlzdG9yeS5zdGF0ZWAgYXMgYXBwcm9wcmlhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBzaG93bkV2dFxuICAgKi9cbiAgZnVuY3Rpb24gb25TaG93blRhYihzaG93bkV2dCkge1xuICAgIGlmKCFzaG93aW5nVGFic0Jhc2VkT25TdGF0ZSkge1xuICAgICAgdmFyICRhY3RpdmF0ZWRUYWIgPSBqUXVlcnkoc2hvd25FdnQudGFyZ2V0KTtcbiAgICAgIHZhciBzZWxlY3RvciA9IGdldFRhYlNlbGVjdG9yKCRhY3RpdmF0ZWRUYWIpO1xuXG4gICAgICBpZihzZWxlY3Rvcikge1xuICAgICAgICB2YXIgdGFiR3JvdXAgPSBnZXRUYWJHcm91cCgkYWN0aXZhdGVkVGFiKTtcblxuICAgICAgICBpZih0YWJHcm91cCkge1xuICAgICAgICAgIHZhciBoaXN0b3J5Q2hhbmdlciA9ICRhY3RpdmF0ZWRUYWIuZGF0YSgndGFiLWhpc3RvcnktY2hhbmdlcicpIHx8IEJvb3RzdHJhcFRhYkhpc3Rvcnkub3B0aW9ucy5kZWZhdWx0Q2hhbmdlcjtcbiAgICAgICAgICB2YXIgbmV3U3RhdGUgPSBjcmVhdGVOZXdIaXN0b3J5U3RhdGUoaGlzdG9yeS5zdGF0ZSwgdGFiR3JvdXAsIHNlbGVjdG9yKTtcbiAgICAgICAgICB2YXIgdXBkYXRlVVJMID0gKGZ1bmN0aW9uICgkYWN0aXZhdGVkVGFiKSB7XG4gICAgICAgICAgICBpZihzZWxlY3RvclswXSA9PT0gJyMnKSB7XG4gICAgICAgICAgICAgIHZhciBlbGVtZW50VXBkYXRlVVJMT3B0aW9uID0gcGFyc2VUcnV0aHlBdHRyaWJ1dGVWYWx1ZSgkYWN0aXZhdGVkVGFiLmRhdGEoJ3RhYi1oaXN0b3J5LXVwZGF0ZS11cmwnKSk7XG5cbiAgICAgICAgICAgICAgaWYoZWxlbWVudFVwZGF0ZVVSTE9wdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEJvb3RzdHJhcFRhYkhpc3Rvcnkub3B0aW9ucy5kZWZhdWx0VXBkYXRlVVJMO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXBkYXRlVVJMT3B0aW9uO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkoJGFjdGl2YXRlZFRhYik7XG5cbiAgICAgICAgICBzd2l0Y2goaGlzdG9yeUNoYW5nZXIpIHtcbiAgICAgICAgICAgIGNhc2UgJ3B1c2gnOlxuICAgICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZShuZXdTdGF0ZSwgJycsIHVwZGF0ZVVSTCA/IHNlbGVjdG9yIDogbnVsbCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncmVwbGFjZSc6XG4gICAgICAgICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKG5ld1N0YXRlLCAnJywgdXBkYXRlVVJMID8gc2VsZWN0b3IgOiBudWxsKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gdGFiLWhpc3RvcnktY2hhbmdlcjogJyArIGhpc3RvcnlDaGFuZ2VyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVjZWl2ZXMgdGhlIGBwb3BzdGF0ZWAgZXZlbnQuIFNob3dzIHRhYnMgYmFzZWQgb24gdGhlIHZhbHVlIG9mIGBoaXN0b3J5LnN0YXRlYCBhcyBhcHByb3ByaWF0ZS5cbiAgICovXG4gIGZ1bmN0aW9uIG9uUG9wU3RhdGUoKSB7XG4gICAgdmFyIGJvb3RzdHJhcFRhYkhpc3RvcnkgPSBoaXN0b3J5LnN0YXRlICYmIGhpc3Rvcnkuc3RhdGUuYm9vdHN0cmFwVGFiSGlzdG9yeTtcblxuICAgIGlmKGJvb3RzdHJhcFRhYkhpc3RvcnkpIHtcbiAgICAgIHNob3dUYWJzQmFzZWRPblN0YXRlKGJvb3RzdHJhcFRhYkhpc3RvcnkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBnaXZlbiB2YWx1ZSwgX3VubGVzc18gdGhhdCB2YWx1ZSBpcyBhbiBlbXB0eSBzdHJpbmcsIGluIHdoaWNoIGNhc2UgYHRydWVgIGlzIHJldHVybmVkLlxuICAgKlxuICAgKiBSYXRpb25hbGU6IEhBTUwgZGF0YSBhdHRyaWJ1dGVzIHdoaWNoIGFyZSBzZXQgdG8gYHRydWVgIGFyZSByZW5kZXJlZCBhcyBhIGJsYW5rIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGZ1bmN0aW9uIHBhcnNlVHJ1dGh5QXR0cmlidXRlVmFsdWUodmFsdWUpIHtcbiAgICBpZih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0gZWxzZSBpZih2YWx1ZSA9PT0gJycpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3cgdGFicyBiYXNlZCB1cG9uIHRoZSBhbmNob3IgY29tcG9uZW50IG9mIGB3aW5kb3cubG9jYXRpb25gLlxuICAgKi9cbiAgZnVuY3Rpb24gc2hvd1RhYnNCYXNlZE9uQW5jaG9yKCkge1xuICAgIGlmKEJvb3RzdHJhcFRhYkhpc3Rvcnkub3B0aW9ucy5zaG93VGFic0Jhc2VkT25BbmNob3IpIHtcbiAgICAgIHZhciBhbmNob3IgPSB3aW5kb3cubG9jYXRpb24gJiYgd2luZG93LmxvY2F0aW9uLmhhc2g7XG5cbiAgICAgIGlmKGFuY2hvcikge1xuICAgICAgICB2YXIgJHRhYkVsZW1lbnQgPSBzaG93VGFiRm9yU2VsZWN0b3IoYW5jaG9yKTtcblxuICAgICAgICBpZigkdGFiRWxlbWVudCAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAmJiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgIHZhciBhbmNob3JZT2Zmc2V0ID0gKGZ1bmN0aW9uICgkdGFiRWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRTZXR0aW5nID0gJHRhYkVsZW1lbnQuZGF0YSgndGFiLWhpc3RvcnktYW5jaG9yLXktb2Zmc2V0Jyk7XG5cbiAgICAgICAgICAgIGlmKGVsZW1lbnRTZXR0aW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIEJvb3RzdHJhcFRhYkhpc3Rvcnkub3B0aW9ucy5kZWZhdWx0QW5jaG9yWU9mZnNldDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50U2V0dGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSgkdGFiRWxlbWVudCk7XG5cbiAgICAgICAgICAvLyBIQUNLOiBUaGlzIHByZXZlbnRzIHNjcm9sbGluZyB0byB0aGUgdGFiIG9uIHBhZ2UgbG9hZC4gVGhpcyByZWxpZXMgb24gdGhlIGZhY3QgdGhhdCB3ZSBzaG91bGQgbmV2ZXIgZ2V0XG4gICAgICAgICAgLy8gICBoZXJlIG9uIGBoaXN0b3J5LmZvcndhcmRgLCBgaGlzdG9yeS5iYWNrYCwgb3IgYGxvY2F0aW9uLnJlbG9hZGAsIHNpbmNlIGluIGFsbCB0aG9zZSBzaXR1YXRpb25zIHRoZVxuICAgICAgICAgIC8vICAgYGhpc3Rvcnkuc3RhdGVgIG9iamVjdCBzaG91bGQgaGF2ZSBiZWVuIHVzZWQgKHVubGVzcyB0aGUgYnJvd3NlciBkaWQgbm90IHN1cHBvcnQgdGhlIG1vZGVybiBIaXN0b3J5IEFQSSkuXG4gICAgICAgICAgaWYoYW5jaG9yWU9mZnNldCB8fCBhbmNob3JZT2Zmc2V0ID09PSAwKSB7XG4gICAgICAgICAgICB2YXIgc2Nyb2xsTGlzdGVuZXIgPSBmdW5jdGlvbiByZXNldEFuY2hvclNjcm9sbCAoKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzY3JvbGxMaXN0ZW5lcik7XG4gICAgICAgICAgICAgIHZhciBzY3JvbGxQYXJhbSA9IGdldFVybFBhcmFtZXRlcignc2Nyb2xsVG8nKTtcblxuICAgICAgICAgICAgICBpZihzY3JvbGxQYXJhbSkge1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvUXVlcnlBbmNob3IoJ3Njcm9sbFRvJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGFuY2hvcllPZmZzZXQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc2Nyb2xsTGlzdGVuZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG93IGEgdGFiIHdoaWNoIGNvcnJlc3BvbmRzIHRvIHRoZSBwcm92aWRlZCBzZWxlY3Rvci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gQSBDU1Mgc2VsZWN0b3IuXG4gICAqIEByZXR1cm5zIHs/alF1ZXJ5fSAtIFRoZSB0YWIgd2hpY2ggd2FzIGZvdW5kIHRvIHNob3cgKGV2ZW4gaWYgc2FpZCB0YWIgd2FzIGFscmVhZHkgYWN0aXZlKS5cbiAgICovXG4gIGZ1bmN0aW9uIHNob3dUYWJGb3JTZWxlY3RvcihzZWxlY3Rvcikge1xuICAgIHZhciAkdGFiRWxlbWVudCA9IChmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgIHZhciAkcmV0ID0gbnVsbDtcblxuICAgICAgalF1ZXJ5KCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0sIFtkYXRhLXRvZ2dsZT1cInBpbGxcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRwb3RlbnRpYWxUYWIgPSBqUXVlcnkodGhpcyk7XG5cbiAgICAgICAgaWYoKCRwb3RlbnRpYWxUYWIuYXR0cignaHJlZicpID09PSBzZWxlY3RvciB8fCAkcG90ZW50aWFsVGFiLmRhdGEoJ3RhcmdldCcpID09PSBzZWxlY3RvcikgJiYgZ2V0VGFiR3JvdXAoJHBvdGVudGlhbFRhYikpIHtcbiAgICAgICAgICAkcmV0ID0gJHBvdGVudGlhbFRhYjtcblxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiAkcmV0O1xuICAgIH0pKHNlbGVjdG9yKTtcblxuICAgIGlmKCR0YWJFbGVtZW50KSB7XG4gICAgICAkdGFiRWxlbWVudC50YWIoJ3Nob3cnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJHRhYkVsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZSB0aHJvdWdoIHRoZSBwcm92aWRlZCBzZXQgb2YgdGFiIHRhYiBncm91cHMsIHNob3dpbmcgdGhlIHRhYnMgYmFzZWQgb24gdGhlIHN0b3JlZCBzZWxlY3RvcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBib290c3RyYXBUYWJIaXN0b3J5IC0gRWFjaCBvZiB0aGUgdmFsdWVzIGlzIHBhc3NlZCB0byBzaG93VGFiRm9yU2VsZWN0b3I7IHRoZSBrZXlzIGFyZSBhY3R1YWxseSBpcnJlbGV2YW50LlxuICAgKi9cbiAgZnVuY3Rpb24gc2hvd1RhYnNCYXNlZE9uU3RhdGUoYm9vdHN0cmFwVGFiSGlzdG9yeSkge1xuICAgIHNob3dpbmdUYWJzQmFzZWRPblN0YXRlID0gdHJ1ZTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IodmFyIGsgaW4gYm9vdHN0cmFwVGFiSGlzdG9yeSkge1xuICAgICAgICBpZihib290c3RyYXBUYWJIaXN0b3J5Lmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgc2hvd1RhYkZvclNlbGVjdG9yKGJvb3RzdHJhcFRhYkhpc3Rvcnlba10pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNob3dpbmdUYWJzQmFzZWRPblN0YXRlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoIHRoZSB2YWx1ZSBvZiBhIFVSTCBwYXJhbWV0ZXJcbiAgICovXG4gIGZ1bmN0aW9uIGdldFVybFBhcmFtZXRlcihuYW1lKSB7XG4gICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1xcW10vLCAnXFxcXFsnKS5yZXBsYWNlKC9bXFxdXS8sICdcXFxcXScpO1xuICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoJ1tcXFxcPyZdJyArIG5hbWUgKyAnPShbXiYjXSopJyk7XG4gICAgdmFyIHJlc3VsdHMgPSByZWdleC5leGVjKGxvY2F0aW9uLnNlYXJjaCk7XG4gICAgcmV0dXJuIHJlc3VsdHMgPT09IG51bGwgPyAnJyA6IGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzFdLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTY3JvbGwgYW4gZWxlbWVudCBpbnRvIHZpZXcgaWYgaXQncyBvbiB0aGUgYWN0aXZlIHRhYi5cbiAgICovXG4gIGZ1bmN0aW9uIHNjcm9sbFRvUXVlcnlBbmNob3IocGFyYW1OYW1lKSB7XG5cbiAgICB2YXIgcGFyZW50VGFiID0gd2luZG93LmxvY2F0aW9uICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuICAgIHZhciBzY3JvbGxQYXJhbSA9IGdldFVybFBhcmFtZXRlcihwYXJhbU5hbWUpO1xuXG4gICAgaWYoc2Nyb2xsUGFyYW0pIHtcbiAgICAgIHZhciAkc2Nyb2xsRWxlbWVudCA9IGpRdWVyeSgnIycrc2Nyb2xsUGFyYW0pO1xuXG4gICAgICBpZigkc2Nyb2xsRWxlbWVudCkge1xuICAgICAgICB2YXIgaXNTY3JvbGxFbGVtZW50T25BY3RpdmVUYWIgPSAkc2Nyb2xsRWxlbWVudC5jbG9zZXN0KHBhcmVudFRhYik7XG4gICAgICAgIGlmKGlzU2Nyb2xsRWxlbWVudE9uQWN0aXZlVGFiLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgJHNjcm9sbEVsZW1lbnRbMF0uc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSkoKTsiXX0=
