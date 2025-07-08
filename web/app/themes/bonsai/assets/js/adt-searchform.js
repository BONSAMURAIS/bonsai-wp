import UserSelection from '../../model/user_selection.js'; 
import * as c_Animation from '../../constants/animation.js'; 
import * as c_Unit from '../../constants/unit.js'; 
import * as Utils from '../../utils/tools.utils.js'; 


jQuery(document).ready(function($){

    $('label.select').each(function() {
        let listOptions = $(this).find('option');
        if (listOptions.length <= 1){
            let arrowImg = $(this).children(':nth-child(2)');
            arrowImg.hide();
            $(this).prop('disabled', true);
        }
    });

    $('.co2-form input[name="switch-one"]').on('change', function(){
        let isChecked = $(this).is(':checked');
        
        if (isChecked) {
            let value = $(this).val();

            console.log($('#footprint-type .radio-choice'));

            $('input.search').attr('placeholder', 'Find footprint by '+value);

            $('#footprint-type .radio-choice').each(function(){
                $(this).toggle();
            });
            $('#most-popular-wrapper').toggle();
            $('.search-input-wrapper').toggle();
            $('#person-choices').toggle();
            if (value === 'person') {
                $('#grave').prop('checked', true).trigger('change');
                let userSelection = new UserSelection();
                adt_get_person_footprint(userSelection);
            } else {
                $('#market').prop('checked', true).trigger('change'); // Fix applied here
            }
        }
    });
    
    $('#household-composition').on('change',function(){
        let userSelection = new UserSelection();
        adt_get_person_footprint(userSelection);
    });

    $('#income-group').on('change',function(){
        let userSelection = new UserSelection();
        adt_get_person_footprint(userSelection);
    });


    $('input[name="switch-two"]').on('change', function(){
        let isChecked = $(this).is(':checked');

        if (isChecked) {
            let value = $(this).val();
            
            if (value == 'advanced') {
                $('#contribution-analysis').css('display', 'flex');
                $('#summary-analysis').hide();
            } else {
                $('#summary-analysis').css('display', 'flex');
                $('#contribution-analysis').hide();
            }
        }
    });

    let productTitleArray = [];
    let productContentArray = [];
    let productCodeArray = [];
    let productUuidArray = [];
    let chosenFootprintType = $('#footprint-type input[name="footprint_type"]:checked').val();

    //object searchform created by 'wp_localize_script' in adt-searchform-shortcode.php line 17
    $(searchform.products).each(function() {
        if (this.code.toLowerCase() == "M_Beef_ons".toLowerCase() || this.code.toLowerCase() == "C_Beef_ons".toLowerCase() ){//|| this.code.toLowerCase() == "M_Beef_veal".toLowerCase() ){
            return true;
        }
        if (chosenFootprintType === "product" && this.code.includes("M_")) {
            return true;
        }

        if (chosenFootprintType === "market" 
            && (this.code.includes('C_') || this.code.includes('EF_') || this.code.includes('A_'))
        ) {
            return true;
        }
        
        if (this.code.startsWith('A_')) {
            this.code = this.code.replace(/^A_/, 'C_');
        }
        
        productTitleArray.push(this.title);
        productContentArray.push(this.content);
        productCodeArray.push(this.code);
        productUuidArray.push(this.uuid);    
    });
    
    // when radio button 'Cradle to consumer' is selected 
    // If user chooses to change footprint type then get new data
    $('#footprint-type input[name="footprint_type"]').on('change', function() {
        chosenFootprintType = $(this).val();
        
        productTitleArray = [];
        productContentArray = [];
        productCodeArray = [];
        productUuidArray = [];

        $(searchform.products).each(function() {
        if (this.code.toLowerCase() == "M_Beef_ons".toLowerCase() || this.code.toLowerCase() == "C_Beef_ons".toLowerCase() ){//|| this.code.toLowerCase() == "M_Beef_veal".toLowerCase() ){
                return true;
            }
            if (chosenFootprintType === "product" && this.code.includes("M_")) {
                return true;
            } else if (
                chosenFootprintType === "market" 
                && (this.code.includes('C_') || this.code.includes('EF_') || this.code.includes('A_'))
            ) {
                return true;
            }
            
            if (this.code.startsWith('A_')) {
                this.code = this.code.replace(/^A_/, 'C_');
            }
            
            productTitleArray.push(this.title);
            productContentArray.push(this.content);
            productCodeArray.push(this.code);
            productUuidArray.push(this.uuid);    
        });

        jQuery('#autocomplete-input').val('');

        adt_dynamic_search_input(productTitleArray, productCodeArray, productUuidArray);

        // return if comparison is active
        // Because the user would need to search for a new product
        let compareButtons = jQuery('.search-result .col:nth-child(2)').find('a.col-inner');
        if (compareButtons.length == 0) {
            adt_update_tags('comparison');
            return;
        }

        // also update the product chosen.
        adt_update_tags('original');
    });

    adt_dynamic_search_input(productTitleArray, productCodeArray, productUuidArray);

    $('.co2-form-result #co2-form-result-header .select-wrapper select').on('change', function() {
        let selectedValue = $('input[name="switch-one"]:checked').val();
        
        let userSelection = new UserSelection();
        if (selectedValue === 'person') {
            adt_get_person_footprint(userSelection);
        } else {

            // Get last searched data instead, this does not always contain all data
            let searchHistory = localStorage.getItem("adt_search_history");
            if (searchHistory) {
                searchHistory = JSON.parse(searchHistory);
                if (searchHistory.length > 0) {
                    let firstItem = searchHistory[0];
                    console.log("firstItem.productTitle, firstItem.productCode = ", firstItem.productTitle, firstItem.productCode)
                    adt_get_product_info(firstItem.productTitle, firstItem.productCode, firstItem.productUuid, userSelection);
                    adt_push_parameter_to_url(firstItem.productTitle, firstItem.productCode, firstItem.productUuid, userSelection);
                }
            }
        }
    })

    $('#most-popular ul li button').on('click', function() {
        let productTitle = $(this).text();
        let productCode = $(this).data('code');
        let productUuid = $(this).data('uuid');
        let userSelection = new UserSelection();

        $('#autocomplete-input').val(productTitle);

        adt_push_parameter_to_url(productTitle, productCode, productUuid, userSelection);
        adt_get_product_info(productTitle, productCode, productUuid, userSelection);
    });

    adt_download_recipe_csv();

    $('.share-icon').on('click', function() {
        let productTitle = $('.search-result.basic .col:first-child p.product-title').text();
        let productFootprint = $('input[name="switch-one"]').val();
        let FootprintView = $('input[name="switch-two"]').val();
        let productFootprintType = $('.search-result > .col:first-child .footprint-type').attr('data-type');
        let productCode = $('.search-result .col:first-child p.product-title').data('code');
        let country = $('.search-result > .col:first-child .country').attr('data-country');
        let year = $('.search-result > .col:first-child .year').attr('data-year');
        let climateMetrics = $('.search-result > .col:first-child .climate-metrics').attr('data-climate-metrics');
        let databaseVersion = $('.search-result > .col:first-child .version').attr('data-database-version');
        let chosenAmount = $('.search-result > .col:first-child #amount').val();
        let chosenUnit = $('.search-result > .col:first-child #unit').val();

        let doesItCompare = false;

        $('.search-result').each(function(){
            if($(this).find('.adt-close').length > 0) {
                doesItCompare = true;
            }
        });

        let productTitleCompare = '';
        let productCodeCompare = '';
        let countryCompare = '';
        let yearCompare = '';
        let climateMetricsCompare = '';
        let databaseVersionCompare = '';
        let chosenAmountCompare = '';
        let chosenUnitCompare = '';

        if (doesItCompare) {
            productTitleCompare = $('.search-result.basic .col:nth-child(2) p.product-title').text();
            productCodeCompare = $('.search-result .col:nth-child(2) p.product-title').data('code');
            countryCompare = $('.search-result > .col:nth-child(2) .country').attr('data-country');
            yearCompare = $('.search-result > .col:nth-child(2) .year').attr('data-year');
            climateMetricsCompare = $('.search-result > .col:nth-child(2) .climate-metrics').attr('data-climate-metrics');
            databaseVersionCompare = $('.search-result > .col:nth-child(2) .version').attr('data-database-version');
            chosenAmountCompare = $('.search-result > .col:nth-child(2) #amount').val();
            chosenUnitCompare = $('.search-result > .col:nth-child(2) #unit').val();
        }

        data = {
            title: productTitle,
            content: productTitle,
            footprint: productFootprint,
            footprint_type: productFootprintType,
            product_code: productCode,
            footprint_country: country,
            footprint_year: year,
            footprint_climate_metrics: climateMetrics,
            databaseVersion: databaseVersion,
            amount_chosen: chosenAmount,
            unit_chosen: chosenUnit,
            title_compared: productTitleCompare,
            content_compared: productTitleCompare,
            footprint_compared: productFootprint,
            footprint_type_compared: productFootprintType,
            product_code_compared: productCodeCompare,
            footprint_country_compared: countryCompare,
            footprint_year_compared: yearCompare,
            footprint_climate_metrics_compared: climateMetricsCompare,
            amount_chosen_compared: chosenAmountCompare,
            unit_chosen_compared: chosenUnitCompare,
            footprint_view: FootprintView,
        };

        adt_save_search_history_on_click(data);
    });

    adt_initialize_local_search_history();

    const params = new URLSearchParams(window.location.search);
    const base64String = params.get('data');

    if (base64String) {
        adt_get_product_by_encoded_string();
    }


    // Comparison code
    $('a:has(.add)').click(function(e){
        e.preventDefault();
        console.log('comparison added');

        $('.search-result').each(function() {
            console.log("this=",$(this))
            let original = $(this).find('.col:first-child');
            let clone = original.clone();
            
            original.after(clone);
            clone.append('<span class="adt-close"></span>');
            $('a:has(.add)').closest('.col').css('display', 'none');

            $('.adt-close').click(function(){
                $('.uncertainty-wrapper').slideUp();
                $('.adt-close').each(function(){
                    $(this).closest('.col').remove();
                });

                $('a:has(.add)').closest('.col').css('display', 'flex');
            });
        });

        const footprintData = JSON.parse(localStorage.getItem("footprint_data"));
        
        adt_download_recipe_csv();
        adt_update_comparison_info(footprintData);

        // Also set a new local storage item, to save the data of the original footprint chosen
        localStorage.setItem("footprint_original_state_data", localStorage.getItem("footprint_data"));
    });
});

