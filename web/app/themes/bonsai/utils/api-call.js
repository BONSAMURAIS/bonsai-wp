import * as Utils from './tools.utils.js'; 

export async function get_product_footprint(userSelection){
    console.log("START get_product_footprint");
    console.log("userSelect =",userSelection.to_string());

    return new Promise((resolve, reject) => { 
        jQuery.ajax({
            type: 'POST',
            url: localize._ajax_url,
            data: {
                _ajax_nonce: localize._ajax_nonce,
                action: 'adt_get_product_footprint',
                title: userSelection.title,
                code: userSelection.code,
                uuid: userSelection.uuid,
                metric: userSelection.climate_metric,
                footprint_location: userSelection.countryCode,
                footprint_type: userSelection.footprint_type,
                footprint_year: userSelection.year,
                database_version: userSelection.db_version,
            },
            beforeSend: Utils.displayLoading(),
            success: (response) => {
                Utils.removeLoading();
                resolve(response.data);
            },
            error: (error) => {
                reject(error);  // Reject if there is an error
                console.log("adt_get_product_info ERROR");
                console.log(response);
                jQuery('#initial-error-message').html('<p>'+response.responseJSON?.data.error+'</p>');
                jQuery('#initial-error-message').slideDown('fast');
            }
        });
    });
}

export async function get_person_footprint(userSelection){
    let act_code = userSelection.income_gpe+"_"+userSelection.household_compo; //fdemandCat will be prefixed in adt-person-functions.php
    console.log("act_code=",act_code);
    let autocomplete_input = jQuery('#autocomplete-input'); 

    return new Promise((resolve, reject) => { 
        jQuery.ajax({
            type: 'POST',
            url: localize._ajax_url,
            data: {
                _ajax_nonce: localize._ajax_nonce,
                action: 'adt_get_person_footprint', //reference in adt-person-functions.php
                version: userSelection.db_version,
                act_code: act_code,
                metric: userSelection.climate_metric,
                region_code: userSelection.countryCode,
            },
            beforeSend: Utils.displayLoading(),
            success: function(response) {
                Utils.removeLoading();
                jQuery('.loading').remove();
                autocomplete_input.prop('disabled', false);
                resolve(response.data);
                
            },
            error: (response) => {
                console.log("error: ",response);
                let error_initMsg = jQuery('#initial-error-message');

                // Request was throttled
                error_initMsg.html('<p>'+response.responseJSON?.data.error+'</p>');
                error_initMsg.slideDown('fast');
            }
        });
    })

}

export function get_recipes(){}

export async function get_converted_number_by_units(fromUnit, toUnit, number) {
    return new Promise((resolve, reject) => {
        jQuery.ajax({
            type: 'POST',
            url: localize._ajax_url,
            data: {
                _ajax_nonce: localize._ajax_nonce,
                action: 'adt_get_converted_number_ajax',
                fromUnit: fromUnit,
                toUnit: toUnit,
                number: number,
            },
            success: (response) => {
                resolve(response.data);  // Resolve with the converted data
            },
            error: (error) => {
                reject(error);  // Reject if there is an error
            }
        });
    });
}

export async function get_product_name_by_code(productCode) {
    return new Promise((resolve, reject)=>{
        jQuery.ajax({
            type: 'POST',
            url: localize._ajax_url,
            data: {
                _ajax_nonce: localize._ajax_nonce,
                action: 'adt_get_product_name_by_code',
                code: productCode,
            },
            success: (response) => {
                let productTitle = response.data;
                resolve(productTitle);
    
            }
        });
    })
}

export async function uncertainty_calculation(original, comparison){
    return new Promise((resolve, reject)=>{
        jQuery.ajax({
            type: 'POST',
            url: localize._ajax_url,
            data: {
            _ajax_nonce: localize._ajax_nonce,
            action: 'adt_probability_a_greater_b',
            original: original,
            comparison: comparison,
            },
            beforeSend: function() {
            },
            success: (response) => {
                // Handle creation of HTML element here
                if (!response.data) {
                    console.log('now uncertainty data');
                    return;
                }
                resolve(response.data)
            }
        });
    });
}