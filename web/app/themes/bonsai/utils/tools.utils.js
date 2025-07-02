export function capitalize(str) {
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function displayLoading() {
    jQuery('#autocomplete-input').after('<div class="loading"></div>');
    jQuery('#autocomplete-input').prop('disabled', true);
    jQuery( "#error-message-content" ).remove(); //at the init
}