function adt_get_person_footprint(userSelection){
    let act_code = userSelection.income_gpe+"_"+userSelection.household_compo; //fdemandCat will be prefixed in adt-person-functions.php
    console.log("act_code=",act_code);
    console.log("metric=",userSelection.climate_metric);
    let autocomplete_input = jQuery('#autocomplete-input'); 
    jQuery.ajax({
        type: 'POST',
        url: localize._ajax_url,
        data: {
            _ajax_nonce: localize._ajax_nonce,
            action: 'adt_get_person_footprint', //reference in adt-person-functions.php
            version: userSelection.version,
            act_code: act_code,
            metric: userSelection.climate_metric,
            region_code: userSelection.countryCode,
        },
        beforeSend: Utils.displayLoading(),
        success: function(response) {
            let dataArray = response.data;
            console.log("dataArray=",dataArray)
            let error_msg = jQuery('.error-message');

            jQuery('.loading').remove();
            autocomplete_input.prop('disabled', false);
            
            if (response.data && response.data.error && response.data.error.includes("Product not found")) {
                adt_show_search_results();
                console.log('Combination not found in adt_get_person_footprint()');
                
                // Save product data even though an error occurred
                // This is so the user can go try to search again with other countries
                // localStorage.setItem("footprint_data", JSON.stringify(response.data));
                return;
            } else {
                error_msg.slideUp('fast');
            }
            
            // Error message
            if (response.data && !response.data.title && !response.data.act_code) {
                error_msg.slideDown('fast');
            } else {
                error_msg.slideUp('fast');
            }

            let compareButtons = jQuery('.search-result .col:nth-child(2)').find('a.col-inner');
            if (compareButtons.length > 0) {
                adt_update_original_info(dataArray);
            } else {
                adt_update_comparison_info(dataArray);
            }

            adt_show_search_results();

            jQuery('html, body').animate({
                scrollTop: jQuery(".co2-form-result").offset().top - 90
            }, c_Animation.DURATION);
            
            // Try this
            localStorage.setItem("footprint_data", JSON.stringify(response.data));
            console.log('successfull run of adt_get_person_footprint()');
        },
        error: (response) => {
            console.log("error: ",response);
            let error_initMsg = jQuery('#initial-error-message');

            // Request was throttled
            error_initMsg.html('<p>'+response.responseJSON?.data.error+'</p>');
            error_initMsg.slideDown('fast');
        }
    });
}

