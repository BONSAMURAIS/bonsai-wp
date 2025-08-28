<?php 

defined('ABSPATH') || exit;

$SEPARATOR = "|";
$CONFIG = json_decode(file_get_contents(__DIR__.'/../../constants/config.json'), true);
$GLOBALS['APIURL'] = $CONFIG['APIURL'];

function adt_get_person_footprint(){
    global $SEPARATOR;
    $country = $_POST['country'];
    $countryCode = $_POST['region_code'];
    $act_code = $_POST['act_code'];
    $version = $_POST['version'];
    $metric = $_POST['metric'];
    $year = $_POST['year'];

    // Check if the data is already cached
    $cachedFootprints = get_transient('adt_person_footprint_cache');
    
    // If cache exists, return the cached data
    if ($cachedFootprints !== false) {
        if (array_key_exists($countryCode, $cachedFootprints) && $cachedFootprints[$countryCode]['chosen_country'] === $countryCode) {
            wp_send_json_success($cachedFootprints[$countryCode]);
            die();
        }
    }

    $fdemand_aux = "F_GOVE";
    $url = $GLOBALS['APIURL']."/footprint-country/?region_reference=".$countryCode."&version=".$version."&act_code=".$fdemand_aux.$SEPARATOR.$act_code."&metric=".$metric; //TODO change if call with F_HOUS does not exist
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
        return ['No footprints found or an error occurred.'];
    }

    if (array_key_exists('detail', $result)) {
        wp_send_json_error(['error' => $result['detail']], 503);
    }

    // get newest version of the footprint.
    $footprintsArray = $result['results'];

    $fdemand_categories = array('F_GOVE', 'F_HOUS', 'F_NPSH');
    $value = get_total_value($fdemand_categories,$countryCode,$act_code,$version,$metric);
    $recipes = adt_get_person_footprint_recipe($fdemand_categories, $countryCode, $act_code, $version,$metric);

    
    //sort per value
    usort($recipes, function ($a, $b) {
        return $b['value'] <=> $a['value']; //b before a for descending order
    });

    // get only the first 20 elements
    $recipes = array_slice($recipes, 0, 20);

    $data = [
        'id' => $footprintsArray[0]['id'],
        'act_code' => $footprintsArray[0]['act_code'],
        'region_code' => $countryCode,
        'country' => $country,
        'value' => $value,
        'version' => $version,
        'metric' => $metric,
        'unit_emission' => $footprintsArray[0]['unit_emission'],
        'recipe' => $recipes,
        'year' => $year,
    ];

    $productCode = "";
    $cachedFootprintArray = [
        $productCode => $data,
    ];

    // Cache the locations for 24 hour (86400 seconds)
    set_transient('adt_person_footprint_cache', $cachedFootprintArray, 86400);
    wp_send_json_success($data);
}

function get_total_value(array $fdemand_categories, string $countryCode, string $act_code, int|string $version, string $metric) : float {
    global $SEPARATOR;
    $total = 0;
    foreach ($fdemand_categories as $cat){
        $url = $GLOBALS['APIURL']."/footprint-country/?region_reference=".$countryCode."&version=".$version."&act_code=".$cat.$SEPARATOR.$act_code."&metric=".$metric;
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

function adt_get_person_footprint_recipe(array $fdemand_categories, string $countryCode, string $act_code, int|string $version, string $metric): array
{ //something off here
    global $SEPARATOR;
    $recipeResult = [];
    
    foreach ($fdemand_categories as $cat){
        $url = $GLOBALS['APIURL'].'/recipes-country/?act_code='.$cat.$SEPARATOR.$act_code.'&region_reference='.$countryCode.'&version='.$version.'&metric='.$metric;
        $recipeResponse = wp_remote_get($url);
        
        // Check for errors
        if (is_wp_error($recipeResponse)) {
            return [
                'error_oui' => $recipeResponse->get_error_message()
            ];
        }
        
        // Get the response body
        $body = wp_remote_retrieve_body($recipeResponse);
        $result = json_decode($body, true);

        $productCount = $result['count'];

        if (empty($result)) {
            return ['No person recipe found or an error occurred.'];
        }
        
        if (array_key_exists('detail', $result)) {
            return ['Error: ' . $result['detail']];
        }

        if (!empty($result['results'])) {
            foreach ($recipeResult as $recipe) {
                foreach ($result['results'] as $new_recipe_key => $new_recipe_val) {
                    
                    if ($recipe["inflow"] == $new_recipe_val["inflow"]){
                        $recipe["value_emission"] += $new_recipe_val["value_emission"];
                        unset($result['results'][$new_recipe_key]);
                    }
                }
            }
            $recipeResult = array_merge($recipeResult, $result['results']);
        }
        
        $pages = ceil($productCount / 100);

        // TODO: Throttled again for loading through the pages?
        for ($i = 1; $i <= $pages; $i++) {
            $api_url = $GLOBALS['APIURL']."/recipes-country/?page=" . $i . "&act_code=" .$cat.$SEPARATOR.$act_code. "&region_reference=" . $countryCode . "&version=" . $version."&metric=".$metric;
            $response = wp_remote_get($api_url);
            
            if (is_wp_error($response)) {
                continue;
            }
            
            $body = wp_remote_retrieve_body($response);
            $result = json_decode($body, true);
            
            if (!empty($result['results'])) {
                foreach ($recipeResult as $recipe) {
                    foreach ($result['results'] as $new_recipe_key => $new_recipe_val) {
                        if ($recipe["inflow"] == $new_recipe_val["inflow"]){
                            $recipe["value_emission"] += $new_recipe_val["value_emission"];
                            unset($result['results'][$new_recipe_key]);
                            // break;
                        }
     
                    }
                }
                $recipeResult = array_merge($recipeResult, $result['results']);
            }            
        }
        
        // Handle potential errors in the recipeResponse
        if (empty($recipeResult)) {
            return [
                'error' => 'No recipes found or an error occurred.'
            ];
        }
    }

    return $recipeResult;
    return array();
}