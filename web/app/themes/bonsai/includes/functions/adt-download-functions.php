<?php
set_time_limit(300); // 300 seconds = 5 minutes

header('Content-Type: text/csv');
header('Content-Disposition: attachment;filename="footprint_data.csv"');

$baseUrl = 'https://lca.aau.dk/api/footprint/?page=';
$page = 1;
$allData = [];

// Fetch the first page to get the total count
$json = file_get_contents($baseUrl . $page);
$response = json_decode($json, true);

$total = $response['count'];
$resultsPerPage = count($response['results']);
$totalPages = ceil($total / $resultsPerPage);

// Collect data from all pages
while ($page <= $totalPages) {
    $json = file_get_contents($baseUrl . $page);
    $response = json_decode($json, true);
    
    if (isset($response['results'])) {
        $allData = array_merge($allData, $response['results']);
    }
    $page++;
}

// Open output stream
$output = fopen('php://output', 'w');

// Write headers from the first entry
if (!empty($allData)) {
    fputcsv($output, array_keys($allData[0]));

    // Write each row
    foreach ($allData as $row) {
        fputcsv($output, $row);
    }
}

fclose($output);
exit;
?>