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
}

export function hide_search_results(id){
    jQuery(id).slideUp('slow', function(){
        // Might need something happening here
    });
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

    if (unit_ref === CONST.UNIT.MEURO){
        unitList = [
            {ratio:1e-6,label: CONST.UNIT.EUR},
            {ratio:1e-3,label: CONST.UNIT.kEUR},
            {ratio:1,label: CONST.UNIT.MEURO},
            {ratio:1,label: CONST.UNIT.DKK},
            {ratio:1e3,label:CONST.UNIT.kDKK},
            {ratio:1e6,label:CONST.UNIT.mDKK}
        ];
    } else if (unit_ref === CONST.UNIT.TONNES) {
        unitList = [
            {ratio:1,label:CONST.UNIT.KG},  //ratio is 1 because the unit label changes too ( co2 eq in kg)
            // {ratio:1e-3,label:"g"},
            {ratio:1,label:CONST.UNIT.TONNES}, //ratio is 1 because the unit label changes too ( co2 eq in tonnes)
        ];
    } else if (unit_ref === CONST.UNIT.MJ){ //
        if (dataArray.all_data[0].flow_code.includes('_elec') || dataArray.all_data[0].flow_code.includes('_POW')){
            unitList = [
                {ratio:1,label:CONST.UNIT.KWH},
            ];
        } else {
            unitList = [
                {ratio:1/3.6,label:CONST.UNIT.KWH},
                {ratio:1e-3,label:CONST.UNIT.MJ},
                {ratio:1,label:CONST.UNIT.GJ},  //ratio is 1 because the unit label changes too ( co2 eq in tonnes)
            ];
        }
    } else if (unit_ref === CONST.UNIT.ITEMS){
        unitList = [
            {ratio:1,label:CONST.UNIT.ITEMS},
        ]
    } else if (unit_ref === CONST.UNIT.TONNES_SERVICE){
        unitList = [
            {ratio:1,label:CONST.UNIT.TONNES}, //requested by Jannick Schmidt
        ]
    } else if (unit_ref == null){ //for person footprint-type
        unitList = [
            {ratio:1,label:CONST.UNIT.PERSON_YEAR},
        ]
    } else if (unit_ref == CONST.UNIT.TJ){ 
        unitList = [
            {ratio:1e3*(3.6*1e-6),label:CONST.UNIT.KWH}, // tonnes to kg + TJ to kWh / 1 TJ = 3.6.10^6
            {ratio:1e-3,label:CONST.UNIT.MJ}, //because co2 eq in kg
            {ratio:1e-3,label:CONST.UNIT.GJ}, //ratio is 1 because in TJ in backend
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
    unit_ref = unit_ref.toLowerCase();
    selectedUnit = selectedUnit.toLowerCase();
    const unitList_for_kgco2 = [CONST.UNIT.KG.toLowerCase(), CONST.UNIT.MJ.toLowerCase(), CONST.UNIT.KWH.toLowerCase(), CONST.UNIT.EUR.toLowerCase()];
    
    let finalUnit =  {ratio:1,label:unit_ref};
    if (unitList_for_kgco2.includes(selectedUnit.toLowerCase())){
        switch (unit_ref){
            case CONST.UNIT.TJ.toLowerCase():
                finalUnit = {ratio:1e-3,label:CONST.UNIT.MJ};
                break;
            case CONST.UNIT.ITEMS.toLowerCase():
                finalUnit = {ratio:1,label:CONST.UNIT.ITEMS};
                break;
            case CONST.UNIT.EUR.toLowerCase():
                finalUnit = {ratio:1,label:CONST.UNIT.EUR};
                break;
            case CONST.UNIT.TONNES.toLowerCase():
            case CONST.UNIT.TONNES_SERVICE.toLowerCase():
                finalUnit = {ratio:1,label:CONST.UNIT.KG};
                break;
        }
    }else{
        switch (unit_ref){
            case CONST.UNIT.TJ.toLowerCase():
                finalUnit = {ratio:1e-3,label:CONST.UNIT.GJ};
                break;
            case CONST.UNIT.ITEMS.toLowerCase():
                finalUnit = {ratio:1,label:CONST.UNIT.ITEMS};
                break;
            case CONST.UNIT.EUR.toLowerCase():
                finalUnit = {ratio:1,label:CONST.UNIT.EUR};
                break;
            case CONST.UNIT.TONNES.toLowerCase():
            case CONST.UNIT.TONNES_SERVICE.toLowerCase():
                finalUnit = {ratio:1,label:CONST.UNIT.TONNES};
                break;
        }
    }

    return finalUnit;
}

export function selectOptionByText(select_DOMelement, targetText) {
    const options = select_DOMelement.options;

    for (let i = 0; i < options.length; i++) {
      if (options[i].text.toLowerCase() === String(targetText).toLowerCase()) {
        select_DOMelement.selectedIndex = i;
        break;
      }
    }
  }