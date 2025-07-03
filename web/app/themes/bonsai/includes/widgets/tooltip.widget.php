<?php 
    function generate_tooltip($attr, $tooltip = null){

        $default = array(
            'id' => 'id',
            'href' => '#',
            'label' => 'label_tooltip', 
            'block_id' => 'info-popup', 
        );
        $a = shortcode_atts($default, $attr);
        $tooltip = do_shortcode('[lightbox id="'.$a['id'].'" width="600px" padding="20px"][block id="'.$a['block_id'].'"][/lightbox]');

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