function adt_get_product_info(productTitle, productCode, productUuid, userSelection, init=false) {
    console.log("-- adt_get_product_info --");
    console.log("productTitle, productCode, productUuid=",productTitle, productCode, productUuid);
    console.log("footprint_location, footprint_type, footprint_year,database_version,metric=",userSelection.countryCode, userSelection.footprint_type, userSelection.year,userSelection.version,userSelection.climate_metric);


    jQuery.ajax({
        type: 'POST',
        url: localize._ajax_url,
        data: {
            _ajax_nonce: localize._ajax_nonce,
            action: 'adt_get_product_footprint',
            title: productTitle,
            code: productCode,
            uuid: productUuid,
            metric: userSelection.climate_metric,
            footprint_location: userSelection.countryCode,
            footprint_type: userSelection.footprint_type,
            footprint_year: userSelection.year,
            database_version: userSelection.version,
        },
        beforeSend: Utils.displayLoading(),
        success: (response) => {
            let dataArray = response.data;

            console.log("test product info dataArray");
            console.log(dataArray);

            jQuery('.loading').remove();
            jQuery('#autocomplete-input').prop('disabled', false);
            
            if (response.data && response.data.error && response.data.error.includes("Product not found")) {
                jQuery('.error-message').first().append("<p id='error-message-content' class='error-message-content-decorator' >Selected footprint doesn't exist in the database. Try selecting a different product, location or footprint type.</p>");
                jQuery('.error-message').slideDown('fast');
                adt_show_search_results();
                console.log('Combination not found in adt_get_product_info()');
                // Save product data even though an error occurred
                // This is so the user can go try to search again with other countries
                // localStorage.setItem("footprint_data", JSON.stringify(response.data));
                return;
            } else {
                jQuery( "#error-message-content" ).remove();
                jQuery('.error-message').slideUp('fast');
            }
            
            // Error message
            if (response.data && !response.data.title) {
                jQuery('.error-message').slideDown('fast');
            } else {
                jQuery('.error-message').slideUp('fast');
            }

            //todo - refactor
            if(init){
                if(dataArray['flow_code']  !== null & dataArray['title'] == null){
                    jQuery.ajax({
                        type: 'POST',
                        url: localize._ajax_url,
                        data: {
                            _ajax_nonce: localize._ajax_nonce,
                            action: 'adt_get_product_name_by_code',
                            code: productCode,
                        },
                        success: (response) => {
                            let productTitle = response.data;
                            dataArray['title'] = Utils.capitalize(productTitle);
                            adt_update_original_info(dataArray); 
                            adt_show_search_results();
                        }
                    });
                }
            }
            
            localStorage.setItem("footprint_data", JSON.stringify(response.data));
            let compareButtons = jQuery('.search-result .col:nth-child(2)').find('a.col-inner');
            if (compareButtons.length > 0) {
                adt_update_original_info(dataArray); 
            } else {
                adt_update_comparison_info(dataArray);
                console.log("adt_update_comparison_info compareButtons.length < 0");
            }

            adt_show_search_results();

            jQuery('html, body').animate({
                scrollTop: jQuery(".co2-form-result").offset().top - 90
            }, c_Animation.DURATION);
        },
        error: (response) => {
            // Request was throttled
            console.log("adt_get_product_info ERROR");
            console.log(response);
            jQuery('#initial-error-message').html('<p>'+response.responseJSON?.data.error+'</p>');
            jQuery('#initial-error-message').slideDown('fast');
        }
    });

    adt_save_local_search_history(productTitle, productCode, productUuid, userSelection);
}

function adt_update_tags(boxToUpdate){
    let typeValue = jQuery('#footprint-type input[name="footprint_type"]:checked').val();
    let type = 'Cradle to gate';
    
    if (typeValue === 'market') {
        type = 'Cradle to consumer';
    } else if (typeValue === 'grave') {
        type = 'Cradle to grave';
    }

    let country = jQuery('#location option:selected').text();
    let countryVal = jQuery('#location option:selected').val();
    let year = jQuery('#year option:selected').text();
    let climateMetrics = jQuery('#climate-metric option:selected').text();
    let climateMetricsVal = jQuery('#climate-metric').val();
    let databaseVersion = jQuery('#database-version option:selected').text();
    
    let whichChild = ':first-child';
    
    if (boxToUpdate === 'comparison') {
        whichChild = ':nth-child(2)';
    }

    // Overwrite the Footprint type tag by data code
    if (typeValue !== 'grave') {
        jQuery('.search-result > .col'+whichChild+' .product-title').each(function() {
            let dataCode = jQuery(this).attr('data-code');

            if (dataCode){
                if (dataCode.includes("M_")) {
                    type = 'Cradle to consumer';
                } else if (dataCode.includes('C_') || dataCode.includes('EF_') || dataCode.includes('A_')) {
                    type = 'Cradle to gate';
                } else if (dataCode.includes("F_")) {
                    type = 'Cradle to grave';
                }
            }

        });
    }
    console.log("updating tags")
    console.log("type=",type)
    console.log("jQuery(this)=",jQuery(this))

    jQuery('.search-result > .col'+whichChild+' .footprint-type').each(function() {
        jQuery(this).text(type);
        jQuery(this).attr('data-type', typeValue);
    });

    jQuery('.search-result > .col'+whichChild+' .country').each(function() {
        jQuery(this).text(country);
        jQuery(this).attr('data-country', countryVal);
    });

    jQuery('.search-result > .col'+whichChild+' .year').each(function() {
        jQuery(this).text(year);
        jQuery(this).attr('data-year', year);
    });

    jQuery('.search-result > .col'+whichChild+' .climate-metrics').each(function() {
        jQuery(this).text(climateMetrics);
        jQuery(this).attr('data-climate-metrics', climateMetricsVal);
    });

    jQuery('.search-result > .col'+whichChild+' .version').each(function() {
        jQuery(this).text(databaseVersion);
        jQuery(this).attr('data-database-version', databaseVersion);
    });
}

