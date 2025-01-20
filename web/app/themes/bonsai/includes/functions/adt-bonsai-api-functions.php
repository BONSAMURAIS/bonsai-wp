<?php

defined('ABSPATH') || exit;

use Roots\WPConfig\Config;

function adt_get_bonsai_product_list() {
    global $wpdb;

    // I get 100 products per page
    // get the count of products and divide by 100
    // loop through the pages and get the products
    $api_url = "https://lca.aau.dk/api/products/?page=1";

    // Make the request
    $response = wp_remote_get($api_url);

    // Check for errors
    if (is_wp_error($response)) {
        return 'Error: ' . $response->get_error_message();
    }

    // Get the response body
    $body = wp_remote_retrieve_body($response);

    // Parse the JSON response
    $result = json_decode($body, true);

    echo '<pre>';
    print_r($result);
    echo '</pre>';
    exit;

    $productCount = $result['count'];

    $products = $result['results'];

    if (empty($result)) {
        return 'No products found or an error occurred.';
    }

    if (array_key_exists('detail', $result)) {
        return 'Error: ' . $result['detail'];
    }

    $pages = ceil($productCount / 100);

    for ($i = 2; $i <= $pages; $i++) {
        $api_url = "https://lca.aau.dk/api/products/?page=" . $i;
        $response = wp_remote_get($api_url);

        if (is_wp_error($response)) {
            continue;
        }

        $body = wp_remote_retrieve_body($response);
        $result = json_decode($body, true);

        if (!empty($result['results'])) {
            $products = array_merge($products, $result['results']);
        }
    }

    foreach ($products as $product) {
        $uuid = $product['uuid'];
        
        if (empty($uuid)) {
            continue;
        }

        $postId = $wpdb->get_var($wpdb->prepare(
            "SELECT post_id FROM $wpdb->postmeta WHERE meta_key = 'adt_uuid' AND meta_value = %s",
            $uuid
        ));

        $post_data = [
            'post_title'   => $product['name'],
            'post_content' => $product['description'],
            'post_status'  => 'publish',
            'post_type'    => 'product',
        ];

        if ($postId) {
            $post_data['ID'] = $postId;
        }

        $postId = wp_insert_post($post_data);

        update_post_meta($postId, 'adt_code', $product['code']);
        update_post_meta($postId, 'adt_characteristic_unit', $product['characteristic_unit']);
        update_post_meta($postId, 'adt_uuid', $product['uuid']);
    }
}

// add_action('template_redirect', 'adt_get_bonsai_product_list');