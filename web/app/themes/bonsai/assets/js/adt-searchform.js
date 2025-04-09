jQuery(document).ready(function($){
    $('.co2-form input[name="switch-one"]').on('change', function(){
        let isChecked = $(this).is(':checked');

        if (isChecked) {
            let value = $(this).val();

            $('input.search').attr('placeholder', 'Find footprint by '+value);

            if (value === 'person') {
                $('#grave').prop('checked', true).trigger('change'); // Fix applied here
                $('#footprint-type .radio-choice').each(function(){
                    $(this).toggle();
                });
            } else {
                $('#market').prop('checked', true).trigger('change'); // Fix applied here
                $('#footprint-type .radio-choice').each(function(){
                    $(this).toggle();
                });
            }
        }
    });

    $('input[name="switch-two"]').on('change', function(){
        let isChecked = $(this).is(':checked');

        if (isChecked) {
            let value = $(this).val();
            
            if (value == 'advanced') {
                $('.search-result.advanced').css('display', 'flex');
                $('.search-result.basic').hide();
            } else {
                $('.search-result.basic').css('display', 'flex');
                $('.search-result.advanced').hide();
            }
        }
    });

    let productTitleArray = [];
    let productContentArray = [];
    let productCodeArray = [];
    let productUuidArray = [];
    let chosenFootprintType = $('#footprint-type input[name="footprint_type"]:checked').val();

    $(searchform.products).each(function() {
        if (chosenFootprintType === "product" && this.code.includes("M_")) {
            return true;
        }

        if (
            chosenFootprintType === "market" && this.code.includes('C_')
            || chosenFootprintType === "market" && this.code.includes('EF_')
            || chosenFootprintType === "market" && this.code.includes('A_')
        ) {
            return true;
        }

        if (this.code.includes('C_') || this.code.includes('EF_')) {
            this.code = this.code.replace(/^(C_|EF_)/, 'A_');
        }
        
        productTitleArray.push(this.title);
        productContentArray.push(this.content);
        productCodeArray.push(this.code);
        productUuidArray.push(this.uuid);    
    });

    // If user chooses to change footprint type then get new data
    $('#footprint-type input[name="footprint_type"]').on('change', function() {
        chosenFootprintType = $(this).val();

        productTitleArray = [];
        productContentArray = [];
        productCodeArray = [];
        productUuidArray = [];

        $(searchform.products).each(function() {
            if (chosenFootprintType === "product" && this.code.includes("M_")) {
                return true;
            }
    
            if (
                chosenFootprintType === "market" && this.code.includes('C_')
                || chosenFootprintType === "market" && this.code.includes('EF_')
                || chosenFootprintType === "market" && this.code.includes('A_')
            ) {
                return true;
            }
    
            if (this.code.includes('C_') || this.code.includes('EF_')) {
                this.code = this.code.replace(/^(C_|EF_)/, 'A_');
            }

            productTitleArray.push(this.title);
            productContentArray.push(this.content);
            productCodeArray.push(this.code);
            productUuidArray.push(this.uuid);    
        });

        jQuery('#autocomplete-input').val('');

        adt_dynamic_search_input(productTitleArray, productCodeArray, productUuidArray);
    });

    adt_dynamic_search_input(productTitleArray, productCodeArray, productUuidArray);

    $('.co2-form-result #co2-form-result-header .select-wrapper select').on('change', function() {
        // Get last searched data instead, this does not always contain all data
        let searchHistory = localStorage.getItem("adt_search_history");
        if (searchHistory) {
            searchHistory = JSON.parse(searchHistory);
            if (searchHistory.length > 0) {
                let chosenValues = adt_get_chosen_values();
                let firstItem = searchHistory[0];
                adt_get_product_info(firstItem.productTitle, firstItem.productCode, firstItem.productUuid, chosenValues);
            }
        }
    })

    $('.most-popular-container ul li button').on('click', function() {
        let productTitle = $(this).text();
        let productCode = $(this).data('code');
        let productUuid = $(this).data('uuid');
        let chosenValues = adt_get_chosen_values();

        adt_get_product_info(productTitle, productCode, productUuid, chosenValues);
    });

    adt_download_recipe_csv();

    $('.share-icon').on('click', function() {
        let productTitle = $('.search-result.basic .col:first-child p.product-title').text();
        let productFootprint = $('input[name="switch-one"]').val();
        let FootprintView = $('input[name="switch-two"]').val();
        let productFootprintType = $('.search-result > .col:first-child .product-tag.footprint-type').attr('data-type');
        let productCode = $('.search-result .col:first-child p.product-title').data('code');
        let country = $('.search-result > .col:first-child .product-tag.country').attr('data-country');
        let year = $('.search-result > .col:first-child .product-tag.year').attr('data-year');
        let climateMetrics = $('.search-result > .col:first-child .product-tag.climate-metrics').attr('data-climate-metrics');
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
        let chosenAmountCompare = '';
        let chosenUnitCompare = '';

        if (doesItCompare) {
            productTitleCompare = $('.search-result.basic .col:nth-child(2) p.product-title').text();
            productCodeCompare = $('.search-result .col:nth-child(2) p.product-title').data('code');
            countryCompare = $('.search-result > .col:nth-child(2) .product-tag.country').attr('data-country');
            yearCompare = $('.search-result > .col:nth-child(2) .product-tag.year').attr('data-year');
            climateMetricsCompare = $('.search-result > .col:nth-child(2) .product-tag.climate-metrics').attr('data-climate-metrics');
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
    adt_get_product_by_encoded_string();
});

function adt_get_product_info(productTitle, productCode, productUuid, chosenValues) 
{
    productInfo = [];

    jQuery.ajax({
        type: 'POST',
        url: localize._ajax_url,
        data: {
            _ajax_nonce: localize._ajax_nonce,
            action: 'adt_get_product_footprint',
            title: productTitle,
            code: productCode,
            uuid: productUuid,
            footprint_location: chosenValues['footprint_location'],
            footprint_type: chosenValues['footprint_type'],
            footprint_year: chosenValues['footprint_year'],
        },
        beforeSend: function() {
            jQuery('#autocomplete-input').after('<div class="loading"></div>');
            jQuery('#autocomplete-input').prop('disabled', true);
        },
        success: (response) => {
            let dataArray = response.data;

            jQuery('.loading').remove();
            jQuery('#autocomplete-input').prop('disabled', false);
            
            if (response.data && response.data.error && response.data.error.includes("Product not found")) {
                jQuery('.error-message').slideDown('fast');
                adt_show_search_results();
                console.log(response.data);
                // Save product data even though an error occurred
                // This is so the user can go try to search again with other countries
                // localStorage.setItem("footprint_data", JSON.stringify(response.data));
                return;
            } else {
                jQuery('.error-message').slideUp('fast');
            }
            
            // Error message
            if (response.data && !response.data.title) {
                jQuery('.error-message').slideDown('fast');
            } else {
                jQuery('.error-message').slideUp('fast');
            }

            console.log(response.data);
            localStorage.setItem("footprint_data", JSON.stringify(response.data));
            
            let compareButtons = jQuery('.search-result .col:nth-child(2)').find('a.col-inner');
            if (compareButtons.length > 0) {
                adt_update_original_info(dataArray);
            } else {
                adt_update_comparison_info(dataArray);
            }

            adt_show_search_results();

            jQuery('#initial-error-message').slideUp('fast');

            jQuery('html, body').animate({
                scrollTop: jQuery(".co2-form-result").offset().top - 90
            }, 500); // 500ms = 0.5 second animation time

        },
        error: (response) => {
            // Request was throttled
            jQuery('#initial-error-message').html('<p>'+response.responseJSON?.data.error+'</p>');
            jQuery('#initial-error-message').slideDown('fast');
        }
    });

    // Save the data to wp_adt_popular_searches
    jQuery.ajax({
        type: 'POST',
        url: localize._ajax_url,
        data: {
            _ajax_nonce: localize._ajax_nonce,
            action: 'adt_log_popular_search',
            search_phrase: productTitle,
            product_code: productCode,
            product_uuid: productUuid,
            footprint_location: chosenValues['footprint_location'],
            footprint_type: chosenValues['footprint_type'],
            footprint_year: chosenValues['footprint_year'],
        },
        beforeSend: function() {
            
        },
        success: (response) => {
        }
    });

    adt_save_local_search_history(productTitle, productCode, productUuid, chosenValues);
}

function adt_get_chosen_values()
{
    let chosenArray = [];

    chosenArray['footprint_type'] = jQuery('#footprint-type input[name="footprint_type"]').val(); 
    chosenArray['footprint_location'] = jQuery('#location').val();
    chosenArray['footprint_year'] = jQuery('#year').val();

    return chosenArray;
}

function adt_update_tags(boxToUpdate)
{
    let typeValue = jQuery('#footprint-type input[name="footprint_type"]:checked').val();
    let type = 'Cradle to gate';
    
    if (typeValue === 'market') {
        type = 'Cradle to consumer';
    }
    
    let country = jQuery('#location option:selected').text();
    let countryVal = jQuery('#location option:selected').val();
    let year = jQuery('#year option:selected').text();
    let climateMetrics = jQuery('#climate-metric option:selected').text();
    let climateMetricsVal = jQuery('#climate-metric').val();
    
    let whichChild = ':first-child';
    
    if (boxToUpdate === 'comparison') {
        whichChild = ':nth-child(2)';
    }

    jQuery('.search-result > .col'+whichChild+' .product-tag.footprint-type').each(function() {
        jQuery(this).text(type);
        jQuery(this).attr('data-type', typeValue);
    });

    jQuery('.search-result > .col'+whichChild+' .product-tag.country').each(function() {
        jQuery(this).text(country);
        jQuery(this).attr('data-country', countryVal);
    });

    jQuery('.search-result > .col'+whichChild+' .product-tag.year').each(function() {
        jQuery(this).text(year);
        jQuery(this).attr('data-year', year);
    });

    jQuery('.search-result > .col'+whichChild+' .product-tag.climate-metrics').each(function() {
        jQuery(this).text(climateMetrics);
        jQuery(this).attr('data-climate-metrics', climateMetricsVal);
    });
}

function adt_change_data_set()
{
    let dataArray = JSON.parse(localStorage.getItem("footprint_data"));

    jQuery('.search-result').each(function() {
        let element = jQuery(this);
        jQuery(dataArray.all_data).each(function(i) {
            if (dataArray.all_data[i].id == dataSet) {
                jQuery(element).attr('data-set-'+i, dataSet);
            }
        });
    });
}

async function adt_update_original_info(dataArray) {
    localStorage.getItem("footprint_data");
    adt_update_tags('original');

    jQuery('.search-result .col:first-child p.product-title').each(function () {
        jQuery(this).text(dataArray.title);
        jQuery(this).attr('data-code', dataArray.flow_code);
    });

    for (const element of jQuery('.search-result .col:first-child')) {
        let $element = jQuery(element);
        $element.find('select.unit').empty();

        jQuery(dataArray.all_data).each(function (i) {
            let unit = dataArray.all_data[i].unit_reference;

            if (unit === 'Meuro') unit = 'EUR';
            if (unit === 'tonnes') unit = 'kg';
            if (unit === 'TJ' && !dataArray.all_data[i].description.includes('electricity')) unit = 'MJ';
            if (unit === 'TJ' && dataArray.all_data[i].description.includes('electricity')) unit = 'kWh';

            $element.attr('data-set-' + i, dataArray.all_data[i].id);
            $element.find('select.unit').append(`<option value="${dataArray.all_data[i].unit_reference}">${unit}</option>`);
        });

        let defaultUnit = $element.find('select.unit').val();
        // Just let the first item be default instead of null
        let valueForItems = dataArray.all_data[0].value;
        let convertedValueForItems = null;

        // Removed because conversion already happened in the PHP function
        // for (const item of dataArray.all_data) {
        //     if (item.unit_reference === defaultUnit) {
        //         valueForItems = item.value;
        //         // To make sure capitalization is not an issue
        //         item.description = item.description.toLowerCase();
                
        //         if (item.unit_reference === 'MJ' && !item.description.includes('electricity')) {
        //             convertedValueForItems = await adt_get_converted_number_by_units('TJ', 'MJ', valueForItems);
        //             item.value = convertedValueForItems;
        //         }

        //         if (item.unit_reference === 'kWh' && item.description.includes('electricity')) {
        //             convertedValueForItems = await adt_get_converted_number_by_units('TJ', 'kWh', valueForItems);
        //             item.value = convertedValueForItems;
        //         }

        //         break;
        //     }
        // }

        if (convertedValueForItems) {
            valueForItems = convertedValueForItems;
        }

        let formatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
        }).format(valueForItems);
        
        $element.find('.product-result').text(formatted);
        let defaultValue = parseFloat($element.find('.product-result').text());

        $element.find('select.unit').on('change', function () {
            let chosenValue = jQuery(this).val();

            jQuery('.search-result .col:first-child .amount').val('1');
            jQuery('.search-result .col:first-child select.unit').each(async function () {
                jQuery(this).val(chosenValue);
                let newElement = jQuery(this).closest('.col-inner');

                for (const item of dataArray.all_data) {
                    if (item.unit_reference === chosenValue) {
                        valueForItems = item.value;
                        // Can I change this number earlier in the flow?
                        // Convert emission in tonnes per 1 million Euro to kg per 1 Euro
                        if (chosenValue === 'Meuro') {
                            // Instead of mulitplying by 1000, divide by 1000000
                            // Then just divide by 1000 to get the value in kg
                            // valueForItems = item.value / 1000;
                        }

                        break;
                    }
                }

                let formatted = new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4
                }).format(valueForItems);

                jQuery(newElement).find('.product-result').text(formatted);
                defaultValue = parseFloat(jQuery('.product-result', newElement).text());
            });
        });

        $element.find('.amount').each(function () {
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
                        jQuery('.error-message').fadeOut(500, function() {
                            jQuery(this).remove();
                        });
                    }, 2000);
                }

                let calculatedValue = defaultValue * numberInput;

                let formattedCalculatedValue = new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4
                }).format(calculatedValue);

                jQuery('.search-result .col:first-child .amount').val(numberInput);
                jQuery('.search-result .col:first-child .product-result').text(formattedCalculatedValue);
            });
        });
    }

    await adt_update_recipe(dataArray, 'original');
}

