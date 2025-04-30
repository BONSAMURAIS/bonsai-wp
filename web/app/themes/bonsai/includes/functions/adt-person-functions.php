<?php 

defined('ABSPATH') || exit;

function adt_get_person_footprint()
{
    $chosenCountry = $_POST['region_code'];

    // Check if the data is already cached
    // $cachedFootprints = get_transient('adt_person_footprint_cache');
    
    // // If cache exists, return the cached data
    // if ($cachedFootprints !== false) {
    //     if (array_key_exists($chosenCountry, $cachedFootprints) && $cachedFootprints[$chosenCountry]['chosen_country'] === $chosenCountry) {
    //         wp_send_json_success($cachedFootprints[$chosenCountry]);
    //         die();
    //     }
    // }

    // API URL
    $url = "https://lca.aau.dk/api/footprint-country/?region_code=".$chosenCountry;

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
        wp_send_json_error(['error' => 'Footprint not found']);
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
    }
    
    $newestVersion = adt_get_newest_version($versionArray);
    
    // Get the footprint with the newest version
    $chosenFootprint = [];

    foreach ($footprints as $footprint) {
        if ($footprint['version'] === $newestVersion) {
            $chosenFootprint[] = $footprint;
        }
    }

    // Using key offset to test
    $recipeData = adt_get_person_footprint_recipe($chosenFootprint[0]['act_code'], $chosenCountry, $newestVersion);

    $data = [
        'id' => $chosenFootprint[0]['id'],
        'act_code' => $chosenFootprint[0]['act_code'],
        'region_code' => $chosenFootprint[0]['region_code'],
        'value' => $chosenFootprint[0]['value'],
        'version' => $chosenFootprint[0]['version'],
        'unit_emission' => $chosenFootprint[0]['unit_emission'],
        'recipe' => $recipeData,
    ];

    $cachedFootprintArray = [
        $productCode => $data,
    ];

    // Cache the locations for 24 hour (86400 seconds)
    // set_transient('adt_person_footprint_cache', $cachedFootprintArray, 86400);

    wp_send_json_success($data);
}

add_action('wp_ajax_adt_get_person_footprint', 'adt_get_person_footprint');
add_action('wp_ajax_nopriv_adt_get_person_footprint', 'adt_get_person_footprint');


function adt_get_person_footprint_recipe($actCode, $chosenCountry, $newestVersion): array
{
    // Example:
    // https://lca.aau.dk/api/recipes-country/?act_code=F_GOVE&region_code=AU
    // And version is not used yet.
    $url = 'https://lca.aau.dk/api/recipes-country/?act_code='.$actCode.'&region_code='.$chosenCountry;

    // Make the API request
    $recipeResponse = wp_remote_get($url);

    // Check for errors
    if (is_wp_error($recipeResponse)) {
        return [
            'error' => $recipeResponse->get_error_message()
        ];
    }
    
    // Retrieve and decode the recipeResponse body
    $recipeBody = wp_remote_retrieve_body($recipeResponse);
    $recipeResult = json_decode($recipeBody, true);

    // Handle potential errors in the recipeResponse
    if (empty($recipeResult)) {
        return [
            'error' => 'No recipes found or an error occurred.'
        ];
    }

    return $recipeResult;
}