import UserSelection from '../../model/user_selection.js'; 
import * as CONST from '../../constants/constants.js'; 
import * as Utils from '../../utils/tools.utils.js';
import * as API from '../../utils/api-call.utils.js'; 

// Makes sure to run the function when users go back and forth in browser
window.addEventListener('popstate', async function(event) {
    const params = new URLSearchParams(window.location.search);
    const base64String = params.get('data');

    if (base64String) {
        init_form();
    }
});

function copyTile(){
    let original = jQuery('#product-analysis-content');
    let clone = original.clone();
    const suffix = '-compared';
    
    clone.find('.switch-field-container-contri-analysis').first().children().each(function(){
        if (jQuery(this).is('input')) {
            const currentId = jQuery(this).attr('id');
            if (currentId) {
                jQuery(this).attr('id', currentId + suffix);
            }
        } else if (jQuery(this).is('label')) {
            const currentFor = jQuery(this).attr('for');
            if (currentFor) {
                jQuery(this).attr('for', currentFor + suffix);
            }
        }
    });

    clone.find('.unit-select-wrapper').first().children().each(function(){
        if (jQuery(this).is('input') || jQuery(this).is('select')) {
            const currentId = jQuery(this).attr('id');
            if (currentId) {
                jQuery(this).attr('id', currentId + suffix);
            }
        } else if (jQuery(this).is('label')) {
            const currentFor = jQuery(this).attr('for');
            if (currentFor) {
                jQuery(this).attr('for', currentFor + suffix);
            }
        }
    });

    clone.find("#unit").first().attr('id', "unit" + suffix);

    clone
        .hide() //init hide behind add-btn
        .removeAttr("id")
        .attr("id","compared-product-analysis-content")
        .addClass("search-result")
        .appendTo("#compared-product-analysis");
}

