<?php

namespace Drupal\uwmcs_reader\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Drupal\uwmcs_reader\Controller\UwmController;
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
    $response->headers->set('X-Custom-Header', 'MyValue111');

  }

  /**
   * Code that should be triggered on the event.
   */
  public function onController(FilterControllerEvent $event) {

    // The RESPONSE event occurs once a response was created for
    // replying to a request. For example you could override or
    // add extra HTTP headers in here.
    $response = $event;

  }

  /**
   * Code that should be triggered on the event.
   */
  public function onRequest(GetResponseEvent $event) {

    $response = $event->getRequest();
    $response->headers->set('X-Custom-Header', 'MyValue22222');

//    $uwm = new UwmController();
//    $uwm->validateProviderNode();


  }

  /**
   * Code that should be triggered on the event.
   */
  public function onException(GetResponseForExceptionEvent $event) {

    $response = $event->getRequest();
    $response->headers->set('X-Custom-Header', 'MyValue113333');

    $uwm = new UwmController();
    $uwm->validateProviderNode(TRUE);

  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {

    $events[KernelEvents::REQUEST][] = ['onRequest'];
    $events[KernelEvents::CONTROLLER][] = ['onController'];
    $events[KernelEvents::RESPONSE][] = ['onRespond'];
    $events[KernelEvents::EXCEPTION][] = ['onException'];
    return $events;

  }

}
