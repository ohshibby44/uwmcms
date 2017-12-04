<?php

namespace Drupal\uwmcs_reader\EventSubscriber;

use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

// Use Symfony\Component\HttpKernel\Event\GetResponseEvent;
// Use Symfony\Component\HttpFoundation\RedirectResponse;.
/**
 * Class UwmSubscriber.
 *
 * @package Drupal\uwmcs_reader\EventSubscriber
 */
class UwmSubscriber implements EventSubscriberInterface {

  /**
   * Code that should be triggered on the event.
   */
  public function onRespond(FilterResponseEvent $event) {

    // The RESPONSE event occurs once a response was created for
    // replying to a request. For example you could override or
    // add extra HTTP headers in here.
    $response = $event->getResponse();
    $response->headers->set('X-Custom-Header', 'MyValue');

  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {

    // For this example I am using KernelEvents
    // constants (see below a full list).
    $events[KernelEvents::RESPONSE][] = ['onRespond'];
    return $events;

  }

}
