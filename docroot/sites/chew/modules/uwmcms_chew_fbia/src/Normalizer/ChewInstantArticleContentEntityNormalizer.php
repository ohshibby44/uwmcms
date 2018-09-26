<?php

namespace Drupal\uwmcms_chew_fbia\Normalizer;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\fb_instant_articles\Normalizer\InstantArticleContentEntityNormalizer;
use Drupal\image\Entity\ImageStyle;
use Facebook\InstantArticles\Elements\Image;
use Facebook\InstantArticles\Elements\InstantArticle;

/**
 * Facebook Instant Articles content entity normalizer.
 *
 * Takes a content entity and normalizes it into a
 * \Facebook\InstantArticles\Elements\InstantArticle object.
 */
class ChewInstantArticleContentEntityNormalizer extends InstantArticleContentEntityNormalizer {

  /**
   * {@inheritdoc}
   */
  public function normalizeDefaultHeader(InstantArticle $article, ContentEntityInterface $entity) {
    $article = parent::normalizeDefaultHeader($article, $entity);
    $header = $article->getHeader();

    $primary_media = $this->getPrimaryMedia($entity);

    if (isset($primary_media['url'])) {
      $article_image = Image::create()
        ->withURL($primary_media['url']);
      $article_image->disableLike();
      $article_image->disableComments();
      $article_image->withPresentation(Image::ASPECT_FIT);


      $header->withCover($article_image);
    }

    return $article;
  }

  /**
   * {@inheritdoc}
   */
  protected function entityAuthor(ContentEntityInterface $entity) {
    $author_field = $entity->get('field_author');
    if (!isset($author_field)) {
      return '';
    }

    $author_entity = $author_field->first()->entity;
    if (!isset($author_entity)) {
      return '';
    }

    $author = $author_entity->getTitle();
    if (!isset($author)) {
      return '';
    }

    return $author;
  }

  /**
   * Get the Primary Media field.
   *
   * @param \Drupal\Core\Entity\ContentEntityInterface $entity
   *
   * @return array
   */
  protected function getPrimaryMedia(ContentEntityInterface $entity) {
    $primary_media = [];
    $image_style = 'medium';

    if (!$entity->hasField('field_primary_media')) {
      return $primary_media;
    }

    // Get the referenced media entities.
    $referenced_entities = $entity->get('field_primary_media')->referencedEntities();
    if (empty($referenced_entities)) {
      return $primary_media;
    }

    // Get the first media entity.
    $media_entity = array_shift($referenced_entities);
    if (empty($media_entity)) {
      return $primary_media;
    }

    // Decide with field to use, based on the media type.
    if ($media_entity->hasField('field_preview_image')) {
      $image_field_name = 'field_preview_image';
    }
    else {
      $image_field_name = 'image';
    }

    // Get the image field.
    $image_field = $media_entity->get($image_field_name);
    if (empty($image_field->entity)) {
      return NULL;
    }

    // Get the URI for the image.
    $image_uri = $image_field->entity->getFileUri();
    if (empty($image_uri)) {
      return NULL;
    }

    // Generate the URL for the image style.
    $primary_media['url'] = ImageStyle::load($image_style)->buildUrl($image_uri);

    return $primary_media;
  }

}
