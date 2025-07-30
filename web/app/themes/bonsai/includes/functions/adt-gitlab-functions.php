<?php

defined('ABSPATH') || exit;

use Roots\WPConfig\Config;

$CONFIG = json_decode(file_get_contents(__DIR__.'/../../constants/config.json'), true);
$GLOBALS['APIGITLAB_URL'] = $CONFIG['APIGITLAB_URL'];

function adt_fetch_gitlab_issues() {
    $project_id = '<project-id>'; // Replace with your GitLab project ID
    $project_id = rawurlencode('bonsamurais/bonsai');
    // $project_id = rawurlencode('bonsamurais/bonsai/build/footprint_calculator');
    $project_id = rawurlencode('bonsamurais/bonsai/bug-report-website');
    $access_token = Config::get('GITLAB_TOKEN'); // Replace with your GitLab Personal Access Token
    $api_url = $GLOBALS['APIGITLAB_URL']."/{$project_id}/issues";
    // GET https://gitlab.com/api/v4/projects/bonsamurais%2Fbonsai/issues

    // Add headers for authorization
    $args = [
        'headers' => [
            'PRIVATE-TOKEN' => $access_token,
        ],
    ];

    // Make the request
    $response = wp_remote_get($api_url, $args);

    // Check for errors
    if (is_wp_error($response)) {
        return 'Error: ' . $response->get_error_message();
    }

    // Get the response body
    $body = wp_remote_retrieve_body($response);

    error_log("git error body");
    error_log($body);

    // Parse the JSON response
    $issues = json_decode($body, true);

    if (empty($issues)) {
        return 'No issues found or an error occurred.';
    }

    return $issues;
}
