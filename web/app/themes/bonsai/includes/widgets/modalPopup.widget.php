<?php

    function generate_modal_popup(){

        return 
            '<div id="modal-content">
                <span id="closeModal" class="close">&times;</span>
                <p>Hurray</p>'
                .'<p>'
                .do_shortcode('[block id="location-info-popup"]')
                .'</p>'
                .'<p>'
                .do_shortcode('[block id="year-info-popup"]')
                .'</p>'
                .'<p>'
                .do_shortcode('[block id="climate-metric-info-popup"]')
                .'</p>'
                .'<p>'
                .do_shortcode('[block id="database-version-info-popup"]')
                .'</p>'
                .'<p>'
                .do_shortcode('[block id="footprint-info-popup"]')
                .'</p>'.
            '</div>';
    }

    add_shortcode('modalPopup', 'generate_modal_popup');
?>