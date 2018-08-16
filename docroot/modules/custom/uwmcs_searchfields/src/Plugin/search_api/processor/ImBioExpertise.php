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
 *   id = "ImBioExpertise",
 *   label = @Translation("Bio Expertise List"),
 *   description = @Translation("Adds the Information Manager to the indexed
 *   data."), stages = {
 *     "add_properties" = 0,
 *   },
 *   locked = true,
 *   hidden = false,
 * )
 */
class ImBioExpertise extends ProcessorPluginBase {

  const FIELD_NAME = 'ImBioExpertise';
  const IM_FIELD_ROOT = 'expertise';
  const IM_FIELD_NAME = 'expertiseName';

  /**
   * {@inheritdoc}
   */
  public function getPropertyDefinitions(DatasourceInterface $datasource = NULL) {

    $properties = [];

    if (!$datasource) {

      $definition = [
        'label' => self::FIELD_NAME,
        'description' => $this->t('Provider expertises from the Information Manager(IM) API'),
        'type' => 'string',
        'processor_id' => $this->getPluginId(),
      ];

      $properties[strtolower(self::FIELD_NAME)] = new ProcessorProperty($definition);

    }

    return $properties;

  }

  /**
   * {@inheritdoc}
   */
  public function addFieldValues(ItemInterface $item) {

    // $item->itemId == 'entity:node/10006:und';.
    $entity = $item->getOriginalObject(TRUE)->getValue();

    if ($entity->getType() === 'uwm_provider') {

      $node = Node::load($entity->nid->value);
      $nodeData = $node->uwmcs_reader_api_values;

      $values = UwmSearchUtils::extractAllMatches(
        $nodeData, self::IM_FIELD_NAME);

      $fields = $item->getFields(FALSE);
      $fields = $this->getFieldsHelper()
        ->filterForPropertyPath($fields, NULL,
          strtolower(self::FIELD_NAME));

      foreach ($fields as $field) {

        foreach ($values as $value) {

          $field->addValue($value);

        }

      }

    }

  }

}
