<?php

namespace Drupal\uwmcs_reader\EventSubscriber;

use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;

class UwmSubscriber implements EventSubscriberInterface {

  /**
   * Code that should be triggered on event specified
   */
  public function onRespond(FilterResponseEvent $event) {

    // The RESPONSE event occurs once a response was created for replying to a request.
    // For example you could override or add extra HTTP headers in here
    $response = $event->getResponse();
    $response->headers->set('X-Custom-Header', 'MyValue');

  }


  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {

    // For this example I am using KernelEvents constants (see below a full list).
    $events[KernelEvents::RESPONSE][] = ['onRespond'];
    return $events;

  }

}


