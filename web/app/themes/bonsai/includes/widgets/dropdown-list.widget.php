<?php
    function generate_dropdown_list($atts){

        $a = shortcode_atts($default, $atts);

        
        return '<div class="tooltip">
                    <a href="#info-household-composition">
                        Household composition
                    </a>

                </div>
                <label class="select" for="household-composition">
                    <select id="household-composition">

                    </select>
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
                    </svg>
                </label>';
    }
    add_shortcode('tooltiped_dropdownlist', 'generate_dropdown_list');
?>