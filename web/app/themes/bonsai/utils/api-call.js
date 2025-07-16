import * as Utils from './tools.utils.js'; 

export async function get_product(userSelection){
    console.log("START get_product_info");
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
                resolve(response.data);
            },
            error: (error) => {
                reject(error);  // Reject if there is an error
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