// Comparison code
jQuery(document).ready(function($){
    $('a:has(.add)').click(function(e){
        e.preventDefault();
        console.log('comparison added');

        $('.search-result').each(function() {
            let original = $(this).find('.col:first-child');
            let clone = original.clone();
            
            original.after(clone);
            clone.append('<span class="adt-close"></span>');
            $('a:has(.add)').closest('.col').css('display', 'none');

            $('.adt-close').click(function(){
                $('.adt-close').each(function(){
                    $(this).closest('.col').remove();
                });

                $('a:has(.add)').closest('.col').css('display', 'flex');
            });
        });

        const footprintData = JSON.parse(localStorage.getItem("footprint_data"));
        
        adt_download_recipe_csv();
        adt_update_comparison_info(footprintData);
    });
});

async function adt_update_comparison_info(dataArray = null)
{
    localStorage.getItem("footprint_data");

    adt_update_tags('comparison');

    jQuery('.search-result .col:nth-child(2) p.product-title').each(function() {
        jQuery(this).text(dataArray.title);
        jQuery(this).attr('data-code', dataArray.flow_code);
    });

    for (const element of jQuery('.search-result .col:nth-child(2)')) {
        let $element = jQuery(element);
        $element.find('select.unit').empty();

        jQuery(dataArray.all_data).each(function (i) {
            let unit = dataArray.all_data[i].unit_reference;

            if (unit === 'Meuro') unit = 'EUR';
            if (unit === 'tonnes') unit = 'kg';
            if (unit === 'TJ' && !dataArray.all_data[i].description.includes('electricity')) unit = 'MJ';
            if (unit === 'TJ' && dataArray.all_data[i].description.includes('electricity')) unit = 'kWh';

            $element.attr('data-set-' + i, dataArray.all_data[i].id);
            $element.find('select.unit').append(`<option value="${dataArray.all_data[i].unit_reference}">${unit}</option>`);
        });

        let defaultUnit = $element.find('select.unit').val();
        // Just let the first item be default instead of null
        let valueForItems = dataArray.all_data[0].value;
        let convertedValueForItems = null;

        for (const item of dataArray.all_data) {
            if (item.unit_reference === defaultUnit) {
                valueForItems = item.value;

                if (item.unit_reference === 'TJ' && !item.description.includes('electricity')) {
                    console.log('does not contain electricity');
                    convertedValueForItems = await adt_get_converted_number_by_units('TJ', 'MJ', valueForItems);
                    item.value = convertedValueForItems;
                }

                if (item.unit_reference === 'TJ' && item.description.includes('electricity')) {
                    console.log('ELECTRICITY is found');
                    convertedValueForItems = await adt_get_converted_number_by_units('TJ', 'kWh', valueForItems);
                    item.value = convertedValueForItems;
                }

                break;
            }
        }

        if (convertedValueForItems) {
            valueForItems = convertedValueForItems;
        }

        let formatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
        }).format(valueForItems);

        $element.find('.product-result').text(formatted);
        let defaultValue = parseFloat($element.find('.product-result').text());

        $element.find('select.unit').on('change', function () {
            let chosenValue = jQuery(this).val();

            jQuery('.search-result .col:nth-child(2) .amount').val('1');
            jQuery('.search-result .col:nth-child(2) select.unit').each(async function () {
                jQuery(this).val(chosenValue);
                let newElement = jQuery(this).closest('.col-inner');

                for (const item of dataArray.all_data) {
                    if (item.unit_reference === chosenValue) {
                        valueForItems = item.value;
                        // Can I change this number earlier in the flow?
                        // Convert emission in tonnes per 1 million Euro to kg per 1 Euro
                        if (chosenValue === 'Meuro') {
                            // Instead of mulitplying by 1000, divide by 1000000
                            // Then just divide by 1000 to get the value in kg
                            // valueForItems = item.value / 1000;
                        }

                        break;
                    }
                }

                let formatted = new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4
                }).format(valueForItems);

                jQuery(newElement).find('.product-result').text(formatted);
                defaultValue = parseFloat(jQuery('.product-result', newElement).text());
            });
        });

        $element.find('.amount').each(function () {
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
                        jQuery('.error-message').fadeOut(500, function() {
                            jQuery(this).remove();
                        });
                    }, 2000);
                }

                let calculatedValue = defaultValue * numberInput;

                let formattedCalculatedValue = new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4
                }).format(calculatedValue);

                jQuery('.search-result .col:nth-child(2) .amount').val(numberInput);
                jQuery('.search-result .col:nth-child(2) .product-result').text(formattedCalculatedValue);
            });
        });
    }

    await adt_update_recipe(dataArray, 'comparison');
}

