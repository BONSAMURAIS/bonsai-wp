import * as CONFIG from '../constants/config.js'; 
import * as CONST from '../constants/constants.js'; 


export function capitalize(str) {
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function reformatValue(value){
    return new Intl.NumberFormat(CONFIG.NUMBERFORMAT, {
        minimumFractionDigits: CONFIG.SIGNIFICANT_NB,
        maximumFractionDigits: CONFIG.SIGNIFICANT_NB
    }).format(value);
}

export function displayLoading() {
    jQuery('#autocomplete-input').after('<div class="loading"></div>');
    jQuery('#autocomplete-input').prop('disabled', true);
    jQuery( "#error-message-content" ).remove(); //at the init
}

export function removeLoading() {
    jQuery('.loading').remove();
    jQuery('#autocomplete-input').prop('disabled', false);
}

// Animations
export function show_search_results(id){
    jQuery(id).slideDown('slow', function(){
        // Might need something happening here
    });
}

export function getUnitOptions(i, dataArray, unit_ref){
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
        if (dataArray.all_data[i].flow_code.includes('_elec') || dataArray.all_data[i].flow_code.includes('_POW')){
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
                {ratio:1,label:"tonne(s) (service)"},
            ]
    }

    return unitList;
}