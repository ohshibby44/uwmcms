<?php

namespace Drupal\uwmcs_reader\Controller;

use Drupal\node\Entity\Node;

/**
 * Controller connects API fields to Drupal fields.
 */
class UwmMapper {

  /**
   * Description here.
   *
   * @param string|null $apiFieldValue
   *   Description here.
   * @param string|null $nodePathAlias
   *   Description here.
   *
   * @return \Drupal\Core\Entity\EntityInterface|mixed|null|static
   *   Description here.
   */
  public function loadApiNode(string $apiFieldValue = NULL, string $nodePathAlias = NULL) {

    if (!empty($apiFieldValue)) {

      // @TODO: Trim search, in case url it http, https, etc.
      $nodes = \Drupal::entityTypeManager()
        ->getStorage('node')
        ->loadByProperties(['field_information_manager_url' => $apiFieldValue]);

      if ($node = reset($nodes)) {

        return $node;

      }

    }

    if (empty($node) && !empty($nodePathAlias)) {

      $path = \Drupal::service('path.alias_manager')
        ->getPathByAlias($nodePathAlias);
      if (preg_match('/node\/(\d+)/', $path, $matches)) {

        return Node::load($matches[1]);

      }

    }

  }

}
