jQuery(document).ready(function($){
    $('.co2-form input[name="switch-one"]').on('change', function(){
        let isChecked = $(this).is(':checked');

        if (isChecked) {
            let value = $(this).val();

            $('input.search').attr('placeholder', 'Find footprint by '+value);
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

    $(searchform.products).each(function() {
        productTitleArray.push(this.title);
        productContentArray.push(this.content);
        productCodeArray.push(this.code);
        productUuidArray.push(this.uuid);    
    });

    const words = productTitleArray;
    const $input = $('#autocomplete-input');
    const $suggestionsWrapper = $('#suggestions-wrapper');
    const $suggestions = $('#suggestions');
    let currentIndex = -1; // To track the currently marked suggestion
    let suggestionSelected = false; // Tracks if a suggestion was selected
    // Get default chosen values
    let chosenValuesArray = adt_get_chosen_values();

        
    $input.on('input', function () {
        const query = $input.val().toLowerCase();
        const matches = words
            .map((word, index) => ({ word, code: productCodeArray[index], uuid: productUuidArray[index] }))
            .filter(item => item.word.toLowerCase().includes(query));
        $suggestions.empty();
        currentIndex = -1; // Reset the index when typing
        suggestionSelected = false; // Reset the selection state

        if (matches.length > 0 && query) {
            $(this).css('border-radius', '50px 50px 0 0');

            var screenWidth = $(window).width();
            if (screenWidth < 768) {
                $(this).css('border-radius', '22.5px 22.5px 0 0');
            }

            $(this).css('border-bottom', 'none');
            $suggestionsWrapper.show();
            matches.forEach(match => {
                const $div = $('<div>')
                    .text(match.word)
                    .addClass('suggestion-item')
                    .attr('data-code', match.code)
                    .attr('data-uuid', match.uuid)
                    .on('click', function () {
                        $input.val(match.word);
                        $input.attr('data-code', match.code); // Set the product code as data attribute
                        $input.attr('data-uuid', match.uuid); // Set the product UUID as data attribute
                        $suggestionsWrapper.hide();

                        // Update chosen values
                        chosenValuesArray = adt_get_chosen_values();

                        adt_get_product_info(match.word, match.code, match.uuid, chosenValuesArray);

                    });
                $suggestions.append($div);
            });
        } else {
            $(this).css('border-radius', '50px');
            $(this).css('border-bottom', '1px solid #ddd');

            $suggestionsWrapper.hide();
        }
    });

    $input.on('keydown', function(e) {
        const $items = $suggestions.find('.suggestion-item');
        if ($items.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentIndex = (currentIndex + 1) % $items.length; // Move down
                markCurrentItem($items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentIndex = (currentIndex - 1 + $items.length) % $items.length; // Move up
                markCurrentItem($items);
            } else if (e.key === 'Enter') {
                if (currentIndex >= 0) {
                    e.preventDefault(); // Prevent form submission when selecting a suggestion
                    const selectedText = $items.eq(currentIndex).text();
                    $input.val(selectedText);
                    $input.attr('data-code', $items.eq(currentIndex).data('code'));
                    $input.attr('data-uuid', $items.eq(currentIndex).data('uuid'));
                    $suggestionsWrapper.hide();
                    $($input).css('border-radius', '50px');
                    $($input).css('border-bottom', '1px solid #ddd');

                    suggestionSelected = true; // Mark a suggestion as selected

                    // Update chosen values
                    chosenValuesArray = adt_get_chosen_values();

                    adt_get_product_info(selectedText, $input.attr('data-code'), $input.attr('data-uuid'), chosenValuesArray);

                    } else if (suggestionSelected) {
                    suggestionSelected = false; // Allow form submission on next Enter press
                }
            }
        }
    });

    $(document).on('click', function(e) {
        if (!$(e.target).is($input)) {
            $suggestionsWrapper.hide();
            $($input).css('border-radius', '50px');
            $($input).css('border-bottom', '1px solid #ddd');
        }
    });

    function markCurrentItem($items) {
        $items.removeClass('highlight'); // Remove highlight from all items
        if (currentIndex >= 0) {
            $items.eq(currentIndex).addClass('highlight'); // Highlight the current item
        }
    }

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

            // Error message
            if (!dataArray.title) {
                jQuery('.error-message').slideDown('fast');
                return;
            } else {
                jQuery('.error-message').slideUp('fast');
            }

            localStorage.setItem("footprint_data", JSON.stringify(dataArray));

            let compareButtons = jQuery('.search-result .col:last-child').find('a.col-inner');
            if (compareButtons.length > 0) {
                adt_update_original_info(dataArray);
            } else {
                adt_update_comparison_info(dataArray);
            }

            adt_show_search_results();
        }
    });

    // jQuery.ajax({
    //     type: 'POST',
    //     url: localize._ajax_url,
    //     data: {
    //         _ajax_nonce: localize._ajax_nonce,
    //         action: 'adt_get_product_recipe',
    //         title: productTitle,
    //         code: productCode,
    //         uuid: productUuid,
    //     },
    //     beforeSend: function() {
            
    //     },
    //     success: (response) => {
    //     }
    // });

    // return productInfo;

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
}

function adt_get_chosen_values()
{
    let chosenArray = [];

    chosenArray['footprint_type'] = jQuery('#footprint-type').val();
    chosenArray['footprint_location'] = jQuery('#location').val();
    chosenArray['footprint_year'] = jQuery('#year').val();

    return chosenArray;
}

function adt_update_tags(boxToUpdate)
{
    let typeValue = jQuery('#footprint-type option:selected').val();
    let type = 'Cradle to gate';
    
    if (typeValue === 'market') {
        type = 'Cradle to consumer';
    }
    
    let country = jQuery('#location option:selected').text();
    let year = jQuery('#year option:selected').text();
    
    let whichChild = ':first-child';
    
    if (boxToUpdate === 'comparison') {
        whichChild = ':last-child';
    }

    jQuery('.search-result > .col'+whichChild+' .product-tag.footprint-type').each(function() {
        jQuery(this).text(type);
    });

    jQuery('.search-result > .col'+whichChild+' .product-tag.country').each(function() {
        jQuery(this).text(country);
    });

    jQuery('.search-result > .col'+whichChild+' .product-tag.year').each(function() {
        jQuery(this).text(year);
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
    });

    var element = '';
    jQuery('.search-result .col:first-child').each(function() {
        // This loops over the basic and advanced search result
        element = jQuery(this);
        jQuery(element).find('select.unit').empty();

        jQuery(dataArray.all_data).each(function(i) {
            let unit = 'kg';

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
            numberValueInCurrency = numberValueInCurrency.toFixed(2);

            jQuery(element).find('.product-result').text(numberValueInCurrency);
            jQuery(element).find('.product-result-unit').text('price CO2eq'); // ???
        }

        if (defualtValue === 'tonnes') {
            // Number in tonnes. It has to be converted to kg
            let numberValueInWeight = dataArray.all_data[0].value;
            // Overwriting Number with the new value in kg
            numberValueInWeight = numberValueInWeight * 1000;
            numberValueInWeight = numberValueInWeight.toFixed(2);

            jQuery(element).find('.product-result').text(numberValueInWeight);
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
                    numberValueInCurrency = numberValueInCurrency.toFixed(2);

                    let numberInput = jQuery('.amount', newElement).val();
                    console.log(numberInput);
    
                    jQuery(newElement).find('.product-result').text(numberValueInCurrency);
                    jQuery(newElement).find('.product-result-unit').text('price CO2eq'); // ???
                    defaultValue = parseFloat(jQuery('.product-result', newElement).text());
                }
    
                if (chosenValue === 'tonnes') {
                    // Number in tonnes. It has to be converted to kg
                    let numberValueInWeight = dataArray.all_data[0].value;
                    // Overwriting Number with the new value in kg
                    numberValueInWeight = numberValueInWeight * 1000;
                    numberValueInWeight = numberValueInWeight.toFixed(2);

                    let numberInput = jQuery('.amount', newElement).val();
                    console.log(numberInput);
    
                    jQuery(newElement).find('.product-result').text(numberValueInWeight);
                    jQuery(newElement).find('.product-result-unit').text('kg CO2eq');
                    defaultValue = parseFloat(jQuery('.product-result', newElement).text());
                }
            });
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
            });
        });
    });

}

