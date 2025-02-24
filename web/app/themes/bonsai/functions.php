<?php
// Add custom Theme Functions here

// Functions
require_once "includes/functions/adt-helper-functions.php";
require_once "includes/functions/adt-admin-functions.php";
require_once "includes/functions/adt-enqueue-functions.php";
require_once "includes/functions/adt-gitlab-functions.php";
require_once "includes/functions/adt-bonsai-api-functions.php";
require_once "includes/functions/adt-product-functions.php";
require_once "includes/functions/adt-search-functions.php";
require_once "includes/functions/adt-footprint-functions.php";
require_once "includes/functions/adt-share-functions.php";

// Shortcodes
require_once "includes/shortcodes/adt-navigation-shortcode.php";
require_once "includes/shortcodes/adt-searchform-shortcode.php";
require_once "includes/shortcodes/adt-issues-shortcode.php";

add_action('wp_head', function(){
    ?>
    <script>
        window.markerConfig = {
            project: '67bc4524d5023171bf6592ec',
            source: 'snippet',
        };
        !function(e,r,a){if(!e.__Marker){e.__Marker={};var t=[],n={__cs:t};["show","hide","isVisible","capture","cancelCapture","unload","reload","isExtensionInstalled","setReporter","clearReporter","setCustomData","on","off"].forEach(function(e){n[e]=function(){var r=Array.prototype.slice.call(arguments);r.unshift(e),t.push(r)}}),e.Marker=n;var s=r.createElement("script");s.async=1,s.src="https://edge.marker.io/latest/shim.js";var i=r.getElementsByTagName("script")[0];i.parentNode.insertBefore(s,i)}}(window,document);
    </script>
    <?php
});