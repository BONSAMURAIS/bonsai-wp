<?php
    function generate_dropdown_list($attr){

        $default = array(
            'id' => 'id',
            'list_options' => '[{"id": "1", "label": "One"}]',
        );

        $a = shortcode_atts($default, $attr);

            // Check for JSON decoding errors
        if (json_last_error() !== JSON_ERROR_NONE) {
            return '<p>Invalid JSON data.</p>';
        }

        $options = '';
        foreach (json_decode($a['list_options']) as $option) {
            $options .= '<option value="' . esc_attr($option['id']) . '">' . esc_html(ucfirst($option['label'])) . '</option>';
        }
        $arrow_icon = do_shortcode('[arrow_icon]');
        return '<label class="select" for="'.$a['id'].'">
                    <select id="'.$a['id'].'">
                    '.$options.'
                    </select>
                    '.$arrow_icon.'
                </label>';
    }
    add_shortcode('dropdown_list', 'generate_dropdown_list');
?>