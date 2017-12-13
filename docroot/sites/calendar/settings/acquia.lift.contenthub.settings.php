<?php

/**
 * Acquia Lift and Content Hub Configuration Overrides: calendar
 *
 * Some configuration for Lift and Content Hub is sensitive (API keys,
 * client secrets) but are the same across environments. These sensitive
 * configurations are stored in the database only and config export has been
 * turned off for these configs via the config_ignore module.
 *
 * This file provides site- and environment-specific overrides for Lift and
 * Content Hub configuration. These configurations are not sensitive.
 *
 * To generate the webhook_uuid config that is unique to each environment, you
 * must first enter the secret keys and save them to initialize each environment.
 * Then use drush config-get commands to fill in the details.
 *
 * drush @[sitename].uwmed.[environment] cget acquia_contenthub.admin_settings
 */

$SITENAME = 'calendar';

if (isset($_ENV['AH_SITE_ENVIRONMENT'])) {
  // Lift for all Acquia Cloud Environments
  $config['acquia_lift.settings']['credential']['site_id'] = $SITENAME . '-' . $_ENV['AH_SITE_ENVIRONMENT'];

  // Content Hub for all Acquia Cloud Environments
  $config['acquia_contenthub.admin_settings']['client_name'] = $SITENAME . '-' . $_ENV['AH_SITE_ENVIRONMENT'];

  switch ($_ENV['AH_SITE_ENVIRONMENT']) {
    case 'dev':
      $config['acquia_contenthub.admin_settings']['origin'] = '44acfe80-7450-4911-5f2a-d96c1226fcd7';
      $config['acquia_contenthub.admin_settings']['webhook_uuid'] = 'bc64df04-632b-4dc1-57bb-c24edbc090fc';
      $config['acquia_contenthub.admin_settings']['webhook_url'] = 'http://' . $SITENAME . '.cmsdev.uwmedicine.org/acquia-contenthub/webhook';
      break;

    case 'test':
      $config['acquia_contenthub.admin_settings']['origin'] = 'f111322f-1123-439f-4874-9982c5fa5b99';
      $config['acquia_contenthub.admin_settings']['webhook_uuid'] = '4b132d1f-c0e9-482c-50c1-37a5cb470576';
      $config['acquia_contenthub.admin_settings']['webhook_url'] = 'http://' . $SITENAME . '.cmsstage.uwmedicine.org/acquia-contenthub/webhook';
      break;

    case 'prod':
      $config['acquia_contenthub.admin_settings']['origin'] = '6aae09bc-64f8-45c4-66ce-c8a2f6a0394a';
      $config['acquia_contenthub.admin_settings']['webhook_uuid'] = 'c4c9446a-1c1d-4d2a-66a8-3e4503ace07b';
      $config['acquia_contenthub.admin_settings']['webhook_url'] = 'http://' . $SITENAME . '.cms.uwmedicine.org/acquia-contenthub/webhook';
      break;

    case 'ra':
      $config['acquia_contenthub.admin_settings']['origin'] = '';
      $config['acquia_contenthub.admin_settings']['webhook_uuid'] = '';
      $config['acquia_contenthub.admin_settings']['webhook_url'] = '';
      break;
  }
}