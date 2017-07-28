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
  $config['acquia_lift']['settings']['credential'] = [
    'site_id' => $SITENAME . '-' . $_ENV['AH_SITE_ENVIRONMENT'],
    'assets_url' => 'https://lift3assets.lift.acquia.com/stable'
  ];

  // Content Hub for all Acquia Cloud Environments
  $config['acquia_contenthub']['admin_settings'] = [
    'hostname' => 'https://us-east-1.content-hub.acquia.com',
    'client_name' => $SITENAME . '-' . $_ENV['AH_SITE_ENVIRONMENT'],
  ];

  switch ($_ENV['AH_SITE_ENVIRONMENT']) {
    case 'dev':
      $config['acquia_contenthub']['admin_settings'] = [
        'webhook_uuid' => '47a7fa22-1def-4b7a-6af5-4f163caed22c',
        'webhook_url' => 'http://calendar.cmsdev.uwmedicine.org/acquia-contenthub/webhook',
      ];
      break;

    case 'test':
      $config['acquia_contenthub']['admin_settings'] = [
        'webhook_uuid' => '43820d7a-7f2b-414f-6cd7-20178919eb58',
        'webhook_url' => 'http://calendar.cmsstage.uwmedicine.org/acquia-contenthub/webhook',
      ];
      break;

    case 'prod':
      $config['acquia_contenthub']['admin_settings'] = [
        'webhook_uuid' => '89623f30-69ac-44e9-75b0-ab1fb462ff1d',
        'webhook_url' => 'http://calendar.cms.uwmedicine.org/acquia-contenthub/webhook',
      ];
      break;

    case 'ra':
      $config['acquia_contenthub']['admin_settings'] = [
        'webhook_uuid' => '', # not initialized yet
        'webhook_url' => 'http://calendar.cmsra.uwmedicine.org/acquia-contenthub/webhook',
      ];
      break;
  }
}