<?php 

defined('ABSPATH') || exit;

function adt_get_person_footprint()
{
    $chosenCountry = $_POST['region_code'];
    $version = $_POST['version'];

    // Check if the data is already cached
    $cachedFootprints = get_transient('adt_person_footprint_cache');
    
    // If cache exists, return the cached data
    if ($cachedFootprints !== false) {
        if (array_key_exists($chosenCountry, $cachedFootprints) && $cachedFootprints[$chosenCountry]['chosen_country'] === $chosenCountry) {
            wp_send_json_success($cachedFootprints[$chosenCountry]);
            die();
        }
    }

    // API URL - does not work with region_code yet
    $url = "https://lca.aau.dk/api/footprint-country/?region_code=".$chosenCountry."&version=".$version;

    // Make the API request
    $response = wp_remote_get($url);
    
    // Check for errors
    if (is_wp_error($response)) {
        return 'Error: ' . $response->get_error_message();
    }
    
    // Retrieve and decode the response body
    $body = wp_remote_retrieve_body($response);
    $result = json_decode($body, true);

    // echo '<pre>';
    // var_dump($result);
    // echo '</pre>';
    
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
    $footprintsArray = $result['results'];
    $governmentValue = 0;
    $householdValue = 0;
    $chinValue = 0;

    foreach ($footprintsArray as $key => $footprint) {
        switch ($footprint['act_code']) {
            case 'F_GOVE':
                $governmentValue = $footprint['value'];
                break;
            case 'F_HOUS':
                $householdValue = $footprint['value'];
                break;
            case 'I_CHIN':
                $chinValue = $footprint['value'];
                break;
            default:
                // Keep the original act_code if no match
                break;
        }
    }

    // add values together because the website wants to display the total emission for a country
    $totalValue = $governmentValue + $householdValue + $chinValue;

    /**
     * In this function we have to get the recipe info from 3 different codes.
     * F_GOVE, F_HOUS and I_CHIN.
     */
    $governmentRecipeData = adt_get_person_footprint_recipe('F_GOVE', $chosenCountry, $version);
    $householdRecipeData = adt_get_person_footprint_recipe('F_HOUS', $chosenCountry, $version);
    $chinRecipeData = adt_get_person_footprint_recipe('I_CHIN', $chosenCountry, $version);

    /**
     * TODO: the arrays above contains a maximum of 100 items.
     * Therefore we need to send more requests to get all the data.
     */

    // Find matching recipe codes and add the values together.
    // Example arrays (you'd replace these with your actual arrays)
    $array1 = $governmentRecipeData['results'];
    $array2 = $householdRecipeData['results'];
    $array3 = $chinRecipeData['results'];

    // Unique product_codes from the first array
    $productCodes = array_column($array1, 'product_code');
    $productCodes = array_unique($productCodes);

    // Merge data
    $mergedResults = [];
    foreach ($productCodes as $code) {
        $mergedItem = adt_accumulate_value([$array1, $array2, $array3], $code);
        if ($mergedItem) {
            $mergedResults[] = $mergedItem;
        }
    }

    $mergedRecipes['results'] = $mergedResults;

    $data = [
        'id' => $footprintsArray[0]['id'],
        'act_code' => $footprintsArray[0]['act_code'],
        'region_code' => $chosenCountry,
        'value' => $totalValue,
        'version' => $version,
        'unit_emission' => $footprintsArray[0]['unit_emission'],
        'recipe' => $mergedRecipes,
        'governmentRecipe' => $governmentRecipeData,
        'chinRecipe' => $chinRecipeData,
    ];

    $cachedFootprintArray = [
        $productCode => $data,
    ];

    // Cache the locations for 24 hour (86400 seconds)
    set_transient('adt_person_footprint_cache', $cachedFootprintArray, 86400);

    wp_send_json_success($data);
}

add_action('wp_ajax_adt_get_person_footprint', 'adt_get_person_footprint');
add_action('wp_ajax_nopriv_adt_get_person_footprint', 'adt_get_person_footprint');

// Helper function to accumulate values by product_code
function adt_accumulate_value($arrays, $productCode) {
    $totalValue = 0;
    $mergedItem = null;

    foreach ($arrays as $array) {
        foreach ($array as $item) {
            if ($item['product_code'] === $productCode) {
                $totalValue += $item['value'];
                if (!$mergedItem) {
                    $mergedItem = $item;
                }
            }
        }
    }

    if ($mergedItem) {
        $mergedItem['value'] = $totalValue;
    }

    return $mergedItem;
}


function adt_get_person_footprint_recipe($actCode, $chosenCountry, $newestVersion): array
{
    // Example:
    // https://lca.aau.dk/api/recipes-country/?act_code=F_GOVE&region_code=AU
    // And version is not used yet.
    $url = 'https://lca.aau.dk/api/recipes-country/?act_code='.$actCode.'&region_code='.$chosenCountry.'&version='.$newestVersion;

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