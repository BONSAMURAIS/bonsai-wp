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

    <div id="main-content">
        <section id="co2-form-result-header" class="col medium-12 small-12 large-12">
            <div class="row">
                <div class="col medium-6 small-12 large-6">
                    <h3>Climate Footprint</h3>
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
                        <?= do_shortcode('[dropdown_list id="climate-metric" filepath="'.__DIR__.'/../../dropdown_options/climate_metric.json"]')?>
                    </div>
                    <div class="medium-6 small-12 large-3">
                        <?= do_shortcode('[tooltip id="info-database-version" href="#info-database-version" label="Database version" block_id="database-version-info-popup"]')?>
                        <?= do_shortcode('[dropdown_list id="database-version" filepath="'.__DIR__.'/../../dropdown_options/db_version.json"]')?>
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
            <div id="divider">
            </div>
            <form id="form">
                <div id="form-container">
                    <div>
                        <?= do_shortcode('[tooltip id="info-footprint" href="#info-footprint" label="Footprint" block_id="footprint-regular-info-popup"]')?>
                        <div class="switch-field-wrapper">
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
                <div id="person-choices" style="display: none;">
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
                <div class="search-input-wrapper">
                    <input name="search" type="text" id="autocomplete-input" placeholder="Find climate footprint by product">
                    <?= do_shortcode('[search_icon]')?>

                    <div id="initial-error-message" style="display: none;">
                        <?= do_shortcode('[block id="nothing-found-error-message"  style="color: blue;"]') ?> 
                    </div>
                    <div id="suggestions-wrapper" style="display: none;">
                        <!-- <div id="search-history">
                            <p><strong>Search history</strong></p>
                            <ul id="search-history-list">
                            </ul>
                        </div> -->
                        <div id="suggestions">
                        </div>
                    </div>

                    <datalist id="words">
                        <?php foreach($productsArray as $product): ?>
                            <option id="<?php echo $product['code'];?>" value="<?php echo $product['title'];?>">
                        <?php endforeach; ?>
                    </datalist>
                </div>
                <section id="search">
                    <div id="search-btns">
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
        </section>

        <section id="most-popular">
            <!-- By other searches -->
            <p>Most popular:</p>
            <ul>
                <?php foreach ($popularSearches as $popularSearch): ?>
                    <li><button data-code="<?= $popularSearch->product_code ?>" data-uuid="<?= $popularSearch->product_uuid ?>" data-choices="<?= $popularSearch->chosen_values ?>"><?= $popularSearch->search_phrase ?></button></li>
                <?php endforeach; ?>
            </ul>
        </section>
        
        <section id="uncertainty-wrapper" style="display: none;">
            <div id="divider">
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
            <div id="divider">
            </div>
            <div id="summary-analysis" class="search-result">
                <div id="summary-analysis-content" class="tile-wrapper col medium-12 small-12 large-12">
                    <div class="tile">
                        <div class="switch-field-wrapper-basic">
                            <div class="switch-field switch-field-container-contri-analysis">
                                <input type="radio" id="basic-choice" name="contri-analysis" value="basic" checked/>
                                <label for="basic-choice">Basic</label>
                                <input type="radio" id="advanced-choice" name="contri-analysis" value="advanced" />
                                <label for="advanced-choice">Advanced</label>
                            </div>
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
                                    <input type="text" class="test" id="test"/>
                                    <input type="number" class="amount" id="amount" value="1.0" max="999999" min="1" step="any"/>
                                    <label class="select" for="amount"></label>
                                    <label class="select" for="unit">
                                        <svg class="unit-arrow" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
                                        </svg>
                                    </label>
                                    <select id="unit" class="unit"></select>
                                </div>
                                <br/>
                                <p>produces</p>
                                <div class="co2-value-wrapper">
                                    <p class="co2-value"></p>
                                    <p class="co2-value-unit"></p>
                                </div>
                            </div>

                            <div class="contribution-analysis" style="display: none;">
                                <p class="big-font emission-message">Where do emissions for 1 tonne of CO2eq come from?</p>
        
                                <table class="emissions-table">
                                    <thead>
                                        <tr>
                                            <th>Inputs</th> <!-- flow_input -->
                                            <th>Country</th> <!-- region_inflow -->
                                            <th class="has-hover">Input</th> <!-- value_inflow + unit_inflow -->
                                            <th class="has-hover">Emissions<span class="emission-header-unit">[Tonnes CO2eq]</span></th> <!-- value_emission + unit_emission -->
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
            <div id="compared-product-analysis">
                <div id="add-btn" class="tile col medium-12 small-12 large-12">
                    <a href="#">
                        <p class="primary-text add">+</p>
                        <p>Add to comparison</p>
                    </a>
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