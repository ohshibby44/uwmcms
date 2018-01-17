<?php

namespace Drupal\uwmed_uwmcms_blocks\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides an Accelerate Promotion (full-width) block.
 *
 * Drupal\Core\Block\BlockBase gives us a very useful set of basic functionality
 * for this configurable block. We can just fill in a few of the blanks with
 * defaultConfiguration(), blockForm(), blockSubmit(), and build().
 *
 * @Block(
 *   id = "accelerate_promotion_full_width_block",
 *   admin_label = @Translation("Accelerate Promotion Full-width")
 * )
 */
class AcceleratePromotionFullWidthBlock extends BlockBase {

  /**
   * {@inheritdoc}
   *
   * This method sets the block default configuration. This configuration
   * determines the block's behavior when a block is initially placed in a
   * region. Default values for the block configuration form should be added to
   * the configuration array. System default configurations are assembled in
   * BlockBase::__construct() e.g. cache setting and block title visibility.
   *
   * @see \Drupal\block\BlockBase::__construct()
   */
  public function defaultConfiguration() {
    $block_html = '<div class="accelerate-promotion-block__content visible-lg col-lg-7">';
    $block_html .= '<p>Right now, UW researchers, faculty and students are leading efforts to find cures, promote health and wellness around the world, and improve our community. Accelerate: The Campaign for UW Medicine allows you to be a part of this exciting future. See what\'s happening now and make a gift today.</p></div>';
    $block_html .= '<div class="accelerate-promotion-block__cta"><a class="btn btn-default" href="http://www.acceleratemed.org">View More</a></div>';

    return [
      'accelerate_promotion_full_width_string' => $block_html,
    ];
  }

  /**
   * {@inheritdoc}
   *
   * This method defines form elements for custom block configuration. Standard
   * block configuration fields are added by BlockBase::buildConfigurationForm()
   * (block title and title visibility) and BlockFormController::form() (block
   * visibility settings).
   *
   * @see \Drupal\block\BlockBase::buildConfigurationForm()
   * @see \Drupal\block\BlockFormController::form()
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form['accelerate_promotion_full_width_string_text'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Block contents'),
      '#description' => $this->t('Accelerate Promotion Full Width - Default HTML.'),
      '#default_value' => $this->configuration['accelerate_promotion_full_width_string'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   *
   * This method processes the blockForm() form fields when the block
   * configuration form is submitted.
   *
   * The blockValidate() method can be used to validate the form submission.
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['accelerate_promotion_full_width_string']
      = $form_state->getValue('accelerate_promotion_full_width_string_text');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
      '#markup' => $this->configuration['accelerate_promotion_full_width_string'],
    ];
  }

}
