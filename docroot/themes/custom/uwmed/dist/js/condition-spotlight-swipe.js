'use strict';

(function ($, Drupal) {
  Drupal.behaviors.conditionSpotlightSwipe = {
    attach: function attach() {
      // media query event handler
      if (matchMedia) {
        var mq = window.matchMedia("(max-width: 1199px)");
        mq.addListener(WidthChange);
        WidthChange(mq);
      }

      // detect media query change and turn condition spotlight swipe on/off
      function WidthChange(mq) {

        if (mq.matches) {
          // window width is less than 1200px
          window.conditionSpotlightSwipe = $('.condition-spotlight__content').Swipe({
            startSlide: 0,
            draggable: true,
            autoRestart: false,
            continuous: false,
            disableScroll: true,
            stopPropagation: true,
            callback: function callback(index, element) {},
            transitionEnd: function transitionEnd(index, element) {}
          }).data('Swipe');
        } else {
          // window width is more than 1200px
          if (window.conditionSpotlightSwipe) {
            window.conditionSpotlightSwipe.kill();
          }
        }
      }
    }
  };
})(jQuery, Drupal);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmRpdGlvbi1zcG90bGlnaHQtc3dpcGUuanMiXSwibmFtZXMiOlsiJCIsIkRydXBhbCIsImJlaGF2aW9ycyIsImNvbmRpdGlvblNwb3RsaWdodFN3aXBlIiwiYXR0YWNoIiwibWF0Y2hNZWRpYSIsIm1xIiwid2luZG93IiwiYWRkTGlzdGVuZXIiLCJXaWR0aENoYW5nZSIsIm1hdGNoZXMiLCJTd2lwZSIsInN0YXJ0U2xpZGUiLCJkcmFnZ2FibGUiLCJhdXRvUmVzdGFydCIsImNvbnRpbnVvdXMiLCJkaXNhYmxlU2Nyb2xsIiwic3RvcFByb3BhZ2F0aW9uIiwiY2FsbGJhY2siLCJpbmRleCIsImVsZW1lbnQiLCJ0cmFuc2l0aW9uRW5kIiwiZGF0YSIsImtpbGwiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQyxVQUFVQSxDQUFWLEVBQWFDLE1BQWIsRUFBcUI7QUFDcEJBLFNBQU9DLFNBQVAsQ0FBaUJDLHVCQUFqQixHQUEyQztBQUN6Q0MsWUFBUSxrQkFBWTtBQUNsQjtBQUNBLFVBQUlDLFVBQUosRUFBZ0I7QUFDZCxZQUFNQyxLQUFLQyxPQUFPRixVQUFQLENBQWtCLHFCQUFsQixDQUFYO0FBQ0FDLFdBQUdFLFdBQUgsQ0FBZUMsV0FBZjtBQUNBQSxvQkFBWUgsRUFBWjtBQUNEOztBQUVEO0FBQ0EsZUFBU0csV0FBVCxDQUFxQkgsRUFBckIsRUFBeUI7O0FBRXZCLFlBQUlBLEdBQUdJLE9BQVAsRUFBZ0I7QUFDZDtBQUNBSCxpQkFBT0osdUJBQVAsR0FBaUNILEVBQUUsK0JBQUYsRUFBbUNXLEtBQW5DLENBQXlDO0FBQ3hFQyx3QkFBWSxDQUQ0RDtBQUV4RUMsdUJBQVcsSUFGNkQ7QUFHeEVDLHlCQUFhLEtBSDJEO0FBSXhFQyx3QkFBWSxLQUo0RDtBQUt4RUMsMkJBQWUsSUFMeUQ7QUFNeEVDLDZCQUFpQixJQU51RDtBQU94RUMsc0JBQVUsa0JBQVVDLEtBQVYsRUFBaUJDLE9BQWpCLEVBQTBCLENBQ25DLENBUnVFO0FBU3hFQywyQkFBZSx1QkFBVUYsS0FBVixFQUFpQkMsT0FBakIsRUFBMEIsQ0FDeEM7QUFWdUUsV0FBekMsRUFXOUJFLElBWDhCLENBV3pCLE9BWHlCLENBQWpDO0FBWUQsU0FkRCxNQWVLO0FBQ0g7QUFDQSxjQUFJZixPQUFPSix1QkFBWCxFQUFvQztBQUNsQ0ksbUJBQU9KLHVCQUFQLENBQStCb0IsSUFBL0I7QUFDRDtBQUNGO0FBQ0Y7QUFDRjtBQWxDd0MsR0FBM0M7QUFvQ0QsQ0FyQ0QsRUFxQ0dDLE1BckNILEVBcUNXdkIsTUFyQ1giLCJmaWxlIjoiY29uZGl0aW9uLXNwb3RsaWdodC1zd2lwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoJCwgRHJ1cGFsKSB7XG4gIERydXBhbC5iZWhhdmlvcnMuY29uZGl0aW9uU3BvdGxpZ2h0U3dpcGUgPSB7XG4gICAgYXR0YWNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBtZWRpYSBxdWVyeSBldmVudCBoYW5kbGVyXG4gICAgICBpZiAobWF0Y2hNZWRpYSkge1xuICAgICAgICBjb25zdCBtcSA9IHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogMTE5OXB4KVwiKTtcbiAgICAgICAgbXEuYWRkTGlzdGVuZXIoV2lkdGhDaGFuZ2UpO1xuICAgICAgICBXaWR0aENoYW5nZShtcSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGRldGVjdCBtZWRpYSBxdWVyeSBjaGFuZ2UgYW5kIHR1cm4gY29uZGl0aW9uIHNwb3RsaWdodCBzd2lwZSBvbi9vZmZcbiAgICAgIGZ1bmN0aW9uIFdpZHRoQ2hhbmdlKG1xKSB7XG5cbiAgICAgICAgaWYgKG1xLm1hdGNoZXMpIHtcbiAgICAgICAgICAvLyB3aW5kb3cgd2lkdGggaXMgbGVzcyB0aGFuIDEyMDBweFxuICAgICAgICAgIHdpbmRvdy5jb25kaXRpb25TcG90bGlnaHRTd2lwZSA9ICQoJy5jb25kaXRpb24tc3BvdGxpZ2h0X19jb250ZW50JykuU3dpcGUoe1xuICAgICAgICAgICAgc3RhcnRTbGlkZTogMCxcbiAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGF1dG9SZXN0YXJ0OiBmYWxzZSxcbiAgICAgICAgICAgIGNvbnRpbnVvdXM6IGZhbHNlLFxuICAgICAgICAgICAgZGlzYWJsZVNjcm9sbDogdHJ1ZSxcbiAgICAgICAgICAgIHN0b3BQcm9wYWdhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cmFuc2l0aW9uRW5kOiBmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5kYXRhKCdTd2lwZScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIC8vIHdpbmRvdyB3aWR0aCBpcyBtb3JlIHRoYW4gMTIwMHB4XG4gICAgICAgICAgaWYgKHdpbmRvdy5jb25kaXRpb25TcG90bGlnaHRTd2lwZSkge1xuICAgICAgICAgICAgd2luZG93LmNvbmRpdGlvblNwb3RsaWdodFN3aXBlLmtpbGwoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pKGpRdWVyeSwgRHJ1cGFsKTsiXX0=
