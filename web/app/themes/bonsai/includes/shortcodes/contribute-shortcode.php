<?php
// Register the shortcode
function contribute_shortcode() {
    wp_enqueue_style('adt-issues-style', content_url('/themes/bonsai/dist/css/adt-issues.css'));

    // Start output buffering
    ob_start();
    ?>

    
    <div class="flex issues-search">
        <input type="text" id="search" placeholder="Search issues" />
        <input type="text" id="labels" placeholder="Labels" readonly />
        <input type="text" id="milestones" placeholder="Milestones" readonly />
        <a href="https://gitlab.com/bonsamurais/bonsai/clean/data_contribution/-/issues/new" class="button primary" target="_blank">                  
            New data contribution
        </a>
    </div>

<?php
    // Return the buffered content
    return ob_get_clean();
    }

    // Add the shortcode
    add_shortcode('contribute-shortcode-wp', 'contribute_shortcode');
?>