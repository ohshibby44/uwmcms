<?php

namespace Drupal\uwmcs_reader\Controller;

/***
 * See https://www.drupal.org/docs/8/api/
 * routing-system/parameter-upcasting-in-routes
 *
 */
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Language\LanguageInterface;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use \Drupal\Core\Url;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Controller routines for UWMCS JSON Reader pages.
 */
class UwmController extends ControllerBase {

  private $requestUri;

  private $requestArgs;

  public $biosPathAlias = 'bios/';

  public $clinicPathAlias = 'locations/';

  /**
   * UwmController constructor.
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
  public function welcomePage() {

    $element = [
      '#markup' => 'Hello, world',
    ];

    return $element;
  }

  /**
   * @param bool $createIfMissing
   */
  public function validateProviderNode(bool $createIfMissing = FALSE) {

    $alias = $this->requestUri;
    if ($node = $this->fetchNodeByAlias($alias)) {

      return TRUE;

    }

    elseif ($createIfMissing) {

      $fetcher = new UwmFetcher();
      $provider = $fetcher->searchForProvider($this->requestArgs[1]);
      $node = $this->createProviderNode($provider);

      if ($node->id()) {

        $url = Url::fromRoute('entity.node.canonical', ['node' => $node->id()]);
        $response = new RedirectResponse($url->toString());
        $response->send();

        // return $this->redirect('/node/' . $node->id());

      }

    }


  }

  private function fetchNodeByAlias(string $alias = '') {


    $alias = \Drupal::service('path.alias_manager')
      ->getPathByAlias($alias);

    if (preg_match('/node\/(\d+)/', $alias, $matches)) {

      $node = Node::load($matches[1]);
      if ($node->id()) {
        return $node;

      }

    }

  }

  /**
   * Function desription.
   *
   * @return \Drupal\Core\Entity\EntityInterface
   *   Return description.
   */
  private function createProviderNode(\stdClass $settings) {


    // Populate defaults array.
    $node = [
      'title' => $settings->fullName,
      'changed' => REQUEST_TIME,
      'promote' => NODE_NOT_PROMOTED,
      'revision' => 1,
      'log' => '',
      'status' => NODE_PUBLISHED,
      'sticky' => NODE_NOT_STICKY,
      'type' => 'page',
      'langcode' => LanguageInterface::LANGCODE_NOT_SPECIFIED,
      'path' =>  [
        'alias' => $this->biosPathAlias . $settings->friendlyUrl,
      ],
      'body' => [
        'value' => $settings->bioIntro,
        'format' => filter_default_format(),
      ],
      'field_image' => [
        'target_id' => 123,
        'alt' => 'Hello world',
        'title' => 'Goodbye world',
      ],
    ];

    $node = entity_create('node', $node);
//    $node->setNewRevision();
    $node->save();
    pathauto_entity_insert($node);

    return $node;

  }

  /**
   * Function description.
   *
   * @param \Drupal\node\NodeInterface $node1
   *   Param description...
   * @param \Drupal\node\NodeInterface $node2
   *   Param description...
   */
  public function foo(NodeInterface $node1, NodeInterface $node2) {

    $a = 123;
    return NULL;
  }



}
