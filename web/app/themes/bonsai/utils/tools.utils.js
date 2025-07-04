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