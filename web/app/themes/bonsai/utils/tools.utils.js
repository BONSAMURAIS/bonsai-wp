import * as c_Config from '../constants/config.js'; 

export function capitalize(str) {
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function reformatValue(value){
    return new Intl.NumberFormat(c_Config.NUMBERFORMAT, {
        minimumFractionDigits: c_Config.SIGNIFICANT_NB,
        maximumFractionDigits: c_Config.SIGNIFICANT_NB
    }).format(value);
}

export function displayLoading() {
    jQuery('#autocomplete-input').after('<div class="loading"></div>');
    jQuery('#autocomplete-input').prop('disabled', true);
    jQuery( "#error-message-content" ).remove(); //at the init
}

// Animations
export function show_search_results(id){
    jQuery(id).slideDown('slow', function(){
        // Might need something happening here
    });
}