jQuery(document).ready(function($){
    let userSelection = new UserSelection();
    let data;

    const params = new URLSearchParams(window.location.search);
    const base64String = params.get('data');

    if (base64String) {
        init_form();
    }

    copyTile();

    $('input[name="footprint_type"]').on('change',async function(){
        let isChecked = $(this).is(':checked');
        
        if (isChecked) {
            let value = $(this).val();

            $('input[name="search"]').attr('placeholder', 'Find footprint by '+value);

            $('#footprint-type .radio-choice').each(function(){
                $(this).toggle();
            });
            $('#most-popular-wrapper').toggle();
            $('#product-tab').toggle();
            $('#person-tab').toggle();
            if (value === 'person') {
                $('#grave').prop('checked', true).trigger('change');
            } else {
                $('#market').prop('checked', true).trigger('change'); // Fix applied here
            }
        }
    });

    $('input[name="contri-analysis"]').on('change', function(){
        let isChecked = $(this).is(':checked');

        if (isChecked) {
            const value = $(this).val();
            const displayValue = value == 'advanced' ? 'flex' : 'none';
            $(this).closest('.tile').find('.contribution-analysis').first().css('display', displayValue);
        }
    });

    let productTitleArray = [];
    let productContentArray = [];
    let productCodeArray = [];
    let productUuidArray = [];
    let chosenFootprintType = $('input[name="footprint_type_extend"]:checked').val();

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
    $('input[name="footprint_type_extend"]').on('change', function() {
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

    });

    adt_dynamic_search_input(productTitleArray, productCodeArray, productUuidArray);

    $('#most-popular ul li button, #search-history-list li').on('click', async function() {
        let productTitle = $(this).text();
        let productCode = $(this).data('code');
        let productUuid = $(this).data('uuid');
        userSelection.get_from_form();
        userSelection.set_product(productTitle,productCode,productUuid);
        let selectedValue = $('input[name="footprint_type"]:checked').val();

        $('#autocomplete-input').val(productTitle);

        console.log("START popular/ history click")
        
        adt_push_parameter_to_url(userSelection);
        let data = await API.get_product_footprint(userSelection);

        if(selectedValue === 'person'){
            data['title'] = "Person in " + Utils.capitalize(userSelection.country) + " - " + userSelection.year;
        }

        await display_result("#product-analysis-content",data);
        adt_save_local_search_history(userSelection);
        console.log("END popular click")
    });

    adt_download_recipe_csv();

    $('.share-icon').on('click', async function() {
        let productTitle = $('.search-result.basic .col:first-child p.product-title').text();
        let productFootprint = $('input[name="footprint_type"]').val();
        let FootprintView = $('input[name="contri-analysis"]').val();
        let productFootprintType = $('.search-result > .col:first-child .footprint-type').attr('data-type');
        let productCode = $('.search-result .col:first-child p.product-title').data('code');
        let country = $('.search-result > .col:first-child .country').attr('data-country');
        let year = $('.search-result > .col:first-child .year').attr('data-year');
        let climateMetrics = $('.search-result > .col:first-child .climate-metrics').attr('data-climate-metrics');
        let databaseVersion = $('.search-result > .col:first-child .version').attr('data-database-version');
        let chosenAmount = $('.search-result > .col:first-child #amount').val();
        let chosenUnit = $('.search-result > .col:first-child .unit').val();

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
            chosenUnitCompare = $('.search-result > .col:nth-child(2) .unit').val();
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

        let search_hist = await API.save_search_history_on_click(data);

        jQuery('#shared-search-box').fadeIn();
        jQuery('#shared-search').val(search_hist);

        jQuery('#copy-search').on('click', function() {
            var $copyText = jQuery('#shared-search');
            $copyText.select();
            $copyText[0].setSelectionRange(0, 99999); // For mobile devices
            document.execCommand('copy');

            jQuery('#shared-search-box').fadeOut();
        });
    });

    adt_initialize_local_search_history();

    // Search 
    $('#btn-search, #search-icon').click(async function(e){
        e.preventDefault();
        let selectedValue = $('input[name="footprint_type"]:checked').val();
        if (selectedValue != 'person' && jQuery('#autocomplete-input').val() ==""){
            let error_msg = jQuery('#error-message');
            error_msg.append("<p id='error-message-content' class='error-message-content-decorator'> Please search for a product or service </p>");
            error_msg.slideDown('fast');
            setTimeout(function () {
                error_msg.slideUp('slow');
                jQuery("#error-message-content").remove();
            }, CONST.ANIM.DURATION); //remove message after 0.5s
            return
        }
        
        console.log('Start searching');
        let userSelection = new UserSelection;
        userSelection.get_from_form();
        data = (selectedValue === 'person') ? await API.get_person_footprint(userSelection) : await API.get_product_footprint(userSelection);

        if(selectedValue === 'person'){
            data['title'] = "Person in " + Utils.capitalize(userSelection.country) + " - " + userSelection.year;
        }
        adt_push_parameter_to_url(userSelection);
        await display_result("#product-analysis-content",data);
        console.log('END searching');
    });
    
    // Search 
    $('#btn-add-comparison, #add-btn').click(async function(e){
        e.preventDefault();
        let selectedValue = $('input[name="footprint_type"]:checked').val();
        if (jQuery('#autocomplete-input').val() =="" && selectedValue != 'person'){
            let error_msg = jQuery('#error-message');
            error_msg.append("<p id='error-message-content' class='error-message-content-decorator'> Please search for a product or service </p>");
            error_msg.slideDown('fast');
            setTimeout(function () {
                error_msg.slideUp('slow');
                jQuery("#error-message-content").remove();
            }, CONST.ANIM.DURATION); //remove message after 0.5s
            return
        }
        
        console.log('Start searching for comparison');
        let userSelection = new UserSelection;
        userSelection.get_from_form();
        console.log("userSelection=", userSelection.to_string())
        
        data = (selectedValue === 'person') ? await API.get_person_footprint(userSelection) : await API.get_product_footprint(userSelection);
        if(selectedValue === 'person'){
            data['title'] = "Person in " + Utils.capitalize(userSelection.country) + " - " + userSelection.year;
        }
        
        let hasResult = await display_result("#compared-product-analysis-content",data);
        
        if (hasResult){
            adt_push_parameter_to_url(userSelection);
            $("#add-btn").hide();
            $("#compared-product-analysis-content").show();
            // $('#uncertainty-wrapper').slideDown();
        }

        console.log('END searching for comparison');
    });

    $(".adt-close").click(function(e){
        e.preventDefault();
        
        // $('#uncertainty-wrapper').slideUp();
        
        let addBtn = $("#add-btn");
        console.log("target e.target.closest(.tile)=",e.target.closest(".tile"))
        if (!addBtn.is(':hidden')){
            Utils.hide_search_results('#co2-form-result');
            return;
        }

        let tile = $(e.target).closest(".tile-wrapper");
        console.log("tile=",tile);
        if (tile.attr("id")=="product-analysis-content"){
            tile.empty();//issue here with the button basic-advanced: the elements are not recognized by the document
            let copy = $("#compared-product-analysis-content").children().first();
            removeSuffix(copy);
            copy.appendTo("#"+tile.attr("id"));
            $("#add-btn").show();
            $("#compared-product-analysis-content").remove();
            copyTile();

            return;
        }
        tile.hide();
        $("#add-btn").show();
        // $("#compared-product-analysis-content").hide();
    });

    function removeSuffix(clone){
        const suffix = '-compared';

        clone.find('.switch-field-container-contri-analysis').first().children().each(function(){
            if (jQuery(this).is('input')) {
                let currentId = jQuery(this).attr('id');
                if (currentId) {
                    currentId = currentId.replace(suffix, "");
                    jQuery(this).attr('id', currentId);
                }
            } else if (jQuery(this).is('label')) {
                let currentFor = jQuery(this).attr('for');
                if (currentFor) {
                    currentFor = currentFor.replace(suffix, "");
                    jQuery(this).attr('for', currentFor);
                }
            }
        });
        
        clone.find('.unit-select-wrapper').children().each(function(){
            if (jQuery(this).is('input') || jQuery(this).is('select')) {
                let currentId = jQuery(this).attr('id');
                console.log("currentId=",currentId)
                if (currentId) {
                    currentId = currentId.replace(suffix, "");
                    jQuery(this).attr('id', currentId);
                }
            } else if (jQuery(this).is('label')) {
                let currentFor = jQuery(this).attr('for');
                if (currentFor) {
                    currentFor = currentFor.replace(suffix, "");
                    jQuery(this).attr('for', currentFor);
                    jQuery(this).children().each(function(){
                        if (jQuery(this).is('input') || jQuery(this).is('select')) {
                            let currentId = jQuery(this).attr('id');
                            console.log("currentId=",currentId)
                            if (currentId) {
                                currentId = currentId.replace(suffix, "");
                                jQuery(this).attr('id', currentId);
                            }
                        }
                    })
                }
            }
        });
    }

    //observe on_change elements
    jQuery('#co2-form-result').find('select.unit').on('change', function () {

        let unitSelect = jQuery(this);
        let unitRatio = unitSelect.val();
        let unitRatio_name = unitSelect.find('option:selected').text();
        let amountInput = unitSelect.closest('.unit-select-wrapper')      // go up to the label wrapping <select>
                                    .find('input.quantity');        // look inside for input.amount
        let numberInput = amountInput.val();
        let co2_result = unitSelect.closest('div.choices')      // go up to the div wrapping 
                                    .find('p.co2-value');        // look inside for p.co2-value
        const co2_result_value = parseFloat(co2_result.data('normal_value'));

        let calculatedValue = co2_result_value * numberInput * unitRatio;
        let formattedCalculatedValue = Utils.reformatValue(calculatedValue);

        co2_result.text(formattedCalculatedValue);
        co2_result.css("width","fit-content");
        co2_result.each(function(index, text) { 
            Utils.resizeTextToFit(text);
        });

        amountInput.val(numberInput);//keep value in input
        
        //TODO add EUR and DKK values in data-attr
        // unitSelect.each(async function () { 
        //     for (const item of data.all_data) {
        //         //issue on code region selected. it is currently random
        //         console.log("item=",item)
        //         console.log("item.value=",item.value)
        //         console.log("item.value*ratio=",item.value*unitRatio)
        //         if (item.unit_reference == CONST.UNIT.DKK){
        //             if (unitRatio_name.includes(CONST.UNIT.DKK)){ //TODO to rafactor
        //                 finalAmount = item.value*unitRatio*currentAmount;
        //                 break;
        //             } else if (unitRatio_name.includes(CONST.UNIT.EUR)){
        //                 finalAmount = item.value*unitRatio*currentAmount;
        //                 break;
        //             }
        //         }
        //         finalAmount = item.value*unitRatio*currentAmount;
        //     }
        // });
    });

    
    function controlInput_value(OBJ){
        let val = OBJ.val();

        // Remove all characters except digits and dot
        val = val.replace(/[^0-9.]/g, '');

        // Allow only one dot
        const parts = val.split('.');
        if (parts.length > 2) {
            val = parts[0] + '.' + parts.slice(1).join('');
        }

        // Limit digits before decimal to 6
        if (parts[0].length > 6) {
            parts[0] = parts[0].substring(0, 6);
            OBJ.closest('.unit-select-wrapper').append('<span class="error-message" style="color: red; position:absolute; top:45px;">Maximum value exceeded</span>');
            setTimeout(() => {
                jQuery('.error-message').fadeOut(CONST.ANIM.DURATION, function() {
                    jQuery(this).remove();
                });
            }, 1000);
        }

        // Limit digits after decimal to 3
        if (parts[1] && parts[1].length > 3) {
            parts[1] = parts[1].substring(0, 3);
        }

        val = parts[1] !== undefined ? parts[0] + '.' + parts[1] : parts[0];

        // Update the input value if changed
        if (val !== OBJ.val()) {
            OBJ.val(val);
        }
    }

    $('input.quantity').on('input', function() {
        controlInput_value($(this));
        let amountInput = $(this);
        let co2_result = amountInput.closest('div.choices')      // go up to the div wrapping 
                                .find('p.co2-value');        // look inside for p.co2-value
        const co2_result_value = parseFloat(co2_result.data('normal_value'));

        let unitSelect = amountInput.closest('div.unit-select-wrapper')      // go up to the div wrapping 
                                .find('select.unit');        // look inside for p.co2-value
        const unitRatio = unitSelect.val();
        // let unitRatio_name = unitSelect.find('option:selected').text();
        // console.log("unitRatio , unitRatio_name = ", unitRatio, unitRatio_name)
        
        let calculatedValue = co2_result_value * amountInput.val() * unitRatio;
        let formattedCalculatedValue = Utils.reformatValue(calculatedValue);

        co2_result.text(formattedCalculatedValue);
        co2_result.css("width","fit-content");
        co2_result.each(function(index, text) { 
            Utils.resizeTextToFit(text);
        });

        amountInput.val(amountInput.val());//keep value in input
    });

    //listener on click emissions-table items 
    jQuery(document).on('click','span.link', async function(e) {
        e.preventDefault();
        let productTitle = jQuery(this).text();
        let productCode = jQuery(this).data('code');
        let productUuid = jQuery(this).data('uuid');
        let countryCode = jQuery(this).data('countryCode');
        let country = jQuery(this).data('country');
        let year = jQuery(this).data('year');
        let metric = jQuery(this).data('metric');

        let userSelection = new UserSelection;
        userSelection.set_product(productTitle,productCode,productUuid);
        userSelection.climate_metric = metric;
        userSelection.year = year;
        userSelection.countryCode = countryCode;
        userSelection.country = country;
        try {
            let data = await API.get_product_footprint(userSelection); //can only be footprint
            const htmlclass = "#"+jQuery(this).closest(".tile-wrapper").attr('id');
            await display_result(htmlclass,data);
            // adt_save_local_search_history(userSelection);
        } catch (err) {
            console.error('Error in async handler:', err);
        }

        // // Jump to new page, so you both can share the URL and go back in browser, if you want to go back to previous state
        // const href = jQuery(this).attr('href');
        // history.pushState(null, '', href);
    });

    //hide/display arrow
    $('label.select').each(function() {
        let listOptions = $(this).find('option');
        if (listOptions.length <= 1){
            let arrowImg = $(this).children(':nth-child(2)');
            arrowImg.hide();
            $(this).prop('disabled', true);
        }
    });

});


