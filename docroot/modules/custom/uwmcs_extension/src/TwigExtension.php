<?php

namespace Drupal\uwmcs_extension;

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

    return \Drupal\uwmcs_reader\Controller\UwmMapper
      ::getNidByPathAlias($string);

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

    return \Drupal\uwmcs_reader\Controller\UwmMapper
      ::getNidByInformationManagerUri($string);

  }




}
