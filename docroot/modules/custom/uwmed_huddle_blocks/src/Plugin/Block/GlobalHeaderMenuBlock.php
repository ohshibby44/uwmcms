<?php

namespace Drupal\uwmed_huddle_blocks\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * This is the UWMed The Huddle Global Header Menu editable block.
 *
 * Drupal\Core\Block\BlockBase gives us a very useful set of basic functionality
 * for this configurable block. We can just fill in a few of the blanks with
 * defaultConfiguration(), blockForm(), blockSubmit(), and build().
 *
 * @Block(
 *   id = "global_header_menu_block",
 *   admin_label = @Translation("Global Header Menu Block")
 * )
 */
class GlobalHeaderMenuBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    // Here is the Block HTMl.
    $block_html = '<nav id="global-menu"><h2 class="visually-hidden">Global Menu</h2><ul class="menu">';
    $block_html .= '<li><a href="/contact">Contact</a></li>';
    $block_html .= '<li><a data-toggle="modal" data-target="#webform-subscribe-modal" href="#">Subscribe</a></li>';
    $block_html .= '<li class="expanded dropdown">';
    $block_html .= '<a href="#" class="dropdown-toggle" data-toggle="dropdown" ';
    $block_html .= 'role="button" aria-haspopup="true" aria-expanded="false">Submit</a>';
    $block_html .= '<ul class="menu dropdown-menu">';
    $block_html .= '<li><a href="/node/add/article">Story Ideas</a></li>';
    $block_html .= '<li><a href="/node/add/gallery">Photos &amp; Videos</a></li>';
    $block_html .= '<li><a href="/node/add/event">Events</a></li>';
    $block_html .= '<li><a href="/node/add/award">Awards</a></li>';
    $block_html .= '</ul></li></ul></nav>';
    $global_header_menu_block_string = [];
    $global_header_menu_block_string['global_header_menu_block_string'] = $this->$block_html;
    return $global_header_menu_block_string['global_header_menu_block_string'];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form['global_header_menu_block_string_text'] = [];
    $form['global_header_menu_block_string_text']['#type'] = 'textarea';
    $form['global_header_menu_block_string_text']['#title'] = $this->t('Block contents');
    $form['global_header_menu_block_string_text']['#description'] = $this->t('Global Header Menu Content - Default HTML');
    $form['global_header_menu_block_string_text']['#default_value'] = $this->configuration['global_header_menu_block_string'];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['global_header_menu_block_string'] = $form_state->getValue('global_header_menu_block_string_text');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build_array = [];
    $build_array['#type'] = 'markup';
    $build_array['#markup'] = $this->configuration['global_header_menu_block_string'];
    return $build_array;
  }

}
