<?php

defined('ABSPATH') || exit;

use Roots\WPConfig\Config;

/**
 * Newest API version for the Bonsai API
 * does not work correctly until february 2025
 */
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

    $updatedPostIds = [];

    foreach ($products as $product) {
        $uuid = $product['uuid'];
        
        if (empty($uuid)) {
            continue;
        }

        $postId = $wpdb->get_var($wpdb->prepare(
            "SELECT post_id FROM $wpdb->postmeta WHERE meta_key = 'adt_uuid' AND meta_value = %s",
            $uuid
        ));

        $postContent = $product['description'];

        if (!$postContent) {
            $postContent = $product['name'];
        }

        if ($postContent === null) {
            $postContent = 'Is not available?';
        }

        $post_data = [
            'post_title'   => $product['name'],
            'post_content' => $postContent,
            'post_status'  => 'publish',
            'post_type'    => 'product',
        ];

        if ($postId) {
            $post_data['ID'] = $postId;
        }

        $postId = wp_insert_post($post_data);

        $updatedPostIds[] = $postId;

        update_post_meta($postId, 'adt_code', $product['code']);
        update_post_meta($postId, 'adt_characteristic_unit', $product['characteristic_unit']);
        update_post_meta($postId, 'adt_uuid', $product['uuid']);

        // flow types
        // market M_
        // product C_ and EF_
        $codePrefix = adt_get_prefix($product['code']);

        if ($codePrefix === 'M') {
            update_post_meta($postId, 'adt_flowtype', 'market');
        } 
        
        if ($codePrefix === 'C' || $codePrefix === 'EF') {
            update_post_meta($postId, 'adt_flowtype', 'product');
        }

        if (array_key_exists('flow_type', $product)) {
            update_post_meta($postId, 'adt_flowtype', $product['flow_type']);
        }
    }

    adt_delete_old_bonsai_products($updatedPostIds);
}

// add_action('template_redirect', 'adt_get_bonsai_product_list');


