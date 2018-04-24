<?php



$config['system.performance']['css']['preprocess'] = FALSE;
$config['system.performance']['js']['preprocess'] = FALSE;
$config['system.performance']['minifyhtml']['minify_html'] = FALSE;

$settings['cache']['bins']['render'] = 'cache.backend.null';
$settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.null';

$settings['cache']['bins']['page'] = 'cache.backend.null';
