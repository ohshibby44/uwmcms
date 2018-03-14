<?php

namespace Drupal\uwmcs_ecare_scheduling\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;

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
  public function getProviderId(string $searchString) {

    return 111;

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
        'class' => 'widgetframe',
        'style' => 'overflow:hidden; overflow-x:hidden; overflow-y:hidden;',
        'src' => 'https://devecare16.medical.washington.edu/mychartpoc/OpenScheduling/SignupAndSchedule/EmbeddedSchedule?id=' . $providerId . '&vt=9000&view=plain',
      ],
    ];

    return [
      '#type' => 'html_tag',
      '#tag' => 'div',
      '#attributes' => [
        'id' => 'ecare' . $providerId,
        'class' => 'hidden scheduleContainer',
        self::ECARE_TAG_ATTRIBUTE => $providerId,
      ],
      '#value' => render($iframe),
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

    $url = Url::fromRoute('entity.node.edit_form', ['node' => $providerId]);
    $url = Url::fromUserInput('#ecare' . $providerId);

    return [
      '#type' => 'link',
      '#url' => $url,
      '#title' => t('This link was rendered'),
      '#attributes' => [
        'class' => 'colorbox',
      ],
    ];

  }

}
