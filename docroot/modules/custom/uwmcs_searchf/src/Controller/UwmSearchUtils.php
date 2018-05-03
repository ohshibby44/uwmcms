<?php

namespace Drupal\uwmcs_searchf\Controller;

/**
 * Controller connects API fields to Drupal fields.
 */
class UwmSearchUtils {

  /**
   * Description here.
   *
   * @param mixed $data
   *   Description here.
   * @param string|null $desiredKeyName
   *   Description here.
   * @param array $resultArray
   *   Description here.
   *
   * @return array
   *   Description here.
   */
  public static function extractArrayValues($data, string $desiredKeyName = NULL, array &$resultArray = []) {

    foreach ((array) $data as $key => $value) {

      if ($key === $desiredKeyName) {
        $resultArray[] = $value;
      }

      elseif (is_array($value) || is_object($value)) {

        self::extractArrayValues($value, $desiredKeyName, $resultArray);

      }

    }

    return (array) $resultArray;

  }

}
