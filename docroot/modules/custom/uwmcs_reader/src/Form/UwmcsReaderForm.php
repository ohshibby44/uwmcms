<?php

namespace Drupal\uwmcs_reader\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Controller routines for UWMCS JSON Reader pages.
 */
class UwmcsReaderForm extends ConfigFormBase {

  /**
   * Constructs UWMCS JSON Reader text with arguments.
   */
  public function getFormId() {
    return 'uwmcs_reader_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    // Form constructor.
    $form = parent::buildForm($form, $form_state);
    // Default settings.
    $config = $this->config('uwmcs_reader.settings');
    // Page title field.
    $form['page_title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('UWMCS JSON Reader generator page title:'),
      '#default_value' => $config->get('uwmcs_reader.page_title'),
      '#description' => $this->t('Give your uwmcs reader generator page a title.'),
    ];
    // Source text field.
    $form['source_text'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Source text for uwmcs reader generation:'),
      '#default_value' => $config->get('uwmcs_reader.source_text'),
      '#description' => $this->t('Write one sentence per line. Those sentences will be used to generate random text.'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {

  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->config('uwmcs_reader.settings');
    $config->set('uwmcs_reader.source_text', $form_state->getValue('source_text'));
    $config->set('uwmcs_reader.page_title', $form_state->getValue('page_title'));
    $config->save();
    return parent::submitForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'uwmcs_reader.settings',
    ];
  }

}
