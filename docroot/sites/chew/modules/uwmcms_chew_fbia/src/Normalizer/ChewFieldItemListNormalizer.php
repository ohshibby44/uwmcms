<?php

namespace Drupal\uwmcms_chew_fbia\Normalizer;

use DOMDocument;
use Drupal\Component\Utility\Html;
use Drupal\Core\Field\FormatterInterface;
use Drupal\fb_instant_articles\Normalizer\FieldItemListNormalizer;
use Drupal\fb_instant_articles\Plugin\Field\InstantArticleFormatterInterface;

/**
 * Normalize FieldItemList object into an Instant Article object.
 */
class ChewFieldItemListNormalizer extends FieldItemListNormalizer {

  /**
   * {@inheritdoc}
   */
  public function normalize($object, $format = NULL, array $context = []) {
    /** @var \Drupal\Core\Field\FieldItemListInterface $object */
    if (!isset($context['instant_article'])) {
      return;
    }
    /** @var \Facebook\InstantArticles\Elements\InstantArticle $article */
    $article = $context['instant_article'];

    // If we're given an entity_view_display object as context, use that as a
    // mapping to guide the normalization.
    if (isset($context['entity_view_display'])) {
      /** @var \Drupal\Core\Entity\Entity\EntityViewDisplay $display */
      $display = $context['entity_view_display'];
      $formatter = $display->getRenderer($object->getName());

      if ($formatter instanceof InstantArticleFormatterInterface) {
        $component = $display->getComponent($object->getName());
        $formatter->viewInstantArticle($object, $article, $component['region']);
      }
      elseif ($formatter instanceof FormatterInterface) {
        $formatter->prepareView([$object->getEntity()->id() => $object]);
        $render_array = $formatter->view($object);
        if ($markup = (string) $this->renderer->renderPlain($render_array)) {
          // TODO: Find a more elegant way to prepare the markup.
          $markup = $this->prepareMarkup($markup);

          // Pass the markup through the Transformer.
          $document = new DOMDocument();
          // Before loading into DOMDocument, setup for success by taking care
          // of encoding issues.  Since we're dealing with HTML snippets, it
          // will always be missing a <meta charset="utf-8" /> or equivalent.
          $markup = '<!doctype html><html><head><meta charset="utf-8" /></head><body>' . $markup . '</body></html>';
          @$document->loadHTML(Html::decodeEntities($markup));

          // Note that we are putting the content of these fields into the body.
          $this->transformer->transform($article, $document);
        }
      }
    }
  }

  /**
   * Perform alterations specific to Right as Rain content.
   *
   * @param $markup
   *
   * @return string $markup;
   */
  protected function prepareMarkup($markup) {
    $search = [
      '#<(/?)article([^>]*)>#is', // Change <article> to <div>.
      '#src="/#is',               // Make image source paths absolute.
    ];
    $replace = [
      '<\1div\2>',
      'src="'. \Drupal::request()->getSchemeAndHttpHost() . '/',
    ];
    $markup = preg_replace($search, $replace, $markup);

    // Remove unneeded fields.
    $search = [
      '#<div[^>]+\bfield--name-field-primary-media\b[^>]*>(.+)</div>#is',
      '#<div[^>]+\bfield--name-field-author\b[^>]*>(.+)</div>#is',
      '#<div[^>]+\bfield--name-field-caption\b[^>]*>(.+?)</div>#is',
      '#<div[^>]+\bfield--name-field-credit\b[^>]*>(.+?)</div>#is',
    ];
    $replace = [
      '',
      '',
      '',
      '',
    ];
    $markup = preg_replace($search, $replace, $markup);

    // Alterations for callouts and asides.
    $search = [
      '#<div[^>]+\bfield--name-field-heading\b[^>]*>(.+?)</div>#is',
      '#<div[^>]+\bfield--name-field-body\b[^>]*>(.+?)</div>#is',
    ];
    $replace = [
      '<h2>\1</h2>',
      '\1',
    ];
    $markup = preg_replace($search, $replace, $markup);

    // Alterations for pull quotes.

    $attribution_count = 0;
    $search = '#<div[^>]+\bfield--name-field-quote-attribution\b[^>]*>(.+?)</div>#is';
    $replace = '<cite>\1</cite>';
    $markup = preg_replace($search, $replace, $markup, -1, $attribution_count);

    if($attribution_count > 0) {
      $search = '#<div[^>]+\bfield--name-field-quote-text\b[^>]*>(.+?)</div>.*?(<cite>.+?</cite>)#is';
      $replace = '<aside>\1\2</aside>';
      $markup = preg_replace($search, $replace, $markup);
    } else {
      $search = '#<div[^>]+\bfield--name-field-quote-text\b[^>]*>(.+?)</div>#is';
      $replace = '<aside>\1</aside>';
      $markup = preg_replace($search, $replace, $markup);
    }

    // Alterations for quick reads.
    $search = [
      '#<div[^>]+\bfield--name-field-superheading\b[^>]*>(.+?)</div>.*?<h2>(.+?)</h2>#is',
    ];
    $replace = [
      '<h2>\1: \2</h2>',
    ];
    $markup = preg_replace($search, $replace, $markup);

    $markup = trim($markup);

    return $markup;
  }

}
