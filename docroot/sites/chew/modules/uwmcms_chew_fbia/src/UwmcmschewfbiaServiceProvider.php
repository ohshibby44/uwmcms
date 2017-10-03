<?php

namespace Drupal\uwmcms_chew_fbia;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;

/**
 * Overrides normalizer services for Facebook Instant Articles.
 */
class UwmcmschewfbiaServiceProvider extends ServiceProviderBase {

  /**
   * {@inheritdoc}
   */
  public function alter(ContainerBuilder $container) {
    $definition1 = $container->getDefinition('serializer.fb_instant_articles.fbia.content_entity');
    $definition1->setClass('Drupal\uwmcms_chew_fbia\Normalizer\ChewInstantArticleContentEntityNormalizer');

    $definition2 = $container->getDefinition('serializer.fb_instant_articles.fbia.field_item_list');
    $definition2->setClass('Drupal\uwmcms_chew_fbia\Normalizer\ChewFieldItemListNormalizer');
  }

}
