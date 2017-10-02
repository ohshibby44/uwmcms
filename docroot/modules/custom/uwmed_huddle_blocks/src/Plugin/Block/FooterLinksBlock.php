<?php

namespace Drupal\uwmed_huddle_blocks\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * This is the UWMed The Huddle Footer Links editable block.
 *
 * Drupal\Core\Block\BlockBase gives us a very useful set of basic functionality
 * for this configurable block. We can just fill in a few of the blanks with
 * defaultConfiguration(), blockForm(), blockSubmit(), and build().
 *
 * @Block(
 *   id = "footer_links_Block",
 *   admin_label = @Translation("Footer Links Block")
 * )
 */
class FooterLinksBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {

    // Here is the Block HTMl.
    $block_html = '<div class="footer-links"><ul><li><a href="#">Airlift Northwest</a></li><li><a href="#">Harborview Medical Center</a></li><li><a href="#">Northwest Hospital &amp; Medical Center</a></li>';
    $block_html .= '<li><a href="#">UW Medical Center</a></li></ul><ul><li><a href="#">UW Neighborhood Clinics</a></li><li><a href="#">UW Physicians</a></li><li><a href="#">UW School of Medicine</a></li>';
    $block_html .= '<li><a href="#">Valley Medical Center</a></li></ul></div>';
    $footer_links_block_string = [];
    $footer_links_block_string['footer_links_block_string'] = $this->$block_html;
    return $footer_links_block_string['footer_links_block_string'];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form['footer_links_block_string_text'] = [];
    $form['footer_links_block_string_text']['#type'] = 'textarea';
    $form['footer_links_block_string_text']['#title'] = $this->t('Block contents');
    $form['footer_links_block_string_text']['#description'] = $this->t('Footer Links - Default HTML');
    $form['footer_links_block_string_text']['#default_value'] = $this->configuration['footer_links_block_string'];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['footer_links_block_string'] = $form_state->getValue('footer_links_block_string_text');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build_array = [];
    $build_array['#type'] = 'markup';
    $build_array['#markup'] = $this->configuration['footer_links_block_string'];
    return $build_array;
  }

}