async function display_result(htmlclass, data){
    console.log("Start display data")
    console.log("data=",data)

    //error management
    let error_msg = jQuery('#error-message');
    if (data && (data.error && data.error.includes("Product not found") || data.title == "")) {
        error_msg.append("<p id='error-message-content' class='error-message-content-decorator' >Selected footprint doesn't exist in the database. Try selecting a different product, location or footprint type.</p>");
        error_msg.slideDown('fast');
        return false;
    }

    //data has been found
    jQuery("#error-message-content").remove();
    error_msg.slideUp('fast');

    Utils.show_search_results('#co2-form-result');

    //summary information
    let main_component = jQuery(htmlclass);
    //set title
    main_component.find('.product-title').first().text(Utils.capitalize(data["title"]));
    //set tags
    //TODO hardcode replacement
    let dataCode = data['flow_code'];
    if (dataCode){
        if (dataCode.includes("M_")) {
            data['footprint-type'] = 'Cradle to consumer';
            data['footprint-type-label'] ='Cradle to consumer';
        } else if (dataCode.includes('C_') || dataCode.includes('EF_') || dataCode.includes('A_')) {
            data['footprint-type'] = 'Cradle to gate';
            data['footprint-type-label'] = 'Cradle to gate';
        } else if (dataCode.includes("F_")) {
            data['footprint-type'] = 'Cradle to grave';
            data['footprint-type-label'] = 'Cradle to grave';
        }
    }
    main_component.find('.footprint-type').first().text(data['footprint-type-label']);
    //endTODO hardcode replacement
    main_component.find('.climate-metric').first().text(data.metric);
    main_component.find('.year').first().text(data["year"]);
    main_component.find('.country').first().text(data["country"]);
    main_component.find('.version').first().text(data["version"]);
    //set value
    main_component.find('.co2-value').first().text(Utils.reformatValue(data["value"]));
    main_component.find('.co2-value').first().data("normal_value",Utils.reformatValue(data["value"]));
    main_component.find('.co2-value-unit').first().text(CONST.UNIT.KGCO2); //use of dataArray.unit_emission?
    let unit_options = main_component.find('select.unit'); 
    unit_options.empty();
    const unit_ref = data.unit_reference;
    //set unitList
    const unitList = Utils.getUnitOptions(data, unit_ref);
    for (const unit of unitList){
        unit_options.append(`<option value="${unit['ratio']}">${unit['label']}</option>`);
    }
    if (unitList.length>1){
        jQuery('.unit-arrow').each(function(index, arrow) {
            arrow.style.display = 'block';
        })
    }else{
        jQuery('.unit-arrow').each(function(index, arrow) {
            arrow.style.display = 'none';
        })

    }

    //recipe
    let tableMarkup = '';
    let otherRowMarkup = '';
    let rowMarkup = '';
    let recipeArray = data.recipe;
    if (recipeArray.error){
        return true;
    }

    for (const recipe of recipeArray) {
        //preprocessing recipe data
        // Add to URL
        const jsonString = JSON.stringify(recipe);
        const base64String = btoa(jsonString);  // Convert to base64
        const getParameter = `?data=${base64String}`;

        let updatedInflow = '';

        // If unit_inflow "Meuro" per tonnes convert to Euro per kg
        if (recipe.unit_inflow === CONST.UNIT.MEURO) {
            updatedInflow = recipe.value_inflow * 1000;
            recipe.value_emission = recipe.value_emission * 1000;
            recipe.unit_inflow = CONST.UNIT.EUR;
        }

        // If unit_inflow "tonnes" per tonnes convert to kg per kg (same number)
        if (recipe.unit_inflow === CONST.UNIT.TONNES) {
            recipe.unit_inflow = CONST.UNIT.KG;
        }
        
        // If unit_inflow "TJ" per tonnes with electricity convert to kWh per kg
        if (recipe.unit_inflow === CONST.UNIT.TJ){
            let final_unit = ""; 
            if(recipe.flow_reference.includes('electricity')) {
                final_unit = CONST.UNIT.KWH;
            }else{
                final_unit = CONST.UNIT.MJ;
                recipe.value_emission = recipe.value_emission * 1000;
            }
            recipe.unit_inflow = final_unit;
            updatedInflow = API.get_converted_number_by_units(CONST.UNIT.TJ, CONST.UNIT.MJ, recipe.value_inflow);
            // Wait for the conversion to complete before continuing
            if (!updatedInflow) {
                console.error('Conversion failed for '+CONST.UNIT.TJ+'to'+ final_unit);
                return false;
            }
        }

        // If unit_inflow "item" per tonnes just convert tonnes to kg
        if (recipe.unit_inflow === 'item') {
            recipe.value_emission = recipe.value_emission * 1000;
        }

        // If unit_inflow "ha*year" per tonnes convert tonnes to kg
        // And convert "ha*year" to "m²*year"
        if (recipe.unit_inflow === CONST.UNIT.HA_PER_YEAR) {
            recipe.unit_inflow = CONST.UNIT.M2_PER_YEAR;
            updatedInflow = recipe.value_inflow * 10;
            recipe.value_emission = recipe.value_emission;
        }
        //end preprocessing
        
        //Create rows
        rowMarkup = '<tr>';//country = recipe.region_inflow or recipe.region_reference?
        rowMarkup += '<td><span class="link" data-href="' +getParameter+ ' " data-code="'+recipe.flow_input+'" data-uuid="'+recipe.id+'" data-country-code="'+recipe.region_inflow+'" data-year="'+"2016"+'" data-metric="'+recipe.metric+'">' + "WILL_BE_UPDATED" + '</span></td>';
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

        if (recipe.flow_input != null && (recipe.flow_input.toLowerCase() === "other" || recipe.flow_input.toLowerCase() === "direct")){
            otherRowMarkup += rowMarkup; // Store "other" row separately
        } else {
            tableMarkup += rowMarkup; // Append all other rows normally
        }
        //end Create rows
    };//end loop on recipeArray

    // Append "other" row at the end if it exists
    tableMarkup += otherRowMarkup;

    // Display the table
    let recipeTable = main_component.find('.emissions-table').first();
    recipeTable.find('tbody').html(tableMarkup);

    // Convert the product code to product name
    recipeTable.find('tbody tr').each(async function(){
        let productCode = jQuery(this).find('span').data('code');
        let productTitle = "";
        if (productCode.toLowerCase() === "other" || productCode.toLowerCase() === "direct"){
            productTitle = productCode;
        }else{
            productTitle = await API.get_product_name_by_code_api(productCode);
        }
        let countryCode = jQuery(this).find('span').data('country-code');
        let country = "NULL";
        if (countryCode != null){
            country = await API.get_country_name_by_code(countryCode);
        }

        jQuery('td span[data-code="'+productCode+'"]').text(Utils.capitalize(productTitle));
        jQuery('td span[data-code="'+productCode+'"]').data('country',country);
        console.log("countryCode, country="+countryCode +" -> "+country)
        console.log("productcode, productTitle="+productCode + " -> "+productTitle)
    });

    // Remove previous click handlers to avoid stacking events
    recipeTable.find('thead th').off('click');

    // Add sorting functionality to table headers
    recipeTable.find('thead th').on('click', function () {
        const header = jQuery(this);
        const columnIndex = header.index();
        const table = header.closest('table');
        const rows = table.find('tbody tr').toArray();

        const isAscending = header.hasClass('ascending');
        header.toggleClass('ascending', !isAscending).toggleClass('descending', isAscending);
        header.siblings().removeClass('ascending descending');

        rows.sort((a, b) => {
            const cellA = jQuery(a).find('td').eq(columnIndex).text().trim();
            const cellB = jQuery(b).find('td').eq(columnIndex).text().trim();

            const valueA = parseFloat(cellA.replace(/[^0-9.-]+/g, '')) || 0;
            const valueB = parseFloat(cellB.replace(/[^0-9.-]+/g, '')) || 0;

            return isAscending ? valueA - valueB : valueB - valueA;
        });

        table.find('tbody').append(rows);
    });

    return true;
}


