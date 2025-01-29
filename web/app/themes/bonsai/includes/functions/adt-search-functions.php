<?php

defined('ABSPATH') || exit;

// Create function which can save search inputs into the database
// The inputs need to have a timestamp a product title and amount searched.

/**
 * Create the table for popular searches.
 */
function adt_create_popular_searches_table() 
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'adt_popular_searches';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        amount_searched int NOT NULL,
        search_phrase varchar(255) NOT NULL,
        product_code varchar(255) NOT NULL,
        product_uuid varchar(255) NOT NULL,
        chosen_values json NOT NULL,
        PRIMARY KEY (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

register_activation_hook(__FILE__, 'adt_create_popular_searches_table');
add_action('wp_loaded', 'adt_create_popular_searches_table');


/**
 * Log a popular search with ajax.
 */
function adt_log_popular_search() 
{
    global $wpdb;

    $search_phrase = $_POST['search_phrase'];
    $product_code = $_POST['product_code'];
    $product_uuid = $_POST['product_uuid'];
    $footprint_location = $_POST['footprint_location'];
    $footprint_type = $_POST['footprint_type'];
    $footprint_year = $_POST['footprint_year'];

    $chosenValues = [
        'footprint_location' => $footprint_location,
        'footprint_type' => $footprint_type,
        'footprint_year' => $footprint_year,
    ];

    $existing_search = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}adt_popular_searches WHERE product_code = %s",
        $product_code
    ));

    if ($existing_search) {
        $wpdb->update(
            $wpdb->prefix . 'adt_popular_searches',
            ['amount_searched' => $existing_search->amount_searched + 1],
            ['id' => $existing_search->id]
        );
    } else {
        $wpdb->insert($wpdb->prefix . 'adt_popular_searches', [
            'amount_searched' => 1,
            'search_phrase' => $search_phrase,
            'product_code' => $product_code,
            'product_uuid' => $product_uuid,
            'chosen_values' => json_encode($chosenValues),
        ]);
    }

    wp_send_json_success();
}

add_action('wp_ajax_adt_log_popular_search', 'adt_log_popular_search');
add_action('wp_ajax_nopriv_adt_log_popular_search', 'adt_log_popular_search');