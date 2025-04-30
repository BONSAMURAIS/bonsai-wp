<?php

defined('ABSPATH') || exit;

add_action('gform_after_submission_1', function(): void {
    if (!headers_sent()) {
        setcookie('contact_info_submitted', 'true', time() + (7 * 24 * 60 * 60), '/');
        wp_safe_redirect(home_url('/downloads'));
    }
});

add_action('init', function(): void {
    $currentSlug = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
    if ($currentSlug === 'downloads' && ($_COOKIE['contact_info_submitted'] ?? '') !== 'true') {
        wp_redirect(home_url('/submit-contact-info'));
        exit;
    }
});