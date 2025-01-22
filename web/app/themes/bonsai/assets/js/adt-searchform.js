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

                    adt_get_product_info(selectedText, $input.data('code'), $input.data('uuid'), chosenValuesArray);
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

            localStorage.setItem("footprint_data", JSON.stringify(dataArray));

            jQuery('p.product-title').each(function() {
                jQuery(this).text(dataArray.title);
            });

            var element = '';
            jQuery('.search-result').each(function() {
                element = jQuery(this);
                jQuery(dataArray.all_data).each(function(i) {
                    // console.log(dataArray.all_data[i].id);
                    jQuery(element).attr('data-set-'+i, dataArray.all_data[i].id);
                });
            });
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
    //         console.log(response);
    //     }
    // });

    // return productInfo;
}

function adt_get_chosen_values()
{
    let chosenArray = [];

    chosenArray['footprint_type'] = jQuery('#footprint-type').val();
    chosenArray['footprint_location'] = jQuery('#location').val();
    chosenArray['footprint_year'] = jQuery('#year').val();

    adt_update_tags();

    return chosenArray;
}

function adt_update_tags()
{
    let typeValue = jQuery('#footprint-type option:selected').val();
    let type = 'Cradle to gate';

    if (typeValue === 'market') {
        type = 'Cradle to consumer';
    }

    let country = jQuery('#location option:selected').text();
    let year = jQuery('#year option:selected').text();

    jQuery('.product-tag.footprint-type').each(function() {
        jQuery(this).text(type);
    });

    jQuery('.product-tag.country').each(function() {
        jQuery(this).text(country);
    });

    jQuery('.product-tag.year').each(function() {
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