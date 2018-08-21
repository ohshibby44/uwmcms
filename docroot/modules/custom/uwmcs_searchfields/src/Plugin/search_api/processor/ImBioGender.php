<?php

namespace Drupal\uwmcs_searchfields\Plugin\search_api\Processor;

use Drupal\node\Entity\Node;
use Drupal\search_api\Datasource\DatasourceInterface;
use Drupal\search_api\Item\ItemInterface;
use Drupal\search_api\Processor\ProcessorPluginBase;
use Drupal\search_api\Processor\ProcessorProperty;
use Drupal\uwmcs_searchfields\Controller\UwmSearchUtils;

/**
 * Adds the item's URL to the indexed data.
 *
 * @SearchApiProcessor(
 *   id = "ImBioGender",
 *   label = @Translation("Bio Expertise List"),
 *   description = @Translation("Adds the Information Manager to the indexed
 *   data."), stages = {
 *     "add_properties" = 0,
 *   },
 *   locked = true,
 *   hidden = false,
 * )
 */
class ImBioGender extends ProcessorPluginBase {

  const FACET_NAME = 'ImBioGender';

  const FIELD_NAME = 'gender';

  /**
   * {@inheritdoc}
   */
  public function getPropertyDefinitions(DatasourceInterface $datasource = NULL) {

    $properties = [];

    if (!$datasource) {

      $definition = [
        'label' => self::FACET_NAME,
        'description' => $this->t('Provides value from the IM-API'),
        'type' => 'string',
        'processor_id' => $this->getPluginId(),
      ];

      $properties[strtolower(self::FACET_NAME)] = new ProcessorProperty($definition);

    }

    return $properties;

  }

  /**
   * {@inheritdoc}
   */
  public function addFieldValues(ItemInterface $item) {

    $facetValues = [];

    $entity = $item->getOriginalObject(TRUE)->getValue();
    if ($entity->getType() === 'uwm_provider') {

      $node = Node::load($entity->nid->value);
      if (!empty($node->uwmcs_reader_api_values)) {

        $data = UwmSearchUtils::extractAllMatches($node->uwmcs_reader_api_values, self::FIELD_NAME);
        foreach ($data as $value) {
          $facetValues[] = $value;
        }
      }

    }

    if (!empty($facetValues)) {

      $fields = $item->getFields(FALSE);
      $fields = $this->getFieldsHelper()
        ->filterForPropertyPath($fields, NULL,
          strtolower(self::FACET_NAME));

      foreach ($fields as $field) {
        foreach ($facetValues as $value) {
          $field->addValue($value);
        }

      }

    }

  }

}
