<?php

defined('ABSPATH') || exit;

use Roots\WPConfig\Config;

$CONFIG = json_decode(file_get_contents(__DIR__.'/../../constants/config.json'), true);
$GLOBALS['APIURL'] = $CONFIG['APIURL'];

function adt_get_bonsai_product_list() {
    global $wpdb;

    // I get 100 products per page
    // get the count of products and divide by 100
    // loop through the pages and get the products
    $api_url = $GLOBALS['APIURL']."/products/?page=1";
    $response = wp_remote_get($api_url);

    // Check for errors
    if (is_wp_error($response)) {
        return 'Error: ' . $response->get_error_message();
    }

    // Get the response body
    $body = wp_remote_retrieve_body($response);
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
        $api_url = $GLOBALS['APIURL']."/products/?page=" . $i;
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
        } else if ($codePrefix === 'C' || $codePrefix === 'EF') {
            update_post_meta($postId, 'adt_flowtype', 'product');
        }

        if (array_key_exists('flow_type', $product)) {
            update_post_meta($postId, 'adt_flowtype', $product['flow_type']);
        }
    }
}

if (isset($_GET['get_future_bonsai_products'])) {
    add_action('template_redirect', 'adt_get_bonsai_product_list');
}

function adt_get_old_bonsai_product_list() {
    global $wpdb;

    $api_url = $GLOBALS['APIURL']."/activity-names/";
    $response = wp_remote_get($api_url);

    // Check for errors
    if (is_wp_error($response)) {
        return 'Error: ' . $response->get_error_message();
    }

    // Get the response body
    $body = wp_remote_retrieve_body($response);
    $products = json_decode($body, true);

    foreach ($products as $product) {
        $code = $product['code'];
        
        if (empty($code)) {
            continue;
        }

        $postId = $wpdb->get_var($wpdb->prepare(
            "SELECT post_id FROM $wpdb->postmeta WHERE meta_key = 'adt_code' AND meta_value = %s",
            $code
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
            echo 'Updating post: ' . $postId . 'with code: ' . $code . PHP_EOL;
        } else {
            echo 'Creating post: ' . $product['name'] . 'with code: ' . $code . PHP_EOL;
        }

        $postId = wp_insert_post($post_data);

        $updatedPostIds[] = $postId;

        update_post_meta($postId, 'adt_code', $code);
        update_post_meta($postId, 'adt_uuid', $product['uuid']);
        update_post_meta($postId, 'adt_flowtype', $product['flow_type']);
    }
}

if (isset($_GET['get_old_bonsai_products'])) {
    add_action('template_redirect', 'adt_get_old_bonsai_product_list');
}

function adt_get_locations(): array{
    // Check if the data is already cached
    $cachedLocations = get_transient('adt_locations_cache');
    
    // If cache exists, return the cached data
    if ($cachedLocations !== false) {
        return $cachedLocations;
    }

    // API URL
    $url = $GLOBALS['APIURL']."/locations/";
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
        return ['We’re sorry, but there was a problem with an external service provider.  
Please try again later, or contact support if the issue persists.'];
    }

    if (array_key_exists('detail', $result)) {
        return wp_send_json_error(['Error: ' . $result['detail']]);
    }

    // Extract locations from the response
    $locations = $result['results'];

    usort($locations, function ($a, $b) {
        return strcmp($a['name'], $b['name']);
    });

    // Cache the locations for 1 hour (3600 seconds)
    set_transient('adt_locations_cache', $locations, 3600);

    return $locations;
}

function adt_get_product_recipe($productCode, $country, $version,$metric): array{
    $url = $GLOBALS['APIURL'].'/recipes/?flow_reference='.$productCode.'&region_reference='.$country.'&version='.strtolower($version).'&metric='.$metric;
    $recipeResponse = wp_remote_get($recipeUrl); // Get the whole recipe list for the product
    
    // Check for errors
    if (is_wp_error($recipeResponse)) {
        return [
            'error' => $recipeResponse->get_error_message()
        ];
    }
    
    // Retrieve and decode the recipeResponse body
    $recipeBody = wp_remote_retrieve_body($recipeResponse);
    $recipeResult = json_decode($recipeBody, true);
    $recipes = $recipeResult["results"];

    //sort per value
    usort($recipes, function ($a, $b) {
        return $b['value_emission'] <=> $a['value_emission']; //b before a for descending order
    });
    
    // Handle potential errors in the recipeResponse
    if (empty($recipes)) {
        return [
            'error' => 'No recipes found or an error occurred.'
        ];
    }
    
    return $recipes;
}

/**
 * Get the data for each recipe item.
 * Use transient to store and get data, as a form of caching.
 * This will make sure we do not make too many requests to the API.
 */
function adt_get_updated_recipe_info(){
    
    $unitInflow = $_POST['unitInflow'];
    $productCode = $_POST['productCode'];
    $countryCode = $_POST['country'];
    $version = $_POST['version'];
    $metric = $_POST['metric'];

    // Check if the data is already cached
    $cachedRecipe = get_transient('adt_recipe_cache');
    
    // If cache exists, return the cached data
    if ($cachedRecipe !== false) {
        return $cachedRecipe;
    }

    // Need unitInflow
    $url = $GLOBALS['APIURL'].'/recipes/?unit_inflow='.$unitInflow.'&flow_reference='.$productCode.'&region_reference='.$countryCode.'&version='.$version."&metric=".$metric;
    error_log($url);
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

function adt_get_product_footprint(){
    $productCode = $_POST['code'];
    $productUuid = $_POST['uuid'];
    $countryCode = $_POST['footprint_location'];
    $type = $_POST['footprint_type'];
    $year = $_POST['footprint_year'];
    $version = $_POST['database_version'];
    $metric = $_POST['metric'];//TODO sth odd with metric

    // Check if the data is already cached
    $cachedFootprints = get_transient('adt_recipe_cache');

    // If cache exists, return the cached data
    if ($cachedFootprints !== false) {
        if (array_key_exists($productCode, $cachedFootprints) 
            && $cachedFootprints[$productCode]['chosen_country'] === $countryCode
            && $cachedFootprints[$productCode]['version'] === $version) {
                wp_send_json_success($cachedFootprints[$productCode]);
                die();
            }
        }
        
    // API URL
    $url = $GLOBALS['APIURL']."/footprint/?flow_code=".$productCode."&region_code=".$countryCode."&version=".$version."&metric=".$metric;
    $response = wp_remote_get($url);
    
    // Check for errors
    if (is_wp_error($response)) {
        return wp_send_json_error(['Error: ' . $response->get_error_message()]);
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

    $unit_reference = "";
    $unit_emission = "";
    foreach ($footprints as $footprint) {
        $versionArray[] = $footprint['version'];
        $footprintTitle = $footprint['description'];
        $unit_reference = $footprint['unit_reference'];
        $unit_emission = $footprint['unit_emission'];
    }

    $newestVersion = adt_get_newest_version($versionArray);

    if ($version) {
        $newestVersion = $version;
    }

    // Get the footprint with the newest version
    $chosenFootprint = [];

    foreach ($footprints as $footprint) {
        if ($footprint['version'] === $newestVersion) {
            switch ($footprint['unit_reference']) {
                case 'Meuro':
                    // Add danish currency Meuro to DKK 
                    // The conversion rate is per million euro
                    $conversionRateInMillion = adt_convert_number_by_units('Meuro', 'DKK');
                    // Divide it by 1 million to get the value 1 Euro to 1 DKK
                    $conversionRate = $conversionRateInMillion / 1000000;
                    /* To get 1 euro per 1 kg emission
                     * instead of 1 Meuro per 1 tonne emission
                     * I need to divide by 1000
                     */
                    $footprint['value'] = $footprint['value'] / 1000;
                    /* To get 1 DKK per 1 kg emission
                     * I need to divide by the conversion rate
                     */
                    $danishValue = $footprint['value'] / $conversionRate;

                    // Footprint with DKK as unit
                    $danishFootprint = [
                        'description' => $footprint['description'],
                        'flow_code' => $footprint['flow_code'],
                        'id' => $footprint['id'],
                        'nace_related_code' => $footprint['nace_related_code'],
                        'region_code' => $footprint['region_code'],
                        'unit_emission' => $footprint['unit_emission'],
                        'unit_reference' => 'DKK',
                        'value' => $danishValue,
                        'version' => $footprint['version'],
                    ];

                    array_push($chosenFootprint, $danishFootprint);
                    break;
                case 'items':
                    /* 
                     * To get 1 item per 1 kg emission
                     * I need to multiply by 1000
                     */
                    $footprint['value'] = $footprint['value'] * 1000;
                    break;

                case 'TJ':
                    if ( str_contains(strtolower($footprint['description']), 'electricity') ) {
                        $multiplier = adt_convert_number_by_units('TJ', 'kWh');
                        $footprint['unit_reference'] = 'kWh';
                    } else {
                        $multiplier = adt_convert_number_by_units('TJ', 'MJ');
                        $footprint['unit_reference'] = 'MJ';
                    }
                    $footprint['value'] = $footprint['value'] / $multiplier * 1000;
                    break;
                default:
                    break;
            }
            // restrict  significant number to 3
            $footprint['value'] = roundToSignificantFigures($footprint['value']);

            $chosenFootprint[] = $footprint;
        }
    }

    $recipeData = adt_get_product_recipe($productCode, $countryCode, $newestVersion, $metric);
    
    $data = [
        'title' => $footprintTitle,
        'flow_code' => $productCode,
        'chosen_country' => $countryCode,
        "unit_reference" => $unit_reference,
        "unit_emission" => $unit_emission,
        'uuid' => $productUuid,
        'version' => $newestVersion,
        'all_data' => $chosenFootprint,
        'description' => $chosenFootprint[0]['description'],
        'id' => $chosenFootprint[0]['id'],
        'metric' => $chosenFootprint[0]['metric'],
        'nace_related_code' => $chosenFootprint[0]['nace_related_code'],
        'region_code' => $chosenFootprint[0]['region_code'],
        'samples' => $chosenFootprint[0]['samples'],
        'value' => $chosenFootprint[0]['value'],
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

function roundToSignificantFigures($num, $sigFigs = 3) {
    if ($num == 0) {
        return '0';
    }

    $d = floor(log10(abs($num)));
    $power = $sigFigs - 1 - $d;
    $magnitude = pow(10, $power);
    $rounded = round($num * $magnitude) / $magnitude;

    // Calculate number of decimal places to display
    $decimals = max(0, $sigFigs - 1 - floor(log10(abs($rounded))));
    
    // Format to the right number of decimal places
    return number_format($rounded, $decimals, '.', '');
}