<?php
// Register the shortcode
function download_template_shortcode() {
    wp_enqueue_style('adt-issues-style', content_url('/themes/bonsai/dist/css/adt-issues.css'));

    // Start output buffering
    ob_start();
    ?>

    <a download>
        Download template
    </a>

<?php
    // Return the buffered content
    return ob_get_clean();
    }

    // Add the shortcode
    add_shortcode('download-data-contribute-template-shortcode-wp', 'download_template_shortcode');
?>