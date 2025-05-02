<?php

defined('ABSPATH') || exit;

add_action('init', function(){

    // Set UI labels for Custom Post Type
    $labels = array(
        'name'                => _x( 'Footprint', 'Post Type General Name', 'adtention' ),
        'singular_name'       => _x( 'Footprint', 'Post Type Singular Name', 'adtention' ),
        'menu_name'           => __( 'Footprint', 'adtention' ),
        'parent_item_colon'   => __( 'Parent footprint', 'adtention' ),
        'all_items'           => __( 'All footprints', 'adtention' ),
        'view_item'           => __( 'See footprint', 'adtention' ),
        'add_new_item'        => __( 'Add new footprint', 'adtention' ),
        'add_new'             => __( 'Add new', 'adtention' ),
        'edit_item'           => __( 'Edit footprint', 'adtention' ),
        'update_item'         => __( 'Update footprint', 'adtention' ),
        'search_items'        => __( 'Search in footprint', 'adtention' ),
        'not_found'           => __( 'Not Found', 'adtention' ),
        'not_found_in_trash'  => __( 'Not found in Trash', 'adtention' ),
    );

    // Set other options for Custom Post Type
    $args = [
        'label'               => __( 'Footprints', 'adtention' ),
        'description'         => __( '', 'adtention' ),
        'labels'              => $labels,
        // Features this CPT supports in Post Editor
        'supports'            => array( 'title', 'editor'),
        'hierarchical'        => false,
        'public'              => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_nav_menus'   => true,
        'show_in_admin_bar'   => true,
        'menu_position'       => 5,
        'can_export'          => false,
        'has_archive'         => false,
        'exclude_from_search' => false,
        'publicly_queryable'  => true,
        'capability_type'     => 'post',
        'show_in_rest' => true,
    ];

    // Registering your Custom Post Type
    register_post_type( 'footprint', $args );

});

function adt_get_all_footprints(): array
{
    // $args = [
    //     'post_type' => 'footprint',
    //     'posts_per_page' => -1,
    // ];

    // $query = new WP_Query($args);

    // $array = [];

    // foreach ($query->posts as $key => $post) {
    //     $postId = $post->ID;

    //     $code = get_post_meta($postId, 'adt_code', true);
    //     $unit = get_post_meta($postId, 'adt_characteristic_unit', true);
    //     $uuid = get_post_meta($postId, 'adt_uuid', true);

    //     $array[$key] = [
    //         'title' => $post->post_title,
    //         'content' => $post->post_content,
    //         'code' => $code,
    //         'unit' => $unit,
    //         'uuid' => $uuid,
    //     ];
    // }

    // return $array;
}

function adt_get_footprint_name_by_code($code)
{
    $args = [
        'post_type' => 'product',
        'numberposts' => 1,
        'meta_query' => [
            [
                'key' => 'adt_code',
                'value' => $code,
                'compare' => '=',
            ],
        ],
    ];
    
    $posts = get_posts($args);
    
    if (empty($posts)) {
        return 'Not found';
    }

    foreach ($posts as $post) {
        $footprintTitle = $post->post_title;
    }

    return $footprintTitle;
}

/**
 * Old API endpoint for products - the Bonsai API
 * To get the older products for cradle to gate also get products from activity names
 */
function adt_get_bonsai_activity_names() {
  
}

// add_action('template_redirect', 'adt_get_bonsai_activity_names');

function adt_convert_number_by_units(string $fromUnit, string $toUnit): float
{
    $url = 'https://lca.aau.dk/api/unit-converters/?unit_from='.$fromUnit.'&unit_to='.$toUnit;

    // Make the request
    $response = wp_remote_get($url);

    // Check for errors
    if (is_wp_error($response)) {
        return 'Error: ' . $response->get_error_message();
    }

    // Get the response body
    $body = wp_remote_retrieve_body($response);

    // Parse the JSON response
    $result = json_decode($body, true);

    return $result[0]['multiplier'];
}

function adt_get_converted_number_ajax()
{
    // Remember that the number is always tonnes and should be displayed in kg
    // therefore remember to multiply by 1000.
    $fromUnit = $_POST['fromUnit'];
    $toUnit = $_POST['toUnit'];
    $number = $_POST['number'];

    $multiplier = adt_convert_number_by_units($fromUnit, $toUnit);

    $convertedNumber = $number / $multiplier * 1000;

    wp_send_json_success($convertedNumber);
}

add_action('wp_ajax_adt_get_converted_number_ajax', 'adt_get_converted_number_ajax');
add_action('wp_ajax_nopriv_adt_get_converted_number_ajax', 'adt_get_converted_number_ajax');


function adt_probability_a_greater_b()
{    
    $A = $_POST['original'];
    $B = $_POST['comparison'];

    $count = 0;
    $total = count($A) * count($B);

    foreach ($A as $a) {
        foreach ($B as $b) {
            if ($a > $b) {
                $count += 1;
            }
        }
    }

    $result = $count / $total;

    wp_send_json_success($result);
}

add_action('wp_ajax_adt_probability_a_greater_b', 'adt_probability_a_greater_b');
add_action('wp_ajax_nopriv_adt_probability_a_greater_b', 'adt_probability_a_greater_b');