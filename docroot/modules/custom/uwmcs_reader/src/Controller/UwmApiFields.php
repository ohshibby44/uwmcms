<?php

namespace Drupal\uwmcs_reader\Controller;

/**
 * Adds extra data to IM API return values.
 */
class UwmApiFields {

  /**
   * Description here.
   *
   * @param array $imApiClinicTimeUseMasters
   *   Description here.
   *
   * @return array
   *   Description here.
   */
  public static function getClinicHoursArray(array $imApiClinicTimeUseMasters = []) {

    // If location has hours, get unix time for javascripts.
    $unixTime = function ($dayOfWeek, $timeOfDay, $useNext = FALSE) {
      $days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      $day = $days[$dayOfWeek];
      list($hours, $minutes, $seconds) = explode(':', $timeOfDay);

      // PHP next is the following, not next week:
      $time = strtotime(($useNext ? "Next " : "") . $day);
      $time = strtotime("+ $hours hours", $time);
      $time = strtotime("+ $minutes minutes", $time);
      $time = strtotime("+ $seconds seconds", $time);

      return $time;

    };

    foreach ($imApiClinicTimeUseMasters as &$collection) {

      $opens = $closes = $nextOpens = $nextCloses = [];
      foreach ($collection->hoursOfOperation as &$entry) {

        $opens[] = $unixTime($entry->dayOfWeek, $entry->startTime);
        $closes[] = $unixTime($entry->dayOfWeek, $entry->endTime);
        $nextOpens[] = $unixTime($entry->dayOfWeek, $entry->startTime, TRUE);
        $nextCloses[] = $unixTime($entry->dayOfWeek, $entry->endTime, TRUE);

      }

      $collection->opens = min($opens);
      $collection->closes = min($closes);
      $collection->nextOpens = min($nextOpens);
      $collection->nextCloses = min($nextCloses);

    }

    return $imApiClinicTimeUseMasters;

  }

}
