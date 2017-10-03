<?php

namespace Drupal\uwmed_huddle_blocks\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * This is the UWMed The Huddle Footer Social Links editable block.
 *
 * Drupal\Core\Block\BlockBase gives us a very useful set of basic functionality
 * for this configurable block. We can just fill in a few of the blanks with
 * defaultConfiguration(), blockForm(), blockSubmit(), and build().
 *
 * @Block(
 *   id = "footer_social_links_Block",
 *   admin_label = @Translation("Footer Social Links Block")
 * )
 */
class FooterSocialLinksBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {

    // Here is the Block HTMl.
    $block_html = '<div class="footer-uw-social-wrap">';
    $block_html .= '<div class="footer-uw-link"><a class="svg" href="http://www.uwmedicine.org/" target="_blank">UW Medicine</a>';
    $block_html .= '<a href="http://www.uwmedicine.org/" target="_blank">UWMedicine.org</a></div>';
    $block_html .= '<div class="footer-social-links"><ul><li>';
    $block_html .= '<a class="facebook" href="#">Facebook</a></li><li><a class="twitter" href="#">Twitter</a></li>';
    $block_html .= '<li><a class="youtube" href="#">Youtube</a></li><li><a class="linkedin" href="#">LinkedIn</a></li><li><a class="instagram" href="#">Instagram</a></li></ul></div></div>';
    $footer_social_links_block_string = [];
    $footer_social_links_block_string['footer_social_links_block_string'] = $this->$block_html;
    return $footer_social_links_block_string['footer_social_links_block_string'];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form['footer_social_links_block_string_text'] = [];
    $form['footer_social_links_block_string_text']['#type'] = 'textarea';
    $form['footer_social_links_block_string_text']['#title'] = $this->t('Block contents');
    $form['footer_social_links_block_string_text']['#description'] = $this->t('Footer Social Links - Default HTML');
    $form['footer_social_links_block_string_text']['#default_value'] = $this->configuration['footer_social_links_block_string'];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['footer_social_links_block_string'] = $form_state->getValue('footer_social_links_block_string_text');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build_array = [];
    $build_array['#type'] = 'markup';
    $build_array['#markup'] = $this->configuration['footer_social_links_block_string'];
    return $build_array;
  }

}
