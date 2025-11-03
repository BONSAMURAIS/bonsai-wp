import UserSelection from '../../model/user_selection.js'; 
import SearchParameters from '../../model/search_parameters.js'; 
import * as CONST from '../../constants/constants.js'; 
import * as Utils from '../../utils/tools.utils.js';
import * as API from '../../utils/api-call.utils.js'; 

// Makes sure to run the function when users go back and forth in browser
window.addEventListener('popstate', async function(event) {
    const params = new URLSearchParams(window.location.search);
    console.log("params=",params);
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

    //listener to modal page event
    $('.tooltip-text').click(function(e) {
        e.preventDefault();
        $('#modal').show();
    }); 
    $('#closeModal').click(function(e) {
        e.preventDefault();
        $('#modal').hide();
    });

    $('input[name="footprint_type"]').on('change',async function(){
        const isChecked = $(this).is(':checked');
        
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
                let userSelection = new UserSelection;
                userSelection.get_from_form();
                userSelection.countryCode = "AU";
                let data = await API.get_person_footprint(userSelection);
                data['title'] = "Emission per person";
                await display_result("#product-analysis-content",data);
            } else {
                $('#market').prop('checked', true).trigger('change'); // Fix applied here
            }
        }
    });

    $('#household-composition, #income-group, .location, .year, .climatemetric, .database-version, .footprint-type').on('change', async function(){
        console.log("change ", jQuery(this).attr('id'));
        let userSelection = new UserSelection;
        userSelection.get_from_dropdown();
        
        adt_push_parameter_to_url(userSelection);
        console.log("at change userSelection:", userSelection.to_string())
        let selectedValue = jQuery('#product-analysis-content .product-title').attr('data-code');
        console.log("selectedValue=",selectedValue)
        let data = (selectedValue === 'person') ? await API.get_person_footprint(userSelection) : await API.get_product_footprint(userSelection);
        if(selectedValue === 'person'){
            data['title'] = "Emission per person";
        }
        await display_result("#product-analysis-content",data);
        adt_push_parameter_to_url(userSelection);

        adt_save_local_search_history(userSelection);
    });

    $('input[name="contri-analysis"]').on('change', function(){
        const isChecked = $(this).is(':checked');

        if (isChecked) {
            const value = $(this).val();
            const flexDir = value == 'advanced' ? 'column' : 'row';
            const displayValue = value == 'advanced' ? 'flex' : 'none';
            $('#analysis-wrapper').css('flex-direction', flexDir);
            $(".contribution-analysis").css('display',displayValue);
        }
    });

    let list_product = {};
    let list_product_title = new Set();

    let chosenFootprintType = $('input[name="footprint_type_extend"]:checked').val();

    //object searchform created by 'wp_localize_script' in adt-searchform-shortcode.php line 17
    $(searchform.products).each(function() {
        list_product[this.title] = { code: this.code, content:this.content, uuid: this.uuid}; //because title is unique
        list_product_title.add(this.title);
    });
    
    // when radio button 'Cradle to consumer' is selected 
    // If user chooses to change footprint type then get new data
    $('input[name="footprint_type_extend"]').on('change', function() {
        console.log("footprint_type_extend changed");
        chosenFootprintType = $(this).val();
        
        list_product = {};
        list_product_title = new Set();
        $(searchform.products).each(function() {
            list_product[this.title] = { code: this.code, content:this.content, uuid: this.uuid} //because title is unique
            list_product_title.add(this.title);
        });

        jQuery('#autocomplete-input').val('');
        adt_dynamic_search_input(list_product,list_product_title);
    });

    adt_dynamic_search_input(list_product,list_product_title);

    $('#most-popular ul li button, #search-history-list li').on('click', async function(e) {
        e.preventDefault();
        // let searchparams = new SearchParameters();
        let productTitle = $(this).text();
        let productCode = $(this).data('code');
        let productUuid = $(this).data('uuid');
        let product_location = $(this).data('location');
        let product_year = $(this).data('year');
        console.log("product_location=",product_location)
        userSelection.get_from_form();
        userSelection.set_product(productTitle,productCode,productUuid);
        let selectedValue = $('input[name="footprint_type"]:checked').val();

        $('#autocomplete-input').val(productTitle);

        console.log("START popular/ history click")
        
        adt_push_parameter_to_url(userSelection);
        let data = await API.get_product_footprint(userSelection);

        if(selectedValue === 'person'){
            data['title'] = "Emission per person";
        }

        await display_result("#product-analysis-content",data);
        adt_save_local_search_history(userSelection);
        adt_push_parameter_to_url(userSelection);
        console.log("END popular click")
    });

    adt_download_recipe_csv();

    adt_initialize_local_search_history();

    // Search 
    $('#btn-search').click(async function(e){
        e.preventDefault();
        console.log("on click ",jQuery(this).attr('id'))
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
        data = await API.get_product_footprint_by_search(jQuery('#autocomplete-input').val());

        if (data.error){
            let error_msg = jQuery('#error-message');
            error_msg.append("<p id='error-message-content' class='error-message-content-decorator'> No product found for this search</p>");
            error_msg.slideDown('fast');
            setTimeout(function () {
                error_msg.slideUp('slow');
                jQuery("#error-message-content").remove();
            }, CONST.ANIM.DURATION); //remove message after 0.5s
            return
        }
        
        if(selectedValue === 'person'){
            data['title'] = "Emission per person";
        }
        adt_push_parameter_to_url(userSelection);
        await display_result("#product-analysis-content",data);
        console.log('END searching');
    });
    
    //observe on_change elements
    jQuery('#co2-form-result').find('select.unit').on('change', function () {
        console.log("change unit")
        
        let unitSelect = jQuery(this);
        let unitLabel = unitSelect.find('option:selected').text();
        let unitRatio = unitSelect.val();
        let amountInput = unitSelect.closest('.unit-select-wrapper')      // go up to the label wrapping <select>
                                    .find('input.quantity');        // look inside for input.amount
        let numberInput = amountInput.val();
        let co2_result = unitSelect.closest('div.product-result')      // go up to the div wrapping 
                                    .find('span.co2-value');        // look inside for span.co2-value
        const co2_result_value = parseFloat(co2_result.data('normal_value'));
        let calculatedValue = co2_result_value * numberInput * unitRatio;
        let formattedCalculatedValue = Utils.reformatValue(calculatedValue);

        co2_result.text(formattedCalculatedValue);
        co2_result.css("width","fit-content");
        co2_result.each(function(index, text) { 
            Utils.resizeTextToFit(text);
        });

        let main_component = amountInput.closest("div.tile");
        main_component.find('.question-unit').first().text(unitLabel);
        const co2Value_unit = Utils.getResultUnitCO2(unitLabel).replace("tonnes", "tonne");;
        main_component.find('.co2-value-unit').text(co2Value_unit);
        const recipeArray = JSON.parse(localStorage.getItem('emission_contriAnalysis'));
        display_recipe_table(main_component, recipeArray);

        amountInput.val(numberInput);//keep value in input
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
        let amountInputValue = amountInput.val() == '' ? 0 : amountInput.val();
        let co2_result = amountInput.closest('div.product-result')      // go up to the div wrapping 
                                .find('span.co2-value');        // look inside for span.co2-value
        const co2_result_value = parseFloat(co2_result.data('normal_value'));



        let unitSelect = amountInput.closest('div.unit-select-wrapper')
                                .find('select.unit');
        const unitRatio = unitSelect.val();

        let calculatedValue = co2_result_value * amountInputValue * unitRatio;
        let formattedCalculatedValue = Utils.reformatValue(calculatedValue);

        co2_result.text(formattedCalculatedValue);
        co2_result.css("width","fit-content");
        co2_result.each(function(index, text) { 
            Utils.resizeTextToFit(text);
        });

        const recipeArray = JSON.parse(localStorage.getItem('emission_contriAnalysis'));
        for (let i = 0; i<recipeArray.length; i++){
            recipeArray[i].value_emission *=  amountInputValue;
            recipeArray[i].value_inflow *=  amountInputValue;
            
        }
        let main_component = amountInput.closest("div.tile");
        display_recipe_table(main_component, recipeArray);

        amountInput.val(amountInput.val());//keep value in input
        
        let quantityQuestion = amountInput.closest('div.contribution-analysis')
                                .find('span.quantity-value');
        quantityQuestion.text(amountInputValue);
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
            const htmlclass = "#"+jQuery(this).closest(".tile").attr('id');
            await display_result(htmlclass,data);
            // adt_save_local_search_history(userSelection);
        } catch (err) {
            console.error('Error in async handler:', err);
        }
    });

    //hide/display arrow
    $('label.select').each(function() {
        let listOptions = $(this).find('option');
        if (listOptions.length <= 1){
            $(this).children('select').first().prop('disabled', true); //disable select
            $(this).children('select').first().css('background', 'white'); //hide arrow
        }
    });

});


