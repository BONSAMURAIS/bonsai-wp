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

function adt_get_footprint_name_by_code()
{
    $code = $_POST['code'];
    $region_code = $_POST['region_code'];
    
    $args = [
        'post_type' => 'footprint',
        'numberposts' => 1,
        'meta_query' => [
            'relation' => 'AND',
            [
                'key' => 'adt_code',
                'value' => $code,
                'compare' => '=',
            ],
            [
                'key' => 'region_code',
                'value' => $region_code,
                'compare' => '=',
            ],
        ],
    ];

    $posts = get_posts($args);

    foreach ($posts as $post) {
        $footprintTitle = $post->post_title;
    }


    wp_send_json_success($footprintTitle);
}

add_action('wp_ajax_adt_get_footprint_name_by_code', 'adt_get_footprint_name_by_code');
add_action('wp_ajax_nopriv_adt_get_footprint_name_by_code', 'adt_get_footprint_name_by_code');

/**
 * Newest API version for the Bonsai API
 * does not work correctly until february 2025
 */
function adt_get_bonsai_activity_names() {
    global $wpdb;

    // I get 100 products per page
    // get the count of products and divide by 100
    // loop through the pages and get the products
    $api_url = "https://lca.aau.dk/api/activity-names/";

    // Make the request
    $response = wp_remote_get($api_url);

    // Check for errors
    if (is_wp_error($response)) {
        return 'Error: ' . $response->get_error_message();
    }

    // Get the response body
    $body = wp_remote_retrieve_body($response);

    // Parse the JSON response
    $products = json_decode($body, true);

    
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
        update_post_meta($postId, 'adt_uuid', $product['uuid']);
        update_post_meta($postId, 'adt_flowtype', $product['flow_type']);
    }
}

// add_action('template_redirect', 'adt_get_bonsai_activity_names');