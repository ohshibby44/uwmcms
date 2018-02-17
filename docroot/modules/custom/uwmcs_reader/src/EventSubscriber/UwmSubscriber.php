<?php

namespace Drupal\uwmcs_reader\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Drupal\uwmcs_reader\Controller\UwmCreator;

/**
 * Class UwmSubscriber.
 *
 * @package Drupal\uwmcs_reader\EventSubscriber
 */
class UwmSubscriber implements EventSubscriberInterface {

  /**
   * Code that should be triggered on the event.
   */
  public function onException(GetResponseForExceptionEvent $event) {

    $uwm = new UwmCreator();
    $uwm->createMissingApiNode(TRUE);

  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {

    $events[KernelEvents::EXCEPTION][] = ['onException'];
    return $events;

  }

}
