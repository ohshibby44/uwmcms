<?php

namespace Drupal\uwmcms_chew_fields\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\Plugin\Field\FieldFormatter\EntityReferenceLabelFormatter;

/**
 * Plugin implementation of the 'Entity Reference First Label' formatter.
 *
 * Ideally this would not be a separate formatter, but a setting on the
 * default entity_reference_label formatter, but the Chaos Tools Blocks
 * module does not yet support third-party settings.
 *
 * @FieldFormatter(
 *   id = "entity_reference_label_first",
 *   label = @Translation("First label only"),
 *   description = @Translation("Display the label of the first referenced eneity."),
 *   field_types = {
 *     "entity_reference"
 *   }
 * )
 */
class EntityReferenceFirstLabelFormatter extends EntityReferenceLabelFormatter {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = parent::viewElements($items, $langcode);

    $first_element = array_shift($elements);

    return [$first_element];
  }

}
