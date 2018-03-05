<?php

namespace Drupal\uwmcs_extension;

use Drupal\uwmcs_reader\Controller\UwmMapper;

/**
 * A Twig extension that adds custom functions/filters.
 */
class TwigExtension extends \Twig_Extension {

  /**
   * Generates a list of all Twig functions that this extension defines.
   *
   * @return array
   *   A key/value array that defines custom Twig functions. The key denotes the
   *   function name used in the tag, e.g.:
   *
   * @code
   *   {{ uwm_test_func() }}
   * @endcode
   *
   *   The value is a standard PHP callback that defines what the function does.
   */
  public function getFunctions() {
    return [
      new \Twig_SimpleFunction('uwm_test_func', [$this, 'testFunction']),
      new \Twig_SimpleFunction('uwm_get_path_nid', [$this, 'getPathNid']),
      new \Twig_SimpleFunction('uwm_get_api_nid', [$this, 'getApiPathNid']),
    ];
  }

  /**
   * Generates a list of all Twig filters that this extension defines.
   *
   * @return array
   *   A key/value array that defines custom Twig filters. The key denotes the
   *   filter name used in the tag, e.g.:
   *
   * @code
   *   {{ foo|uwm_test_filter }}
   * @endcode
   *
   *   The value is a standard PHP callback that defines what the filter does.
   */
  public function getFilters() {
    return [
      new \Twig_SimpleFilter('uwm_test_filter', [$this, 'testFilter']),
      new \Twig_SimpleFilter('uwm_replace_markup', [$this, 'convertInlineStyles']),
      new \Twig_SimpleFilter('uwm_join_parts', [$this, 'joinArray']),
      new \Twig_SimpleFilter('uwm_format_phone', [$this, 'formatPhone']),

    ];
  }

  /**
   * Gets a unique identifier for this Twig extension.
   *
   * @return string
   *   A unique identifier for this Twig extension.
   */
  public function getName() {
    return 'uwmcs_extension';
  }

  /**
   * Description text.
   *
   * @param bool $upperCase
   *   Description text.
   *
   * @return string
   *   Description text.
   */
  public static function testFunction($upperCase = FALSE) {
    $string = "The quick brown box jumps over the lazy dog 123.";
    if ($upperCase) {
      return strtoupper($string);
    }
    else {
      return strtolower($string);
    }
  }

  /**
   * Description text.
   *
   * @param string $string
   *   Description text.
   *
   * @return string
   *   Description text.
   */
  public static function testFilter(string $string) {
    return strtolower($string);
  }

  /**
   * Description text.
   *
   * @param string $string
   *   Description text.
   *
   * @return string
   *   Description text.
   */
  public static function getPathNid(string $string) {

    return UwmMapper::getNidByPathAlias($string);

  }

  /**
   * Description text.
   *
   * @param string $string
   *   Description text.
   *
   * @return string
   *   Description text.
   */
  public static function getApiPathNid(string $string) {

    return UwmMapper::getNidByInformationManagerUri($string);

  }

  /**
   * Description text.
   *
   * @param string $string
   *   Description text.
   *
   * @return string
   *   Description text.
   */
  public static function convertInlineStyles(string $string) {

    $patterns = [
      '/(style="[^"]?italic[^>]+>)([^<]+)/',
      '/(style="[^"]?bold[^>]+>)([^<]+)/',
    ];

    $replacements = [
      '$1<em>$2</em>',
      '$1<strong>$2</strong>',
    ];

    return preg_replace($patterns, $replacements, $string);

  }

  /**
   * Description text.
   *
   * @param array $parts
   *   Description text.
   * @param string $separator
   *   Description text.
   *
   * @return string
   *   Description text.
   */
  public static function joinArray(array $parts = NULL, string $separator = '') {

    $cleanArr = [];

    foreach ($parts as $part) {
      $cleanPart = trim(
        preg_replace('/\s+/', ' ', $part)
      );
      if (!empty($cleanPart)) {
        $cleanArr[] = $cleanPart;
      }
    }

    return implode($separator, $parts);

  }

  /**
   * Description text.
   *
   * @param string $phone
   *   Description text.
   * @param string $separator
   *   Description text.
   *
   * @return null|string
   *   Description text.
   */
  public static function formatPhone(string $phone = NULL, string $separator = '-') {

    $digits = preg_replace('/[^0-9]/', '', $phone);

    if (strlen($digits) > 10) {
      return implode(
        [
          substr($digits, 0, strlen($digits) - 10),
          '(' . substr($digits, -10, 3) . ')',
          substr($digits, -7, 3),
          substr($digits, -4, 4),
        ], $separator);

    }
    elseif (strlen($digits) == 10) {
      return implode(
        [
          substr($digits, 0, 3),
          substr($digits, 3, 3),
          substr($digits, 6, 4),
        ], $separator);

    }
    elseif (strlen($digits) == 7) {
      return implode(
        [
          substr($digits, 0, 3),
          substr($digits, 3, 4),
        ], $separator);
    }

    return NULL;
  }

}