async function adt_update_original_info(dataArray) {
    console.log("adt_update_original_info");
    console.log("dataArray.title=",dataArray.title);
    setTileTitle('.search-result .col:first-child p.product-title',dataArray);
    jQuery('.search-result .col:first-child p.product-title').each(function () {
        if (jQuery('#autocomplete-input').val()) {
            jQuery(this).text(Utils.capitalize(jQuery('#autocomplete-input').val()));
        }
    });
    
    for (const element of jQuery('.search-result .col:first-child')) {
        console.log("element=",element);
        let $element = jQuery(element);
        $element.find('select.unit').empty();
        let defaultValue = 0;
        
        if (dataArray.all_data) {
            $element.find('.product-result-unit').text(c_Unit.KGCO2);
            console.log("dataArray.all_data:",dataArray.all_data);
            jQuery('.emission-message').text('Where do emissions for 1kg of CO2eq come from?');
            jQuery('.emission-header-unit').text('['+c_Unit.KGCO2+']');
            
            let unit_ref = dataArray.all_data[0].unit_reference;
            console.log("unit_ref =",unit_ref);
            
            setUnitOptions($element, 0, dataArray, unit_ref);
            let defaultUnit = $element.find('select.unit').val();
            console.log("defaultUnit=",defaultUnit)
            // Just let the first item be default instead of null
            let valueForItems = dataArray.all_data[0].value;
            let convertedValueForItems = null;
            
            if (convertedValueForItems) {
                valueForItems = convertedValueForItems;
            }
            
            console.log("test")
            console.log(valueForItems)
            let formatted = Utils.reformatValue(valueForItems);
            
            $element.find('.product-result').text(formatted);
            defaultValue = parseFloat($element.find('.product-result').text());
            
            
            on_change_unit($element,".col:first-child",dataArray,valueForItems);
        } else {
            console.log("!dataArray.all_data");
            $element.find('select.unit').append(`<option value="person-year">Person Year</option>`);
            
            $element.find('.product-result-unit').text(dataArray.unit_emission);
            
            // Just let the first item be default instead of null
            let valueForItems = dataArray.value;
            let formatted = Utils.reformatValue(valueForItems);
            
            console.log("test defaultValue")
            console.log(valueForItems)
            $element.find('.product-result').text(formatted);
            defaultValue = valueForItems;
        }
        
        setMaxValueMessage($element, defaultValue, '.col:first-child');
    }


    adt_update_tags('original');

    await adt_update_recipe(dataArray, 'original');
}


async function adt_update_comparison_info(dataArray = null){
    setTileTitle('.search-result .col:nth-child(2) p.product-title',dataArray);
    jQuery('.search-result .col:nth-child(2) p.product-title').each(function () {
        if (jQuery('#autocomplete-input').val()) {
            jQuery(this).text(Utils.capitalize(jQuery('#autocomplete-input').val()));
        }
    });


    if (dataArray.all_data) {
        for (const element of jQuery('.search-result .col:nth-child(2)')) {
            let $element = jQuery(element);
            $element.find('select.unit').empty();

            const unit_ref = dataArray.all_data[0].unit_reference;
            setUnitOptions($element, 0, dataArray, unit_ref);
                    
            let defaultUnit = $element.find('select.unit').val();
            console.log("comparison : defaultUnit=",defaultUnit);
            // Just let the first item be default instead of null
            console.log(dataArray.all_data[0].value);
            let valueForItems = dataArray.all_data[0].value;
            let convertedValueForItems = null;

            for (const item of dataArray.all_data) {
                if (item.unit_reference === defaultUnit) {
                    valueForItems = item.value;

                    // The original data is saved because it's needed for the uncertainty calculation
                    let originalDataArray = JSON.parse(localStorage.getItem("footprint_original_state_data"));
                    let originalSample = [];

                    for (const originalItem of originalDataArray.all_data) {
                        if (originalItem.unit_reference === defaultUnit) {
                            originalSample = originalItem.samples;
                        }
                    }

                    let comparisonSample = item.samples;

                    // Because comparison is active also get the uncertainty of the comparison
                    adt_uncertainty_calculation(originalSample, comparisonSample);

                    if (item.unit_reference === c_Unit.TJ){
                        if(item.description.includes('electricity')){
                            console.log('ELECTRICITY is found');
                            convertedValueForItems = await adt_get_converted_number_by_units(c_Unit.TJ, c_Unit.KWH, valueForItems);
                            item.value = convertedValueForItems;
                        }else{
                            console.log('does not contain electricity');
                            convertedValueForItems = await adt_get_converted_number_by_units(c_Unit.TJ, c_Unit.MJ, valueForItems);
                            // multiply by 1000 to convert from MJ per tonnes to MJ per kg
                            convertedValueForItems = convertedValueForItems * 1000;
                            item.value = convertedValueForItems;
                        }
                    }
                    break;
                }
            }

            if (convertedValueForItems) {
                valueForItems = convertedValueForItems;
            }
            let formatted = Utils.reformatValue(valueForItems);

            $element.find('.product-result').text(formatted);
            let defaultValue = parseFloat($element.find('.product-result').text());

            on_change_unit($element, ".col:nth-child(2)", dataArray, valueForItems);

            setMaxValueMessage($element, defaultValue, '.col:nth-child(2)');

        }
    }

    // Comparison begins
    if (!dataArray.all_data) {
        setTileTitle('.search-result .col:nth-child(2) p.product-title',dataArray);
        
        for (const element of jQuery('.search-result .col:nth-child(2)')) {
            let $element = jQuery(element);
            $element.find('select.unit').empty();
            let defaultValue = 0;
            
            if (!dataArray.all_data) {
                $element.find('select.unit').append(`<option value="person-year">Person Year</option>`);
                
                $element.find('.product-result-unit').text(dataArray.unit_emission);
                
                // Just let the first item be default instead of null
                let valueForItems = dataArray.value;
                let formatted = Utils.reformatValue(valueForItems);
                
                $element.find('.product-result').text(formatted);
                defaultValue = valueForItems;
            }
            
            setMaxValueMessage($element, defaultValue, '.col:nth-child(2)');

        }
    }

    // test end
    adt_update_tags('comparison');

    await adt_update_recipe(dataArray, 'comparison');
}

