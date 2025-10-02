<?php
    add_shortcode('secure_download', 'secure_static_download_shortcode');
    add_action('admin_post_nopriv_download_file', 'serve_static_file');

    $filename = 'Template_PPF_v1.xlsx';
    function serve_static_file() {
        $filepath = __DIR__.'/../../../uploads/'.$filename;

        if (!file_exists($filepath)) {
            wp_die('File not found.');
        }

        $mime = mime_content_type($filepath);
        $allowed_mimes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

        if (!in_array($mime, $allowed_mimes)) {
            wp_die('File type not allowed.');
        }

        header('Content-Description: File Transfer');
        header('Content-Type: ' . $mime);
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($filepath));
        header('X-Content-Type-Options: nosniff');

        readfile($filepath);
        exit;
    }

    // Shortcode: [download-data-contribute-template-shortcode-wp]
    function secure_static_download_shortcode() {
        $url = admin_url('admin-post.php?action=download_file');
        return '<a href="' . esc_url($url) . '" download="'.$filename.'">Download</a>';
    }

    add_shortcode('download-data-contribute-template-shortcode-wp', 'secure_static_download_shortcode');
?>