async function adt_update_recipe(dataArray, boxToUpdate)
{
    console.log(dataArray);
    let tableMarkup = '';
    let otherRowMarkup = '';
    let rowMarkup = '';

    let whichChild = 'first-child';
    // Recipe return structure changed
    let recipeArray = dataArray.recipe.results;

    jQuery.each(recipeArray, async function(_, recipe) {
        // https://lca.aau.dk/api/footprint/?flow_code=A_Pears&region_code=DK&version=v1.1.0

        // Convert to base64
        const jsonString = JSON.stringify(recipe);
        const base64String = btoa(jsonString);  // base64 encode

        // Add to URL
        const getParameter = `?data=${base64String}`;

        // If unit_inflow "Meuro" per tonnes convert to Euro per kg
        if (recipe.unit_inflow === 'Meuro') {
            recipe.value_inflow = recipe.value_inflow * 1000;
            recipe.value_emission = recipe.value_emission * 1000;
            recipe.unit_inflow = 'EUR';
        }

        // If unit_inflow "tonnes" per tonnes convert to kg per kg (same number)
        if (recipe.unit_inflow === 'tonnes') {
            recipe.unit_inflow = 'kg';
        }

        // If unit_inflow "TJ" per tonnes convert to MJ per kg
        if (recipe.unit_inflow === 'TJ' && !recipe.flow_input.includes('electricity')) {
            recipe.value_inflow = await adt_get_converted_number_by_units('TJ', 'MJ', recipe.value_inflow);
            // from tonnes to kg
            recipe.value_emission = recipe.value_emission * 1000;
            recipe.unit_inflow = 'MJ';
        }

        // If unit_inflow "TJ" per tonnes with electricity convert to kWh per kg
        if (recipe.unit_inflow === 'TJ' && recipe.flow_input.includes('electricity')) {
            recipe.value_inflow = await adt_get_converted_number_by_units('TJ', 'kWh', recipe.value_inflow);
            // from tonnes to kg
            recipe.value_emission = recipe.value_emission * 1000;
            recipe.unit_inflow = 'kWh';
        }

        // If unit_inflow "item" per tonnes just convert tonnes to kg
        if (recipe.unit_inflow === 'item') {
            recipe.unit_inflow = 'item';
            recipe.value_emission = recipe.value_emission * 1000;
        }

        // If unit_inflow "ha*year" per tonnes convert tonnes to kg
        // And convert "ha*year" to "m²*year"
        if (recipe.unit_inflow === 'ha*year') {
            recipe.unit_inflow = 'm²*year';
            recipe.value_inflow = recipe.value_inflow * 10;
            recipe.value_emission = recipe.value_emission;
        }

        rowMarkup = '<tr>';
        rowMarkup += '<td><a href=" ' +getParameter+ ' " data-code="'+recipe.flow_input+'" data-uuid="'+recipe.id+'" data-country="'+recipe.region_inflow+'">' + recipe.flow_input + '</a></td>';
        rowMarkup += '<td>' + (recipe.region_inflow || '') + '</td>';
        rowMarkup += '<td class="input-flow">';

        if (recipe.value_inflow && recipe.value_inflow !== NaN) {
            recipe.value_inflow = recipe.value_inflow.toFixed(5);
        }

        if (recipe.value_emission && recipe.value_emission !== NaN) {
            recipe.value_emission = recipe.value_emission.toFixed(5);
        }

        rowMarkup += '<span class="inflow-value">' + (recipe.value_inflow ? recipe.value_inflow : '') + '</span>';
        rowMarkup += '<span class="inflow-unit">' + (recipe.unit_inflow || '') + '</span>';

        rowMarkup += '</td>';
        rowMarkup += '<td>' + (recipe.value_emission ? recipe.value_emission : '') + '</td>';
        rowMarkup += '</tr>';

        if (recipe.flow_input.toLowerCase() === "other" || recipe.flow_input.toLowerCase() === "direct") {
            otherRowMarkup += rowMarkup; // Store "other" row separately
        } else {
            tableMarkup += rowMarkup; // Append all other rows normally
        }

        jQuery.ajax({
            type: 'POST',
            url: localize._ajax_url,
            data: {
                _ajax_nonce: localize._ajax_nonce,
                action: 'adt_get_product_name_by_code',
                code: recipe.flow_input,
            },
            beforeSend: function() {
                
            },
            success: (response) => {
                let productTitle = response.data;

                jQuery('td a[data-code="'+recipe.flow_input+'"]').text(productTitle);
            }
        });
        
    });

    // Append "other" row at the end if it exists
    tableMarkup += otherRowMarkup;

    if (boxToUpdate === 'comparison') {
        whichChild = 'nth-child(2)';
    }

    jQuery('.search-result > .col:'+whichChild+' .emissions-table tbody').html(tableMarkup);

    adt_switch_between_recipe_items();
}