function on_change_unit(element, childClass, dataArray, valueForItems){
    element.find('select.unit').on('change', function () {
        let unitRatio = jQuery(this).val();
        let unitRatio_name = jQuery(this).find('option:selected').text();
        let currentAmount = jQuery('.search-result '+childClass+' .amount').val();
        console.log("jQuery(this) =",jQuery(this))
        console.log("unitRatio_name =",unitRatio_name)
        console.log("unitRatio =",unitRatio)
        console.log("amount=",currentAmount)
        
        jQuery('.search-result '+childClass+' select.unit').each(async function () {
            jQuery(this).val(unitRatio);
            let newElement = jQuery(this).closest('.col-inner');

            console.log("newElement=",newElement)
            for (const item of dataArray.all_data) {
                //issue on code region selected. it is currently random
                console.log("item=",item)
                console.log("item.value=",item.value)
                console.log("item.value*ratio=",item.value*unitRatio)
                if (item.unit_reference == c_Unit.DKK){
                    if (unitRatio_name.includes(c_Unit.DKK)){ //TODO to rafactor
                        valueForItems = item.value*unitRatio*currentAmount;
                        break;
                    } else if (unitRatio_name.includes(c_Unit.EUR)){
                        valueForItems = item.value*unitRatio*currentAmount;
                        break;
                    }
                }
                valueForItems = item.value*unitRatio*currentAmount;
            }

            let formatted = Utils.reformatValue(valueForItems);
            
            jQuery(newElement).find('.product-result').text(formatted);
            defaultValue = parseFloat(jQuery('.product-result', newElement).text());
        });
    });

}

async function adt_update_recipe(dataArray, boxToUpdate)
{
    let tableMarkup = '';
    let otherRowMarkup = '';
    let rowMarkup = '';

    let whichChild = 'first-child';

    if (boxToUpdate === 'comparison') {
        whichChild = 'nth-child(2)';
    }

    let recipeArray = dataArray.recipe;

    console.log("recipeArray=",recipeArray);

    for (const recipe of recipeArray) {
        // Convert to base64
        const jsonString = JSON.stringify(recipe);
        const base64String = btoa(jsonString);  // base64 encode

        if (recipe.flow_input === undefined) {
            recipe.flow_input = recipe.product_code;
            jQuery('.emission-message').text('Where do emissions for 1 tonne of CO2eq come from?');
            jQuery('.emission-header-unit').text('[Tonnes CO2eq]');
        }

        if (recipe.region_inflow === undefined) {
            recipe.region_inflow = recipe.region_code;
        }   

        if (recipe.value_emission === undefined) {
            recipe.value_emission = recipe.value;
        }

        // Add to URL
        const getParameter = `?data=${base64String}`;
        let updatedInflow = '';

        // If unit_inflow "Meuro" per tonnes convert to Euro per kg
        if (recipe.unit_inflow === c_Unit.MEURO) {
            updatedInflow = recipe.value_inflow * 1000;
            recipe.value_emission = recipe.value_emission * 1000;
            recipe.unit_inflow = c_Unit.EUR;
        }

        // If unit_inflow "tonnes" per tonnes convert to kg per kg (same number)
        if (recipe.unit_inflow === c_Unit.TONNES) {
            recipe.unit_inflow = c_Unit.KG;
        }
        
        // If unit_inflow "TJ" per tonnes with electricity convert to kWh per kg
        if (recipe.unit_inflow === c_Unit.TJ){
            let final_unit = ""; 
            if(recipe.flow_reference.includes('electricity')) {
                final_unit = c_Unit.KWH;
            }else{
                final_unit = c_Unit.MJ;
                recipe.value_emission = recipe.value_emission * 1000;
            }
            recipe.unit_inflow = final_unit;
            updatedInflow = await adt_get_converted_number_by_units(c_Unit.TJ, c_Unit.MJ, recipe.value_inflow);
            // Wait for the conversion to complete before continuing
            if (!updatedInflow) {
                console.error('Conversion failed for '+c_Unit.TJ+'to'+ final_unit);
                return;
            }
        }

        // If unit_inflow "item" per tonnes just convert tonnes to kg
        if (recipe.unit_inflow === 'item') {
            recipe.unit_inflow = 'item';
            recipe.value_emission = recipe.value_emission * 1000;
        }

        // If unit_inflow "ha*year" per tonnes convert tonnes to kg
        // And convert "ha*year" to "m²*year"
        if (recipe.unit_inflow === c_Unit.HA_PER_YEAR) {
            recipe.unit_inflow = c_Unit.M2_PER_YEAR;
            updatedInflow = recipe.value_inflow * 10;
            recipe.value_emission = recipe.value_emission;
        }

        rowMarkup = '<tr>';
        rowMarkup += '<td><a href=" ' +getParameter+ ' " data-code="'+recipe.flow_input+'" data-uuid="'+recipe.id+'" data-country="'+recipe.region_inflow+'">' + "recipe.flow_input" + '</a></td>';
        rowMarkup += '<td>' + (recipe.region_inflow || '') + '</td>';
        rowMarkup += '<td class="input-flow">';

        if (recipe.value_inflow && recipe.value_inflow !== NaN) {
            updatedInflow = Utils.reformatValue(recipe.value_inflow);
        }
        
        if (recipe.value_emission && recipe.value_emission !== NaN) {
            recipe.value_emission = Utils.reformatValue(recipe.value_emission);
        }

        rowMarkup += '<span class="inflow-value">' + (updatedInflow ? updatedInflow : '') + '</span>';
        rowMarkup += '<span class="inflow-unit">' + (recipe.unit_inflow || '') + '</span>';

        rowMarkup += '</td>';
        rowMarkup += '<td>' + (recipe.value_emission ? recipe.value_emission : '') + '</td>';
        rowMarkup += '</tr>';

        if (recipe.flow_input.toLowerCase() === "other" || recipe.flow_input.toLowerCase() === "direct") {
            otherRowMarkup += rowMarkup; // Store "other" row separately
        } else {
            tableMarkup += rowMarkup; // Append all other rows normally
        }
    };

    // Append "other" row at the end if it exists
    tableMarkup += otherRowMarkup;

    // Display the table
    jQuery('.search-result > .col:'+whichChild+' .emissions-table tbody').html(tableMarkup);

    // Convert the product code to product name
    jQuery('.search-result > .col:'+whichChild+' .emissions-table tbody tr').each(function(){
        let productCode = jQuery(this).find('a').data('code');

        jQuery.ajax({
            type: 'POST',
            url: localize._ajax_url,
            data: {
                _ajax_nonce: localize._ajax_nonce,
                action: 'adt_get_product_name_by_code',
                code: productCode,
            },
            success: (response) => {
                let productTitle = response.data;

                jQuery('td a[data-code="'+productCode+'"]').text(Utils.capitalize(productTitle));
            }
        });
    });

    // Remove previous click handlers to avoid stacking events
    jQuery('.search-result > .col:' + whichChild + ' .emissions-table thead th').off('click');

    // Add sorting functionality to table headers
    jQuery('.search-result > .col:' + whichChild + ' .emissions-table thead th').on('click', function () {
        const $header = jQuery(this);
        const columnIndex = $header.index();
        const $table = $header.closest('table');
        const $rows = $table.find('tbody tr').toArray();

        const isAscending = $header.hasClass('ascending');
        $header.toggleClass('ascending', !isAscending).toggleClass('descending', isAscending);
        $header.siblings().removeClass('ascending descending');

        $rows.sort((a, b) => {
            const cellA = jQuery(a).find('td').eq(columnIndex).text().trim();
            const cellB = jQuery(b).find('td').eq(columnIndex).text().trim();

            const valueA = parseFloat(cellA.replace(/[^0-9.-]+/g, '')) || 0;
            const valueB = parseFloat(cellB.replace(/[^0-9.-]+/g, '')) || 0;

            return isAscending ? valueA - valueB : valueB - valueA;
        });

        $table.find('tbody').append($rows);
    });

    adt_switch_between_recipe_items();
}

