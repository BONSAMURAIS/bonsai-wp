import * as CONFIG from '../constants/config.js'; 
import * as CONST from '../constants/constants.js'; 


export function capitalize(str) {
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function reformatValue(value){

    const precise = Number.parseFloat(value).toPrecision(CONFIG.SIGNIFICANT_NB); // Keep 3 significant digits
    const rounded = Number(precise); // Convert to number to remove scientific notation
    let result = new Intl.NumberFormat(CONFIG.NUMBERFORMAT).format(rounded);
    if((Math.abs(value) < 1e-3 && value != 0) || Math.abs(value) > 1e9){
        result = value.toExponential(CONFIG.SIGNIFICANT_NB-1);
    }

    return result;
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
            // {ratio:1e-3,label:"g"},
            {ratio:1,label:"tonne(s)"}, //ratio is 1 because the unit label changes too
        ];
    } else if (unit_ref === CONST.UNIT.MJ){
        if (dataArray.all_data[0].flow_code.includes('_elec') || dataArray.all_data[0].flow_code.includes('_POW')){
            unitList = [
                {ratio:1,label:"kWh"},
            ];
        } else {
            unitList = [
                {ratio:1,label:"kWh"},
                {ratio:1e-3,label:"MJ"},
                {ratio:1,label:"GJ"}, //ratio is 1 because the unit label changes too
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
            {ratio:1,label:"kWh"},
            {ratio:1e-3,label:"MJ"},
            {ratio:1,label:"GJ"}, //ratio is 1 because the unit label changes too
        ]
    }

    return unitList;
}

export function getResultUnitCO2(unit_ref){
    const unitList_for_kgco2 = [CONST.UNIT.KG.toLowerCase(), CONST.UNIT.MJ.toLowerCase(), CONST.UNIT.KWH.toLowerCase(), CONST.UNIT.EUR.toLowerCase()];
    let finalUnit = unitList_for_kgco2.includes(unit_ref.toLowerCase()) ? CONST.UNIT.KGCO2 : CONST.UNIT.TONNESCO2;
    return finalUnit;
}
export function getUnitContriAnalysis(selectedUnit, unit_ref){
    if (unit_ref == null){
        return ""
    }
    let unit = unit_ref.toLowerCase();
    selectedUnit = selectedUnit.toLowerCase();
    const unitList_for_kgco2 = [CONST.UNIT.KG.toLowerCase(), CONST.UNIT.MJ.toLowerCase(), CONST.UNIT.KWH.toLowerCase(), CONST.UNIT.EUR.toLowerCase()];
    
    let finalUnit = "";
    if (unitList_for_kgco2.includes(unit_ref.toLowerCase())){
        switch (unit){
            case CONST.UNIT.TJ:
                finalUnit = CONST.UNIT.MJ;
            case CONST.UNIT.ITEMS:
                finalUnit = CONST.UNIT.ITEMS;
            case CONST.UNIT.EUR:
                finalUnit = CONST.UNIT.EUR;
            case CONST.UNIT.TONNES:
                finalUnit = CONST.UNIT.KG;
            break;
        }
    }else{
        switch (unit){
            case CONST.UNIT.TJ:
                finalUnit = CONST.UNIT.GJ;
            case CONST.UNIT.ITEMS:
                finalUnit = CONST.UNIT.ITEMS;
            case CONST.UNIT.EUR:
                finalUnit = CONST.UNIT.EUR;
            case CONST.UNIT.TONNES:
                finalUnit = CONST.UNIT.TONNES;
            break;
        }
    }
    console.log("blabla unit_ref=",unit_ref)
    console.log("blabla finalUnit=",finalUnit)

    return finalUnit;
}

export function convertUnit(unit_ref){
    //TODO
}