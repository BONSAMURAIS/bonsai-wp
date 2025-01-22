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

                        adt_get_product_info(match.word, match.code, match.uuid);
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

                    console.log($input.val());

                    adt_get_product_info(selectedText, $input.data('code'), $input.data('uuid'));
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


function adt_get_product_info(productTitle, productCode, productUuid) 
{
    jQuery.ajax({
        type: 'POST',
        url: localize._ajax_url,
        data: {
            _ajax_nonce: localize._ajax_nonce,
            action: 'adt_get_product_recipe',
            title: productTitle,
            code: productCode,
            uuid: productUuid,
        },
        beforeSend: function() {
            
        },
        success: (response) => {
            console.log(response);
        }
    });

    return productInfo;
}