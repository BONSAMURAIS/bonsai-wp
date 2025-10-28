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
    // $locationsArray = adt_get_locations();
    $popularSearches = adt_get_popular_searches();
    error_log(json_encode($popularSearches[0]));

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
            </div>

            <!-- Per person -->
            <div id="person-tab" style="display: none;">
                <p class="tab-desc">
                    Explore per-person climate footprints by country, household type, and income level.
                </p>
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
                <p class="tab-desc">
                    Search for climate footprint of a product or service per functional unit.
                </p>
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

                <section id="most-popular">
                    <p>Most popular:</p>
                    <ul>
                        <?php foreach ($popularSearches as $popularSearch): ?>
                            <?php $chosenValues = json_decode($popularSearch->chosen_values, true); ?>
                            <li><button data-code="<?= $popularSearch->product_code ?>" data-uuid="<?= $popularSearch->product_uuid ?>" data-year="<?= $chosenValues['footprint_year'] ?>" data-location="<?= $chosenValues['footprint_location'] ?>" data-type="<?= $chosenValues['footprint_type'] ?>"><?= $popularSearch->search_phrase ?></button></li>
                        <?php endforeach; ?>
                    </ul>
                </section>

                <datalist id="words">
                    <?php foreach($productsArray as $product): ?>
                        <option id="<?php echo $product['code'];?>" value="<?php echo $product['title'];?>">
                    <?php endforeach; ?>
                </datalist>

                <div id="error-message">
                </div>
            </div>
        </form>
        
        <section id="uncertainty-wrapper" style="display: none;">
            <hr />
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

        <div id="modal">
            <?= do_shortcode('[modalPopup]') ?> 
        </div>

        <section id="co2-form-result">            
            <hr />
            <div id="product-analysis-content" class="tile">
                <div class="tile-header">
                    <h2 class="product-title"></h2>
                    <div class="switch-field-container-contri-analysis col medium-6 small-12 large-6">
                        <div class="switch-field-container switch-field">
                            <input type="radio" id="basic-choice" name="contri-analysis" value="basic" checked/>
                            <label for="basic-choice">Basic</label>
                            <input type="radio" id="advanced-choice" name="contri-analysis" value="advanced" />
                            <label for="advanced-choice">Advanced</label>
                        </div>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-parameters">
                        <div>
                            <?= do_shortcode('[tooltip id="info-location" href="#info-location" label="Location" block_id="location-info-popup"]')?>
                            <?= do_shortcode('[dropdown_list id="location" filepath=""]')?>
                        </div>
                        <div>
                            <?= do_shortcode('[tooltip id="info-year" href="#info-year" label="Year" block_id="year-info-popup"]')?>
                            <?= do_shortcode('[dropdown_list id="year" filepath="'.__DIR__.'/../../dropdown_options/year.json"]')?>
                        </div>
                        <div>
                            <?= do_shortcode('[tooltip id="info-climate-metric" href="#info-climate-metric" label="Climate metric" block_id="climate-metric-info-popup"]')?>
                            <?= do_shortcode('[dropdown_list id="climatemetric" filepath="'.__DIR__.'/../../dropdown_options/climate_metric.json"]')?>
                        </div>
                        <div>
                            <?= do_shortcode('[tooltip id="info-database-version" href="#info-database-version" label="Database version" block_id="database-version-info-popup"]')?>
                            <?= do_shortcode('[dropdown_list id="database-version" filepath="'.__DIR__.'/../../dropdown_options/db_version.json"]')?>
                        </div>
                        <div>
                            <?= do_shortcode('[tooltip id="info-footprint-type" href="#info-footprint-type" label="Footprint extent" block_id="footprint-info-popup"]')?>
                            <?= do_shortcode('[dropdown_list id="footprint-type" filepath="'.__DIR__.'/../../dropdown_options/footprint_extend.json"]')?>
                        </div>
                    </div>
                    <div class="product-result">
                        <div class="unit-select-wrapper">
                            <input type="text" class="quantity" id="quantity" value="1"/>
                            <label class="select" for="unit">
                                <select id="unit" class="unit"></select>
                            </label>
                        </div>
                        <p style="font-size: medium;">produces</p>
                        <p>
                            <span class="co2-value"></span>
                            <span class="co2-value-unit"></span>
                        </p>
                    </div>
                </div>
                <!-- <div>
                    <a class="tooltip-text">What do those boxes mean?</a>
                </div> -->
                <div class="contribution-analysis" style="display: none;">
                    <p class="big-font emission-message">Where do emissions for 
                        <span class="quantity-value">1</span>
                        <span class="product-unit question-unit"></span>
                        <span class="product-unit question-unit-preposition"></span>
                        <span class="product-title question-location" style="font-size:inherit;"></span>
                        come from?
                    </p>
                    <table class="emissions-table">
                        <thead>
                            <tr>
                                <th>Input name</th> <!-- flow_input -->
                                <th>Country</th> <!-- region_inflow -->
                                <th class="emissions-table-header-input">Input value</th> <!-- value_inflow + unit_inflow -->
                                <th class="emissions-table-header-emissions">Emissions <span class="emission co2-value-unit"></span></th> <!-- value_emission + unit_emission -->
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