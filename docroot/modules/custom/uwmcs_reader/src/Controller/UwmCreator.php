<?php

namespace Drupal\uwmcs_reader\Controller;

/***
 * See https://www.drupal.org/docs/8/api/
 * routing-system/parameter-upcasting-in-routes
 *
 */
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Language\LanguageInterface;
use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Controller routines for UWMCS JSON Reader pages.
 */
class UwmCreator extends ControllerBase {

  private $requestUri;

  private $requestArgs;

  public $biosPathRoot = 'bios';

  public $clinicPathRoot = 'locations';

  /**
   * UwmCreator constructor.
   */
  public function __construct() {

    $this->requestUri = \Drupal::request()->getRequestUri();
    $this->requestArgs = explode('/', trim($this->requestUri, '/'));

  }

  /**
   * Returns a simple page.
   *
   * @return array
   *   A simple renderable array.
   */
  public function adminPage() {
    $element = [
      '#markup' => 'This page intentionally left blank.',
    ];
    return $element;
  }

  /**
   * This is a description.
   *
   * @param bool $createIfMissing
   *   Description here.
   */
  public function validateRemoteNode(bool $createIfMissing = FALSE) {

    if ($this->validateNodeAlias($this->requestUri)) {

      // Alias exists. Nothing to do.
      return TRUE;

    }

    elseif ($createIfMissing) {

      $fetcher = new UwmFetcher();

      // Find the remote, API data:
      if ($this->requestArgs[0] === $this->biosPathRoot) {

        $search = ['friendlyUrl' => $this->requestArgs[1]];
        $data = $fetcher->getProvider($search);

        if (!empty($data->fullName)) {
          $provider = $this->prepareProviderNode($data);
          $node = $this->saveRemoteNode($provider);

        }
      }

      elseif ($this->requestArgs[0] === $this->clinicPathRoot) {

        $search = ['clinicUrl' => '/locations/' . $this->requestArgs[1]];
        $data = $fetcher->getClinic($search);

        if (!empty($data->clinicName)) {
          $clinic = $this->prepareClinicNode($data);
          $node = $this->saveRemoteNode($clinic);

        }
      }

      // If we created a node, redirect to it:
      if (!empty($node) && !empty($node->id())) {
        $url = Url::fromRoute('entity.node.canonical', ['node' => $node->id()]);
        $response = new RedirectResponse($url->toString());
        $response->send();

      }

    }

  }

  /**
   * This is a description.
   *
   * @param \stdClass $data
   *   Description here.
   *
   * @return array
   *   Description here.
   */
  private function prepareProviderNode(\stdClass $data) {

    // Populate defaults array.
    $settings = [
      'title' => $data->fullName,
      'changed' => REQUEST_TIME,
      'promote' => NODE_NOT_PROMOTED,
      'revision' => 1,
      'log' => '',
      'status' => NODE_PUBLISHED,
      'sticky' => NODE_NOT_STICKY,
      'type' => 'uwm_provider',
      'langcode' => LanguageInterface::LANGCODE_NOT_SPECIFIED,
      'path' => [
        'source' => '/node/1',
        'alias' => '/' . $this->biosPathRoot . '/' . $data->friendlyUrl,
      ],
      'field_information_manager_url' => $data->url,
    ];

    return $settings;

  }

  /**
   * This is a description.
   *
   * @param \stdClass $data
   *   Description here.
   *
   * @return array
   *   Description here.
   */
  private function prepareClinicNode(\stdClass $data) {

    $settings = [
      'title' => $data->clinicName,
      'changed' => REQUEST_TIME,
      'promote' => NODE_NOT_PROMOTED,
      'revision' => 1,
      'log' => '',
      'status' => NODE_PUBLISHED,
      'sticky' => NODE_NOT_STICKY,
      'type' => 'uwm_clinic',
      'langcode' => LanguageInterface::LANGCODE_NOT_SPECIFIED,
      'path' => [
        'source' => '/node/1',
        'alias' => '/' . $this->clinicPathRoot . '/' . str_replace('/locations/', '', $data->clinicUrl),
      ],
      'field_information_manager_url' => $data->url,
    ];

    return $settings;

  }

  /**
   * This is a description.
   *
   * @return \Drupal\Core\Entity\EntityInterface
   *   Description here.
   */
  private function saveRemoteNode(array $data) {

    $node = entity_create('node', $data);
    $node->save();

    // Add an url alias.
    // We can't do this before saving and knowing the nid.
    $path = [
      'source' => '/node/' . $node->id(),
      'alias' => $data['path']['alias'],
    ];

    $pathManager = \Drupal::service('path.alias_storage');
    $pathManager->delete(['alias' => $path['alias']]);
    $pathManager->save($path['source'], $path['alias']);

    return $node;

  }

  /**
   * Function desription.
   *
   * @param string $alias
   *   Drupal node path alias to search for.
   *
   * @return bool|null
   *   Description here.
   */
  private function validateNodeAlias(string $alias = '') {

    $pathManager = \Drupal::service('path.alias_storage');
    $alias = $pathManager->load(['alias' => $alias]);

    if (!empty($alias['pid'])) {

      // Let's not load the node.
      // Assume it exists if alias does.
      return TRUE;

    }

  }

}