//TODO to remove. kept for the moment because of the uncertainty
async function adt_update_comparison_info(dataArray = null){
    if (dataArray.all_data) {
        for (const element of jQuery('.search-result .col:first-child')) {
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
                    let numberUncertainty = await API.uncertainty_calculation(originalSample, comparisonSample);
                    // convert number to percentage
                    numberUncertainty = parseFloat(numberUncertainty) * 100;
                    numberUncertainty = Math.round(numberUncertainty * 100) / 100; // Round to two decimal places

                    let uncertaintyBar = jQuery('#uncertainty-bar-background');
                    uncertaintyBar.css('width', numberUncertainty+'%');
                    uncertaintyBar.attr('data-uncertainty', numberUncertainty+'%');

                    jQuery('#uncertainty-wrapper').slideDown();

                    let colorBar = "";
                    if (numberUncertainty < 80) {
                        colorBar = CONST.COLOR.GREEN;
                    } else if (numberUncertainty >= 80 && numberUncertainty < 90) {
                        colorBar = CONST.COLOR.YELLOW;
                    } else {
                        colorBar = CONST.COLOR.RED;
                    }
                    uncertaintyBar.css('background-color', colorBar);

                    if (item.unit_reference === CONST.UNIT.TJ){
                        if(item.description.includes('electricity')){
                            console.log('ELECTRICITY is found');
                            convertedValueForItems = await API.get_converted_number_by_units(CONST.UNIT.TJ, CONST.UNIT.KWH, valueForItems);
                        }else{
                            console.log('does not contain electricity');
                            convertedValueForItems = await API.get_converted_number_by_units(CONST.UNIT.TJ, CONST.UNIT.MJ, valueForItems);
                            convertedValueForItems = convertedValueForItems * 1000; // multiply by 1000 to convert from MJ per tonnes to MJ per kg
                        }
                        item.value = convertedValueForItems;
                    }
                    break;
                }
            }
        }
    }
}

