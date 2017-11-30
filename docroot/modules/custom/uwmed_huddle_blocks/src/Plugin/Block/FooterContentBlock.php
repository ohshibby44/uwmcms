<?php

namespace Drupal\uwmed_huddle_blocks\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * This is the UWMed The Huddle Footer Content editable block.
 *
 * Drupal\Core\Block\BlockBase gives us a very useful set of basic functionality
 * for this configurable block. We can just fill in a few of the blanks with
 * defaultConfiguration(), blockForm(), blockSubmit(), and build().
 *
 * @Block(
 *   id = "footer_content_Block",
 *   admin_label = @Translation("Footer Content Block")
 * )
 */
class FooterContentBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {

    // Here is the Block HTMl.
    $block_html = '<div class="footer-accelerate">';
    $block_html .= '<a href="#">Accelerate - The Campaign for UW Medicine</a></div>';
    $block_html .= '<div class="footer-tagline">';
    $block_html .= '<h5>Our Mission: Improving the Health of the Public</h5></div>';
    $footer_content_block_string = [];
    $footer_content_block_string['footer_content_block_string'] = $this->$block_html;
    return $footer_content_block_string['footer_content_block_string'];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form['footer_content_block_string_text'] = [];
    $form['footer_content_block_string_text']['#type'] = 'textarea';
    $form['footer_content_block_string_text']['#title'] = $this->t('Block contents');
    $form['footer_content_block_string_text']['#description'] = $this->t('Footer Content - Default HTML');
    $form['footer_content_block_string_text']['#default_value'] = $this->configuration['footer_content_block_string'];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['footer_content_block_string'] = $form_state->getValue('footer_content_block_string_text');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build_array = [];
    $build_array['#type'] = 'markup';
    $build_array['#markup'] = $this->configuration['footer_content_block_string'];
    return $build_array;
  }

}
