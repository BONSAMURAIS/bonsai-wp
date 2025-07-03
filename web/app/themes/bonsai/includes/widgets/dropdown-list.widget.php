<?php
    function generate_dropdown_list($attr){

        $default = array(
            'id' => 'id',
            'filepath' => '',
        );
        $a = shortcode_attr($default, $attr);

        $json_file = $attr['filepath'];

        if (!file_exists($json_file)) {
            return '<p>JSON file not found.</p>';
        }

        $json_content = file_get_contents($json_file);
        $list_options = json_decode($json_content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return '<p>Invalid JSON data.</p>';
        }

        $options = '';
        foreach ($list_options as $option) {
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