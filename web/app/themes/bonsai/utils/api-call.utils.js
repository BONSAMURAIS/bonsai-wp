import * as Utils from "./tools.utils.js";
import * as CONST from "../constants/constants.js";

export async function get_product_footprint_by_search(query) {
  console.log("START get_product_footprint_by_search");

  return new Promise((resolve, reject) => {
    jQuery.ajax({
      type: "POST",
      url: localize._ajax_url,
      data: {
        _ajax_nonce: localize._ajax_nonce,
        action: "get_prod_footprint_by_search",
        query: query,
      },
      beforeSend: Utils.showLoading(),
      success: (response) => {
        Utils.hideLoading();
        console.log("by search");
        console.log(response);
        localStorage.setItem("prod_title", response.data.title);
        localStorage.setItem("prod_country", response.data.chosen_country);
        localStorage.setItem(
          "emission_contriAnalysis",
          JSON.stringify(response.data.recipe),
        );
        localStorage.setItem(
          "unit_reference",
          JSON.stringify(response.data.unit_reference),
        );
        localStorage.setItem("year", response.data.year);

        resolve(response.data);
      },
      error: (error) => {
        Utils.hideLoading();
        reject(error); // Reject if there is an error
        console.log("adt_get_product_info ERROR");
        console.log(error);
        jQuery("#initial-error-message").html(
          "<p>" + error.responseJSON?.data.error + "</p>",
        );
        jQuery("#initial-error-message").slideDown("fast");
      },
    });
  });
}

export async function get_product_footprint(userSelection) {
  console.log("START get_product_footprint");
  console.log("userSelect =", userSelection.to_string());

  return new Promise((resolve, reject) => {
    jQuery.ajax({
      type: "POST",
      url: localize._ajax_url,
      data: {
        _ajax_nonce: localize._ajax_nonce,
        action: "adt_get_product_footprint",
        title: userSelection.title,
        code: userSelection.code,
        uuid: userSelection.uuid,
        metric: userSelection.climate_metric,
        footprint_location: userSelection.countryCode,
        country: userSelection.country,
        footprint_type: userSelection.footprint_type,
        footprint_type_label: userSelection.footprint_type_label,
        footprint_year: userSelection.year,
        database_version: userSelection.db_version,
      },
      beforeSend: Utils.showLoading(),
      success: (response) => {
        Utils.hideLoading();
        localStorage.setItem(
          "emission_contriAnalysis",
          JSON.stringify(response.data.recipe),
        );
        localStorage.setItem("unit_reference", response.data.unit_reference);
        localStorage.setItem("prod_country", response.data.chosen_country);
        response.data.title =
          response.data.title == "" ? userSelection.title : response.data.title;
        localStorage.setItem("year", userSelection.year);
        resolve(response.data);
      },
      error: (error) => {
        Utils.hideLoading();
        reject(error); // Reject if there is an error
        console.log("adt_get_product_info ERROR");
        console.log(error);
        jQuery("#initial-error-message").html(
          "<p>" + error.responseJSON?.data.error + "</p>",
        );
        jQuery("#initial-error-message").slideDown("fast");
      },
    });
  });
}

export async function get_person_footprint(userSelection) {
  console.log("userSelection=", userSelection.to_string());
  let autocomplete_input = jQuery("#autocomplete-input");

  return new Promise((resolve, reject) => {
    jQuery.ajax({
      type: "POST",
      url: localize._ajax_url,
      data: {
        _ajax_nonce: localize._ajax_nonce,
        action: "adt_get_person_footprint", //reference in adt-person-functions.php
        version: userSelection.db_version,
        income_group: userSelection.income_group,
        household_type: userSelection.household_type,
        metric: userSelection.climate_metric,
        region_code: userSelection.countryCode,
        country: userSelection.country,
        year: userSelection.year,
      },
      beforeSend: Utils.showLoading(),
      success: function (response) {
        Utils.hideLoading();
        jQuery(".loading").remove();
        autocomplete_input.prop("disabled", false);
        console.log("person_data response = ", response);
        localStorage.setItem(
          "emission_contriAnalysis",
          JSON.stringify(response.data.recipe),
        );
        localStorage.setItem("year", userSelection.year);
        response.data["unit_reference"] = CONST.UNIT.PERSON_YEAR;
        resolve(response.data);
      },
      error: (response) => {
        Utils.hideLoading();
        console.log("error -: ", response);
        let error_initMsg = jQuery("#initial-error-message");

        // Request was throttled
        error_initMsg.html("<p>" + response.responseJSON?.data.error + "</p>");
        error_initMsg.slideDown("fast");
      },
    });
  });
}

export async function get_converted_number_by_units(fromUnit, toUnit, number) {
  return new Promise((resolve, reject) => {
    jQuery.ajax({
      type: "POST",
      url: localize._ajax_url,
      data: {
        _ajax_nonce: localize._ajax_nonce,
        action: "adt_get_converted_number_ajax",
        fromUnit: fromUnit,
        toUnit: toUnit,
        number: number,
      },
      success: (response) => {
        resolve(response.data); // Resolve with the converted data
      },
      error: (error) => {
        reject(error); // Reject if there is an error
      },
    });
  });
}

export async function get_product_name_by_code_api(productCode) {
  return new Promise((resolve, reject) => {
    jQuery.ajax({
      type: "POST",
      url: localize._ajax_url,
      data: {
        _ajax_nonce: localize._ajax_nonce,
        action: "get_product_name_by_code_api",
        code: productCode,
      },
      success: (response) => {
        let productTitle = response.data;
        resolve(productTitle);
      },
      error: (err) => {
        console.log("err=", err);
        reject(err);
      },
    });
  });
}

export async function uncertainty_calculation(original, comparison) {
  return new Promise((resolve, reject) => {
    jQuery.ajax({
      type: "POST",
      url: localize._ajax_url,
      data: {
        _ajax_nonce: localize._ajax_nonce,
        action: "adt_probability_a_greater_b",
        original: original,
        comparison: comparison,
      },
      beforeSend: function () {},
      success: (response) => {
        // Handle creation of HTML element here
        if (!response.data) {
          console.log("now uncertainty data");
          return;
        }
        resolve(response.data);
      },
    });
  });
}

export async function save_search_history_on_click(data) {
  return new Promise((resolve, reject) => {
    jQuery.ajax({
      type: "POST",
      url: localize._ajax_url,
      data: {
        _ajax_nonce: localize._ajax_nonce,
        action: "adt_save_shared_search",
        data: data,
      },
      beforeSend: function () {},
      success: (response) => {
        if (!response.success) {
          return;
        }
        resolve(response.data);
      },
    });
  });
}
