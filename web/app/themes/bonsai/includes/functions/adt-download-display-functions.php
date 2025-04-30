<?php

defined('ABSPATH') || exit;

add_action('admin_menu', 'my_custom_posts_admin_page');

function my_custom_posts_admin_page() {
    add_menu_page(
        'Custom Posts List',     // Page title
        'Custom Posts',          // Menu title
        'manage_options',        // Capability
        'custom-posts-list',     // Menu slug
        'renderCustomPostsPage', // Callback
        'dashicons-list-view',  // Icon
        20                      // Position
    );
}

function renderCustomPostsPage(): void {
    $entries = GFAPI::get_entries(1);

    $emailCounts = array_reduce($entries, function ($carry, $entry) {
        $email = $entry[3];
        if (isset($carry[$email])) {
            $carry[$email]['count']++;
        } else {
            $carry[$email] = [
                'count' => 1,
                'id' => $entry['id'],
                'name' => $entry[1],
                'mail' => $email
            ];
        }
        return $carry;
    }, []);

    $sortOrder = $_GET['sortOrder'] ?? 'desc';
    uasort($emailCounts, function ($a, $b) use ($sortOrder) {
        return $sortOrder === 'asc' ? $a['count'] <=> $b['count'] : $b['count'] <=> $a['count'];
    });

    $newSortOrder = $sortOrder === 'asc' ? 'desc' : 'asc';

    ob_start();
    ?>
    <div class="wrap">
        <h1>Signups for download</h1>
        <style>
            .custom-post-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .custom-post-table th, .custom-post-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .custom-post-table th { background-color: #f4f4f4; cursor: pointer; }
        </style>
        <table class="custom-post-table">
            <thead>
                <tr>
                    <th><a href="?sortOrder=<?php echo $newSortOrder; ?>">Count</a></th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Mail</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($emailCounts as $emailData): ?>
                    <tr>
                        <td><?php echo esc_html($emailData['count']); ?></td>
                        <td><?php echo esc_html($emailData['id']); ?></td>
                        <td><?php echo esc_html($emailData['name']); ?></td>
                        <td><?php echo esc_html($emailData['mail']); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
    echo ob_get_clean();
}