// Animations
function adt_show_search_results()
{
    jQuery('#divider').show();
    jQuery('.co2-form-result').slideDown('slow', function(){
        // Might need something happening here
    });
}

// Download CSV
function adt_download_recipe_csv()
{
    jQuery(".download .button").each(function () {
        jQuery(this).click(function (e) {
            e.preventDefault();

            let productTitle = jQuery(this).closest('.col-inner').find('.product-title').text();
            let country = jQuery(this).closest('.col-inner').find('.country').text();
            let version = jQuery(this).closest('.col-inner').find('.version').text();
            
            let csvContent = "";

            jQuery(this).closest('.col-inner').find('.emissions-table tr').each(function () {
                let rowData = [];
                jQuery(this).find("th, td").each(function () {
                    let cellText = jQuery(this).text();
                    // Escape double quotes by doubling them, and wrap in quotes if contains comma or quote
                    if (cellText.includes(',') || cellText.includes('"')) {
                        cellText = '"' + cellText.replace(/"/g, '""') + '"';
                    }
                    rowData.push(cellText);
                });
                csvContent += rowData.join(",") + "\n";
            });

            // Add productTitle, country, and version at the bottom
            csvContent += "\n";
            csvContent += "Product Title," + productTitle + "\n";
            csvContent += "Country," + country + "\n";
            csvContent += "Version," + version + "\n";

            let blob = new Blob([csvContent], { type: "text/csv" });
            let url = URL.createObjectURL(blob);
            let a = jQuery("<a></a>")
                .attr("href", url)
                .attr("download", productTitle + "_" + version + ".csv")
                .appendTo("body");

            a[0].click();
            a.remove();
        });
    });
}

function adt_dynamic_search_input(productTitleArray, productCodeArray, productUuidArray) 
{
    const words = productTitleArray;
    const $input = jQuery('#autocomplete-input');
    const $suggestionsWrapper = jQuery('#suggestions-wrapper');
    const $suggestions = jQuery('#suggestions');
    const $submitBtn = jQuery('.search-input-wrapper button'); // Ensure this ID matches your button's ID
    let currentIndex = -1;
    let suggestionSelected = false;


    $input.on('input', function () {
        const query = $input.val().toLowerCase();
        const matches = words
        .map((word, index) => ({ word, code: productCodeArray[index], uuid: productUuidArray[index] }))
        .filter(item => item.word.toLowerCase().includes(query));
        $suggestions.empty();
        currentIndex = -1;
        suggestionSelected = false;
        
        if (matches.length > 0 && query) {
            jQuery(this).css('border-radius', '50px 50px 0 0').css('border-bottom', 'none');
            $suggestionsWrapper.show();

            matches.forEach(match => {
                const $div = jQuery('<div>')
                    .text(match.word)
                    .addClass('suggestion-item')
                    .attr('data-code', match.code)
                    .attr('data-uuid', match.uuid)
                    .on('click', function () {
                        selectSuggestion(match.word, match.code, match.uuid);
                    });
                $suggestions.append($div);
            });
        } else {
            jQuery(this).css('border-radius', '50px').css('border-bottom', '1px solid #ddd');
            $suggestionsWrapper.hide();
        }
    });

    $input.on('keydown', function (e) {
        const $items = $suggestions.find('.suggestion-item');
        if ($items.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentIndex = (currentIndex + 1) % $items.length;
                markCurrentItem($items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentIndex = (currentIndex - 1 + $items.length) % $items.length;
                markCurrentItem($items);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (currentIndex >= 0) {
                    const selectedItem = $items.eq(currentIndex);
                    selectSuggestion(selectedItem.text(), selectedItem.data('code'), selectedItem.data('uuid'));
                } else if (!suggestionSelected && $items.length > 0) {
                    const firstItem = $items.eq(0);
                    selectSuggestion(firstItem.text(), firstItem.data('code'), firstItem.data('uuid'));
                }
            }
        }
    });

    $submitBtn.on('click', function (e) {
        e.preventDefault();
        
        const $items = $suggestions.find('.suggestion-item');
        if (!suggestionSelected && $items.length > 0) {
            const firstItem = $items.eq(0);
            selectSuggestion(firstItem.text(), firstItem.data('code'), firstItem.data('uuid'));
        }
    });

    jQuery(document).on('click', function (e) {
        if (!jQuery(e.target).is($input)) {
            $suggestionsWrapper.hide();
            jQuery($input).css('border-radius', '50px').css('border-bottom', '1px solid #ddd');
        }
    });

    function markCurrentItem($items) {
        $items.removeClass('highlight');
        if (currentIndex >= 0) {
            $items.eq(currentIndex).addClass('highlight');
        }
    }

    
    function selectSuggestion(text, code, uuid) {
        $input.val(text).attr('data-code', code).attr('data-uuid', uuid);
        $suggestionsWrapper.hide();
        jQuery($input).css('border-radius', '50px').css('border-bottom', '1px solid #ddd');
        suggestionSelected = true;
        let userSelection = new UserSelection();
        
        adt_push_parameter_to_url(text, code, uuid, userSelection);
        adt_get_product_info(text, code, uuid, userSelection);
    }
}

function adt_switch_between_recipe_items()
{
    jQuery('.emissions-table a').on('click', function(e) {
        e.preventDefault();

        let productTitle = jQuery(this).text();
        let productCode = jQuery(this).data('code');
        let productUuid = jQuery(this).data('uuid');
        let userSelection = new UserSelection();

        console.log('Make sure this only run once!');
        adt_get_product_info(productTitle, productCode, productUuid, userSelection);
        
        // Jump to new page, so you both can share the URL and go back in browser, if you want to go back to previous state
        const href = jQuery(this).attr('href');
        history.pushState(null, '', href);
        
    });
}

function adt_save_search_history_on_click(data)
{
    jQuery.ajax({
        type: 'POST',
        url: localize._ajax_url,
        data: {
            _ajax_nonce: localize._ajax_nonce,
            action: 'adt_save_shared_search',
            data: data,
        },
        beforeSend: function() {
            
        },
        success: (response) => {
            if (!response.success) {
                return;
            }

            jQuery('#shared-search-box').fadeIn();
            jQuery('#shared-search').val(response.data);

            jQuery('#copy-search').on('click', function() {
                var $copyText = jQuery('#shared-search');
                $copyText.select();
                $copyText[0].setSelectionRange(0, 99999); // For mobile devices
                document.execCommand('copy');


                jQuery('#shared-search-box').fadeOut();
            });
        }
    });
}

function adt_save_local_search_history(productTitle, productCode, productUuid, chosenValues)
{
    // Save the data for individual user search history.
    // Save the four lastest searches to adt_search_history in local storage
    let searchHistory = localStorage.getItem("adt_search_history");
    searchHistory = JSON.parse(searchHistory);

    if (!searchHistory) {
        searchHistory = [];
    }

    // converting the chosenValues from jQuery array to JSON object.
    // This is needed to save the data in local storage.
    chosenValues = {
        database_version: chosenValues['database_version'],
        footprint_location: chosenValues['footprint_location'],
        footprint_type: chosenValues['footprint_type'],
        metric: chosenValues['metric'],
        footprint_year: chosenValues['footprint_year']
    }

    const newSearch = {
        productTitle: productTitle,
        productCode: productCode,
        productUuid: productUuid,
        chosenValues: chosenValues
    }

    searchHistory.unshift(newSearch);
    
    if (searchHistory.length > 4) {
        searchHistory.pop();
    }

    localStorage.setItem("adt_search_history", JSON.stringify(searchHistory));

    let searchHistoryHtml = '';
    searchHistory.forEach((search, index) => {
        searchHistoryHtml += '<li class="button primary is-outline" style="border-radius:99px;" data-code="' + search.productCode + '" data-uuid="' + search.productUuid + '">';
        searchHistoryHtml += search.productTitle + ' ';
        searchHistoryHtml += '<span class="remove" data-index="' + index + '"></span>';
        searchHistoryHtml += '</li>';
    });

    jQuery('#search-history-list').html(searchHistoryHtml);

    jQuery('#search-history-list .remove').on('click', function() {
        const index = jQuery(this).data('index');
        searchHistory.splice(index, 1);
        localStorage.setItem("adt_search_history", JSON.stringify(searchHistory));
        jQuery(this).parent().remove();
    });

    jQuery('#search-history-list li').on('click', function() {
        let productTitle = jQuery(this).text();
        let productCode = jQuery(this).data('code');
        let productUuid = jQuery(this).data('uuid');
        let userSelection = new UserSelection();

        jQuery('#autocomplete-input').val(productTitle);

        adt_push_parameter_to_url(productTitle, productCode, productUuid, userSelection);
        adt_get_product_info(productTitle, productCode, productUuid, userSelection);
    });
}

function adt_initialize_local_search_history()
{
    let searchHistory = localStorage.getItem("adt_search_history");
    searchHistory = JSON.parse(searchHistory);

    if (!searchHistory) {
        searchHistory = [];
    }

    let searchHistoryHtml = '';
    searchHistory.forEach((search, index) => {
        searchHistoryHtml += '<li class="button primary is-outline" style="border-radius:99px;" data-code="' + search.productCode + '" data-uuid="' + search.productUuid + '">';
        searchHistoryHtml += search.productTitle + ' ';
        searchHistoryHtml += '<span class="remove" data-index="' + index + '"></span>';
        searchHistoryHtml += '</li>';
    });

    jQuery('#search-history-list').html(searchHistoryHtml);

    jQuery('#search-history-list .remove').on('click', function() {
        const index = jQuery(this).data('index');
        searchHistory.splice(index, 1);
        localStorage.setItem("adt_search_history", JSON.stringify(searchHistory));
        jQuery(this).parent().remove();
    });

    jQuery('#search-history-list li').on('click', function() {
        let productTitle = jQuery(this).text();
        let productCode = jQuery(this).data('code');
        let productUuid = jQuery(this).data('uuid');
        let userSelection = new UserSelection();

        adt_get_product_info(productTitle, productCode, productUuid, userSelection);
    });
}

//init get the first time the product 
function adt_get_product_by_encoded_string()
{
    const params = new URLSearchParams(window.location.search);
    const base64String = params.get('data');

    const jsonString = atob(base64String);  // base64 decode
    const obj = JSON.parse(jsonString);
    const chosenValues = [];
    chosenValues['footprint_location'] = obj.footprint_location;
    chosenValues['footprint_type'] = obj.footprint_type;
    chosenValues['footprint_year'] = obj.footprint_year;
    // chosenValues['metric'] = obj.metric;
    chosenValues['database_version'] = obj.database_version;

    jQuery('#location').val(obj.footprint_location);
    jQuery('#year').val(obj.footprint_year);
    // jQuery('#climate-metric').val( obj.metric);
    jQuery('#database-version').val(obj.database_version);

    adt_get_product_info(obj.title, obj.code, obj.uuid, chosenValues, true);
}

// Makes sure to run the function when users go back and forth in browser
window.addEventListener('popstate', function(event) {
    adt_get_product_by_encoded_string();
});

function adt_get_converted_number_by_units(fromUnit, toUnit, number) 
{
    return new Promise((resolve, reject) => {
        jQuery.ajax({
            type: 'POST',
            url: localize._ajax_url,
            data: {
                _ajax_nonce: localize._ajax_nonce,
                action: 'adt_get_converted_number_ajax',
                fromUnit: fromUnit,
                toUnit: toUnit,
                number: number,
            },
            success: (response) => {
                resolve(response.data);  // Resolve with the converted data
            },
            error: (error) => {
                reject(error);  // Reject if there is an error
            }
        });
    });
}

function adt_uncertainty_calculation(original, comparison)
{
    jQuery.ajax({
        type: 'POST',
        url: localize._ajax_url,
        data: {
            _ajax_nonce: localize._ajax_nonce,
            action: 'adt_probability_a_greater_b',
            original: original,
            comparison: comparison,
        },
        beforeSend: function() {
            
        },
        success: (response) => {
            // Handle creation of HTML element here
            if (!response.data) {
                console.log('now uncertainty data');
                return;
            }
            
            // Because comparison is active also get the uncertainty of the comparison
            let numberUncertainty = response.data;
            // convert number to percentage
            numberUncertainty = parseFloat(numberUncertainty) * 100;
            numberUncertainty = Math.round(numberUncertainty * 100) / 100; // Round to two decimal places

            let uncertaintyBar = jQuery('.uncertainty-wrapper .uncertainty-bar .uncertainty-bar-background');
            uncertaintyBar.css('width', numberUncertainty+'%');
            uncertaintyBar.attr('data-uncertainty', numberUncertainty+'%');

            jQuery('.uncertainty-wrapper').slideDown();

            let colorBar = "";
            if (numberUncertainty < 80) {
                colorBar = '#EB594E';
            } else if (numberUncertainty >= 80 && numberUncertainty < 90) {
                colorBar = '#F5DA5A';
            } else {
                colorBar = '#C3F138';
            }
            uncertaintyBar.css('background-color', colorBar);

        }
    });
}

function adt_push_parameter_to_url(text, code, uuid, userSelection)
{
    // Do this to make sure you can go back in browser
    // Convert to base64
    let allData = {
        title: text,
        code: code,
        uuid: uuid,
        metric: userSelection.climate_metric,
        footprint_location: userSelection.countryCode,
        footprint_type: userSelection.footprint_type,
        footprint_year: userSelection.year,
        database_version: userSelection.version,
    };

    const jsonString = JSON.stringify(allData);
    const base64String = btoa(jsonString);  // base64 encode

    // Add to URL
    const getParameter = `?data=${base64String}`;
    history.pushState(null, '', getParameter);
}

function setTileTitle(elementClass,dataArray){
    jQuery(elementClass).each(function () {
        let value = "";
        let title = "";
        
        if (dataArray.all_data) {
            title = Utils.capitalize(dataArray.title);
            value = dataArray.flow_code;
        } else {
            title = 'Emission per person';
            value = dataArray.act_code;
        }
        jQuery(this).text(title);
        jQuery(this).attr('data-code',value);
    });
}

function setMaxValueMessage(element, defaultValue , classElement){
    element.find('.amount').each(function () {
    let inputElement = jQuery(this).closest('.col-inner');

    jQuery('.amount', inputElement).on('input', function () {
        let numberInput = parseInt(jQuery(this).val());
        let maxNumber = parseInt(jQuery(this).attr('max'));

        if (isNaN(numberInput) || numberInput <= 0) {
            numberInput = 0;
        }

        if (numberInput > maxNumber) {
            numberInput = maxNumber;
            jQuery(this).val(numberInput);
            jQuery('.unit-select-wrapper', inputElement).append('<span class="error-message" style="color: red; position:absolute; top:45px;">Maximum value exceeded</span>');
            setTimeout(() => {
                jQuery('.error-message').fadeOut(c_Animation.DURATION, function() {
                    jQuery(this).remove();
                });
            }, 1000);
        }

        let calculatedValue = defaultValue * numberInput;
        let formattedCalculatedValue = Utils.reformatValue(calculatedValue);

        jQuery('.search-result '+classElement+' .amount').val(numberInput);
        jQuery('.search-result '+classElement+' .product-result').text(formattedCalculatedValue);
        jQuery('.search-result '+classElement+' .product-result').css("width","fit-content");
        resizeTextToFit(classElement);
    });
});
}

function resizeTextToFit(classElement) {
    const textList = jQuery('.search-result '+classElement+' .product-result');
    let fontSize = 60;

    textList.each(function(index, text) { 

        text.style.fontSize = fontSize + "px";
        
        while (text.offsetWidth > 300 && fontSize > 1) {
            fontSize -= 1;
            text.style.fontSize = fontSize + "px";
        }
    });
}


function setUnitOptions(element, i, dataArray, unit_ref){
    let unitList = [];

    console.log("setUnit dataArray:",dataArray);
    
    if (unit_ref === c_Unit.DKK){
        unitList = [
            {ratio:1e-6,label:"EUR"},
            {ratio:1e-3,label:"kEUR"},
            {ratio:1,label:"mEUR"},
            {ratio:1,label:"DKK"},
            {ratio:1e3,label:"kDKK"},
            {ratio:1e6,label:"mDKK"}
        ];
    } else if (unit_ref === c_Unit.TONNES) {
        unitList = [
            {ratio:1,label:"kg"},
            {ratio:1e-3,label:"g"},
            {ratio:1e3,label:"tonne(s)"},
        ];
    } else if (unit_ref === c_Unit.MJ){
        if (dataArray.all_data[i].flow_code.includes('_elec') || dataArray.all_data[i].flow_code.includes('_POW')){
            unitList = [
                {ratio:1,label:"kWh"},
            ];
        } else {
            unitList = [
                {ratio:1,label:"MJ"},
            ];
        }
    } else if (unit_ref === c_Unit.ITEMS){
            unitList = [
                {ratio:1,label:"item(s)"},
            ]
    } else if (unit_ref === 'tonnes (service)'){
            unitList = [
                {ratio:1,label:"tonne(s) (service)"},
            ]
    }

    for (const unit of unitList){
        element.attr('data-set-' + i, dataArray.all_data[i].id);
        element.find('select.unit').append(`<option value="${unit['ratio']}">${unit['label']}</option>`);
    }

    //todo hide for person
    if (unitList.length>1 & element.find('.unit-arrow').length >0){
        jQuery('.unit-arrow').each(function(index, arrow) {
            arrow.style.display = 'block';
        })
    }

}