<?php

/**
 * Acquia Lift and Content Hub Configuration Overrides: huddle
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

$SITENAME = 'huddle';

if (isset($_ENV['AH_SITE_ENVIRONMENT'])) {
  // Lift for all Acquia Cloud Environments
  $config['acquia_lift.settings']['credential']['site_id'] = $SITENAME . '-' . $_ENV['AH_SITE_ENVIRONMENT'];

  // Content Hub for all Acquia Cloud Environments
  $config['acquia_contenthub.admin_settings']['client_name'] = $SITENAME . '-' . $_ENV['AH_SITE_ENVIRONMENT'];

  switch ($_ENV['AH_SITE_ENVIRONMENT']) {
    case 'dev':
      $config['acquia_contenthub.admin_settings']['origin'] = 'aba38b50-4ccd-4ff1-7aed-e00a041bce59';
      $config['acquia_contenthub.admin_settings']['webhook_uuid'] = '6a2f7a78-465c-4a00-4431-e3e2688ac11b';
      $config['acquia_contenthub.admin_settings']['webhook_url'] = 'http://' . $SITENAME . '.cmsdev.uwmedicine.org/acquia-contenthub/webhook';
      break;

    case 'test':
      $config['acquia_contenthub.admin_settings']['origin'] = '1415d261-ac6d-4f54-52b0-9a9e1125a403';
      $config['acquia_contenthub.admin_settings']['webhook_uuid'] = '4f9c836e-10dc-4682-7ed3-44fc1bf399e5';
      $config['acquia_contenthub.admin_settings']['webhook_url'] = 'http://' . $SITENAME . '.cmsstage.uwmedicine.org/acquia-contenthub/webhook';
      break;

    case 'prod':
      $config['acquia_contenthub.admin_settings']['origin'] = 'cd8465cc-1e7a-4d91-610e-ad2d90a6f8bd';
      $config['acquia_contenthub.admin_settings']['webhook_uuid'] = 'cbd06f2a-fbe9-4b22-64c7-c0b7d88f9968';
      $config['acquia_contenthub.admin_settings']['webhook_url'] = 'http://' . $SITENAME . '.cms.uwmedicine.org/acquia-contenthub/webhook';
      break;

    case 'ra':
      $config['acquia_contenthub.admin_settings']['origin'] = '';
      $config['acquia_contenthub.admin_settings']['webhook_uuid'] = '';
      $config['acquia_contenthub.admin_settings']['webhook_url'] = '';
      break;
  }
}