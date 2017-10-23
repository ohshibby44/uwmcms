<?php

namespace Drupal\uwmcs_reader\Controller;

/***
 * See https://www.drupal.org/docs/8/api/
 * routing-system/parameter-upcasting-in-routes
 *
 */
use Drupal\Component\Utility\Html;
use Httpful\Request;

/**
 * Controller routines for UWMCS JSON Reader pages.
 */
class UwmcsReaderFetcher {

  protected static $informationManagerApiUrl = 'http://webservices.uwmedicine.org/api';

  /**
   * Return content for provider
   *
   * @return array
   *   A simple renderable array.
   */
  public function fetchProvider() {

    $element = [];

    $url = self::$informationManagerApiUrl . '/bioinformation/233599';
    $response = Request::get($url)
      ->expectsJson()
      ->withXTrivialHeader('Just as a demo')
      ->send();

    $element['#markup'] = "{$response->body->fullName} ....." .
      "has the following body text:<br><br>{$response->body->fullBio}";

    return $element;

  }

  /**
   * Return content for clinic.
   *
   * @return array
   *   A simple renderable array.
   */
  public function fetchClinic() {

    $element = [];

    $url = self::$informationManagerApiUrl . '/clinic/5365';
    $response = Request::get($url)
      ->expectsJson()
      ->withXTrivialHeader('Just as a demo')
      ->send();

    $element['#markup'] = "{$response->body->name} \n" .
      "has the following address:<br><br>{$response->body->address}";

    return $element;

  }

}
