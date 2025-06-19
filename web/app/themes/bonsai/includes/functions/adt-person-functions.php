<?php 

defined('ABSPATH') || exit;

function adt_get_person_footprint()
{
    error_log("-- adt_get_person_footprint --");

    $chosenCountry = $_POST['region_code'];
    $chosenActCode = $_POST['act_code'];
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

    $url = "https://lca.aau.dk/api/footprint-country/?region_code=".$chosenCountry."&version=".$version."&act_code=F_HOUS".$chosenActCode; //TODO change if call with F_HOUS does not exist
    error_log("-- adt_get_person_footprint url");
    error_log($url);
    $response = wp_remote_get($url);

    
    // Check for errors
    if (is_wp_error($response)) {
        error_log("is_wp_error(response)= true");
        
        return 'Error: ' . $response->get_error_message();
    }
    
    // Retrieve and decode the response body
    $body = wp_remote_retrieve_body($response);
    $result = json_decode($body, true);
    error_log("retrieve body = true");
    
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

    $fdemand_categories = array('F_GOVE', 'F_HOUS', 'F_NPSH');


    $value = get_total_value($fdemand_categories,$chosenCountry,$chosenActCode,$version);
    $governmentValue = 0;
    $householdValue = 0;
    $chinValue = 0;

    foreach ($footprintsArray as $key => $footprint) {
        if (str_contains($footprint['act_code'],'F_GOVE')){
            $governmentValue = $footprint['value'];
            break;
        } else if (str_contains($footprint['act_code'],'F_HOUS')){
            $householdValue = $footprint['value'];
            break;
        } else if (str_contains($footprint['act_code'],'I_CHIN')){
            $chinValue = $footprint['value'];
            break;
        }
    }
    
    // add values together because the website wants to display the total emission for a country
    $totalValue = $governmentValue + $householdValue + $chinValue;
    $recipes = adt_get_person_footprint_recipe($footprint['act_code'], $chosenCountry, $version);

    /**
     * TODO: the arrays above contains a maximum of 100 items.
     * Therefore we need to send more requests to get all the data.
     * 
     * I have gotten the results from all the pages in the function adt_get_person_footprint_recipe.
     * But below I use the $householdRecipeData array to get the product codes. 
     * If there is product codes in the other two arrays, which are not present in $householdRecipeData,
     * then they will not be included in the final result.
     */

    // Find matching recipe codes and add the values together.
    // Unique product_codes from the first array
    // $productCodes = array_column($recipes, 'product_code');
    // $productCodes = array_unique($productCodes);

    $data = [
        'id' => $footprintsArray[0]['id'],
        'act_code' => $footprintsArray[0]['act_code'],
        'region_code' => $chosenCountry,
        'value' => $totalValue,
        'version' => $version,
        'unit_emission' => $footprintsArray[0]['unit_emission'],
        'recipe' => $recipes,
    ];

    $productCode = "";
    $cachedFootprintArray = [
        $productCode => $data,
    ];

    // Cache the locations for 24 hour (86400 seconds)
    set_transient('adt_person_footprint_cache', $cachedFootprintArray, 86400);
    wp_send_json_success($data);
}

function get_total_value(array $fdemand_categories, string $country, string $act_code, int|string $version) {
    $total = 0;

    error_log("get_total_value");

    foreach ($fdemand_categories as $cat){
        $url = "https://lca.aau.dk/api/footprint-country/?region_code=".$country."&version=".$version."&act_code=".$category."|".$act_code;
        $response = wp_remote_get($url);

        error_log("loop url");
        error_log($url);
        
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
        error_log("loop body");
        error_log($body);
        error_log('value');
        $footprintsArray = $result['results'];
        foreach ($footprintsArray as $key => $footprint) {
            if (str_contains($footprint['act_code'],'F_GOVE')){
                $governmentValue = $footprint['value'];
                $total += $footprint['value'];
                error_log($footprint['value']);
                break;
            } else if (str_contains($footprint['act_code'],'F_HOUS')){
                $householdValue = $footprint['value'];
                $total += $footprint['value'];
                error_log($footprint['value']);
                break;
            } else if (str_contains($footprint['act_code'],'I_CHIN')){
                $chinValue = $footprint['value'];
                $total += $footprint['value'];
                error_log($footprint['value']);
                break;
            }
        }
        error_log($total);
  
    } 

    return $total;
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


function adt_get_person_footprint_recipe($actCode, $chosenCountry, $version): array
{
    // Example:
    // https://lca.aau.dk/api/recipes-country/?act_code=F_GOVE&region_code=AU
    // And version is not used yet.
    $url = 'https://lca.aau.dk/api/recipes-country/?act_code='.$actCode.'&region_code='.$chosenCountry.'&version='.$version;

    // Make the API request
    $recipeResponse = wp_remote_get($url);

    // Check for errors
    if (is_wp_error($recipeResponse)) {
        return [
            'error' => $recipeResponse->get_error_message()
        ];
    }
    
    // Get the response body
    $body = wp_remote_retrieve_body($recipeResponse);
    
    // Parse the JSON response
    $result = json_decode($body, true);

    $productCount = $result['count'];

    $recipeResult = $result['results'];

    if (empty($result)) {
        return 'No person recipe found or an error occurred.';
    }
    
    if (array_key_exists('detail', $result)) {
        return 'Error: ' . $result['detail'];
    }
    
    $pages = ceil($productCount / 100);

    
    // TODO: Throttled again for loading through the pages?
    for ($i = 2; $i <= $pages; $i++) {
        $api_url = "https://lca.aau.dk/api/recipes-country/?page=" . $i . "&act_code=" . $actCode . "&region_code=" . $chosenCountry . "&version=" . $version;
        $response = wp_remote_get($api_url);
        
        if (is_wp_error($response)) {
            continue;
        }
        
        $body = wp_remote_retrieve_body($response);
        $result = json_decode($body, true);
        if (!empty($result['results'])) {
            $recipeResult = array_merge($recipeResult, $result['results']);
        }
    }
    
    // Handle potential errors in the recipeResponse
    if (empty($recipeResult)) {
        return [
            'error' => 'No recipes found or an error occurred.'
        ];
    }
    
    return $recipeResult;
}