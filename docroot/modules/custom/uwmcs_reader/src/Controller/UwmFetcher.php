<?php

namespace Drupal\uwmcs_reader\Controller;

/***
 * See https://www.drupal.org/docs/8/api/
 * routing-system/parameter-upcasting-in-routes
 *
 */
use Drupal\Core\Cache\CacheBackendInterface;
use Httpful\Request;

/**
 * Controller routines for UWMCS JSON Reader pages.
 */
class UwmFetcher {

  protected static $apiUri = 'http://webservices.uwmedicine.org';

  protected static $clinicEndpoint = '/api/clinic';

  protected static $providerEndpoint = '/api/bioinformation';

  /**
   * UwmFetcher constructor.
   */
  public function __construct() {
  }


  /**
   * @param array $searchFields
   *
   * @return \stdClass
   */
  public function getProvider(array $searchFields = []) {

    $uri = $uri = self::$apiUri . self::$providerEndpoint;
    $provider = $this->findItem($searchFields, $uri);

    return $provider;

  }

  /**
   * @param array $searchFields
   *
   * @return \stdClass
   */
  public function getClinic(array $searchFields = []) {

    $uri = $uri = self::$apiUri . self::$clinicEndpoint;
    $clinic = $this->findItem($searchFields, $uri);

    return $clinic;

  }

  /**
   * Description here.
   *
   * @param string|null $search
   *   Description here.
   *
   * @return \stdClass
   *   Description here.
   */
  private function findItem(array $searchFields = [], string $apiUri = NULL) {

    foreach ($this->fetchItem($apiUri) as $dataItem) {

      foreach($searchFields as $key => $val) {

        if (isset($dataItem->{$key}) && $dataItem->{$key} === $val) {

          // Matched an item in the collection.
          // If it has it's own endpoint, return that instead.
          if(!empty($dataItem->url)) {

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

    if ($cache = $this->_cacheGet($apiUri)) {

      return $cache->data;

    }
    else {

      $response = Request::get($apiUri)
        ->expectsJson()
        ->send();

      $this->_cacheSet($apiUri, $response->body);

      return $response->body;

    }

  }

  /**
   * @param string $key
   *
   * @return false|object
   */
  private function _cacheGet(string $key) {

    $key = $this->_cacheKey($key);

    return \Drupal::cache()->get($key);

  }

  /**
   * @param string $key
   * @param $data
   */
  private function _cacheSet(string $key, $data) {

    $key = $this->_cacheKey($key);

    \Drupal::cache()->set($key, $data,
      CacheBackendInterface::CACHE_PERMANENT
    );

  }

  /**
   * @param string|NULL $dataUniqueUri
   *
   * @return mixed
   */
  private function _cacheKey(string $dataUniqueUri = NULL) {

    $key = $dataUniqueUri;

    return preg_replace("/[^A-Za-z0-9 ]/", '_', $key);

  }

}
