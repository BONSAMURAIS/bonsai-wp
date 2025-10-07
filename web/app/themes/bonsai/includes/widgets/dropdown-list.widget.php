<?php
    function generate_dropdown_list($attr){

        $default = array(
            'id' => 'id',
            'filepath' => '',
        );
        $a = shortcode_atts($default, $attr);

        $json_content = file_get_contents($attr['filepath']);
        $list_options = json_decode($json_content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return '<p>Invalid JSON data.</p>';
        }

        $options = '';
        foreach ($list_options as $option) {
            $id = isset($option['id']) ? esc_html($option['id']) : '';
            $label = isset($option['label']) ? esc_html(ucfirst($option['label'])) : '';
            $options .= '<option value="' . $id . '">' . $label . '</option>';
        }

        return '<div class="arrow-wrapper">
                    <label class="select" for="'.$a['id'].'">
                    '.do_shortcode('[arrow_icon]').'
                        <select class="'.$a['id'].' id="'.$a['id'].'">
                        '.$options.'
                        </select>
                    </label>
                </div>';
    }
    add_shortcode('dropdown_list', 'generate_dropdown_list');
?>