<?php

defined('ABSPATH') || exit;

add_shortcode( 'adt_searchform', function($atts) {
    wp_enqueue_style('adt-searchform-style', content_url('/themes/bonsai/dist/css/adt-searchform.css'));
    wp_enqueue_script('adt-searchform-script', content_url('/themes/bonsai/dist/js/adt-searchform.js'), ['jquery']);
    wp_localize_script('adt-searchform-script', 'localize', [
        '_ajax_url'   => admin_url('admin-ajax.php'),
        '_ajax_nonce' => wp_create_nonce('_ajax_nonce'),
    ]);
    
    $productsArray = adt_get_all_products_by_footprint();
    $locationsArray = adt_get_locations();
    $popularSearches = adt_get_popular_searches();

    wp_localize_script('adt-searchform-script', 'searchform', [
        'products' => $productsArray,
    ]);

    ob_start();
    ?>

    <div class="co2-form-wrapper">
        <form class="co2-form">
            <div class="row align-bottom">
                <div class="col medium-6 small-12 large-6 pb-0 text-left">
                    <div class="tooltip">
                        <a href="#info-footprint">
                            Footprint
                        </a>
                        <?= do_shortcode('[lightbox id="info-footprint" width="600px" padding="20px"][block id="footprint-regular-info-popup"][/lightbox]') ?>
                    </div>
                    <div class="switch-field-wrapper">
                        <div class="switch-field-container">
                            <input type="radio" id="radio-one" name="switch-one" value="product" checked/>
                            <label for="radio-one">Product</label>
                            <input type="radio" id="radio-two" name="switch-one" value="person"/>
                            <label for="radio-two">Person</label>
                        </div>
                    </div>
                </div>
                <div class="col medium-6 small-12 large-6 pb-0 text-right">
                    <div class="tooltip">
                        <a href="#info-footprint-type">
                            Footprint extent
                        </a>
                        <?= do_shortcode('[lightbox id="info-footprint-type" width="600px" padding="20px"][block id="footprint-info-popup"][/lightbox]') ?>
                    </div>
                    <div id="footprint-type" class="select">
                        <div class="radio-choice">
                            <input type="radio" id="production" name="footprint_type" value="product" checked/>
                            <label for="production">Cradle to gate</label>
                        </div>
                        <div class="radio-choice">
                            <input type="radio" id="market" name="footprint_type" value="market" />
                            <label for="market">Cradle to consumer</label>
                        </div>
                        <div class="radio-choice" style="display: none;">
                            <input type="radio" id="grave" name="footprint_type" value="grave" />
                            <label for="grave">Cradle to grave</label>
                        </div>
                        <!-- <select id="footprint-type">
                            <option value="product">Cradle to gate (i.e. production)</option>
                            <option value="market">Cradle to consumer (i.e., markets)</option>
                        </select>
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
                        </svg> -->
                    </div>
                </div>
            </div>

            <!-- Per person -->
            <div class="row person-choices" style="display: none;">
                <div class="select-wrapper col medium-12 small-12 large-12">
                    <div class="medium-6 small-12 large-6">
                        <div class="tooltip">
                            <a href="#info-household-composition">
                                Household composition
                            </a>
                            <?= do_shortcode('[lightbox id="info-household-composition" width="600px" padding="20px"][block id="household-composition-info-popup"][/lightbox]') ?>
                        </div>
                        <label class="select" for="household-composition">
                            <select id="household-composition">
                                <option value="average-person">Average Person</option>
                                <option value="pensioner" disabled>Pensioner</option>
                                <option value="couple-with-kids" disabled>Couple with kids</option>
                                <option value="couple-without-kids" disabled>Couple without kids</option>
                                <option value="single" disabled>Single (with and without kids)</option>
                            </select>
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
                            </svg>
                        </label>
                    </div>
                    <div class="medium-6 small-12 large-6">
                        <div class="tooltip">
                            <a href="#info-income-group">
                                Income group
                            </a>
                            <?= do_shortcode('[lightbox id="info-income-group" width="600px" padding="20px"][block id="income-group-info-popup"][/lightbox]') ?>
                        </div>
                        <label class="select" for="income-group">
                            <select id="income-group">
                                <option value="average-income-group">Average income group</option>
                                <option value="five-specific" disabled>5 specific income groups (ranging from
                                20% poorest to 20% richest)</option>
                            </select>
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
                            </svg>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Per product -->
            <div class="search-input-wrapper">
                <input class="search" type="text" id="autocomplete-input" placeholder="Find climate footprint by product">
                <button>
                    <svg width="37" height="34" viewBox="0 0 37 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M34.9521 33.4583L21.15 20.4374C20.0458 21.3402 18.776 22.0346 17.3406 22.5208C15.9052 23.0069 14.4882 23.2499 13.0896 23.2499C9.69498 23.2499 6.82194 22.1416 4.47043 19.9249C2.1193 17.7086 0.943726 15.0003 0.943726 11.7999C0.943726 8.59992 2.11856 5.88881 4.46823 3.66659C6.81752 1.44436 9.68836 0.333252 13.0807 0.333252C16.4727 0.333252 19.3465 1.44228 21.7021 3.66034C24.0576 5.87874 25.2354 8.58915 25.2354 11.7916C25.2354 13.2152 24.9594 14.6041 24.4073 15.9583C23.8552 17.3124 23.1375 18.4583 22.2541 19.3958L36.0562 32.4166L34.9521 33.4583ZM13.0896 21.7916C16.0708 21.7916 18.5828 20.828 20.6255 18.901C22.6682 16.9739 23.6896 14.6041 23.6896 11.7916C23.6896 8.97908 22.6682 6.60929 20.6255 4.68221C18.5828 2.75513 16.0708 1.79159 13.0896 1.79159C10.1083 1.79159 7.59633 2.75513 5.55362 4.68221C3.51091 6.60929 2.48956 8.97908 2.48956 11.7916C2.48956 14.6041 3.51091 16.9739 5.55362 18.901C7.59633 20.828 10.1083 21.7916 13.0896 21.7916Z" fill="#031819" fill-opacity="0.39"/>
                    </svg>
                </button>
                <div id="initial-error-message" style="display: none;">
                    <?= do_shortcode('[block id="nothing-found-error-message"]') ?>
                </div>
                <div id="suggestions-wrapper" style="display: none;">
                    <div class="search-history">
                        <!-- Users current search history -->
                        <p><strong>Search history</strong></p>
                        <ul>
                            <!-- Empty before searches have been made -->
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
            </div>
        </form>
        <div class="most-popular-wrapper">
            <div class="most-popular-container">
                <!-- By other searches -->
                <p>Most popular:</p>
                <ul>
                    <?php foreach ($popularSearches as $popularSearch): ?>
                        <li><button data-code="<?= $popularSearch->product_code ?>" data-uuid="<?= $popularSearch->product_uuid ?>" data-choices="<?= $popularSearch->chosen_values ?>"><?= $popularSearch->search_phrase ?></button></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>
        <div class="text-center">
            <div class="is-divider divider clearfix" style="
                margin-top:50px;
                margin-bottom:50px;
                max-width:75%;
                height:1px;
                background-color: #E8EDED;
            ">
            </div>
        </div>
        <div class="co2-form-result">
            <div id="co2-form-result-header" class="col medium-12 small-12 large-12">
                <div class="row">
                    <div class="col medium-6 small-12 large-6">
                        <h3>Climate Footprint</h3>
                    </div>
                    <div class="switch-field-wrapper-basic col medium-6 small-12 large-6">
                        <div class="switch-field-container">
                            <input type="radio" id="basic-choice" name="switch-two" value="basic" checked/>
                            <label for="basic-choice">Basic</label>
                            <input type="radio" id="advanced-choice" name="switch-two" value="advanced" />
                            <label for="advanced-choice">Advanced</label>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="select-wrapper col medium-12 small-12 large-12">
                        <div class="medium-4 small-12 large-4">
                            <div class="tooltip">
                                <a href="#info-location">
                                    Location
                                </a>
                                <?= do_shortcode('[lightbox id="info-location" width="600px" padding="20px"][block id="location-info-popup"][/lightbox]') ?>
                            </div>
                            <label class="select" for="location">
                                <select id="location">
                                    <?php foreach($locationsArray as $location): ?>
                                        <option value="<?php echo $location['code']; ?>"><?php echo $location['name']; ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
                                </svg>
                            </label>
                        </div>
                        
                        <div class="medium-4 small-12 large-4">
                            <div class="tooltip">
                                <a href="#info-year">
                                    Year
                                </a>
                                <?= do_shortcode('[lightbox id="info-year" width="600px" padding="20px"][block id="year-info-popup"][/lightbox]') ?>
                            </div>
                            <label class="select" for="year">
                                <select id="year">
                                    <option value="2016">2016</option>
                                </select>
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
                                </svg>
                            </label>    
                        </div>

                        <div class="medium-4 small-12 large-4">
                            <div class="tooltip">
                                <a href="#info-climate-metric">
                                    Climate metric
                                </a>
                                <?= do_shortcode('[lightbox id="info-climate-metric" width="600px" padding="20px"][block id="climate-metric-info-popup"][/lightbox]') ?>
                            </div>
                            <label class="select" for="climate-metric">
                                <select id="climate-metric">
                                    <option value="gwp100">GWP100</option>
                                </select>
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
                                </svg>
                            </label>    
                        </div>
                    </div>
                    <!-- Not ready yet -->
                    <!-- <div id="share-wrapper">
                        <div class="share-icon">
                            <div>
                                <p class="pb-0 mb-0">Share search</p>
                            </div>
                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 13V17.5C20 20.5577 16 20.5 12 20.5C8 20.5 4 20.5577 4 17.5V13M12 3L12 15M12 3L16 7M12 3L8 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div id="shared-search-box" style="display: none;">
                        <div class="background"></div>
                        <div class="shared-search-box-wrapper">
                            <input type="text" id="shared-search" value="https://www.google.dk" readonly>
                            <button id="copy-search">
                                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" stroke="#1C274C" stroke-width="1.5"/>
                                    <path d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" stroke="#1C274C" stroke-width="1.5"/>
                                </svg>
                            </button>
                        </div>
                    </div> -->
                </div>
                <div class="error-message text-left" style="display: none;">
                    <?= do_shortcode('[block id="nothing-found-error-message"]') ?>
                </div>
            </div>
            <div class="row align-equal search-result basic" style="display: flex;">
                <div class="col medium-6 small-12 large-6">
                    <div class="col-inner">
                        <p class="product-title">Aluminium</p>
                        <div class="product-tag-wrapper">
                            <span class="product-tag footprint-type">Cradle To Gate</span>
                            <span class="product-tag country">Australia</span>
                            <span class="product-tag year">2016</span>
                            <span class="product-tag climate-metrics">GWP100</span>
                        </div>
                        <div class="unit-select-wrapper">
                            <label class="select" for="amount">
                                <input type="number" id="amount" class="amount" value="1" max="1000" min="1">
                                <!-- <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
                                </svg> -->
                            </label>
                            <label class="select" for="unit">
                                <select id="unit" class="unit">
                                    <option value="kg">kg</option>
                                </select>
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
                                </svg>
                            </label>
                            <p>equal</p>
                        </div>
                        <p class="product-result">0.00</p>
                        <p class="product-result-unit">kg CO2eq</p>
                        <div class="tooltip-wrapper">
                            <a href="#info-product">
                                Read more about the result
                            </a>
                            <?= do_shortcode('[lightbox id="info-product" width="600px" padding="20px"][block id="product-result-info-popup"][/lightbox]') ?>
                        </div>
                    </div>
                </div>

                <div class="col medium-6 small-12 large-6">
                    <a href="#" class="col-inner">
                        <p class="primary-text add">+</p>
                        <p>Add to comparison</p>
                    </a>
                </div>
            </div>
            <div class="row align-equal search-result advanced" style="display: none;">
                <div class="col medium-12 small-12 large-12">
                    <div class="col-inner">
                        <div class="calculation-wrapper">
                            <div class="choices">
                                <p class="product-title">Aluminium</p>
                                <div class="product-tag-wrapper">
                                    <span class="product-tag footprint-type">Cradle To Gate</span>
                                    <span class="product-tag country">Australia</span>
                                    <span class="product-tag year">2016</span>
                                    <span class="product-tag">GWP100</span>
                                </div>
                                <div class="unit-select-wrapper">
                                    <label class="select" for="amount">
                                        <input type="number" id="amount" class="amount" value="1" max="1000" min="1">
                                        <!-- <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
                                        </svg> -->
                                    </label>
                                    <label class="select" for="unit">
                                        <select id="unit" class="unit">
                                            <option value="kg">kg</option>
                                            <option value="g">g</option>
                                            <option value="ton">ton</option>
                                        </select>
                                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
                                        </svg>
                                    </label>
                                    <p>equal</p>
                                </div>
                            </div>
                            <div class="calculation-result">
                                <p class="product-result">5.91</p>
                                <p class="product-result-unit">kg CO2eq</p>
                            </div>
                        </div>
                        <p class="big-font emission-message">Where do emissions for 1kg come from?</p>

                        <table class="emissions-table">
                            <thead>
                                <tr>
                                    <th>Inputs</th> <!-- flow_input -->
                                    <th>Country</th> <!-- region_inflow -->
                                    <th>Input</th> <!-- value_inflow + unit_inflow -->
                                    <th>Emissions<span class="emission-header-unit">[kg CO2eq]</span></th> <!-- value_emission + unit_emission -->
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><a href="#">Electricity (market for)</a></td>
                                    <td>AU</td>
                                    <td>0.37 MJ</td>
                                    <td>0.2</td>
                                </tr>
                                <tr>
                                    <td><a href="#">Heat for non-ferrous metals (market for)</a></td>
                                    <td>AU</td>
                                    <td>0.37 MJ</td>
                                    <td>0.2</td>
                                </tr>
                                <tr>
                                    <td><a href="#">Other land transportation services (market for)</a></td>
                                    <td>AU</td>
                                    <td>0.37 MJ</td>
                                    <td>0.2</td>
                                </tr>
                                <tr>
                                    <td><a href="#">Petroleum coke (market for)</a></td>
                                    <td>AU</td>
                                    <td>0.37 MJ</td>
                                    <td>0.2</td>
                                </tr>
                                <tr>
                                    <td colspan="3">Sum of not-displayed inputs</td>
                                    <td>0.118</td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="result-buttons">
                            <div class="go-back text-left show-for-small">
                                <a href="#" class="button primary lowercase" style="border-radius:99px; font-size:10px;">
                                    <i class="icon-angle-left" aria-hidden="true"></i>
                                    <span>Go back</span>
                                </a>
                            </div>
                            <div class="download text-right hide-for-small">
                                <a href="#" class="button grey lowercase" style="border-radius:99px;">
                                    <span>Download</span>
                                    <i class="icon-dribbble" aria-hidden="true"></i>
                                </a>
                            </div>
                        </div>

                        <div class="tooltip-wrapper">
                            <a href="#info-product">
                                Read more about the result
                            </a>
                            <?= do_shortcode('[lightbox id="info-product" width="600px" padding="20px"][block id="product-result-info-popup"][/lightbox]') ?>
                        </div>
                    </div>
                </div>

                <div class="col medium-12 small-12 large-12">
                    <a href="#" class="col-inner">
                        <p class="primary-text add">+</p>
                        <p>Add to comparison</p>
                    </a>
                </div>
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