<?php

namespace Drupal\uwmcs_extension;

use Drupal\image\Entity\ImageStyle;
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
      new \Twig_SimpleFunction(
        'uwm_test_func', [$this, 'testFunction']),
      new \Twig_SimpleFunction(
        'uwm_get_path_nid', [$this, 'getPathNid']),
      new \Twig_SimpleFunction(
        'uwm_get_api_nid', [$this, 'getApiPathNid']),
      new \Twig_SimpleFunction(
        'uwm_extract_parts', [$this, 'extractArrayValues']),
      new \Twig_SimpleFunction(
        'uwm_render_remote_image', [$this, 'styleRemoteImage']),

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
      new \Twig_SimpleFilter(
        'uwm_test_filter', [$this, 'testFilter']),
      new \Twig_SimpleFilter(
        'uwm_replace_markup', [$this, 'convertInlineStyles']),
      new \Twig_SimpleFilter(
        'uwm_join_parts', [$this, 'joinArray']),
      new \Twig_SimpleFilter(
        'uwm_sort_parts', [$this, 'sortArrayByValues']),
      new \Twig_SimpleFilter(
        'uwm_format_phone', [$this, 'formatPhone']),
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
      '/<style .*style>/s',
    ];

    $replacements = [
      '$1<em>$2</em>',
      '$1<strong>$2</strong>',
      '',
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
  public static function joinArray(array $parts = NULL, string $separator = ', ') {

    $cleanArr = [];

    foreach ($parts as $part) {
      $cleanPart = trim(
        preg_replace('/\s+/', ' ', $part)
      );
      if (!empty($cleanPart)) {
        $cleanArr[] = $cleanPart;
      }
    }

    return implode($separator, $cleanArr);

  }

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
   * @code
   * These are all valid:
   * {{ uwm_extract_parts(clinic, 'expertiseName') | uwm_join_parts(',<br>') |
   *   raw }}
   * {{ uwm_extract_parts(clinic.expertise, 'expertiseName') | slice(0, 4) |
   *   uwm_join_parts(',<br>') | raw }}
   * @endcode
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

  /**
   * Description here.
   *
   * @param mixed $data
   *   Description here.
   * @param string|null $sortKey
   *   Description here.
   *
   * @return mixed
   *   Description here.
   */
  public static function sortArrayByValues($data, string $sortKey = NULL) {

    usort($data, function ($a, $b) use ($sortKey) {

      if (isset($sortKey)) {

        if (is_array($a) && isset($a[$sortKey])) {

          return $a[$sortKey] <=> $b[$sortKey];

        }
        elseif (is_object($a) && isset($a->{$sortKey})) {

          return $a->{$sortKey} <=> $b->{$sortKey};

        }
      }

      return $a <=> $b;

    });

    return $data;

  }

  /**
   * Description text.
   *
   * @param string|null $phone
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

  /**
   * Creates Drupal image from a remote file.
   *
   * @param string|null $imageUri
   *   Description text.
   * @param string $imageStyle
   *   Description text.
   *
   * @return array
   *   Description here.
   *
   * @code
   * {% set image = uwm_render_remote_image('http://abc.com/image.jpg,
   *   'medium') %}
   * {{ image }}
   *
   * OR
   * {% set image = uwm_render_remote_image('http://abc.com/image.jpg) %}
   * <img src="{{ image['#uri'] | image_style('default_responsive_image') }}">
   *
   * @endcode
   */
  public static function styleRemoteImage(string $imageUri = NULL, string $imageStyle = NULL) {

    $managed = FALSE;
    $parsed_url = parse_url($imageUri);
    $path = file_build_uri('uwm_r' . preg_replace('/[^a-zA-Z0-9.]/', '.', $parsed_url['path']));

    try {

      $data = (string) \Drupal::httpClient()->get($imageUri)->getBody();
      $local = $managed ? file_save_data($data, $path, FILE_EXISTS_REPLACE) :
        file_unmanaged_save_data($data, $path, FILE_EXISTS_REPLACE);

      $image = \Drupal::service('image.factory')->get($local);
      if (!$image->isValid()) {
        throw new \Exception('UWM couldn\'t get local');
      }

    }
    catch (\Exception $exception) {

      \Drupal::logger(__CLASS__)
        ->error(t('UWM couldn\'t fetch file from "@remote" due to error "@error".', [
          '@remote' => $imageUri,
          '@error' => $exception->getMessage(),
        ]));

      return [];

    }

    $renderArray = [
      '#theme' => 'image',
      '#width' => $image->getWidth(),
      '#height' => $image->getHeight(),
      '#uri' => $local,
      '#attributes' => [],
    ];

    if ($imageStyle && $style = ImageStyle::load($imageStyle)) {
      $build = [
        'style_name' => $imageStyle,
        'width' => $renderArray['#width'],
        'height' => $renderArray['#height'],
        'uri' => $local,
        'attributes' => [],
      ];

      template_preprocess_image_style($build);
    }

    return $build['image'] ?? $renderArray;

  }

}