// Download CSV
function adt_download_recipe_csv()
{
    jQuery(".download .button").each(function () {
        jQuery(this).click(function (e) {
            e.preventDefault();

            let productTitle = jQuery(this).closest('.tile').find('.product-title').text();
            let country = jQuery(this).closest('.tile').find('.country').text();
            let version = jQuery(this).closest('.tile').find('.version').text();
            
            let csvContent = "";

            jQuery(this).closest('.tile').find('.emissions-table tr').each(function () {
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
    const $submitBtn = jQuery('#search-icon');
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
                        $input.val(match.word);
                        $input.attr("data-code",match.code);
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
    
    async function selectSuggestion(text, code, uuid) {
        $input.val(text).attr('data-code', code).attr('data-uuid', uuid);
        $suggestionsWrapper.hide();
        jQuery($input).css('border-radius', '50px').css('border-bottom', '1px solid #ddd');
        suggestionSelected = true;
        let userSelection = new UserSelection;
        userSelection.get_from_form();
        userSelection.set_product(text,code,uuid);
        
        adt_push_parameter_to_url(userSelection);
        let data = await API.get_product_footprint(userSelection);
        await display_result(data);
        adt_save_local_search_history(userSelection);
    }
}


function adt_save_local_search_history(userSelection)
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
    let chosenValues = {
        database_version: userSelection.db_version,
        footprint_location: userSelection.countryCode,
        footprint_type: userSelection.footprint_type,
        metric: userSelection.climate_metric,
        footprint_year: userSelection.year
    }

    const newSearch = {
        productTitle: userSelection.title,
        productCode: userSelection.code,
        productUuid: userSelection.uuid,
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

    // jQuery('#search-history-list li').on('click', async function() {
    //     let userSelection = new UserSelection;
    //     let productTitle = jQuery(this).text();
    //     let productCode = jQuery(this).data('code');
    //     let productUuid = jQuery(this).data('uuid');
    //     userSelection.set_product(productTitle,productCode,productUuid);
    //     userSelection.get_from_form();

    //     jQuery('#autocomplete-input').val(productTitle);

    //     adt_push_parameter_to_url(userSelection);
    //     let data_product = await API.get_product_footprint(userSelection);
    //     updateTile(data_product);
    //     adt_save_local_search_history(userSelection);

    // });
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
}

//init get the first time the product 
async function init_form(){
    let userSelection = new UserSelection;
    userSelection.get_from_url();
    console.log("init to_string()=",userSelection.to_string())

    let data = userSelection.footprint_type ==="person" ? await API.get_person_footprint(userSelection) : await API.get_product_footprint(userSelection);

    if(userSelection.footprint_type === 'person'){
        data['title'] = "Person in " + Utils.capitalize(userSelection.country) + " - " + userSelection.year;
    }
    await display_result("#product-analysis-content",data);
    adt_save_local_search_history(userSelection);

}

function adt_push_parameter_to_url(userSelection)
{
    // Do this to make sure you can go back in browser
    // Convert to base64
    let allData = {
        title: userSelection.title,
        code: userSelection.code,
        uuid: userSelection.uuid,
        climate_metric: userSelection.climate_metric,
        household_compo: userSelection.household_compo,
        income_gpe: userSelection.income_gpe,
        location: userSelection.countryCode,
        country: userSelection.country,
        footprint_type_label: userSelection.footprint_type_label,
        footprint_type: userSelection.footprint_type,
        year: userSelection.year,
        db_version: userSelection.db_version,
    };

    const jsonString = JSON.stringify(allData);
    const base64String = btoa(jsonString);  // base64 encode

    // Add to URL
    const getParameter = `?data=${base64String}`;
    history.pushState(null, '', getParameter);
}