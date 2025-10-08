<?php

    function generate_modal_popup(){

        return 
            '<div id="modal-content">
                <span id="closeModal" class="close">&times;</span>
                <p>Hurray</p>
                [block id="year-info-popup"]
            </div>';
    }

    add_shortcode('modalPopup', 'generate_modal_popup');
?>