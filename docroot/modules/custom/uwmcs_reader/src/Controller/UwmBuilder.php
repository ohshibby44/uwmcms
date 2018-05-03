<?php

namespace Drupal\uwmcs_reader\Controller;

/**
 * Controller connects API fields to Drupal fields.
 */
class UwmBuilder {

  /**
   * Modifies Information Manager data and adds special values.
   *
   * @param \stdClass $data
   *   Description here.
   */
  public static function prepareClinicValues(\stdClass &$data) {

    $fetcher = new UwmFetcher();

    // If clinic has location, get full location details:
    if (!empty($data->location->url)) {

      $location = $fetcher->getUrl($data->location->url);
      if (!empty($location->id)) {
        $data->location = $location;
      }

    }

    // If clinic has providers, populate full provider details:
    // @TODO: Change this attach bio-node.
    if (!empty($data->careNetworks)) {

      foreach ($data->careNetworks as &$network) {

        foreach ($network->bioInformations as &$bio) {

          if (!empty($bio->url)) {

            $detail = $fetcher->getUrl($bio->url);
            if (!empty($bio->id)) {
              $bio = $detail;
            }

          }

        }

      }

    }

  }

  /**
   * Modifies Information Manager data and adds special values.
   *
   * @param \stdClass $data
   *   Description here.
   */
  public static function prepareProviderValues(\stdClass &$data) {

    $fetcher = new UwmFetcher();

    // Get publications details:
    if (!empty($data->bioPublications[0]->pubMedId)) {

      $pubIds = [];
      foreach ($data->bioPublications as $k => $v) {
        array_push($pubIds, $v->pubMedId);
      }

      $data->bioPublicationsDetails = $fetcher->getUrl(
        'http://webservices.uwmedicine.org/api/publications?ids=' .
        implode(',', $pubIds));

    }

    // If provider has clinics, get details of each clinic:
    // @TODO: Change this to node-load locations.
    if (!empty($data->careNetworks[0]->clinicBases)) {

      foreach ($data->careNetworks as &$network) {

        foreach ($network->clinicBases as &$clinic) {

          if (!empty($clinic->url)) {

            $clinicDetail = $fetcher->getUrl($clinic->url);
            if (!empty($clinicDetail->id)) {
              $clinic = $clinicDetail;
            }

          }

        }

      }

    }

  }

}
