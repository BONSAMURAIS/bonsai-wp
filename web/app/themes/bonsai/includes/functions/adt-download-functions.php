<?php

defined('ABSPATH') || exit;

// Footprint
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

function adt_process_footprint_data_batch(): void {
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
        'callback' => 'adt_process_footprint_data_batch',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('download/v1', '/process-contribution-batch', [
        'methods' => 'GET',
        'callback' => 'adt_process_contribution_data_batch',
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

    $firstname = isset($_POST['firstname']) ? sanitize_text_field($_POST['firstname']) : '';
    $lastname  = isset($_POST['lastname']) ? sanitize_text_field($_POST['lastname']) : '';
    $email     = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';
    error_log("dl footprint firstname");
    error_log($firstname);
    error_log($lastname);
    error_log($email);

    if (empty($firstname) || empty($lastname) || !is_email($email)) {
        wp_die('Invalid input');
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

// Contribution
function adt_get_contribution_data_batch(int $page): array {
    $endpoint = 'https://lca.aau.dk/api/recipes/?page=' . $page;
    $response = wp_remote_get($endpoint);

    echo $page;
    
    $body = wp_remote_retrieve_body($response);

    return json_decode($body, true)['results'] ?? [];
}

function adt_store_contribution_data(array $data): void {
    global $wpdb;
    $tableName = $wpdb->prefix . 'contribution_data';

    foreach ($data as $item) {
        $wpdb->replace(
            $tableName,
            [
                'id' => $item['id'],
                'flow_reference' => $item['flow_reference'],
                'region_reference' => $item['region_reference'],
                'unit_reference' => $item['unit_reference'],
                'flow_input' => $item['flow_input'],
                'region_inflow' => $item['region_inflow'],
                'value_inflow' => $item['value_inflow'],
                'unit_inflow' => $item['unit_inflow'],
                'value_emission' => $item['value_emission'],
                'unit_emission' => $item['unit_emission'],
                'metrics' => $item['metrics'],
                'version' => $item['version'],
            ]
        );
    }
}

function adt_process_contribution_data_batch(): void {
    $currentPage = get_option('contribution_data_current_page', 1);
    $data = adt_get_contribution_data_batch($currentPage);

    if (!empty($data)) {
        adt_store_contribution_data($data);
        update_option('contribution_data_current_page', $currentPage + 1);
    } else {
        delete_option('contribution_data_current_page');
    }
}

function adt_get_and_store_contribution_data(): void {
    global $wpdb;

    $tableName = $wpdb->prefix . 'contribution_data';

    $wpdb->query("CREATE TABLE IF NOT EXISTS $tableName (
        id VARCHAR(255) NOT NULL,
        flow_reference VARCHAR(255) NOT NULL,
        region_reference VARCHAR(255) NOT NULL,
        unit_reference VARCHAR(255) NOT NULL,
        flow_input VARCHAR(255) NOT NULL,
        region_inflow VARCHAR(255) NULL,
        value_inflow FLOAT NULL,
        unit_inflow VARCHAR(255) NULL,
        value_emission FLOAT NOT NULL,
        unit_emission VARCHAR(255) NOT NULL,
        metrics VARCHAR(255) NOT NULL,
        version VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
    )");
}

register_activation_hook(__FILE__, 'adt_get_and_store_contribution_data');
add_action('wp_loaded', 'adt_get_and_store_contribution_data');

function adt_download_contribution_csv(): void {
    global $wpdb;
    $tableName = $wpdb->prefix . 'contribution_data';

    $results = $wpdb->get_results("SELECT * FROM $tableName", ARRAY_A);

    if (empty($results)) {
        wp_die('No data available to download.');
    }

    $firstname = isset($_POST['firstname']) ? sanitize_text_field($_POST['firstname']) : '';
    $lastname  = isset($_POST['lastname']) ? sanitize_text_field($_POST['lastname']) : '';
    $email     = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';

    if (empty($firstname) || empty($lastname) || !is_email($email)) {
        wp_die('Invalid input');
    }

    error_log($firstname);

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=contribution_data.csv');

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
add_action('admin_post_download_contribution_csv', 'adt_download_contribution_csv');

// Update the action to allow everyone to download the CSV file
add_action('admin_post_nopriv_download_contribution_csv', 'adt_download_contribution_csv');