<?php

use Illuminate\Support\Str;

defined('ABSPATH') || exit;

/**
 * Add styles/classes to the "Formater" drop-down
 *
 * @see https://wordpress.stackexchange.com/questions/128931/tinymce-%E2%80%8C%E2%80%8Badding-css-to-format%E2%80%8C%E2%80%8B-dropdown
 */
add_filter('tiny_mce_before_init', function (array $settings): array {
    $selectors = 'h1,h2,h3,h4,h5,h6,p,strong,u,em,ol,ul,span';

    $styleFormats = [
        [
            'title' => '(SEO-friendly) Headings',
            'items' => [
                [
                    'title' => 'Heading 1',
                    'selector' => $selectors,
                    'classes' => 'h1',
                ],
                [
                    'title' => 'Heading 2',
                    'selector' => $selectors,
                    'classes' => 'h2',
                ],
                [
                    'title' => 'Heading 3',
                    'selector' => $selectors,
                    'classes' => 'h3',
                ],
                [
                    'title' => 'Heading 4',
                    'selector' => $selectors,
                    'classes' => 'h4',
                ],
                [
                    'title' => 'Heading 5',
                    'selector' => $selectors,
                    'classes' => 'h5',
                ],
                [
                    'title' => 'Heading 6',
                    'selector' => $selectors,
                    'classes' => 'h5',
                ],
            ],
        ],
        [
            'title' => 'BONSAI-theme',
            'items' => [
                [
                    'title' => 'Huge title',
                    'selector' => $selectors,
                    'classes' => 'big-title',
                ],
                [
                    'title' => 'Sub heading',
                    'selector' => 'p',
                    'classes' => 'sub-heading',
                ],
                [
                    'title' => 'Primary Color Link with Underline',
                    'selector' => $selectors,
                    'classes' => 'adt-primary-link',
                ],
                [
                    'title' => 'Text Color Secondary',
                    'selector' => $selectors,
                    'classes' => 'adt-text-secondary',
                ],
            ],
        ],
    ];

    $mergedStyles = array_merge($styleFormats, json_decode($settings['style_formats']));

    $settings['style_formats'] = json_encode($mergedStyles);

    return $settings;
}, 25);

/**
 * Enable unfiltered_html capability for certain roles.
 *
 * @param  array  $caps    The user's capabilities.
 * @param  string $cap     Capability name.
 * @param  int    $user_id The user ID.
 * @param  mixed  $args
 *
 * @return array  $caps    The user's capabilities, with 'unfiltered_html' potentially added.
 */
add_filter('map_meta_cap', function ($caps, $cap, $user_id, ...$args) {
    if ('unfiltered_html' === $cap && user_can($user_id, 'administrator')) {
        $caps = ['unfiltered_html'];
    }

    return $caps;
}, 1, 4);

// Prevent unnecessary optimizing of our theme assets (and thus dirtying Git).
add_filter('ewww_image_optimizer_bypass', function (bool $bypassed, string $path): bool {
    if (Str::contains($path, 'web/app/themes')) {
        return false;
    }

    return $bypassed;
}, 10, 2);
