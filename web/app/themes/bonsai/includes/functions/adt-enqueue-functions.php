<?php

defined('ABSPATH') || exit;

add_action('wp_enqueue_scripts', function (): void {
    $version = adt_get_version();
    $baseUrl = content_url('themes/bonsai');

    wp_enqueue_script('adt-faq-script', $baseUrl.'/dist/js/adt-faq.js', ['jquery']);

    if (is_single()) {
        wp_enqueue_style('adt-blog-style', content_url('/themes/bonsai/dist/css/adt-blog-posts.css'));
    }

});
