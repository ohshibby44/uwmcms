<?php

namespace Drupal\uwmcs_searchfields\Plugin\search_api\Processor;

use Drupal\node\Entity\Node;
use Drupal\search_api\Datasource\DatasourceInterface;
use Drupal\search_api\Item\ItemInterface;
use Drupal\search_api\Processor\ProcessorPluginBase;
use Drupal\search_api\Processor\ProcessorProperty;
use Drupal\uwmcs_searchfields\Controller\UwmSearchUtils;

/**
 * Provides a value to the Search API for the "Search within" drop-down.
 *
 * The value is based on different properties for a content item, such as its
 * node-type, its path alias, terms associated with the node and so on. Allows
 * us to create a custom general content type category.
 *
 * @SearchApiProcessor(
 *   id = "UwmContentCategory",
 *   label = @Translation("UwmContentCategory"),
 *   description = @Translation("Adds a general content area, like Education or
 *   Medical Services field to the search API."), stages = {
 *     "add_properties" = 0,
 *   },
 *   locked = true,
 *   hidden = false,
 * )
 *
 * @TODO: Make search facet use a taxonomy and move code to a node_load().
 */
class UwmContentCategory extends ProcessorPluginBase {

  const FIELD_NAME = 'UwmContentCategory';

  const VALUE_PROVIDER = 'Providers';

  const VALUE_LOCATION = 'Locations';

  const VALUE_MEDICAL_SERVICE = 'Medical Services';

  const VALUE_PATIENT_RESOURCES = 'Patient Info & Resources';

  const VALUE_EDUCATION = 'Education';

  const VALUE_RESEARCH = 'Research';

  const VALUE_REFERRALS = 'Referrals';

  /**
   * {@inheritdoc}
   */
  public function getPropertyDefinitions(DatasourceInterface $datasource = NULL) {

    $properties = [];

    if (!$datasource) {

      $definition = [
        'label' => self::FIELD_NAME,
        'description' => $this->t('General area or type of content item.'),
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
    $newValues = [];
    $entity = $item->getOriginalObject(TRUE)->getValue();

    // Provide a general search bucket based on different node values.
    if (method_exists($entity, 'getType') && !empty($entity->nid->value)) {

      $node = Node::load($entity->nid->value);
      self::setValueForContentType($node, $newValues);
      self::setValueForContentTerms($node, $newValues);
      self::setValueForContentAlias($node, $newValues);

    }

    if (!empty($newValues)) {

      $itemFields = $item->getFields(FALSE);
      $itemFields = $this->getFieldsHelper()
        ->filterForPropertyPath($itemFields, NULL,
          strtolower(self::FIELD_NAME));

      foreach ($itemFields as $field) {
        foreach ($newValues as $value) {
          $field->addValue($value);
        }
      }

    }

  }

  /**
   * Description here.
   *
   * @param \Drupal\node\Entity\Node $node
   *   Description here.
   * @param array $matches
   *   Description here.
   */
  private function setValueForContentType(Node $node, array &$matches) {

    $nodeType = $node->getType();

    if ($nodeType === 'uwm_provider') {
      $matches[] = self::VALUE_PROVIDER;
    }

    if ($nodeType === 'uwm_clinic') {
      $matches[] = self::VALUE_LOCATION;
    }

    if (in_array($nodeType, [
      'uwm_medical_service',
      'uwm_medical_specialty',
      'landing_page',
      'fact_page',
      'condition_spotlight',
      'content_spotlight',
    ])) {
      $matches[] = self::VALUE_PATIENT_RESOURCES;
    }

    if (in_array($nodeType, [
      'condition_spotlight',
      'content_spotlight',
    ])) {
      $matches[] = self::VALUE_RESEARCH;
    }

  }

  /**
   * Description here.
   *
   * @param \Drupal\node\Entity\Node $node
   *   Description here.
   * @param array $matches
   *   Description here.
   */
  private function setValueForContentAlias(Node $node, array &$matches) {

    $alias = \Drupal::service('path.alias_manager')
      ->getAliasByPath('/node/' . $node->nid->value);

    if (!empty($alias)) {

      if (stripos($alias, 'education') !== FALSE) {
        $matches[] = self::VALUE_EDUCATION;
      }

      if (stripos($alias, 'research') !== FALSE) {
        $matches[] = self::VALUE_RESEARCH;
      }

      if (stripos($alias, 'about') !== FALSE || stripos($alias, 'patient-care') !== FALSE || stripos($alias, 'patient-resources') !== FALSE) {
        $matches[] = self::VALUE_PATIENT_RESOURCES;
      }

      if (stripos($alias, 'services') !== FALSE) {
        $matches[] = self::VALUE_MEDICAL_SERVICE;
      }

    }

  }

  /**
   * Description here.
   *
   * @param \Drupal\node\Entity\Node $node
   *   Description here.
   * @param array $matches
   *   Description here.
   */
  private function setValueForContentTerms(Node $node, array &$matches) {

    $apiData = $node->uwmcs_reader_api_values;

    if ($node->getType() === 'uwm_clinic' || $node->getType() === 'uwm_provider') {

      $medicalServices = UwmSearchUtils::extractFirstMatch($apiData, 'lineOfCareName');
      if (!empty($medicalServices)) {
        $matches[] = self::VALUE_MEDICAL_SERVICE;
      }

      $expertises = UwmSearchUtils::extractFirstMatch($apiData, 'expertiseName');
      if (!empty($medicalServices)) {
        $matches[] = self::VALUE_MEDICAL_SERVICE;
      }

    }

  }

}
