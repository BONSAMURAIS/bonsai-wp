<?php

defined('ABSPATH') || exit;

add_action('wp_enqueue_scripts', function (): void {
    $version = adt_get_version();
    $baseUrl = content_url('themes/bonsai');

    // Child theme style.css.
    // wp_dequeue_style('flatsome-style');
    // wp_deregister_style('flatsome-style');
    // wp_enqueue_style('flatsome-style', sprintf('%s/style.css', $baseUrl), ['flatsome-main'], $version);

    // wp_enqueue_script('adt-mobile-menu', sprintf('%s/dist/js/adt-mobile-menu-script.js', $baseUrl), ['jquery'], $version);
    wp_enqueue_script('adt-faq-script', $baseUrl.'dist/js/adt-faq.js', ['jquery']);

    if (is_single()) {
        wp_enqueue_style('adt-blog-style', content_url('/themes/bonsai/dist/css/adt-blog-posts.css'));
    }

});