// Animations
function adt_show_search_results()
{
    jQuery('.co2-form-wrapper .text-center:has(.divider)').show();
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
            
            let csvContent = "";
            
            jQuery(this).closest('.col-inner').find('.emissions-table tr').each(function () {
                let rowData = [];
                
                jQuery(this).find("th, td").each(function () {
                    rowData.push(jQuery(this).text());
                });

                csvContent += rowData.join(",") + "\n";
            });

            let blob = new Blob([csvContent], { type: "text/csv" });
            let url = URL.createObjectURL(blob);
            let a = jQuery("<a></a>")
                .attr("href", url)
                .attr("download", productTitle + ".csv")
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
    let chosenValuesArray = adt_get_chosen_values();

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
        chosenValuesArray = adt_get_chosen_values();
        
        // Do this to make sure you can go back in browser
        // Convert to base64
        let allData = {
            title: text,
            code: code,
            uuid: uuid,
            footprint_location: chosenValuesArray['footprint_location'],
            footprint_type: chosenValuesArray['footprint_type'],
            footprint_year: chosenValuesArray['footprint_year'],
        };

        const jsonString = JSON.stringify(allData);
        const base64String = btoa(jsonString);  // base64 encode

        // Add to URL
        const getParameter = `?data=${base64String}`;
        history.pushState(null, '', getParameter);

        adt_get_product_info(text, code, uuid, chosenValuesArray);
    }
}

