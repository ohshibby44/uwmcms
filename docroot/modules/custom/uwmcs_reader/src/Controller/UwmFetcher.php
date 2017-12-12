<?php

namespace Drupal\uwmcs_reader\Controller;

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

  /**
   * UwmFetcher constructor.
   */
  public function __construct() {
  }

  /**
   * @param null $search
   *   Provider Friendly URL to search for.
   *
   * @return \stdClass
   *
   */
  public function searchForProvider($search = NULL) {

    $this->fetchProviders();

    foreach ($this->providersCache as $provider) {

      if ($provider->friendlyUrl === $search) {
        return $provider;
      }
    }

    return new \stdClass();

  }

  /**
   * @param null $search
   *   Clinic Friendly URL to search for.
   *
   * @return \stdClass
   *
   */
  public function searchForClinic($search = NULL) {

    $this->fetchClinics();
    // ...
    foreach ($this->clinicsCache as $clinic) {

      $parts = explode('/', $clinic->externalUrl);
      $slug = end($parts);

      if ($slug === $search) {
        return $clinic;
      }
    }

    return new \stdClass();

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
   * Return content for all clinics.
   *
   * @return array
   *   A simple renderable array.
   */
  public function fetchClinics() {

    $url = self::$apiUrl . '/clinic/';
    $response = Request::get($url)
      ->expectsJson()
      ->send();

    $this->clinicsCache = $response->body;
    return $response->body;

  }

}
