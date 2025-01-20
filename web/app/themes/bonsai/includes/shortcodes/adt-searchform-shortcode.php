<?php

defined('ABSPATH') || exit;

add_shortcode( 'adt_searchform', function($atts) {
    wp_enqueue_style('adt-searchform-style', content_url('/themes/bonsai/dist/css/adt-searchform.css'));
    wp_enqueue_script('adt-searchform-script', content_url('/themes/bonsai/dist/js/adt-searchform.js'), ['jquery']);
    
    $productsArray = adt_get_all_products();

    wp_localize_script('adt-searchform-script', 'searchform', [
        'products' => $productsArray,
    ]);

    ob_start();
    ?>

    <div class="co2-form-wrapper">
        <form class="co2-form">
            <div class="switch-field-wrapper">
                <div class="switch-field-container">
                    <input type="radio" id="radio-one" name="switch-one" value="product" checked/>
                    <label for="radio-one">Product</label>
                    <input type="radio" id="radio-two" name="switch-one" value="country" />
                    <label for="radio-two">Country</label>
                </div>
            </div>

            <div class="search-input-wrapper">
                <input class="search" type="text" id="autocomplete-input" placeholder="Find footprint by product">
                <div id="suggestions-wrapper" style="display: none;">
                    <div class="search-history">
                        <!-- Users current search history -->
                        <p><strong>Search history</strong></p>
                        <ul>
                            <li class="button primary is-outline lowercase" style="border-radius:99px;">Chicken <span class="remove"></span></li>
                            <li class="button primary is-outline lowercase" style="border-radius:99px;">Almonds <span class="remove"></span></li>
                            <li class="button primary is-outline lowercase" style="border-radius:99px;">Aluminium <span class="remove"></span></li>
                            <li class="button primary is-outline lowercase" style="border-radius:99px;">Beef <span class="remove"></span></li>
                        </ul>
                    </div>
                    <div id="suggestions">
                    </div>
                </div>

                <datalist id="words">
                    <?php foreach($productsArray as $product): ?>
                        <option value="<?php echo $product['title']; ?>">
                    <?php endforeach; ?>
                </datalist>

                <button>
                    <svg width="37" height="34" viewBox="0 0 37 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M34.9521 33.4583L21.15 20.4374C20.0458 21.3402 18.776 22.0346 17.3406 22.5208C15.9052 23.0069 14.4882 23.2499 13.0896 23.2499C9.69498 23.2499 6.82194 22.1416 4.47043 19.9249C2.1193 17.7086 0.943726 15.0003 0.943726 11.7999C0.943726 8.59992 2.11856 5.88881 4.46823 3.66659C6.81752 1.44436 9.68836 0.333252 13.0807 0.333252C16.4727 0.333252 19.3465 1.44228 21.7021 3.66034C24.0576 5.87874 25.2354 8.58915 25.2354 11.7916C25.2354 13.2152 24.9594 14.6041 24.4073 15.9583C23.8552 17.3124 23.1375 18.4583 22.2541 19.3958L36.0562 32.4166L34.9521 33.4583ZM13.0896 21.7916C16.0708 21.7916 18.5828 20.828 20.6255 18.901C22.6682 16.9739 23.6896 14.6041 23.6896 11.7916C23.6896 8.97908 22.6682 6.60929 20.6255 4.68221C18.5828 2.75513 16.0708 1.79159 13.0896 1.79159C10.1083 1.79159 7.59633 2.75513 5.55362 4.68221C3.51091 6.60929 2.48956 8.97908 2.48956 11.7916C2.48956 14.6041 3.51091 16.9739 5.55362 18.901C7.59633 20.828 10.1083 21.7916 13.0896 21.7916Z" fill="#031819" fill-opacity="0.39"/>
                    </svg>
                </button>
            </div>
        </form>
        <div class="most-popular-wrapper">
            <div class="most-popular-container">
                <!-- By other searches -->
                <p>Most popular:</p>
                <ul>
                    <li><button>Chicken</button></li>
                    <li><button>Almonds</button></li>
                    <li><button>Aluminium</button></li>
                    <li><button>Beef</button></li>
                </ul>
            </div>
        </div>
        <div class="text-center">
            <div class="is-divider divider clearfix" style="
                margin-top:30px;
                margin-bottom:30px;
                max-width:75%;
                height:1px;
                background-color: #E8EDED;
            ">
            </div>
        </div>
        <div class="co2-form-result">
            <div class="switch-field-wrapper-basic">
                <div class="switch-field-container">
                    <input type="radio" id="basic-choice" name="switch-two" value="basic" checked/>
                    <label for="basic-choice">Basic</label>
                    <input type="radio" id="advanced-choice" name="switch-two" value="advanced" />
                    <label for="advanced-choice">Advanced</label>
                </div>
            </div>
            <div class="select-wrapper">
                <select id="footprint-type">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                <select id="location">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                <select id="year">
                    <option value="2016">2016</option>
                    <option value="2025">2025</option>
                </select>
            </div>
        </div>
    </div>
    <?php
    return ob_get_clean();
});

// UX Builder support
add_action('ux_builder_setup', function(){
    $parentTheme = get_template_directory();
    wp_enqueue_style('adt-searchform', content_url('/themes/bonsai/dist/css/adt-searchform.css'));

    add_ux_builder_shortcode( 'adt_advanced_button',
        array(
            'name'      => __( 'ADT advanced button' ),
            'category'  => __('Forcia', 'adtention'),
            'thumbnail' => content_url('themes/bonsai/assets/png/adt-logo.png'),
            'wrap'      => false,
            'presets'   => array(
                array(
                    'name'    => __( 'Default' ),
                    'content' => '[adt_advanced_button]<h3>Lorem ipsum dolor sit amet</h3><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat....</p>[/adt_advanced_button]',
                ),
            ),
            'options'   => array(
                'title' => [
                    'type' => 'textfield',
                    'heading' => 'Titel',
                ],
                'subtitle' => [
                    'type' => 'textfield',
                    'heading' => 'Undertitel',
                ],
                'bg_color'    => [
                    'type'  => 'colorpicker',
                    'heading' => __('Bg Color'),
                    'format' => 'rgb',
                    'alpha' => true,
                    'position' => 'bottom right',
                    'helpers' => require($parentTheme.'/inc/builder/shortcodes/helpers/colors.php'),
                ],
                'custom_icon' => array(
                    'type'    => 'image',
                    'heading' => 'Icon',
                    'value'   => '',
                ),
                'custom_icon_right' => array(
                    'type'    => 'image',
                    'heading' => 'Icon',
                    'value'   => '',
                ),
                'img_width'   => array(
                    'type'      => 'slider',
                    'heading'   => 'Icon Width',
                    'unit'      => 'px',
                    'default'   => 24,
                    'max'       => 60,
                    'min'       => 20,
                    'on_change' => array(
                        'selector' => '.icon-box-img',
                        'style'    => 'width: {{ value }}px',
                    ),
                ),
                'link_group'  => require($parentTheme.'/inc/builder/shortcodes/commons/links.php' ),
            ),
        )
    );
});