<?php

namespace Drupal\uwmcs_reader\Controller;

/***
 * See https://www.drupal.org/docs/8/api/
 * routing-system/parameter-upcasting-in-routes
 *
 */
use Drupal\Core\Cache\CacheBackendInterface;
use Httpful\Request;
use Httpful\Response;

/**
 * Controller routines for UWMCS JSON Reader pages.
 */
class UwmFetcher {

  protected static $cachePrefix = 'uwmftc';

  protected static $apiUri = 'http://webservices.uwmedicine.org';

  protected static $apiDevelopmentUri = 'http://uatwebservices.uwmedicine.org';

  protected static $clinicEndpoint = '/api/clinic';

  protected static $providerEndpoint = '/api/bioinformation';

  /**
   * UwmFetcher constructor.
   */
  public function __construct() {
  }

  /**
   * Description here.
   *
   * @param string $apiEndpoint
   *   Description here.
   *
   * @return \stdClass
   *   Description here.
   */
  public function getUrl(string $apiEndpoint = NULL) {

    if (self::isDevelopmentHost()) {

      $devHost = parse_url(self::$apiDevelopmentUri, PHP_URL_HOST);
      $prodHost = parse_url(self::$apiUri, PHP_URL_HOST);

      $apiEndpoint = str_ireplace($prodHost, $devHost, $apiEndpoint);

    }

    $data = $this->fetchItem($apiEndpoint);
    return $data;

  }

  /**
   * Description here.
   *
   * @param array $searchFields
   *   Description here.
   *
   * @return \stdClass
   *   Description here.
   */
  public function getProvider(array $searchFields = []) {

    $uri = $uri = self::$apiUri . self::$providerEndpoint;
    $provider = $this->findItem($searchFields, $uri);

    return $provider;

  }

  /**
   * Description here.
   *
   * @param array $searchFields
   *   Description here.
   *
   * @return \stdClass
   *   Description here.
   */
  public function getClinic(array $searchFields = []) {

    $uri = $uri = self::$apiUri . self::$clinicEndpoint;
    $clinic = $this->findItem($searchFields, $uri);

    return $clinic;

  }

  /**
   * Description here.
   *
   * @param array $searchFields
   *   Description here.
   * @param string|null $apiUri
   *   Description here.
   *
   * @return \stdClass
   *   Description here.
   */
  private function findItem(array $searchFields = [], string $apiUri = NULL) {

    foreach ($this->fetchItem($apiUri) as $dataItem) {

      foreach ($searchFields as $key => $val) {

        if (isset($dataItem->{$key}) && $dataItem->{$key} === $val) {

          // Matched an item in the collection.
          // If it has it's own endpoint, return that instead.
          if (!empty($dataItem->url)) {

            $detailView = $this->fetchItem($dataItem->url);

          }

          return empty($detailView) ? $dataItem : $detailView;
        }

      }
    }

    return new \stdClass();

  }

  /**
   * Return content for all providers.
   *
   * @return \stdClass
   *   Description here.
   */
  private function fetchItem(string $apiUri = NULL) {

    if (empty($apiUri)) {

      return new \stdClass();

    }
    elseif ($cache = $this->cacheGet($apiUri)) {

      return $cache->data;

    }
    else {

      try {

        // @TODO: Move special cases to request builder.
        if (stripos($apiUri, 'api/publications')) {

          // Extract JSONP and prepare JSON.
          $response = Request::get($apiUri)->parseWith(function ($body) {

            if ($body[0] !== '[' && $body[0] !== '{') {
              $body = substr($body, strpos($body, '('));
            }
            return json_decode(trim($body, '();'));

          })->send();

        }
        else {

          $response = Request::get($apiUri)
            ->expectsJson()
            ->send();

        }

        $this->validateResponse($response);
        $this->cacheSet($apiUri, $response->body);

        return $response->body;

      }
      catch (\Exception $e) {

        \Drupal::logger(__CLASS__)
          ->error('Unable to parse ' . $apiUri . $e->getMessage());
        return new \stdClass();

      }

    }

  }

  /**
   * Description here.
   *
   * @return bool
   *   Description here.
   */
  private function isDevelopmentHost() {

    if ($_ENV['AH_NON_PRODUCTION']) {
      return TRUE;
    }
    elseif (!file_exists('/var/www/site-php') && empty($_ENV['AH_SITE_ENVIRONMENT'])) {
      return TRUE;
    }

    return FALSE;

  }

  /**
   * Description here.
   *
   * @param string $key
   *   Description here.
   *
   * @return false|object
   *   Description here.
   */
  private function cacheGet(string $key) {

    if (self::isDevelopmentHost()) {
      return FALSE;
    }

    $key = $this->cacheKey($key);

    return \Drupal::cache()->get($key);

  }

  /**
   * Description here.
   *
   * @param string $key
   *   Description here.
   * @param mixed $data
   *   Description here.
   */
  private function cacheSet(string $key, $data) {

    $key = $this->cacheKey($key);

    \Drupal::cache()->set($key, $data,
      CacheBackendInterface::CACHE_PERMANENT
    );

  }

  /**
   * Description here.
   *
   * @param string|null $dataUniqueUri
   *   Description here.
   *
   * @return mixed
   *   Description here.
   */
  private function cacheKey(string $dataUniqueUri = NULL) {

    $key = $dataUniqueUri;

    return preg_replace("/[^A-Za-z0-9 ]/", '', $key);

  }

  /**
   * Description here.
   *
   * @param \Httpful\Response $response
   *   Description here.
   *
   * @throws \Exception
   *   Description here.
   */
  private function validateResponse(Response $response) {

    if (empty($response)) {
      throw new \Exception();
    }
    if ($response->code != 200) {
      throw new \Exception();
    }
    if (empty($response->body)) {
      throw new \Exception();
    }
    if (!is_object($response->body) && !is_array($response->body)) {
      throw new \Exception();
    }
    if (isset($response->body->message)) {
      if (stripos($response->body->message, 'request is invalid.')) {
        throw new \Exception();
      }
    }

  }

}
