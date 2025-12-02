<?php 

defined('ABSPATH') || exit;

$SEPARATOR = "|";
$CONFIG = json_decode(file_get_contents(__DIR__.'/../../constants/config.json'), true);
$GLOBALS['APIURL'] = $CONFIG['APIURL'];

function adt_get_person_footprint(){
    global $SEPARATOR;
    $country = $_POST['country'];
    $countryCode = $_POST['region_code'];
    $household_type = $_POST['household_type'];
    $income_group = $_POST['income_group'];
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

    $final_demand_aux = "F_GOVE";
    $url = $GLOBALS['APIURL']."/footprint-country/?region_code=".$countryCode."&version=".$version."&metric=".$metric."&household_type=".$household_type."&income_group=".$income_group."&final_demand=".$final_demand_aux; //TODO change if call with F_HOUS does not exist
    error_log("person tab: url= {$url}");
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
        return ['No footprints found or an error occurred.'];
    }

    if (array_key_exists('detail', $result)) {
        wp_send_json_error(['error' => $result['detail']], 503);
    }

    // get newest version of the footprint.
    $footprintsArray = $result['results'];

    $value = get_total_value($countryCode,$household_type, $income_group,$version,$metric);

    $recipes = adt_get_person_footprint_recipe($countryCode,$household_type, $income_group,$version,$metric);

    $data = [
        'id' => $footprintsArray[0]['id'],
        'household_type' => $household_type,
        'income_group' => $income_group,
        'region_code' => $countryCode,
        'country' => $country,
        'value' => $value,
        'version' => $version,
        'metric' => $metric,
        'unit_emission' => $footprintsArray[0]['unit_emission'],
        'list_locations' => adt_get_locations(),//$result["locations"],
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

function get_total_value(string $countryCode, string $household_type, string $income_group, string $version, string $metric) : float {
    $total = 0;
    $url = $GLOBALS['APIURL']."/footprint-country/?region_code=".$countryCode."&version=".$version."&metric=".$metric."&household_type=".$household_type."&income_group=".$income_group;

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
        wp_send_json_error(['error' => $result['detail']], 503);
    }

    $footprintsArray = $result['results'];
    foreach ($footprintsArray as $key => $footprint) {
        $total += $footprint['value'];
    }
    return $total;
}

add_action('wp_ajax_adt_get_person_footprint', 'adt_get_person_footprint');
add_action('wp_ajax_nopriv_adt_get_person_footprint', 'adt_get_person_footprint');

function adt_get_person_footprint_recipe(string $countryCode, string $household_type, string $income_group, string $version, string $metric) : array
{ 
    $recipeResult = [];
    $url = $GLOBALS['APIURL'].'/recipes-country/?region_reference='.$countryCode.'&version='.$version.'&metric='.$metric."&household_type=".$household_type."&income_group=".$income_group;
    $recipeResponse = wp_remote_get($url);
    // Get the response body
    error_log("start loop");
    error_log("url=".$url);
    $body = wp_remote_retrieve_body($recipeResponse);
    $result = json_decode($body, true);
    
    // Check for errors
    if (is_wp_error($recipeResponse)) {
        return [
            'error_oui' => $recipeResponse->get_error_message()
        ];
    }
    
    if (!isset($result['results'])) {
        return ['No person recipe found or an error occurred.'];
    }
    
    $final_results= [];
    
    do {
        foreach ($result['results'] as $product) {
            error_log("result['next']=".$$result['next']);
            
            if (isset($final_results[$product['inflow']])){
                $final_results[$product['inflow']]['value_inflow'] +=$product['value_inflow'];
                $final_results[$product['inflow']]['value_emission'] +=$product['value_emission'];
            }else{
                $final_results[$product['inflow']]['inflow'] = $product['inflow'];
                $final_results[$product['inflow']]['region_inflow'] = $product['region_inflow'];
                $final_results[$product['inflow']]['inflow_name'] = $product['inflow_name'];
                $final_results[$product['inflow']]['value_inflow'] = $product['value_inflow'];
                $final_results[$product['inflow']]['value_emission'] = $product['value_emission'];
                $final_results[$product['inflow']]['unit_inflow'] = $product['unit_inflow'];
                $final_results[$product['inflow']]['unit_emission'] = $product['unit_emission'];
            }
        }
        if (!empty($result['next'])) {
            $recipeResponse = wp_remote_get($result['next']);
            
            // Check for errors
            if (is_wp_error($recipeResponse)) {
                return [
                    'error_oui' => $recipeResponse->get_error_message()
                ];
            }
            
            // Get the response body
            $body = wp_remote_retrieve_body($recipeResponse);
            $result = json_decode($body, true);
        }
    }
    while(isset($result['next']));

    error_log("end loop");
        // //sort per value
    usort($final_results, function ($a, $b) {
        return $b['value_emission'] <=> $a['value_emission']; //b before a for descending order
    });

    $final_results = array_slice($final_results, 0, 20);

    return $final_results;
}
