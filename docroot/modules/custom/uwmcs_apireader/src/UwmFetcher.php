<?php

namespace Drupal\uwmcs_reader\;

/***
 * See https://www.drupal.org/docs/8/api/
 * routing-system/parameter-upcasting-in-routes
 *
 */
use Httpful\Request;

/**
 * Controller routines for UWMCS JSON Reader pages.
 */
class UwmFetcher {

  protected static $apiUrl = 'http://webservices.uwmedicine.org/api';

  protected $providerDetail;

  protected $clinicDetail;

  protected $clinicsCache;

  protected $providersCache;

  /***
   * UwmFetcher constructor.
   *
   */
  public function __construct() {
  }

  /**
   * Returns a provider given a search string.
   *
   * @return array
   *   A simple renderable array.
   */
  public function findProvider(string $search = NULL) {

    $this->findProviders();
    // ...

    return [];

  }

  /**
   * Returns a clinic given a search string.
   *
   * @return array
   *   A simple renderable array.
   */
  public function findClinic(string $search = NULL) {

    $this->findClinics();
    // ...

    return [];

  }

  /**
   * Return content for all providers.
   *
   * @return array
   *   A simple renderable array.
   */
  public function fetchProviders() {

    $url = self::$apiUrl . '/bioinformation/';
    $response = Request::get($url)
      ->expectsJson()
      ->send();

    $this->providersCache = $response->body;
    return $response->body;

  }

  /**
   * Return content for provider.
   *
   * @return array
   *   A simple renderable array.
   */
  public function fetchProvider(int $providerId) {

    //    if($this->providersCache) {
    //
    //    }
    $url = self::$apiUrl . '/bioinformation/' . $providerId;
    $response = Request::get($url)
      ->expectsJson()
      ->send();

    return $response->body;

  }

  /**
   * Return content for all clinics.
   *
   * @return array
   *   A simple renderable array.
   */
  public function fetchClinics(string $search = NULL) {

    $url = self::$apiUrl . '/clinic/';
    $response = Request::get($url)
      ->expectsJson()
      ->send();

    $this->clinicsCache = $response->body;
    return $response->body;

  }

  /**
   * Return content for provider.
   *
   * @return array
   *   A simple renderable array.
   */
  public function fetchClinic(int $clinicId) {

    //    if($this->clinicsCache) {
    //
    //    }
    $url = self::$apiUrl . '/bioinformation/' . $clinicId;
    $response = Request::get($url)
      ->expectsJson()
      ->send();

    return $response->body;

  }


}