// Comparison code
jQuery(document).ready(function($){
    $('a:has(.add)').click(function(e){
        e.preventDefault();

        $('.search-result').each(function() {
            let original = $(this).find('.col:first-child');
            let clone = original.clone();
            
            original.after(clone);
            clone.append('<span class="close-god-damn"></span>');
            $('a:has(.add)').closest('.col').css('display', 'none');

            $('.close-god-damn').click(function(){
                $('.close-god-damn').each(function(){
                    $(this).closest('.col').remove();
                });

                $('a:has(.add)').closest('.col').css('display', 'flex');
            });
        });
    });
});

function adt_update_comparison_info(dataArray)
{
    localStorage.getItem("footprint_data");

    adt_update_tags('comparison');

    jQuery('.search-result .col:last-child p.product-title').each(function() {
        jQuery(this).text(dataArray.title);
    });

    var element = '';
    jQuery('.search-result .col:last-child').each(function() {
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

        console.log(defualtValue);

        if (defualtValue === 'Meuro') {
            let numberValueInCurrency = dataArray.all_data[1].value;
            numberValueInCurrency = numberValueInCurrency.toFixed(2);

            jQuery(element).find('.product-result').text(numberValueInCurrency);
            jQuery(element).find('.product-result-unit').text('price CO2eq'); // ???
        }

        if (defualtValue === 'tonnes') {
            // Number in tonnes. It has to be converted to kg
            let numberValueInWeight = dataArray.all_data[0].value;
            // Overwriting Number with the new value in kg
            numberValueInWeight = numberValueInWeight * 1000;
            numberValueInWeight = numberValueInWeight.toFixed(2);

            jQuery(element).find('.product-result').text(numberValueInWeight);
            jQuery(element).find('.product-result-unit').text('kg CO2eq');
        }

        jQuery(element).find('select.unit').on('change', function() {
            let chosenValue = jQuery(this).val();
            
            jQuery('.search-result .col:last-child select.unit').each(function(){
                jQuery(this).val(chosenValue);

                let newElement = jQuery(this).closest('.col-inner');

                if (chosenValue === 'Meuro') {
                    let numberValueInCurrency = dataArray.all_data[1].value;
                    numberValueInCurrency = numberValueInCurrency.toFixed(2);
    
                    jQuery(newElement).find('.product-result').text(numberValueInCurrency);
                    jQuery(newElement).find('.product-result-unit').text('price CO2eq'); // ???
                }
    
                if (chosenValue === 'tonnes') {
                    // Number in tonnes. It has to be converted to kg
                    let numberValueInWeight = dataArray.all_data[0].value;
                    // Overwriting Number with the new value in kg
                    numberValueInWeight = numberValueInWeight * 1000;
                    numberValueInWeight = numberValueInWeight.toFixed(2);
    
                    jQuery(newElement).find('.product-result').text(numberValueInWeight);
                    jQuery(newElement).find('.product-result-unit').text('kg CO2eq');
                }
            });
        });
    });
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
jQuery(document).ready(function ($) {
    $(".download .button").click(function (e) {
        e.preventDefault();
        
        let csvContent = "";
        
        $(this).closest('.col-inner').find('.emissions-table tr').each(function () {
            let rowData = [];
            
            $(this).find("th, td").each(function () {
                rowData.push($(this).text());
            });

            csvContent += rowData.join(",") + "\n";
        });

        let blob = new Blob([csvContent], { type: "text/csv" });
        let url = URL.createObjectURL(blob);
        let a = $("<a></a>")
            .attr("href", url)
            .attr("download", "table_data.csv")
            .appendTo("body");

        a[0].click();
        a.remove();
    });
});