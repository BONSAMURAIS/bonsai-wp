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

    $json_climate_metric = file_get_contents(__DIR__.'/../../dropdown_options/climate_metric.json');
    $list_climate_metric = json_decode($json_climate_metric, true);

    wp_localize_script('adt-searchform-script', 'searchform', [
        'products' => $productsArray,
    ]);

    ob_start();
    
    ?>

    <div id="main-content">
        <div id="loadingModal" style="display:none;">
            <div class="spinner"></div>
        </div>
        <form id="form">
            <div id="form-container">
                <div>
                    <?= do_shortcode('[tooltip id="info-footprint" href="#info-footprint" label="Footprint" block_id="footprint-regular-info-popup"]')?>
                    <div id="switch-field-wrapper">
                        <div class="switch-field switch-field-container">
                            <input type="radio" id="radio-product" name="footprint_type" value="product" checked/>
                            <label for="radio-product">Product</label>
                            <input type="radio" id="radio-person" name="footprint_type" value="person"/>
                            <label for="radio-person">Person</label>
                        </div>
                    </div>
                </div>
                <div>
                    <?= do_shortcode('[tooltip id="info-footprint-type" href="#info-footprint-type" label="Footprint extent" block_id="footprint-info-popup"]')?>
                    <div id="footprint-type" class="select">
                        <div class="radio-choice">
                            <input type="radio" id="production" name="footprint_type_extend" value="product" checked/>
                            <label for="production">Cradle to gate</label>
                        </div>
                        <div class="radio-choice">
                            <input type="radio" id="market" name="footprint_type_extend" value="market" />
                            <label for="market">Cradle to consumer</label>
                        </div>
                        <div class="radio-choice" style="display: none;">
                            <input type="radio" id="grave" name="footprint_type_extend" value="grave" />
                            <label for="grave">Cradle to grave</label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Per person -->
            <div id="person-tab" style="display: none;">
                <div class="select-wrapper col medium-12 small-12 large-12">
                    <div class="medium-6 small-12 large-6">
                        <?= do_shortcode('[tooltip id="info-household-composition" href="#info-household-composition" label="Household composition" block_id="household-composition-info-popup"]')?>
                        <?= do_shortcode('[dropdown_list id="household-composition" filepath="'.__DIR__.'/../../dropdown_options/household_compo.json"]')?>
                    </div>
                    <div class="medium-6 small-12 large-6">
                        <?= do_shortcode('[tooltip id="info-income-group" href="#info-income-group" label="Income group" block_id="income-group-info-popup"]')?>
                        <?= do_shortcode('[dropdown_list id="income-group" filepath="'.__DIR__.'/../../dropdown_options/income_gpe.json"]')?>
                    </div>
                </div>
            </div>

            <!-- Per product -->
            <div id="product-tab">
                <input name="search" type="text" id="autocomplete-input" placeholder="Find climate footprint by product">
                <?= do_shortcode('[search_icon]')?>
                <div id="initial-error-message" style="display: none;">
                    <?= do_shortcode('[block id="nothing-found-error-message"  style="color: blue;"]') ?> 
                </div>
                <div id="suggestions-wrapper" style="display: none;">
                    <div id="search-history">
                        <p><strong>Search history</strong></p>
                        <ul id="search-history-list">
                        </ul>
                    </div>
                    <div id="suggestions">
                    </div>
                </div>

                <datalist id="words">
                    <?php foreach($productsArray as $product): ?>
                        <option id="<?php echo $product['code'];?>" value="<?php echo $product['title'];?>">
                    <?php endforeach; ?>
                </datalist>
            </div>

            <section id="most-popular">
                <!-- By other searches -->
                <p>Most popular:</p>
                <ul>
                    <?php foreach ($popularSearches as $popularSearch): ?>
                        <li><button data-code="<?= $popularSearch->product_code ?>" data-uuid="<?= $popularSearch->product_uuid ?>" data-choices="<?= $popularSearch->chosen_values ?>"><?= $popularSearch->search_phrase ?></button></li>
                    <?php endforeach; ?>
                </ul>
            </section>

            <section id="search">
                <div id="search-btns" style="display:none;">
                    <button id="btn-search">
                        Search
                    </button>
                    <button id="btn-add-comparison">
                        Add to comparison
                    </button>
                </div>
                <div id="error-message" style="display: none;">
                    <!-- <?= do_shortcode('[block id="nothing-found-error-message"]') ?> -->
                </div>
            </section>
        </form>
        
        <section id="uncertainty-wrapper" style="display: none;">
            <div class="divider">
            </div>
            <p>How sure are we on the ranking of the two compared products on a scale from 0-100%?</p>
            <div id="uncertainty-bar">
                <div id="uncertainty-bar-background">
                    <div id="uncertainty-bar-fill" style="width: 10%; background-color: green"></div>
                </div>
            </div>
            <div class="tooltip-wrapper">
                <?= do_shortcode('[tooltip id="info-uncertainty" href="#info-uncertainty" label="read more about the uncertainty in the data" block_id="uncertainty-info-popup"]')?>
            </div>
        </section>

        <section id="co2-form-result">            
            <div class="divider">
            </div>
            <section id="co2-form-result-header" class="col medium-12 small-12 large-12">
                <div class="row">
                    <div class="col medium-6 small-12 large-6">
                        <h3>Climate Footprint</h3>
                    </div>
                    <div class="switch-field-container-contri-analysis col medium-6 small-12 large-6">
                        <div class="switch-field-container switch-field">
                            <input type="radio" id="basic-choice" name="contri-analysis" value="basic" checked/>
                            <label for="basic-choice">Basic</label>
                            <input type="radio" id="advanced-choice" name="contri-analysis" value="advanced" />
                            <label for="advanced-choice">Advanced</label>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="select-wrapper col medium-12 small-12 large-12">
                        <div class="medium-6 small-12 large-3">
                            <?= do_shortcode('[tooltip id="info-location" href="#info-location" label="Location" block_id="location-info-popup"]')?>
                            <label class="select" for="location">
                                <select id="location">
                                    <?php foreach($locationsArray as $location): ?>
                                        <option value="<?php echo $location['code']; ?>"><?php echo $location['name']; ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <?= do_shortcode('[arrow_icon]')?>
                            </label>
                        </div>
                        <div class="medium-6 small-12 large-3">
                            <?= do_shortcode('[tooltip id="info-year" href="#info-year" label="Year" block_id="year-info-popup"]')?>
                            <?= do_shortcode('[dropdown_list id="year" filepath="'.__DIR__.'/../../dropdown_options/year.json"]')?>
                        </div>
                        <div class="medium-6 small-12 large-3">
                            <?= do_shortcode('[tooltip id="info-climate-metric" href="#info-climate-metric" label="Climate metric" block_id="climate-metric-info-popup"]')?>
                            <?= do_shortcode('[dropdown_list id="climatemetric" filepath="'.__DIR__.'/../../dropdown_options/climate_metric.json"]')?>
                        </div>
                        <div class="medium-6 small-12 large-3">
                            <?= do_shortcode('[tooltip id="info-database-version" href="#info-database-version" label="Database version" block_id="database-version-info-popup"]')?>
                            <?= do_shortcode('[dropdown_list id="database-version" filepath="'.__DIR__.'/../../dropdown_options/db_version.json"]')?>
                        </div>
                    </div>
                </div>        
            </section>
            <section id="analysis-wrapper">
                <div id="product-analysis" class="search-result">
                    <div id="product-analysis-content" class="tile-wrapper col medium-12 small-12 large-12">
                        <div class="tile">
                            <div class="tile-corner">
                                <span class="adt-close">
                                </span>
                            </div>
                            <div class="calculation-wrapper">
                                <div class="choices">
                                    <p class="product-title"></p>
                                    <div class="product-tag-wrapper">
                                        <span class="footprint-type"></span>
                                        <span class="climate-metric"></span>
                                        <span class="year"></span>
                                        <span class="country"></span>
                                        <span class="version"></span>
                                    </div>
                                    <div class="unit-select-wrapper">
                                        <input type="text" class="quantity" id="quantity" value="1"/>
                                        <label class="select" for="unit">
                                            <select id="unit" class="unit">
                                            </select>
                                            <svg class="unit-arrow" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
                                            </svg>
                                        </label>
                                    </div>
                                    <br/>
                                    <p>produces</p>
                                    <div class="co2-value-wrapper">
                                        <p class="co2-value"></p>
                                        <p class="co2-value-unit"></p>
                                    </div>
                                </div>
                                <div class="contribution-analysis" style="display: none;">
                                    <p class="big-font emission-message">Where do emissions for 1 <span class="product-unit"></span> of <span class="product-title"></span> come from?</p>
                                    <table class="emissions-table">
                                        <thead>
                                            <tr>
                                                <th>Inputs</th> <!-- flow_input -->
                                                <th>Country</th> <!-- region_inflow -->
                                                <th class="emissions-table-header-input">Input</th> <!-- value_inflow + unit_inflow -->
                                                <th class="emissions-table-header-emissions">Emissions [<span class="emission-unit"></span> CO2eq]</th> <!-- value_emission + unit_emission -->
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
            
                                    <div class="result-buttons">
                                        <div class="button go-back show-for-small">
                                            <a href="#" class="primary lowercase" style="border-radius:99px; font-size:10px;">
                                                <i class="icon-angle-left" aria-hidden="true"></i>
                                                <span>Go back</span>
                                            </a>
                                        </div>
                                        <div class="download hide-for-small">
                                            <a href="#" class="button lowercase" style="border-radius:99px;">
                                                <span>Download</span>
                                                <i class="icon-dribbble" aria-hidden="true"></i>
                                            </a>
                                        </div>
                                    </div>
            
                                    <div class="tooltip-wrapper">
                                        <?= do_shortcode('[tooltip id="info-product" href="#info-product" label="Read more about the result" block_id="product-result-info-popup"]')?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="compared-product-analysis" class="tile-wrapper">
                    <div id="add-btn" class="tile col medium-12 small-12 large-12">
                        <a href="#">
                            <p class="add">+</p>
                            <p>Add to comparison</p>
                        </a>
                    </div>
                </div>
            </section>
        </section>
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