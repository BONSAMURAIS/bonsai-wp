<?php 

defined('ABSPATH') || exit;

$SEPARATOR = "|";

function adt_get_person_footprint()
{
    error_log("-- adt_get_person_footprint --");
    global $SEPARATOR;
    $country = $_POST['region_code'];
    $act_code = $_POST['act_code'];
    $version = $_POST['version'];

    // Check if the data is already cached
    $cachedFootprints = get_transient('adt_person_footprint_cache');
    
    // If cache exists, return the cached data
    if ($cachedFootprints !== false) {
        if (array_key_exists($country, $cachedFootprints) && $cachedFootprints[$country]['chosen_country'] === $country) {
            wp_send_json_success($cachedFootprints[$country]);
            die();
        }
    }

    $fdemand_aux = "F_HOUS";
    $url = "https://lca.aau.dk/api/footprint-country/?region_code=".$country."&version=".$version."&act_code=".$fdemand_aux.$SEPARATOR.$act_code; //TODO change if call with F_HOUS does not exist
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
    $footprintsArray = $result['results'];

    $fdemand_categories = array('F_GOVE', 'F_HOUS', 'F_NPSH');
    $value = get_total_value($fdemand_categories,$country,$act_code,$version);
    $recipes = adt_get_person_footprint_recipe($fdemand_categories, $country, $act_code, $version);

    /**
     * TODO: the arrays above contains a maximum of 100 items.
     * Therefore we need to send more requests to get all the data.
     * 
     * I have gotten the results from all the pages in the function adt_get_person_footprint_recipe.
     */

    // Find matching recipe codes and add the values together.
    // Unique product_codes from the first array
    // $productCodes = array_column($recipes, 'product_code');
    // $productCodes = array_unique($productCodes);

    $data = [
        'id' => $footprintsArray[0]['id'],
        'act_code' => $footprintsArray[0]['act_code'],
        'region_code' => $country,
        'value' => $value,
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

function get_total_value(array $fdemand_categories, string $country, string $act_code, int|string $version) : int {
    global $SEPARATOR;
    $total = 0;
    foreach ($fdemand_categories as $cat){
        $url = "https://lca.aau.dk/api/footprint-country/?region_code=".$country."&version=".$version."&act_code=".$cat.$SEPARATOR.$act_code;
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

        $footprintsArray = $result['results'];
        foreach ($footprintsArray as $key => $footprint) {
            if (str_contains($footprint['act_code'], $cat)){
                $governmentValue = $footprint['value'];
                $total += $footprint['value'];
                break;
            }
        }
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


function adt_get_person_footprint_recipe(array $fdemand_categories, string $country, string $act_code, int|string $version): array
{
    // Example:
    // https://lca.aau.dk/api/recipes-country/?act_code=F_GOVE|1-5_average&region_code=AU

    global $SEPARATOR;
    $recipeResult = [];
    error_log("-- adt_get_person_footprint_recipe");
    
    foreach ($fdemand_categories as $cat){
        $url = 'https://lca.aau.dk/api/recipes-country/?act_code='.$cat.$SEPARATOR.$act_code.'&region_code='.$country.'&version='.$version;
        
        error_log("url");
        error_log($url);
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
        // error_log("body");
        // error_log($body);
        
        // Parse the JSON response
        $result = json_decode($body, true);
        $productCount = $result['count'];
        
        $recipeResult = array_merge($recipeResult, $result['results']);
        
        if (empty($result)) {
            return 'No person recipe found or an error occurred.';
        }
        
        if (array_key_exists('detail', $result)) {
            return 'Error: ' . $result['detail'];
        }
        
        $pages = ceil($productCount / 100);


        
            
        // TODO: Throttled again for loading through the pages?
        for ($i = 1; $i <= $pages; $i++) {
            $api_url = "https://lca.aau.dk/api/recipes-country/?page=" . $i . "&act_code=" .$cat.$SEPARATOR.$act_code. "&region_code=" . $country . "&version=" . $version;
            $response = wp_remote_get($api_url);
            
            if (is_wp_error($response)) {
                continue;
            }
            
            $body = wp_remote_retrieve_body($response);
            $result = json_decode($body, true);
            // error_log("test");
            // error_log(json_encode($result['results']));
            
            if (!empty($result['results'])) {
                foreach ($recipeResult as $recipe) {
                    foreach ($result['results'] as $new_recipe) {
                        error_log("----- test recipe code");
                        error_log($recipe["product_code"]);
                        error_log($recipe["value"]);
                        error_log(" - test NEW recipe prod code");
                        error_log($new_recipe["product_code"]);
                        error_log("-----");
     
                    }
                }

            }
                // error_log(json_encode($result['results']));
                // error_log(json_encode($result['results'][0]["product_code"]));
                // error_log(json_encode($result['results'][0]["value"]));
                // // error_log(print_r(json_encode($recipe)));
                // // error_log(print_r(json_encode($new_recipe)));
      
                // $result['results']
                // $recipeResult = array_merge($recipeResult, );

            
        }
        
        // Handle potential errors in the recipeResponse
        if (empty($recipeResult)) {
            return [
                'error' => 'No recipes found or an error occurred.'
            ];
        }

        error_log("recipeResult count");
        error_log(count($recipeResult));

    }

    // $final_result = remove_duplicates_and_add_up_values($recipeResult);
    return [];
    return $recipeResult;
}

// function remove_duplicates_and_add_up_values(array $recipeResult): array{
//     $unique_
//     return result;
// }