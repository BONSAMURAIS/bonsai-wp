<?php 
    function generate_tooltip($attr, $tooltip = null){

        $default = array(
            'href' => '#',
            'label' => 'label_tooltip', 
            'block_id' => 'info-popup', 
        );
        $a = shortcode_atts($default, $atts);
        $tooltip = do_shortcode('[lightbox id="'.$a['href'].'" width="600px" padding="20px"][block id="'.$a['block_id'].'"][/lightbox]');

        return '
            <div class="tooltip">
                <a href="'.$a['href'].'">
                    '. $a['label'] .'
                </a>'
                . $tooltip .
            '</div>';
    }
    add_shortcode('tooltip', 'generate_tooltip');
?>