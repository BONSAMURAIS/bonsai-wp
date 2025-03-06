<?php

defined('ABSPATH') || exit;

add_action('init', function(){

    // Set UI labels for Custom Post Type
    $labels = array(
        'name'                => _x( 'Shared search', 'Post Type General Name', 'adtention' ),
        'singular_name'       => _x( 'Shared search', 'Post Type Singular Name', 'adtention' ),
        'menu_name'           => __( 'Shared search', 'adtention' ),
        'parent_item_colon'   => __( 'Parent search', 'adtention' ),
        'all_items'           => __( 'All shared searches', 'adtention' ),
        'view_item'           => __( 'See search', 'adtention' ),
        'add_new_item'        => __( 'Add new search', 'adtention' ),
        'add_new'             => __( 'Add new', 'adtention' ),
        'edit_item'           => __( 'Edit search', 'adtention' ),
        'update_item'         => __( 'Update search', 'adtention' ),
        'search_items'        => __( 'Search in shared searches', 'adtention' ),
        'not_found'           => __( 'Not Found', 'adtention' ),
        'not_found_in_trash'  => __( 'Not found in Trash', 'adtention' ),
    );

    // Set other options for Custom Post Type
    $args = [
        'label'               => __( 'Shared searches', 'adtention' ),
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
        'rewrite'             => ['slug' => 'search'],
        'capability_type'     => 'post',
        'show_in_rest' => true,
    ];

    // Registering your Custom Post Type
    register_post_type( 'shared_searches', $args );

});

function adt_save_shared_search()
{
    $data = $_POST['data'];

    // Product searched is the title
    $postId = wp_insert_post(array(
        'post_title' => $data['title'],
        'post_content' => $data['content'],
        'post_type' => 'shared_searches',
        'post_status' => 'publish',
    ));

    $originalData = [
        'footprint' => $data['footprint'],
        'footprint_type' => $data['footprint_type'],
        'product_code' => $data['product_code'],
        'footprint_country' => $data['footprint_country'],
        'footprint_year' => $data['footprint_year'],
        'footprint_climate_metrics' => $data['footprint_climate_metrics'],
        'amount_chosen' => $data['amount_chosen'],
        'unit_chosen' => $data['unit_chosen'],
    ];

    $comparedData = [
        'title' => $data['title_compared'],
        'content' => $data['content_compared'],
        'footprint' => $data['footprint_compared'],
        'footprint_type' => $data['footprint_type_compared'],
        'product_code' => $data['product_code_compared'],
        'footprint_country' => $data['footprint_country_compared'],
        'footprint_year' => $data['footprint_year_compared'],
        'footprint_climate_metrics' => $data['footprint_climate_metrics_compared'],
        'amount_chosen' => $data[''],
        'unit_chosen' => $data['unit_chosen_compared'],
    ];

    // The original data
    update_post_meta($postId, 'footprint_original', $originalData);
    // If there is a compared product or not
    update_post_meta($postId, 'compared', $data['compared']);
    // Which view is chosen (basic or advanced)
    update_post_meta($postId, 'footprint_view', $data['footprint_view']);
    // The compared data to display if there is a compared product
    update_post_meta($postId, 'footprint_compared', $comparedData);

    $url = get_permalink($postId);

    wp_send_json_success($url);
    wp_die();
}

add_action('wp_ajax_adt_save_shared_search', 'adt_save_shared_search');
add_action('wp_ajax_nopriv_adt_save_shared_search', 'adt_save_shared_search');


function adt_get_shared_search(int $id): array
{
    $data = [
        'title' => get_the_title($id),
        'content' => get_the_content($id),
        'footprint' => get_post_meta($id, 'footprint_original', true)['footprint'],
        'footprint_type' => get_post_meta($id, 'footprint_original', true)['footprint_type'],
        'product_code' => get_post_meta($id, 'footprint_original', true)['product_code'],
        'footprint_country' => get_post_meta($id, 'footprint_original', true)['footprint_country'],
        'footprint_year' => get_post_meta($id, 'footprint_original', true)['footprint_year'],
        'footprint_climate_metrics' => get_post_meta($id, 'footprint_original', true)['footprint_climate_metrics'],
        'amount_chosen' => get_post_meta($id, 'footprint_original', true)['amount_chosen'],
        'unit_chosen' => get_post_meta($id, 'footprint_original', true)['unit_chosen'],
        'compared' => get_post_meta($id, 'compared', true),
        'footprint_view' => get_post_meta($id, 'footprint_view', true),
        'footprint_compared' => get_post_meta($id, 'footprint_compared', true),
    ];

    return $data;
}