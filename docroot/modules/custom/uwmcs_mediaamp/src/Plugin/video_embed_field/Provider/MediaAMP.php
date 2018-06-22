<?php

namespace Drupal\uwmcs_mediaamp\Plugin\video_embed_field\Provider;

use Drupal\Component\Serialization\Json;
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

  protected static $providerMatch = 'player.mediaamp.io';

  protected static $providerIdMatch = '\/media\/(?<mediaid>[^?\/]+)';

  protected static $accountEmbedUrl = '//player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/embed/select/media/%s';

  protected static $accountFeedUrl = '//feed.theplatform.com/f/U8-EDC/DmdisEvWzzBl?byPid=%s';

  /**
   * {@inheritdoc}
   */
  public static function getIdFromInput($input) {

    $pattern = '/(?<domain>' . self::$providerMatch . ').+' . self::$providerIdMatch . '/';
    preg_match_all($pattern, $input, $matches);

    if (!empty($matches['domain'][0]) && !empty($matches['mediaid'][0])) {

      return trim($matches['mediaid'][0]);

    }

  }

  /**
   * {@inheritdoc}
   */
  public static function getThumbnailFromInput($input) {

    $id = self::getIdFromInput($input);

    if (!empty($id)) {

      return self::fetchMediaAmpFeedData('defaultThumbnailUrl', $id);

    }

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
      '#url' => $this->getIframeUrl(),
      '#query' => [
        'form' => 'html',
        // @todo Update this 'autoplay' => $autoplay,
      ],

      '#attributes' => [
        'width' => $width,
        'height' => $height,
        'frameborder' => '1',
        'allowfullscreen' => 'allowfullscreen',
        'style' => ["width: $width; height: $height"],
        'data-title' => $this->getName(),
        'data-thumbnail' => $this->getRemoteThumbnailUrl(),
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

    $this->fetchMediaAmpFeedData('defaultThumbnailUrl', $this->getVideoId());

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

    return $this->fetchMediaAmpFeedData('title', $this->getVideoId());

  }

  /**
   * {@inheritdoc}
   */
  private function getIframeUrl() {

    return sprintf(self::$accountEmbedUrl, $this->getVideoId());

  }

  /**
   * {@inheritdoc}
   */
  private static function fetchMediaAmpFeedData($jsonField, $videoId) {

    $uri = sprintf(self::$accountFeedUrl, $videoId);
    try {

      $response = \Drupal::httpClient()->get($uri);
      $data = Json::decode($response->getBody());

      if (!empty($data[$jsonField])) {

        return $data[$jsonField];

      }
      if (!empty($data['entries'][0][$jsonField])) {

        return $data['entries'][0][$jsonField];

      }

    }
    catch (RequestException $e) {

    }

  }

}

/*
 *
 *

MEDIA AMP FEED URL FOR UWM DRUPAL:
http://feed.theplatform.com/f/U8-EDC/DmdisEvWzzBl?byPid={{ MEDIA_ID/ PID }}
(Shows configured feed fields for video)

MEDIA AMP URL FOR VIDEO WITH PLAYER:
https://player.mediaamp.io/p/U8-EDC/{{ PLAYER_ID }}/embed/select/media
/{{ MEDIA_ID/ PID }}?form=html
(Player for use in iframe)

PLAYER:
https://player.mediaamp.io/p/U8-EDC/gQh_1ek3wdLT/embed/select/media/
ViWDFnXGVkrf?form=html


OTHER MediaAMP SAMPLES:


<iframe src="http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/embed/select/
media/2j4IXUPa_kv0?form=html" width="482" height="272" frameBorder="0"
seamless="seamless" allowFullScreen></iframe>

<iframe src="http://player.theplatform.com/p/U8-EDC/gQh_1ek3wdLT?form=html"
width="482" height="272" frameBorder="0" seamless="seamless"
allowFullScreen></iframe>


JSON:
http://feed.theplatform.com/f/U8-EDC/DmdisEvWzzBl?byPid=ViWDFnXGVkrf
http://feed.theplatform.com/f/U8-EDC/DmdisEvWzzBl?byPid=ayW_lTEaxd_S

XML:   feed that includes all media automatically:
http://feed.theplatform.com/f/U8-EDC/wQ5K7m0GNBGc
Querying the feed will depend on the type of ID you're using:

- For mediaIDs, it would be feed_url/{mediaID}
- For GUIDs, it would be feed_url?byGuid={GUID}
- For media PIDs, it would be feed_url?byPid={PID}


You can additionally customize the response payload to be JSON, cJSON, RSS,
as well as limiting the response data to just what you want, eg:
feed_url/{mediaID}?form=cjson&fields=defaultThumbnailUrl.


Nick,

Example 1: Public ID = _KkGEnglfZ9q
Example 2: Public ID =  ellmMECE9wA5

iframe
<iframe src="http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/embed/select/media/
_KkGEnglfZ9q?form=html" width="480" height="270" frameBorder="0"
seamless="seamless" allowFullScreen></iframe>

<iframe src="http://player.mediaamp.io/p/U8-EDC/ellmMECE9wA5/embed/select/media/
ellmMECE9wA5?form=html" width="480" height="270" frameBorder="0"
seamless="seamless" allowFullScreen></iframe>

Script
<div style="width: 480px; height: 270px"><script type="text/javascript" src="
http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/embed/select/media/_KkGEnglfZ9q
?form=javascript"></script></div>

https://player.mediaamp.io/p/U8-EDC/{{ PLAYER_ID }}/embed/select/
media/{{ MEDIA_ID/ PID }}?form=javascript


<div style="width: 480px; height: 270px"><script type="text/javascript" src="
http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/embed/select/media/ellmMECE9wA5
?form=javascript"></script></div>

Link
http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/embed/select/
media/_KkGEnglfZ9q?form=html

http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/embed/select/
media/ellmMECE9wA5?form=html

Flash Only
<embed src="http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/swf/select/media/
_KkGEnglfZ9q" width="480" height="270" type="application/x-shockwave-flash"
allowFullScreen="true" bgcolor="0x000000"/>

<embed src="http://player.mediaamp.io/p/U8-EDC/PfS6F0yR_GNu/swf/select/media/
ellmMECE9wA5" width="480" height="270" type="application/x-shockwave-flash"
allowFullScreen="true" bgcolor="0x000000"/>

Caption URL: http://lyeqby-md.storage.googleapis.com/UWMC_-_Marketing_VMS/
449/455/Dr.%20Dudley%20-final%20cut.srt
 *
 *
 */
