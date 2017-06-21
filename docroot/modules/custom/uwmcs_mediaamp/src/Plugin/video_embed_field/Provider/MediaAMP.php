<?php

namespace Drupal\video_embed_field\Plugin\video_embed_field\Provider;

use Drupal\video_embed_field\ProviderPluginBase;

/**
 * A MediaAMP provider plugin.
 *
 * @VideoEmbedProvider(
 *   id = "MediaAMP",
 *   title = @Translation("MediaAMP")
 * )
 */
class MediaAMP extends ProviderPluginBase {

  /**
   * {@inheritdoc}
   */
  public static function getIdFromInput($input) {

    // @todo Update old preg
    // preg_match('/^https?:\/\/(www\.)?MediaAMP.com\/(channels\/[a-zA-Z0-9]*\/)?
    // (?<id>[0-9]*)(\/[a-zA-Z0-9]+)?(\#t=(\d+)s)?$/', $input, $matches);
    $pattern = '/https?:\/\/player\.mediaamp\.io\/.+media\/(?<id>[-_a-zA-Z0-9]+)/';
    preg_match($pattern, $input, $matches);
    return isset($matches['id']) ? $matches['id'] : FALSE;

  }

  /**
   * {@inheritdoc}
   */
  public function renderEmbedCode($width, $height, $autoplay) {

    $width = $width ? $width : '480';
    $height = $width ? $width : '270';

    $iframe = [
      '#type' => 'video_embed_iframe',
      '#provider' => 'MediaAMP',
      '#url' => sprintf('http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/embed/select/media/%s', $this->getVideoId()),
      '#query' => [
        'form' => 'html',
        // @todo Update this 'autoplay' => $autoplay,
      ],
      '#attributes' => [
        'width' => $width,
        'height' => $height,
        'frameborder' => '1',
        'allowfullscreen' => 'allowfullscreen',
        // @todo Update this 'style' => array("width: $width; height: $height"),
      ],
    ];

    if ($time_index = $this->getTimeIndex()) {

      $iframe['#fragment'] = sprintf('t=%s', $time_index);

    }

    return $iframe;

  }

  /**
   * Get the time index from the URL.
   *
   * @return string|false
   *   A time index parameter to pass to the frame or FALSE if none is found.
   */
  protected function getTimeIndex() {

    preg_match('/\#t=(?<time_index>(\d+)s)$/', $this->input, $matches);
    return isset($matches['time_index']) ? $matches['time_index'] : FALSE;

  }

  /**
   * {@inheritdoc}
   */
  public function getRemoteThumbnailUrl() {

    return 'http://jkcoze-sc.storage.googleapis.com/UWMC_-_Marketing_VMS/419/774/UW_Medicine_Strawberry_Fest_2017_(CC)_1080p_1920x1080_951384643780.jpg';
    // @todo Update this
    // <meta property="og:image" content="http://jkcoze-sc.storage.googleapis.com/UWMC_-_Marketing_VMS/419/774/UW_Medicine_Strawberry_Fest_2017_(CC)_1080p_1920x1080_951384643780.jpg"/>
    // return $this->oEmbedData()->thumbnail_url;
  }

  /**
   * Get the MediaAMP oembed data.
   *
   * @return array
   *   An array of data from the oembed endpoint.
   */
  protected function oEmbedData() {

    return json_decode(file_get_contents('http://vimeo.com/api/oembed.json?url=' . $this->getInput()));

  }

  /**
   * {@inheritdoc}
   */
  public function getName() {

    return 'UWMed Video...';
    // @todo Update this return $this->oEmbedData()->title;

  }

}
/*
 *
 *
Nick,

Example 1: Public ID = _KkGEnglfZ9q
Example 2: Public ID =  ellmMECE9wA5

iframe
<iframe src="http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/embed/select/media/
_KkGEnglfZ9q?form=html" width="480" height="270" frameBorder="0"
seamless="seamless" allowFullScreen></iframe>

<iframe src="http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/embed/select/media/
ellmMECE9wA5?form=html" width="480" height="270" frameBorder="0"
seamless="seamless" allowFullScreen></iframe>

Script
<div style="width: 480px; height: 270px"><script type="text/javascript" src="
http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/embed/select/media/_KkGEnglfZ9q
?form=javascript"></script></div>

<div style="width: 480px; height: 270px"><script type="text/javascript" src="
http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/embed/select/media/ellmMECE9wA5
?form=javascript"></script></div>

Link
http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/embed/select/media/_KkGEnglfZ9q
?form=html

http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/embed/select/media/ellmMECE9wA5
?form=html

Flash Only
<embed src="http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/swf/select/media/
_KkGEnglfZ9q" width="480" height="270" type="application/x-shockwave-flash"
allowFullScreen="true" bgcolor="0x000000"/>

<embed src="http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/swf/select/media/
ellmMECE9wA5" width="480" height="270" type="application/x-shockwave-flash"
allowFullScreen="true" bgcolor="0x000000"/>
 *
 *
 */
