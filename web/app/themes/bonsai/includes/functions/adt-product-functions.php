<?php

defined('ABSPATH') || exit;

add_action('init', function(){

    // Set UI labels for Custom Post Type
    $labels = array(
        'name'                => _x( 'Product', 'Post Type General Name', 'adtention' ),
        'singular_name'       => _x( 'Product', 'Post Type Singular Name', 'adtention' ),
        'menu_name'           => __( 'Product', 'adtention' ),
        'parent_item_colon'   => __( 'Parent product', 'adtention' ),
        'all_items'           => __( 'All products', 'adtention' ),
        'view_item'           => __( 'See product', 'adtention' ),
        'add_new_item'        => __( 'Add new product', 'adtention' ),
        'add_new'             => __( 'Add new', 'adtention' ),
        'edit_item'           => __( 'Edit product', 'adtention' ),
        'update_item'         => __( 'Update Product', 'adtention' ),
        'search_items'        => __( 'Search in Product', 'adtention' ),
        'not_found'           => __( 'Not Found', 'adtention' ),
        'not_found_in_trash'  => __( 'Not found in Trash', 'adtention' ),
    );

    // Set other options for Custom Post Type
    $args = [
        'label'               => __( 'Products', 'adtention' ),
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
    register_post_type( 'product', $args );

});

function adt_get_all_products_by_footprint(): array
{
    $args = [
        'post_type' => 'product',
        'posts_per_page' => -1,
    ];

    $query = new WP_Query($args);

    $array = [];

    foreach ($query->posts as $key => $post) {
        $postId = $post->ID;

        $code = get_post_meta($postId, 'adt_code', true);
        $unit = get_post_meta($postId, 'adt_characteristic_unit', true);
        $uuid = get_post_meta($postId, 'adt_uuid', true);

        $array[$key] = [
            'title' => $post->post_title,
            'content' => $post->post_content,
            'code' => $code,
            'unit' => $unit,
            'uuid' => $uuid,
        ];
    }

    return $array;
}