<?php
// Register the shortcode
function contribute_shortcode()
{
    wp_enqueue_style('adt-issues-style', content_url('/themes/bonsai/dist/css/adt-issues.css'));

    // Start output buffering
    ob_start();
    ?>

    <div class="flex data-contri-search">
        <a href="https://gitlab.com/bonsamurais/bonsai/clean/data_contribution/-/issues/new"
            class="button primary data-contri-link" target="_blank">
            Upload
        </a>
    </div>

    <?php
    // Return the buffered content
    return ob_get_clean();
}

// Add the shortcode
add_shortcode('contribute-shortcode-wp', 'contribute_shortcode');
?>