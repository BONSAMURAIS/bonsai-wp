<?php
    function generate_dropdown_list($attr){

        $default = array(
            'id' => 'id',
            'list_options' => '[{"id": "1", "label": "One"}]',
        );

        $a = shortcode_atts($default, $attr);

        $options = '';
        foreach (json_decode($a['list_options']) as $option) {
            $id = isset($option['id']) ? esc_html($option['id']) : '';
            $label = isset($option['label']) ? esc_html($option['label']) : '';
            $options .= '<option value="' . $id . '">' . $label . '</option>';
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