function adt_switch_between_recipe_items()
{
    jQuery('.emissions-table a').on('click', function(e) {
        e.preventDefault();

        let productTitle = jQuery(this).text();
        let productCode = jQuery(this).data('code');
        let productUuid = jQuery(this).data('uuid');
        let chosenValues = adt_get_chosen_values();
        chosenValues['footprint_location'] = jQuery(this).data('country');

        console.log('Make sure this only run once!');
        adt_get_product_info(productTitle, productCode, productUuid, chosenValues);
        
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
            console.log(response);
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

    const newSearch = {
        productTitle: productTitle,
        productCode: productCode,
        productUuid: productUuid,
        chosenValues: chosenValues
    };

    searchHistory.unshift(newSearch);

    if (searchHistory.length > 4) {
        searchHistory.pop();
    }

    localStorage.setItem("adt_search_history", JSON.stringify(searchHistory));

    let searchHistoryHtml = '';
    searchHistory.forEach((search, index) => {
        searchHistoryHtml += '<li class="button primary is-outline lowercase" style="border-radius:99px;">';
        searchHistoryHtml += search.productTitle + ' ';
        searchHistoryHtml += '<span class="remove" data-index="' + index + '"></span>';
        searchHistoryHtml += '</li>';
    });

    jQuery('.search-history ul').html(searchHistoryHtml);

    jQuery('.search-history ul .remove').on('click', function() {
        const index = jQuery(this).data('index');
        searchHistory.splice(index, 1);
        localStorage.setItem("adt_search_history", JSON.stringify(searchHistory));
        jQuery(this).parent().remove();
    });

    jQuery('.search-history ul li').on('click', function() {
        let productTitle = jQuery(this).text();
        let productCode = jQuery(this).data('code');
        let productUuid = jQuery(this).data('uuid');
        let chosenValues = adt_get_chosen_values();

        adt_get_product_info(productTitle, productCode, productUuid, chosenValues);
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
        searchHistoryHtml += '<li class="button primary is-outline lowercase" style="border-radius:99px;" data-code="' + search.productCode + '" data-uuid="' + search.productUuid + '">';
        searchHistoryHtml += search.productTitle + ' ';
        searchHistoryHtml += '<span class="remove" data-index="' + index + '"></span>';
        searchHistoryHtml += '</li>';
    });

    jQuery('.search-history ul').html(searchHistoryHtml);

    jQuery('.search-history ul .remove').on('click', function() {
        const index = jQuery(this).data('index');
        searchHistory.splice(index, 1);
        localStorage.setItem("adt_search_history", JSON.stringify(searchHistory));
        jQuery(this).parent().remove();
    });

    jQuery('.search-history ul li').on('click', function() {
        let productTitle = jQuery(this).text();
        let productCode = jQuery(this).data('code');
        let productUuid = jQuery(this).data('uuid');
        let chosenValues = adt_get_chosen_values();

        adt_get_product_info(productTitle, productCode, productUuid, chosenValues);
    });
}

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

    adt_get_product_info(obj.title, obj.code, obj.uuid, chosenValues);
}

// Makes sure to run the function when users go back and forth in browser
window.addEventListener('popstate', function(event) {
    adt_get_product_by_encoded_string();
});

function adt_find_multiplier_for_lowest_number(data)
{
    let minValue = null;
    
    // Find the minimum non-null value_inflow
    jQuery.each(data, function(index, item) {
        if (item.value_inflow !== null) {
            if (minValue === null || item.value_inflow < minValue) {
                minValue = item.value_inflow;
            }
        }
    });
    
    let multiplier = 1;
    if (minValue !== null && minValue > 0) {
        multiplier = 1 / minValue;
    }
    
    // Output the multiplier
    // console.log("Min value:", minValue);
    // console.log("Multiplier needed:", multiplier);
}

// function adt_get_converted_number_by_units(fromUnit, toUnit, number)
// {
//     jQuery.ajax({
//         type: 'POST',
//         url: localize._ajax_url,
//         data: {
//             _ajax_nonce: localize._ajax_nonce,
//             action: 'adt_get_converted_number_ajax',
//             fromUnit: fromUnit,
//             toUnit: toUnit,
//             number: number,
//         },
//         beforeSend: function() {
            
//         },
//         success: (response) => {
//             console.log(response.data);

//             return response.data;
//         }
//     });
// }

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
                console.log(response.data);
                resolve(response.data);  // Resolve with the converted data
            },
            error: (error) => {
                reject(error);  // Reject if there is an error
            }
        });
    });
}