<?php

namespace Drupal\uwmcs_ecare_scheduling\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;
use Drupal\Core\Render\Markup;

/**
 * Provides widget iframe for EPIC MyChart eCare.
 */
class ECareController extends ControllerBase {

  const ECARE_TAG_ATTRIBUTE = 'data-uwm-ecare-provider-id';

  /**
   * Description here.
   *
   * @param string $searchString
   *   Description here.
   *
   * @return int
   *   Description here.
   */
  public function findProviderId(string $searchString) {

    preg_match('/' . self::ECARE_TAG_ATTRIBUTE . '="(?P<id>[-_0-9]+)"/',
      $searchString, $matches);
    return $matches['id'] ?? NULL;

  }

  /**
   * Description here.
   *
   * @param int $providerId
   *   Description here.
   *
   * @return array
   *   Description here.
   */
  public function eCareWidget(int $providerId = 0) {

    $iframe = [
      '#type' => 'html_tag',
      '#tag' => 'iframe',
      '#attributes' => [
        'style' => 'overflow:hidden; overflow-x:hidden; overflow-y:hidden;width:100%;min-height:400px',
        'scrolling' => 'no',
        'src' => 'https://devecare16.medical.washington.edu/mychartpoc/OpenScheduling/SignupAndSchedule/EmbeddedSchedule?id=' . $providerId . '&vt=9000&view=plain',
        // 'src' => '/sites/default/files/MyChart%20-%20EmbeddedSchedule.html'.
      ],
    ];

    $button = [
      '#type' => 'html_tag',
      '#tag' => 'button',
      '#value' => t('Close'),
      '#attributes' => [
        'class' => 'btn btn-default',
        'data-dismiss' => 'modal',
      ],
    ];

    return [
      '#type' => 'html_tag',
      '#tag' => 'div',
      '#theme' => 'bootstrap_modal',
      '#attributes' => [
        'id' => 'ecare-container-' . $providerId,
        'class' => 'ecare scheduleContainer modal-fluid modal-full-height',
      ],
      '#value' => render($iframe),
      // If our theme suggestion is used,
      // set body for Bootstrap-modal.html.twig.
      '#body' => render($iframe),
      '#footer' => render($button),
    ];

  }

  /**
   * Description here.
   *
   * @param int $providerId
   *   Description here.
   *
   * @return array
   *   Description here.
   */
  public function eCareLink(int $providerId = 0) {

    $anchor = '#ecare-container-' . $providerId;
    // $url = Url::fromRoute('entity.node',
    // ['node' => $nodeId], ['fragment' => $anchor]);.
    $url = Url::fromUserInput($anchor);

    return [
      '#type' => 'link',
      '#url' => $url,
      '#title' => Markup::create('Schedule an Appointment Online'),

      '#attributes' => [
        'class' => '',
        'data-toggle' => 'modal',
        'data-target' => '#ecare-container-' . $providerId,
        'data-anchor' => $anchor,
      ],
    ];

  }

}
