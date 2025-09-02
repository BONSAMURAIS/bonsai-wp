import * as CONFIG from '../constants/config.js'; 
import * as CONST from '../constants/constants.js'; 


export function capitalize(str) {
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function reformatValue(value){
  // Keep 3 significant digits
  const precise = Number.parseFloat(value).toPrecision(CONFIG.SIGNIFICANT_NB);

  // Convert to number to remove scientific notation
  const rounded = Number(precise);

  return rounded;

    return new Intl.NumberFormat(CONFIG.NUMBERFORMAT, {
        minimumFractionDigits: 0,
        maximumFractionDigits: CONFIG.SIGNIFICANT_NB
    }).format(value);
}

export function displayLoading() {
    jQuery('#co2-form-result-header').after('<div class="loading"></div>');
    jQuery('#co2-form-result-header').prop('disabled', true);
    jQuery( "#error-message-content" ).remove(); //at the init
}

export function removeLoading() {
    jQuery('.loading').remove();
    jQuery('#co2-form-result-header').prop('disabled', false);
}

export function showLoading() {
    document.getElementById('loadingModal').style.display = 'flex';
}

export function hideLoading() {
    document.getElementById('loadingModal').style.display = 'none';
}

// Animations
export function show_search_results(id){
    jQuery(id).slideDown('slow', function(){
        // Might need something happening here
    });
    jQuery('html, body').animate({
        scrollTop: jQuery(id).offset().top - 90
    }, CONST.ANIM.DURATION);
}

export function hide_search_results(id){
    jQuery(id).slideUp('slow', function(){
        // Might need something happening here
    });
    jQuery('html, body').animate({
        scrollTop: jQuery(id).offset().top - 90
    }, CONST.ANIM.DURATION);
}

export function resizeTextToFit(text){
    // text needs to be a jquery obj
    let fontSize = CONFIG.FONTSIZE;
    text.style.fontSize = fontSize + "px";
    
    while (text.offsetWidth > CONFIG.MAX_FONTSIZE && fontSize > 1) {
        fontSize -= 1;
        text.style.fontSize = fontSize + "px";
    }
}

export function getUnitOptions(dataArray, unit_ref){
    //TODO rename hard coded unit with electricity
    let unitList = [];

    if (unit_ref === CONST.UNIT.DKK){
        unitList = [
            {ratio:1e-6,label:"EUR"},
            {ratio:1e-3,label:"kEUR"},
            {ratio:1,label:"mEUR"},
            {ratio:1,label:"DKK"},
            {ratio:1e3,label:"kDKK"},
            {ratio:1e6,label:"mDKK"}
        ];
    } else if (unit_ref === CONST.UNIT.TONNES) {
        unitList = [
            {ratio:1,label:"kg"},
            {ratio:1e-3,label:"g"},
            {ratio:1e3,label:"tonne(s)"},
        ];
    } else if (unit_ref === CONST.UNIT.MJ){
        if (dataArray.all_data[0].flow_code.includes('_elec') || dataArray.all_data[0].flow_code.includes('_POW')){
            unitList = [
                {ratio:1,label:"kWh"},
            ];
        } else {
            unitList = [
                {ratio:1,label:"MJ"},
            ];
        }
    } else if (unit_ref === CONST.UNIT.ITEMS){
        unitList = [
            {ratio:1,label:"item(s)"},
        ]
    } else if (unit_ref === 'tonnes (service)'){
        unitList = [
            {ratio:1,label:"tonne(s)"}, //requested by Jannick Schmidt
        ]
    } else if (unit_ref == null){ //for person footprint-type
        unitList = [
            {ratio:1,label:"Person Year"},
        ]
    } else if (unit_ref == CONST.UNIT.TJ){ //for person footprint-type
        unitList = [
            {ratio:1,label:"TJ"},
        ]
    }

    return unitList;
}