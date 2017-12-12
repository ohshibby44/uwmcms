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
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Controller routines for UWMCS JSON Reader pages.
 */
class UwmController extends ControllerBase {

  public $biosPathAlias = 'bios';

  public $clinicPathAlias = 'locations';

  private $requestUri;

  private $requestArgs;


  /**
   * UwmController constructor.
   */
  public function __construct() {

    $this->requestUri = \Drupal::request()->getRequestUri();
    $this->requestArgs = explode('/', trim($this->requestUri, '/'));

  }


  /**
   * This is a description.
   *
   * @param bool $createIfMissing
   *   Param description.
   */
  public function validateRemoteNode(bool $createIfMissing = FALSE) {


    if ($this->validateNodeByAlias($this->requestUri)) {

      return TRUE;

    }

    elseif ($createIfMissing) {

      $fetcher = new UwmFetcher();

      // Find the remote, API data:
      if ($this->requestArgs[0] === $this->biosPathAlias) {

        $data = $fetcher->searchForProvider($this->requestArgs[1]);
        $provider = $this->prepareRemoteNodeProvider($data);
        $node = $this->saveRemoteNode($provider);

      }

      if ($this->requestArgs[0] === $this->clinicPathAlias) {

        $data = $fetcher->searchForClinic($this->requestArgs[1]);
        $clinic = $this->prepareRemoteNodeClinic($data);
        $node = $this->saveRemoteNode($clinic);

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
   * Function desription.
   *
   */
  private function prepareRemoteNodeProvider(\stdClass $data) {

    // Populate defaults array.
    $settings = [
      'title' => $data->fullName,
      'changed' => REQUEST_TIME,
      'promote' => NODE_NOT_PROMOTED,
      'revision' => 1,
      'log' => '',
      'status' => NODE_PUBLISHED,
      'sticky' => NODE_NOT_STICKY,
      'type' => 'page',
      'langcode' => LanguageInterface::LANGCODE_NOT_SPECIFIED,
      'body' => [
        'value' => $data->bioIntro,
        'format' => filter_default_format(),
      ],
      'path' => [
        'source' => '/node/1',
        'alias' => '/'. $this->biosPathAlias . '/' . $data->friendlyUrl,
      ],
    ];

    return $settings;

  }

  private function prepareRemoteNodeClinic(\stdClass $data) {

    $settings = [
      'title' => $data->clinicName,
      'changed' => REQUEST_TIME,
      'promote' => NODE_NOT_PROMOTED,
      'revision' => 1,
      'log' => '',
      'status' => NODE_PUBLISHED,
      'sticky' => NODE_NOT_STICKY,
      'type' => 'page',
      'langcode' => LanguageInterface::LANGCODE_NOT_SPECIFIED,
      'body' => [
        'value' => $data->clinicName,
        'format' => filter_default_format(),
      ],
      'path' => [
        'source' => '/node/1',
        'alias' => '/'. $this->clinicPathAlias . str_replace('/locations/', '', $data->clinicUrl),
      ],
    ];

    return $settings;

  }

  /**
   * Function desription.
   *
   * @return \Drupal\Core\Entity\EntityInterface
   *   Return description.
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
    $pathManager->delete(array('alias' => $path['alias']));
    $pathManager->save($path['source'], $path['alias']);

    return $node;

  }

  /**
   * @param string $alias
   *   Drupal node path alias to search for.
   *
   * @return bool|null
   */
  private function validateNodeByAlias(string $alias = '') {

    $pathManager = \Drupal::service('path.alias_storage');
    $alias = $pathManager->load(['alias' => $alias]);

    if(!empty($alias['pid'])) {

      // Let's not load the node.
      // Assume it exists if alias does.
      return TRUE;

    }

  }

}