async function display_result(htmlclass, data){
    console.log("Start display data")
    console.log("data=",data)

    //error management
    let error_msg = jQuery('#error-message');
    if (data && (data.error && data.error.includes("Product not found") || data.title == "")) {
        if(jQuery('#error-message-content').length == 0){
            error_msg.append("<p id='error-message-content' class='error-message-content-decorator' >Selected footprint doesn't exist in the database. Try selecting a different product, location or footprint type.</p>");
        }
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
    main_component.find('.product-title').text(Utils.capitalize(data["title"]));
    main_component.find('.product-title').first().attr("data-code",data['flow_code'] ?? "person");
    main_component.find('.product-title').first().attr("data-uuid",data['uuid']);
    //set location list of dropdown
    let location_dropdownElement = main_component.find('.location').first();
    for (const location of data['list_locations']){
        location_dropdownElement.append(`<option value="${location['code']}">${location['name']}</option>`);
    }
    if (data['list_locations'].length <= 1){
        location_dropdownElement.prop('disabled', true);
        location_dropdownElement.css('background', 'white');
    }else{
        location_dropdownElement.prop('disabled', false);
        location_dropdownElement.css('background', '');
    }
    //set dropdown tags
    console.log(main_component)
    Utils.selectOptionByText(main_component.find('.location').first()[0], data['country']);
    Utils.selectOptionByText(main_component.find('.year').first()[0], data['year']);
    Utils.selectOptionByText(main_component.find('.climatemetric').first()[0], data['metric']);
    Utils.selectOptionByText(main_component.find('.database-version').first()[0], data['version']);
    jQuery(main_component.find('.footprint-type').first()).val(data['scope']);
    let dropdown_footprint_type = main_component.find('.footprint-type').first();
    dropdown_footprint_type.prop('disabled', true);
    dropdown_footprint_type.css('background', 'white');

    const isPersonTab = data['flow_code'] == null;
    main_component.find('.emission-unit').first().text("in "+data['unit_emission']);
    main_component.find('.question-location').text(isPersonTab ? data["country"] : Utils.capitalize(data["title"]));
    main_component.find('.version').first().text(data["version"]);
    //set value
    console.log("testtest")
    console.log(data["value"])
    main_component.find('.co2-value').first().data("normal_value",Utils.reformatValue(data["value"]));
    main_component.find('.co2-value').first().data("normal_unit",data["unit_reference"]);
    let unit_options = main_component.find('select.unit'); 
    unit_options.empty();
    //set unitList
    const unitList = Utils.getUnitOptions(data, data["unit_reference"]);
    for (const unit of unitList){
        unit_options.append(`<option value="${unit['ratio']}">${unit['label'].replace("tonnes", "tonne")}</option>`);
    }
    console.log(unitList);
    if (unitList.length <= 1){
        unit_options.prop('disabled', true);
        unit_options.css('background', 'white');
    }else{
        unit_options.prop('disabled', false);
        unit_options.css('background', '');
    }
    
    //display default unit and adapt the result value 
    if(data["unit_reference"]==CONST.UNIT.TJ){
        Utils.selectOptionByText(unit_options.first()[0],CONST.UNIT.KWH); //display as default 'kWh' for unit_ref = TJ
    }else if (data["unit_reference"]==CONST.UNIT.TONNES){
        Utils.selectOptionByText(unit_options.first()[0],CONST.UNIT.KG); //display as default 'kg' for unit_ref = tonnes
    }
    let default_selected_unit_ratio = main_component.find('select.unit option:selected').val();
    console.log(default_selected_unit_ratio)
    main_component.find('.co2-value').first().text(Utils.reformatValue(default_selected_unit_ratio*data["value"]));

    let displayed_unit = data["unit_reference"];
    let preposition = " of ";
    if(displayed_unit == CONST.UNIT.TONNES_SERVICE){
        displayed_unit = CONST.UNIT.TONNES;
    } else if (isPersonTab){
        displayed_unit = CONST.UNIT.PERSON_YEAR;
        preposition = " in ";
    }
    displayed_unit = displayed_unit.replace("tonnes", "tonne");
    let selectedUnit_dropdownlist = main_component.find('select.unit').find('option:selected').text();
    selectedUnit_dropdownlist = selectedUnit_dropdownlist.replace("tonnes", "tonne");
    main_component.find('.product-unit').first().text(displayed_unit);
    main_component.find('.question-unit').first().text(selectedUnit_dropdownlist);
    main_component.find('.question-unit-preposition').first().text(preposition);
    const co2Value_unit = Utils.getResultUnitCO2(selectedUnit_dropdownlist);
    main_component.find('.co2-value-unit').text(isPersonTab ? CONST.UNIT.TONNESCO2 : co2Value_unit);

    //recipe
    display_recipe_table(main_component,data.recipe);
    return true;
}

function display_recipe_table(main_component,recipeArray){
    if (recipeArray && recipeArray.error){
        return true;
    }

    let tableMarkup = '';
    let otherRowMarkup = '';
    let rowMarkup = '';

    for (const recipe of recipeArray) {
        //preprocessing recipe data
        // Add to URL
        const jsonString = JSON.stringify(recipe);
        const base64String = btoa(jsonString);  // Convert to base64
        const getParameter = `?data=${base64String}`;
        
        //Create rows
        rowMarkup = '<tr>';//country = recipe.region_inflow or recipe.region_reference?
        rowMarkup += '<td><span class="link" data-href="' +getParameter+ ' " data-code="'+recipe.inflow+'" data-uuid="'+recipe.id+'" data-country-code="'+recipe.region_inflow+'" data-year="'+"2016"+'" data-metric="'+recipe.metric+'">' + Utils.capitalize(recipe.inflow_name) + '</span></td>';
        rowMarkup += '<td>' + (recipe.region_inflow || '') + '</td>';
        rowMarkup += '<td class="input-flow">';

        
        if ( (recipe.value_emission && recipe.value_emission !== NaN) || recipe.value_emission == 0) {
            recipe.value_emission = Utils.reformatValue(parseFloat(recipe.value_emission));
        }

        const selectedUnit_dropdownlist = main_component.find('select.unit').find('option:selected').text();
        let displayed_unit = Utils.getUnitContriAnalysis(selectedUnit_dropdownlist,recipe.unit_inflow);
        // console.log(displayed_unit)
        if (displayed_unit && displayed_unit['label']  !== null && displayed_unit['label']  !== undefined && displayed_unit['label']  !== '' && displayed_unit['label'].includes("tonnes")){
            displayed_unit['label'] =  displayed_unit['label'].replace("tonnes", "tonne")
        }
        const value_inflow = recipe.value_inflow ? Utils.reformatValue(recipe.value_inflow*displayed_unit['ratio']) : "others";
        rowMarkup += '<span class="inflow-value">' + value_inflow  + '</span>';
        rowMarkup += '<span class="inflow-unit">' + displayed_unit['label'] + '</span>';
        
        let default_selected_unit_ratio = main_component.find('select.unit option:selected').val(); //convert value in recipes
        rowMarkup += '</td>';
        rowMarkup += '<td class="emissions-value">' + (recipe.value_emission ? default_selected_unit_ratio*recipe.value_emission : '') + '</td>';
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

function adt_dynamic_search_input(list_product, list_product_title) 
{
    const words = [...list_product_title];
    console.log("words=",words)
    console.log("list_product=",list_product)
    const $input = jQuery('#autocomplete-input');
    const $suggestionsWrapper = jQuery('#suggestions-wrapper');
    const $suggestions = jQuery('#suggestions');
    let currentIndex = -1;
    let suggestionSelected = false;

    $input.on('input', function () {
        const query = $input.val().toLowerCase();
        const matches = words
        .map((word, index) => ({ word, code: list_product[word]["code"], uuid: list_product[word]["uuid"] }))
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
                    .on('click', async function () {
                        $input.val(match.word);
                        $input.attr("data-code",match.code);
                        await selectSuggestion(match.word, match.code, match.uuid);
                    });
                $suggestions.append($div);
            });
        } else {
            jQuery(this).css('border-radius', '50px').css('border-bottom', '1px solid #ddd');
            $suggestionsWrapper.hide();
        }
    });

    $input.on('keydown', async function (e) {
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
            } else if (e.key === 'Enter' && jQuery('#autocomplete-input').val() !== '') {
                e.preventDefault();
                let data = await API.get_product_footprint_by_search(jQuery('#autocomplete-input').val());
                $suggestionsWrapper.hide();
                if (data.error){
                    let error_msg = jQuery('#error-message');
                    error_msg.append("<p id='error-message-content' class='error-message-content-decorator'> No product found for this search</p>");
                    error_msg.slideDown('fast');
                    setTimeout(function () {
                        error_msg.slideUp('slow');
                        jQuery("#error-message-content").remove();
                    }, CONST.ANIM.DURATION); //ici
                    return
                }
                // adt_push_parameter_to_url(userSelection);
                await display_result("#product-analysis-content",data);
                jQuery(this).css('border-radius', '50px').css('border-bottom', '1px solid #ddd');
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
        let data = await API.get_product_footprint_by_search(text);
        await display_result("#product-analysis-content",data);
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
        data['title'] = "Emission per person in " + Utils.capitalize(userSelection.country) + " - " + userSelection.year;
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
        household_type: userSelection.household_type,
        income_group: userSelection.income_group,
        location: userSelection.countryCode,
        country: userSelection.country,
        footprint_type_label: userSelection.footprint_type_label,
        footprint_type: userSelection.footprint_type,
        year: userSelection.year,
        db_version: userSelection.db_version,
    };

    const jsonString = JSON.stringify(allData);
    console.log("to url")
    console.log(jsonString)
    const base64String = btoa(jsonString);  // base64 encode

    // Add to URL
    const getParameter = `?data=${base64String}`;
    history.pushState(null, '', getParameter);
}

function add_url_parameters(data)
{
    // Do this to make sure you can go back in browser
    // Convert to base64
    let params = {
        title: data.title,
        code: data.code,
        climate_metric: data.climate_metric,
        household_type: data.household_type,
        income_group: data.income_group,
        location: data.countryCode,
        country: data.country,
        footprint_type: data.footprint_type,
        year: data.year,
        db_version: data.db_version,
    };

    const jsonString = JSON.stringify(params);
    console.log("to url")
    console.log(jsonString)
    // const base64String = btoa(jsonString);  // base64 encode

    // Add to URL
    const queryString = new URLSearchParams(params).toString(); 
    const getParameter = `?${queryString}`;
    history.pushState(null, '', getParameter);
}