function adt_get_old_bonsai_product_list() {
    global $wpdb;

    $api_url = "https://lca.aau.dk/api/activity-names/";

    // Make the request
    $response = wp_remote_get($api_url);

    // Get the response body
    $body = wp_remote_retrieve_body($response);

    // Parse the JSON response
    $products = json_decode($body, true);

    
    foreach ($products as $product) {
        $uuid = $product['uuid'];
        $code = $product['code'];
        
        if (empty($uuid)) {
            continue;
        }
        
        $postId = $wpdb->get_var($wpdb->prepare(
            "SELECT post_id FROM $wpdb->postmeta WHERE meta_key = 'adt_code' AND meta_value = %s",
            $code
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
        update_post_meta($postId, 'adt_uuid', $product['uuid']);
        update_post_meta($postId, 'adt_characteristic_unit', $product['characteristic_unit']);
        update_post_meta($postId, 'adt_flowtype', $product['flow_type']);
    }
}

function adt_get_bonsai_footprint_list() {
    global $wpdb;

    // I get 100 footprints per page
    // get the count of footprints and divide by 100
    // loop through the pages and get the footprints
    $api_url = "https://lca.aau.dk/api/footprint/?flow_code=A_Pines";

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

    $updatedPostIds = [];

    foreach ($result['results'] as $product) {
        $uuid = $product['id'];
        
        if (empty($uuid)) {
            continue;
        }

        $postId = $wpdb->get_var($wpdb->prepare(
            "SELECT post_id FROM $wpdb->postmeta WHERE meta_key = 'adt_footprint_id' AND meta_value = %s",
            $uuid
        ));

        $post_data = [
            'post_title'   => $product['description'],
            'post_content' => $product['description'],
            'post_status'  => 'publish',
            'post_type'    => 'footprint',
        ];

        if ($postId) {
            $post_data['ID'] = $postId;
        }

        $postId = wp_insert_post($post_data);

        $updatedPostIds[] = $postId;

        update_post_meta($postId, 'adt_code', $product['flow_code']);
        update_post_meta($postId, 'nace_related_code', $product['nace_related_code']);
        update_post_meta($postId, 'adt_footprint_id', $product['id']);
        update_post_meta($postId, 'region_code', $product['region_code']);
    }
}

// add_action('template_redirect', 'adt_get_bonsai_footprint_list');

function adt_delete_old_bonsai_products(array $updatedPostIds) 
{
    $args = array(
        'post_type'      => 'product',
        'posts_per_page' => -1,
        'fields'         => 'ids', // Only retrieve IDs
    );
    
    $products = get_posts($args);

    $productsToDelete = array_diff($products, $updatedPostIds);

    foreach ($productsToDelete as $productId) {
        wp_delete_post($productId, true);
    }
}

function adt_get_locations(): array
{
    // Check if the data is already cached
    $cachedLocations = get_transient('adt_locations_cache');
    
    // If cache exists, return the cached data
    if ($cachedLocations !== false) {
        return $cachedLocations;
    }

    // API URL
    $url = "https://lca.aau.dk/api/locations/";

    // Make the API request
    $response = wp_remote_get($url);

    // Check for errors
    if (is_wp_error($response)) {
        return 'Error: ' . $response->get_error_message();
    }

    // Retrieve and decode the response body
    $body = wp_remote_retrieve_body($response);
    $result = json_decode($body, true);

    // Handle potential errors in the response
    if (empty($result)) {
        return 'No locations found or an error occurred.';
    }

    if (array_key_exists('detail', $result)) {
        return 'Error: ' . $result['detail'];
    }

    // Extract locations from the response
    $locations = $result['results'];

    // Cache the locations for 1 hour (3600 seconds)
    set_transient('adt_locations_cache', $locations, 3600);

    return $locations;
}

function adt_get_product_recipe($productCode, $chosenCountry, $newestVersion): array
{
    // Get the whole recipe list for the product
    $recipeUrl = 'https://lca.aau.dk/api/recipes/?flow_reference='.$productCode.'&region_reference='.$chosenCountry.'&version='.$newestVersion;

    // Make the API request
    $recipeResponse = wp_remote_get($recipeUrl);

    // Check for errors
    if (is_wp_error($recipeResponse)) {
        return [
            'error' => $recipeResponse->get_error_message()
        ];
    }

    // Retrieve and decode the recipeResponse body
    $recipeBody = wp_remote_retrieve_body($recipeResponse);
    $recipeResult = json_decode($recipeBody, true);

    // echo '<pre>';
    // var_dump($recipeResult);
    // echo '</pre>';

    // Handle potential errors in the recipeResponse
    if (empty($recipeResult)) {
        return [
            'error' => 'No recipes found or an error occurred.'
        ];
    }

    return $recipeResult;
}


/**
 * Get the data for each recipe item.
 * Use transient to store and get data, as a form of caching.
 * This will make sure we do not make too many requests to the API.
 */
function adt_get_updated_recipe_info()
{
    
    $unitInflow = $_POST['unitInflow'];
    $productCode = $_POST['productCode'];
    $chosenCountry = $_POST['country'];
    $newestVersion = $_POST['version'];

    // Check if the data is already cached
    $cachedRecipe = get_transient('adt_recipe_cache');
    
    // If cache exists, return the cached data
    if ($cachedRecipe !== false) {
        return $cachedRecipe;
    }

    // Need unitInflow
    $url = 'https://lca.aau.dk/api/recipes/?unit_inflow='.$unitInflow.'&flow_reference='.$productCode.'&region_reference='.$chosenCountry.'&version='.$newestVersion;
    // Make the API request
    $response = wp_remote_get($url);

    // Check for errors
    if (is_wp_error($response)) {
        return 'Error: ' . $response->get_error_message();
    }

    // Retrieve and decode the response body
    $body = wp_remote_retrieve_body($response);
    $result = json_decode($body, true);

    // Handle potential errors in the response
    if (empty($result)) {
        return 'No footprints found or an error occurred.';
    }

    if (array_key_exists('detail', $result)) {
        return 'Error: ' . $result['detail'];
    }

    $locations = $result;

    // Cache the locations for 24 hour (86400 seconds)
    set_transient('adt_recipe_cache', $locations, 86400);

    wp_send_json_success($result);
}

add_action('wp_ajax_adt_get_updated_recipe_info', 'adt_get_updated_recipe_info');
add_action('wp_ajax_nopriv_adt_get_updated_recipe_info', 'adt_get_updated_recipe_info');


function adt_get_product_footprint()
{
    $productCode = $_POST['code'];
    $productUuid = $_POST['uuid'];
    $chosenCountry = $_POST['footprint_location'];
    $chosenType = $_POST['footprint_type'];
    // Everything if from year 2016, but this might get updated.
    $chosenYear = $_POST['footprint_year'];

    // Check if the data is already cached
    $cachedFootprints = get_transient('adt_recipe_cache');
    
    // If cache exists, return the cached data
    if ($cachedFootprints !== false) {
        if (array_key_exists($productCode, $cachedFootprints) && $cachedFootprints[$productCode]['chosen_country'] === $chosenCountry) {
            wp_send_json_success($cachedFootprints[$productCode]);
            die();
        }
    }

    // API URL
    $url = "https://lca.aau.dk/api/footprint/?flow_code=".$productCode."&region_code=".$chosenCountry;

    // Make the API request
    $response = wp_remote_get($url);

    
    // Check for errors
    if (is_wp_error($response)) {
        return 'Error: ' . $response->get_error_message();
    }
    
    // Retrieve and decode the response body
    $body = wp_remote_retrieve_body($response);
    $result = json_decode($body, true);
    
    if (isset($result['count']) && $result['count'] === 0) {
        wp_send_json_error(['error' => 'Product not found']);
    }

    // Handle potential errors in the response
    if (empty($result)) {
        return 'No footprints found or an error occurred.';
    }

    if (array_key_exists('detail', $result)) {
        wp_send_json_error(['error' => $result['detail']], 503);
    }

    // get newest version of the footprint.
    $footprints = $result['results'];
    $versionArray = [];

    foreach ($footprints as $footprint) {
        $versionArray[] = $footprint['version'];
        $footprintTitle = $footprint['description'];
    }

    $newestVersion = adt_get_newest_version($versionArray);

    // Get the footprint with the newest version
    $chosenFootprint = [];

    foreach ($footprints as $footprint) {
        if ($footprint['version'] === $newestVersion) {
            $chosenFootprint[] = $footprint;
        }
    }

    $recipeData = adt_get_product_recipe($productCode, $chosenCountry, $newestVersion);
    $foodprintName = adt_get_footprint_name_by_code($productCode, $chosenCountry);
    
    $data = [
        'title' => $footprintTitle,
        'flow_code' => $productCode,
        'chosen_country' => $chosenCountry,
        'uuid' => $productUuid,
        'all_data' => $chosenFootprint,
        'recipe' => $recipeData,
    ];

    $cachedFootprintArray = [
        $productCode => $data,
    ];


    // Cache the locations for 24 hour (86400 seconds)
    set_transient('adt_recipe_cache', $cachedFootprintArray, 86400);

    wp_send_json_success($data);
}

add_action('wp_ajax_adt_get_product_footprint', 'adt_get_product_footprint');
add_action('wp_ajax_nopriv_adt_get_product_footprint', 'adt_get_product_footprint');

// Maybe use version_compare instead PHP function
function adt_get_newest_version(array $versions): string
{
    usort($versions, 'version_compare');
    return end($versions);
}