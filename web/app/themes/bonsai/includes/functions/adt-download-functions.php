<?php

defined('ABSPATH') || exit;

function adt_get_footprint_data_batch(int $page): array {
    $endpoint = 'https://lca.aau.dk/api/footprint/?page=' . $page;
    $response = wp_remote_get($endpoint);

    echo $page;
    
    $body = wp_remote_retrieve_body($response);

    return json_decode($body, true)['results'] ?? [];
}

function adt_store_footprint_data(array $data): void {
    global $wpdb;
    $tableName = $wpdb->prefix . 'footprint_data';

    foreach ($data as $item) {
        $wpdb->replace(
            $tableName,
            [
                'id' => $item['id'],
                'flow_code' => $item['flow_code'],
                'nace_related_code' => $item['nace_related_code'],
                'description' => $item['description'],
                'unit_reference' => $item['unit_reference'],
                'region_code' => $item['region_code'],
                'value' => $item['value'],
                'unit_emission' => $item['unit_emission'],
                'version' => $item['version']
            ]
        );
    }
}

function adt_process_footprint_fata_batch(): void {
    $currentPage = get_option('footprint_data_current_page', 1);
    $data = adt_get_footprint_data_batch($currentPage);

    if (!empty($data)) {
        adt_store_footprint_data($data);
        update_option('footprint_data_current_page', $currentPage + 1);
    } else {
        delete_option('footprint_data_current_page');
    }
}

function adt_get_and_store_footprint_data(): void {
    global $wpdb;

    $tableName = $wpdb->prefix . 'footprint_data';

    $wpdb->query("CREATE TABLE IF NOT EXISTS $tableName (
        id INT NOT NULL,
        flow_code VARCHAR(255) NOT NULL,
        nace_related_code VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        unit_reference VARCHAR(255) NOT NULL,
        region_code VARCHAR(255) NOT NULL,
        value FLOAT NOT NULL,
        unit_emission VARCHAR(255) NOT NULL,
        version VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
    )");
}

register_activation_hook(__FILE__, 'adt_get_and_store_footprint_data');
add_action('wp_loaded', 'adt_get_and_store_footprint_data');

add_action('rest_api_init', function (): void {
    register_rest_route('download/v1', '/process-footprint-batch', [
        'methods' => 'GET',
        'callback' => 'adt_process_footprint_fata_batch',
        'permission_callback' => '__return_true',
    ]);
});

function adt_download_footprint_csv(): void {
    global $wpdb;
    $tableName = $wpdb->prefix . 'footprint_data';

    $results = $wpdb->get_results("SELECT * FROM $tableName", ARRAY_A);

    if (empty($results)) {
        wp_die('No data available to download.');
    }

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=footprint_data.csv');

    $output = fopen('php://output', 'w');

    // Add CSV headers
    fputcsv($output, array_keys($results[0]));

    // Add data rows
    foreach ($results as $row) {
        fputcsv($output, $row);
    }

    fclose($output);
    exit;
}

// Handle the button click to trigger the CSV download
add_action('admin_post_download_footprint_csv', 'adt_download_footprint_csv');

// Update the action to allow everyone to download the CSV file
add_action('admin_post_nopriv_download_footprint_csv', 'adt_download_footprint_csv');