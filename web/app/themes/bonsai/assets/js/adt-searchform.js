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
        ) {
            return true;
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
        let jsonObject = localStorage.getItem("footprint_data");
        jsonObject = JSON.parse(jsonObject);

        let chosenValues = adt_get_chosen_values();

        adt_get_product_info(jsonObject.title, jsonObject.flow_code, jsonObject.uuid, chosenValues);
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
            
        },
        success: (response) => {
            let dataArray = response.data;

            if (response.data && response.data.error && response.data.error.includes("Product not found")) {
                jQuery('.error-message').slideDown('fast');
                adt_show_search_results();
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

function adt_update_original_info(dataArray)
{
    localStorage.getItem("footprint_data");

    adt_update_tags('original');

    jQuery('.search-result .col:first-child p.product-title').each(function() {
        jQuery(this).text(dataArray.title);
        jQuery(this).attr('data-code', dataArray.flow_code);
    });

    var element = '';
    jQuery('.search-result .col:first-child').each(function() {
        // This loops over the basic and advanced search result
        element = jQuery(this);
        jQuery(element).find('select.unit').empty();

        // More Units: kWh, MJ, TJ, tonne, Meuro, item.
        // 1 TJ = 1,000,000 MJ (1 million MJ).
        jQuery(dataArray.all_data).each(function(i) {
            let unit = dataArray.all_data[i].unit_reference;

            if (dataArray.all_data[i].unit_reference === 'Meuro') {
                unit = 'EUR';
            }

            if (dataArray.all_data[i].unit_reference === 'tonnes') {
                unit = 'kg';
            }

            jQuery(element).attr('data-set-'+i, dataArray.all_data[i].id);
            jQuery(element).find('select.unit').append('<option value="'+dataArray.all_data[i].unit_reference+'">'+unit+'</option>');
        });


        let defualtValue = jQuery(element).find('select.unit').val();

        if (defualtValue === 'Meuro') {
            let numberValueInCurrency = dataArray.all_data[1].value;
            let formatted = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(numberValueInCurrency);

            jQuery(element).find('.product-result').text(formatted);
        }

        if (defualtValue === 'tonnes') {
            // Number in tonnes. It has to be converted to kg
            let numberValueInWeight = dataArray.all_data[0].value;
            // Overwriting Number with the new value in kg
            let formatted = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(numberValueInWeight);

            jQuery(element).find('.product-result').text(formatted);
            jQuery(element).find('.product-result-unit').text('kg CO2eq');
        }

        let defaultValue = parseFloat(jQuery('.product-result', element).text());

        jQuery(element).find('select.unit').on('change', function() {
            let chosenValue = jQuery(this).val();

            // Reset number in .amount field when changing the unit
            jQuery('.search-result .col:first-child .amount').each(function(){
                jQuery(this).val('1');
            });
            
            jQuery('.search-result .col:first-child select.unit').each(function(){
                jQuery(this).val(chosenValue);

                let newElement = jQuery(this).closest('.col-inner');

                if (chosenValue === 'Meuro') {
                    let numberValueInCurrency = dataArray.all_data[1].value;
                    let formatted = new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(numberValueInCurrency);

                    let numberInput = jQuery('.amount', newElement).val();
                    // console.log(numberInput);
    
                    jQuery(newElement).find('.product-result').text(formatted);
                    defaultValue = parseFloat(jQuery('.product-result', newElement).text());
                }
    
                if (chosenValue === 'tonnes') {
                    // Number in tonnes. It has to be converted to kg
                    let numberValueInWeight = dataArray.all_data[0].value;
                    // Overwriting Number with the new value in kg
                    let formatted = new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(numberValueInWeight);

                    let numberInput = jQuery('.amount', newElement).val();
                    // console.log(numberInput);
    
                    jQuery(newElement).find('.product-result').text(formatted);
                    jQuery(newElement).find('.product-result-unit').text('kg CO2eq');
                    defaultValue = parseFloat(jQuery('.product-result', newElement).text());
                }
            });

            // adt_update_recipe(dataArray, 'original', true);
        });

        // This changes the number foreach input in the .amount field
        jQuery('.amount', element).each(function() {
            let inputElement = jQuery(this).closest('.col-inner');

            jQuery('.amount', inputElement).on('input', function() {
                let numberInput = jQuery(this).val();
                let calculatedValue = defaultValue * numberInput;
                
                jQuery('.search-result .col:first-child .amount').each(function(){
                    jQuery(this).val(numberInput);
                });

                jQuery('.search-result .col:first-child .product-result').each(function(){
                    jQuery(this).text(calculatedValue);
                });
                
                // adt_update_recipe(dataArray, 'original');
            });
            
        });
    });

    adt_update_recipe(dataArray, 'original');
}

// Comparison code
jQuery(document).ready(function($){
    $('a:has(.add)').click(function(e){
        e.preventDefault();

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

        adt_download_recipe_csv();
        adt_update_comparison_info();
    });
});

function adt_update_comparison_info(dataArray = null)
{
    localStorage.getItem("footprint_data");

    adt_update_tags('comparison');

    jQuery('.search-result .col:nth-child(2) p.product-title').each(function() {
        jQuery(this).text(dataArray.title);
        jQuery(this).attr('data-code', dataArray.flow_code);
    });

    var element = '';
    jQuery('.search-result .col:nth-child(2)').each(function() {
        // This loops over the basic and advanced search result
        element = jQuery(this);
        jQuery(element).find('select.unit').empty();

        jQuery(dataArray.all_data).each(function(i) {
            let unit = 'kg';

            if (dataArray.all_data[i].unit_reference === 'Meuro') {
                unit = 'EUR';
            } else if (dataArray.all_data[i].unit_reference === 'tonnes') {
                unit = 'kg';
            }

            jQuery(element).attr('data-set-'+i, dataArray.all_data[i].id);
            jQuery(element).find('select.unit').append('<option value="'+dataArray.all_data[i].unit_reference+'">'+unit+'</option>');
        });

        let defualtValue = jQuery(element).find('select.unit').val();

        if (defualtValue === 'Meuro') {
            let numberValueInCurrency = dataArray.all_data[1].value;
            let formatted = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(numberValueInCurrency);

            jQuery(element).find('.product-result').text(formatted);
        }

        if (defualtValue === 'tonnes') {
            // Number in tonnes. It has to be converted to kg
            let numberValueInWeight = dataArray.all_data[0].value;
            // Overwriting Number with the new value in kg
            let formatted = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(numberValueInWeight);

            jQuery(element).find('.product-result').text(formatted);
            jQuery(element).find('.product-result-unit').text('kg CO2eq');
        }

        let defaultValue = parseFloat(jQuery('.product-result', element).text());

        jQuery(element).find('select.unit').on('change', function() {
            let chosenValue = jQuery(this).val();

            // Reset number in .amount field when changing the unit
            jQuery('.search-result .col:nth-child(2) .amount').each(function(){
                jQuery(this).val('1');
            });
            
            jQuery('.search-result .col:nth-child(2) select.unit').each(function(){
                jQuery(this).val(chosenValue);

                let newElement = jQuery(this).closest('.col-inner');

                if (chosenValue === 'Meuro') {
                    let numberValueInCurrency = dataArray.all_data[1].value;
                    let formatted = new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(numberValueInCurrency);

                    let numberInput = jQuery('.amount', newElement).val();
                    // console.log(numberInput);
    
                    jQuery(newElement).find('.product-result').text(formatted);
                    defaultValue = parseFloat(jQuery('.product-result', newElement).text());
                }
    
                if (chosenValue === 'tonnes') {
                    // Number in tonnes. It has to be converted to kg
                    let numberValueInWeight = dataArray.all_data[0].value;
                    // Overwriting Number with the new value in kg
                    let formatted = new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(numberValueInWeight);

                    let numberInput = jQuery('.amount', newElement).val();
                    // console.log(numberInput);
    
                    jQuery(newElement).find('.product-result').text(formatted);
                    jQuery(newElement).find('.product-result-unit').text('kg CO2eq');
                    defaultValue = parseFloat(jQuery('.product-result', newElement).text());
                }
            });

            // adt_update_recipe(dataArray, 'comparison', true);
        });

        // This changes the number foreach input in the .amount field
        jQuery('.amount', element).each(function() {
            let inputElement = jQuery(this).closest('.col-inner');

            jQuery('.amount', inputElement).on('input', function() {
                let numberInput = jQuery(this).val();
                let calculatedValue = defaultValue * numberInput;
                
                jQuery('.search-result .col:nth-child(2) .amount').each(function(){
                    jQuery(this).val(numberInput);
                });

                jQuery('.search-result .col:nth-child(2) .product-result').each(function(){
                    jQuery(this).text(calculatedValue);
                });
                
                // adt_update_recipe(dataArray, 'comparison');
            });
        });
    });

    // adt_update_recipe(dataArray, 'comparison');
}

function adt_update_recipe(dataArray, boxToUpdate, isChanged = false)
{
    let tableMarkup = '';
    let otherRowMarkup = '';
    let rowMarkup = '';

    let whichChild = 'first-child';
    // Recipe return structure changed
    let recipeArray = dataArray.recipe.results;

    console.log(recipeArray);

    // Get the amount and unit of the product
    let amount = jQuery('.search-result .col:'+whichChild+' .amount').val();
    let unit = jQuery('.search-result .col:'+whichChild+' select.unit').val();
    let chosenCountry = jQuery('select#location').val();
    // Just get the version from the currently available data
    // let newestVersion = dataArray.recipe[0].version;

    // console.log(dataArray);

    // Convert the tonnes amount to kg
    // if (unit === 'tonnes') {
    //     amount = amount;
    // }

    jQuery.each(recipeArray, function(index, recipe) {
        // https://lca.aau.dk/api/footprint/?flow_code=A_Pears&region_code=DK&version=v1.1.0
        rowMarkup = '<tr>';
        rowMarkup += '<td><a href="#" data-code="'+recipe.flow_input+'" data-uuid="'+recipe.id+'" data-country="'+recipe.region_inflow+'">' + recipe.flow_input + '</a></td>';
        rowMarkup += '<td>' + (recipe.region_inflow || '') + '</td>';
        rowMarkup += '<td class="input-flow">';

        rowMarkup += '<span class="inflow-value">' + (recipe.value_inflow ? recipe.value_inflow.toFixed(4) : '') + '</span>';
        rowMarkup += '<span class="inflow-unit">' + (recipe.unit_inflow || '') + '</span>';

        rowMarkup += '</td>';
        rowMarkup += '<td>' + (recipe.value_emission ? recipe.value_emission.toFixed(4) : '') + '</td>';
        rowMarkup += '</tr>';

        if (recipe.flow_input.toLowerCase() === "other") {
            otherRowMarkup = rowMarkup; // Store "other" row separately
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

    jQuery('.search-result > .col:'+whichChild+' .emissions-table tbody').html(tableMarkup);

    adt_switch_between_recipe_items();

    if (boxToUpdate === 'comparison') {
        whichChild = 'nth-child(2)';
    }

    // If unit is changed, then get new information from API
    // let newTableMarkup = '';

    // console.log(isChanged);
    // if (isChanged) {
    //     jQuery.ajax({
    //         type: 'POST',
    //         url: localize._ajax_url,
    //         data: {
    //             _ajax_nonce: localize._ajax_nonce,
    //             action: 'adt_get_updated_recipe_info',
    //             unitInflow: unit,
    //             productCode: dataArray.flow_code,
    //             country: chosenCountry,
    //             version: newestVersion,
    //         },
    //         beforeSend: function() {
    //             jQuery('.search-result > .col:'+whichChild+' .emissions-table tbody').html('');
    //         },
    //         success: (response) => {
    //             let newRecipeArray = response.data;

    //             console.log(newRecipeArray);

    //             jQuery.each(newRecipeArray, function(index, recipe) {
    //                 newTableMarkup += '<tr>';
    //                 newTableMarkup += '<td><a href="#">' + recipe.flow_input + '</a></td>';
    //                 newTableMarkup += '<td>' + recipe.region_inflow + '</td>';
    //                 newTableMarkup += '<td>' + recipe.value_inflow + '</td>';
    //                 newTableMarkup += '<td>' + recipe.value_emission + '</td>';
    //                 newTableMarkup += '</tr>';
    //             });
            
    //             if (boxToUpdate === 'comparison') {
    //                 whichChild = 'nth-child(2)';
    //             }

    //             // Insert new markup here
    //             jQuery('.search-result > .col:'+whichChild+' .emissions-table tbody').html(newTableMarkup);
    //         }
    //     });
    // }
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
    });
}

function adt_save_search_history_on_click(data)
{
    let dummyData = {
        amount_chosen: "1",
        amount_chosen_compared: "2",
        content: "Cauliflowers and broccoli, market of",
        content_compared: "Cucumbers and gherkins, market of",
        footprint: "product",
        footprint_climate_metrics: "gwp100",
        footprint_climate_metrics_compared: "gwp100",
        footprint_compared: "product",
        footprint_country: "AT",
        footprint_country_compared: "DK",
        footprint_type: "product",
        footprint_type_compared: "product",
        footprint_year: "2016",
        footprint_year_compared: "2016",
        product_code: "M_Cauli",
        product_code_compared: "M_Cucus",
        title: "Cauliflowers and broccoli, market of",
        title_compared: "Cucumbers and gherkins, market of",
        unit_chosen: "tonnes",
        unit_chosen_compared: "Meuro",
    };

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