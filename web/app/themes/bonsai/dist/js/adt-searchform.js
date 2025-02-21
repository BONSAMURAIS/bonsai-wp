/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/adt-searchform.js":
/*!*************************************!*\
  !*** ./assets/js/adt-searchform.js ***!
  \*************************************/
/***/ (() => {

jQuery(document).ready(function ($) {
  $('.co2-form input[name="switch-one"]').on('change', function () {
    var isChecked = $(this).is(':checked');
    if (isChecked) {
      var value = $(this).val();
      $('input.search').attr('placeholder', 'Find footprint by ' + value);
    }
  });
  $('input[name="switch-two"]').on('change', function () {
    var isChecked = $(this).is(':checked');
    if (isChecked) {
      var value = $(this).val();
      if (value == 'advanced') {
        $('.search-result.advanced').css('display', 'flex');
        $('.search-result.basic').hide();
      } else {
        $('.search-result.basic').css('display', 'flex');
        $('.search-result.advanced').hide();
      }
    }
  });
  var productTitleArray = [];
  var productContentArray = [];
  var productCodeArray = [];
  var productUuidArray = [];
  var chosenFootprintType = $('#footprint-type input[name="footprint_type"]:checked').val();
  $(searchform.products).each(function () {
    if (chosenFootprintType === "product" && this.code.includes("M_")) {
      return true;
    }
    if (chosenFootprintType === "market" && this.code.includes('C_') || chosenFootprintType === "market" && this.code.includes('EF_')) {
      return true;
    }
    productTitleArray.push(this.title);
    productContentArray.push(this.content);
    productCodeArray.push(this.code);
    productUuidArray.push(this.uuid);
  });

  // If user chooses to change footprint type then get new data
  $('#footprint-type input[name="footprint_type"]').on('change', function () {
    chosenFootprintType = $(this).val();
    productTitleArray = [];
    productContentArray = [];
    productCodeArray = [];
    productUuidArray = [];
    $(searchform.products).each(function () {
      if (chosenFootprintType === "product" && this.code.includes("M_")) {
        return true;
      }
      if (chosenFootprintType === "market" && this.code.includes('C_') || chosenFootprintType === "market" && this.code.includes('EF_')) {
        return true;
      }
      productTitleArray.push(this.title);
      productContentArray.push(this.content);
      productCodeArray.push(this.code);
      productUuidArray.push(this.uuid);
    });
    jQuery('#autocomplete-input').val('');
    adt_dynamic_search_input(productTitleArray, productCodeArray, productUuidArray);
  });
  adt_dynamic_search_input(productTitleArray, productCodeArray, productUuidArray);
  $('.co2-form-result #co2-form-result-header .select-wrapper select').on('change', function () {
    var jsonObject = localStorage.getItem("footprint_data");
    jsonObject = JSON.parse(jsonObject);
    var chosenValues = adt_get_chosen_values();
    adt_get_product_info(jsonObject.title, jsonObject.flow_code, jsonObject.uuid, chosenValues);
  });
  $('.most-popular-container ul li button').on('click', function () {
    var productTitle = $(this).text();
    var productCode = $(this).data('code');
    var productUuid = $(this).data('uuid');
    var chosenValues = adt_get_chosen_values();
    adt_get_product_info(productTitle, productCode, productUuid, chosenValues);
  });
  adt_download_recipe_csv();
  $('.share-icon').on('click', function () {
    var productTitle = $('.search-result.basic .col:first-child p.product-title').text();
    var productFootprint = $('input[name="switch-one"]').val();
    var FootprintView = $('input[name="switch-two"]').val();
    var productFootprintType = $('.search-result > .col:first-child .product-tag.footprint-type').attr('data-type');
    var productCode = $('.search-result .col:first-child p.product-title').data('code');
    var country = $('.search-result > .col:first-child .product-tag.country').attr('data-country');
    var year = $('.search-result > .col:first-child .product-tag.year').attr('data-year');
    var climateMetrics = $('.search-result > .col:first-child .product-tag.climate-metrics').attr('data-climate-metrics');
    var chosenAmount = $('.search-result > .col:first-child #amount').val();
    var chosenUnit = $('.search-result > .col:first-child #unit').val();
    var doesItCompare = false;
    $('.search-result').each(function () {
      if ($(this).find('.adt-close').length > 0) {
        doesItCompare = true;
      }
    });
    var productTitleCompare = '';
    var productCodeCompare = '';
    var countryCompare = '';
    var yearCompare = '';
    var climateMetricsCompare = '';
    var chosenAmountCompare = '';
    var chosenUnitCompare = '';
    if (doesItCompare) {
      productTitleCompare = $('.search-result.basic .col:nth-child(2) p.product-title').text();
      productCodeCompare = $('.search-result .col:nth-child(2) p.product-title').data('code');
      countryCompare = $('.search-result > .col:nth-child(2) .product-tag.country').attr('data-country');
      yearCompare = $('.search-result > .col:nth-child(2) .product-tag.year').attr('data-year');
      climateMetricsCompare = $('.search-result > .col:nth-child(2) .product-tag.climate-metrics').attr('data-climate-metrics');
      chosenAmountCompare = $('.search-result > .col:nth-child(2) #amount').val();
      chosenUnitCompare = $('.search-result > .col:nth-child(2) #unit').val();
    }
    data = {
      title: productTitle,
      content: productTitle,
      footprint: productFootprint,
      footprint_type: productFootprintType,
      product_code: productCode,
      footprint_country: country,
      footprint_year: year,
      footprint_climate_metrics: climateMetrics,
      amount_chosen: chosenAmount,
      unit_chosen: chosenUnit,
      title_compared: productTitleCompare,
      content_compared: productTitleCompare,
      footprint_compared: productFootprint,
      footprint_type_compared: productFootprintType,
      product_code_compared: productCodeCompare,
      footprint_country_compared: countryCompare,
      footprint_year_compared: yearCompare,
      footprint_climate_metrics_compared: climateMetricsCompare,
      amount_chosen_compared: chosenAmountCompare,
      unit_chosen_compared: chosenUnitCompare,
      footprint_view: FootprintView
    };
    adt_save_search_history_on_click(data);
  });
});
function adt_get_product_info(productTitle, productCode, productUuid, chosenValues) {
  productInfo = [];
  jQuery.ajax({
    type: 'POST',
    url: localize._ajax_url,
    data: {
      _ajax_nonce: localize._ajax_nonce,
      action: 'adt_get_product_footprint',
      title: productTitle,
      code: productCode,
      uuid: productUuid,
      footprint_location: chosenValues['footprint_location'],
      footprint_type: chosenValues['footprint_type'],
      footprint_year: chosenValues['footprint_year']
    },
    beforeSend: function beforeSend() {},
    success: function success(response) {
      var dataArray = response.data;

      // Error message
      if (!dataArray.title) {
        jQuery('.error-message').slideDown('fast');
        jQuery('#initial-error-message').slideDown('fast');
        return;
      } else {
        jQuery('.error-message').slideUp('fast');
        jQuery('#initial-error-message').slideUp('fast');
      }
      localStorage.setItem("footprint_data", JSON.stringify(dataArray));
      var compareButtons = jQuery('.search-result .col:nth-child(2)').find('a.col-inner');
      if (compareButtons.length > 0) {
        adt_update_original_info(dataArray);
      } else {
        adt_update_comparison_info(dataArray);
      }
      adt_show_search_results();
      jQuery('#initial-error-message').slideUp('fast');
      jQuery('html, body').animate({
        scrollTop: jQuery(".co2-form-result").offset().top - 90
      }, 500); // 500ms = 0.5 second animation time
    },
    error: function error(response) {
      var _response$responseJSO;
      // Request was throttled
      jQuery('#initial-error-message').html('<p>' + ((_response$responseJSO = response.responseJSON) === null || _response$responseJSO === void 0 ? void 0 : _response$responseJSO.data.error) + '</p>');
      jQuery('#initial-error-message').slideDown('fast');
    }
  });

  // Save the data to wp_adt_popular_searches
  jQuery.ajax({
    type: 'POST',
    url: localize._ajax_url,
    data: {
      _ajax_nonce: localize._ajax_nonce,
      action: 'adt_log_popular_search',
      search_phrase: productTitle,
      product_code: productCode,
      product_uuid: productUuid,
      footprint_location: chosenValues['footprint_location'],
      footprint_type: chosenValues['footprint_type'],
      footprint_year: chosenValues['footprint_year']
    },
    beforeSend: function beforeSend() {},
    success: function success(response) {}
  });
}
function adt_get_chosen_values() {
  var chosenArray = [];
  chosenArray['footprint_type'] = jQuery('#footprint-type input[name="footprint_type"]').val();
  chosenArray['footprint_location'] = jQuery('#location').val();
  chosenArray['footprint_year'] = jQuery('#year').val();
  return chosenArray;
}
function adt_update_tags(boxToUpdate) {
  var typeValue = jQuery('#footprint-type input[name="footprint_type"]').val();
  var type = 'Cradle to gate';
  if (typeValue === 'market') {
    type = 'Cradle to consumer';
  }
  var country = jQuery('#location option:selected').text();
  var countryVal = jQuery('#location option:selected').val();
  var year = jQuery('#year option:selected').text();
  var climateMetrics = jQuery('#climate-metric option:selected').text();
  var climateMetricsVal = jQuery('#climate-metric').val();
  var whichChild = ':first-child';
  if (boxToUpdate === 'comparison') {
    whichChild = ':nth-child(2)';
  }
  jQuery('.search-result > .col' + whichChild + ' .product-tag.footprint-type').each(function () {
    jQuery(this).text(type);
    jQuery(this).attr('data-type', typeValue);
  });
  jQuery('.search-result > .col' + whichChild + ' .product-tag.country').each(function () {
    jQuery(this).text(country);
    jQuery(this).attr('data-country', countryVal);
  });
  jQuery('.search-result > .col' + whichChild + ' .product-tag.year').each(function () {
    jQuery(this).text(year);
    jQuery(this).attr('data-year', year);
  });
  jQuery('.search-result > .col' + whichChild + ' .product-tag.climate-metrics').each(function () {
    jQuery(this).text(climateMetrics);
    jQuery(this).attr('data-climate-metrics', climateMetricsVal);
  });
}
function adt_change_data_set() {
  var dataArray = JSON.parse(localStorage.getItem("footprint_data"));
  jQuery('.search-result').each(function () {
    var element = jQuery(this);
    jQuery(dataArray.all_data).each(function (i) {
      if (dataArray.all_data[i].id == dataSet) {
        jQuery(element).attr('data-set-' + i, dataSet);
      }
    });
  });
}
function adt_update_original_info(dataArray) {
  localStorage.getItem("footprint_data");
  adt_update_tags('original');
  jQuery('.search-result .col:first-child p.product-title').each(function () {
    jQuery(this).text(dataArray.title);
    jQuery(this).attr('data-code', dataArray.flow_code);
  });
  var element = '';
  jQuery('.search-result .col:first-child').each(function () {
    // This loops over the basic and advanced search result
    element = jQuery(this);
    jQuery(element).find('select.unit').empty();

    // More Units: kWh, MJ, TJ, tonne, Meuro, item.
    // 1 TJ = 1,000,000 MJ (1 million MJ).
    jQuery(dataArray.all_data).each(function (i) {
      var unit = dataArray.all_data[i].unit_reference;
      if (dataArray.all_data[i].unit_reference === 'Meuro') {
        unit = 'EUR';
      }
      if (dataArray.all_data[i].unit_reference === 'tonnes') {
        unit = 'kg';
      }
      jQuery(element).attr('data-set-' + i, dataArray.all_data[i].id);
      jQuery(element).find('select.unit').append('<option value="' + dataArray.all_data[i].unit_reference + '">' + unit + '</option>');
    });
    var defualtValue = jQuery(element).find('select.unit').val();
    if (defualtValue === 'Meuro') {
      var numberValueInCurrency = dataArray.all_data[1].value;
      var formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numberValueInCurrency);
      jQuery(element).find('.product-result').text(formatted);
      jQuery(element).find('.product-result-unit').text('price CO2eq'); // ???
    }
    if (defualtValue === 'tonnes') {
      // Number in tonnes. It has to be converted to kg
      var numberValueInWeight = dataArray.all_data[0].value;
      // Overwriting Number with the new value in kg
      var _formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numberValueInWeight);
      jQuery(element).find('.product-result').text(_formatted);
      jQuery(element).find('.product-result-unit').text('kg CO2eq');
    }
    var defaultValue = parseFloat(jQuery('.product-result', element).text());
    jQuery(element).find('select.unit').on('change', function () {
      var chosenValue = jQuery(this).val();

      // Reset number in .amount field when changing the unit
      jQuery('.search-result .col:first-child .amount').each(function () {
        jQuery(this).val('1');
      });
      jQuery('.search-result .col:first-child select.unit').each(function () {
        jQuery(this).val(chosenValue);
        var newElement = jQuery(this).closest('.col-inner');
        if (chosenValue === 'Meuro') {
          var _numberValueInCurrency = dataArray.all_data[1].value;
          var _formatted2 = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(_numberValueInCurrency);
          var numberInput = jQuery('.amount', newElement).val();
          // console.log(numberInput);

          jQuery(newElement).find('.product-result').text(_formatted2);
          jQuery(newElement).find('.product-result-unit').text('price CO2eq'); // ???
          defaultValue = parseFloat(jQuery('.product-result', newElement).text());
        }
        if (chosenValue === 'tonnes') {
          // Number in tonnes. It has to be converted to kg
          var _numberValueInWeight = dataArray.all_data[0].value;
          // Overwriting Number with the new value in kg
          var _formatted3 = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(_numberValueInWeight);
          var _numberInput = jQuery('.amount', newElement).val();
          // console.log(numberInput);

          jQuery(newElement).find('.product-result').text(_formatted3);
          jQuery(newElement).find('.product-result-unit').text('kg CO2eq');
          defaultValue = parseFloat(jQuery('.product-result', newElement).text());
        }
      });

      // adt_update_recipe(dataArray, 'original', true);
    });

    // This changes the number foreach input in the .amount field
    jQuery('.amount', element).each(function () {
      var inputElement = jQuery(this).closest('.col-inner');
      jQuery('.amount', inputElement).on('input', function () {
        var numberInput = jQuery(this).val();
        var calculatedValue = defaultValue * numberInput;
        jQuery('.search-result .col:first-child .amount').each(function () {
          jQuery(this).val(numberInput);
        });
        jQuery('.search-result .col:first-child .product-result').each(function () {
          jQuery(this).text(calculatedValue);
        });

        // adt_update_recipe(dataArray, 'original');
      });
    });
  });
  adt_update_recipe(dataArray, 'original');
}

// Comparison code
jQuery(document).ready(function ($) {
  $('a:has(.add)').click(function (e) {
    e.preventDefault();
    $('.search-result').each(function () {
      var original = $(this).find('.col:first-child');
      var clone = original.clone();
      original.after(clone);
      clone.append('<span class="adt-close"></span>');
      $('a:has(.add)').closest('.col').css('display', 'none');
      $('.adt-close').click(function () {
        $('.adt-close').each(function () {
          $(this).closest('.col').remove();
        });
        $('a:has(.add)').closest('.col').css('display', 'flex');
      });
    });
    adt_download_recipe_csv();
    adt_update_comparison_info();
  });
});
function adt_update_comparison_info() {
  var dataArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  localStorage.getItem("footprint_data");
  adt_update_tags('comparison');
  jQuery('.search-result .col:nth-child(2) p.product-title').each(function () {
    jQuery(this).text(dataArray.title);
    jQuery(this).attr('data-code', dataArray.flow_code);
  });
  var element = '';
  jQuery('.search-result .col:nth-child(2)').each(function () {
    // This loops over the basic and advanced search result
    element = jQuery(this);
    jQuery(element).find('select.unit').empty();
    jQuery(dataArray.all_data).each(function (i) {
      var unit = 'kg';
      if (dataArray.all_data[i].unit_reference === 'Meuro') {
        unit = 'EUR';
      } else if (dataArray.all_data[i].unit_reference === 'tonnes') {
        unit = 'kg';
      }
      jQuery(element).attr('data-set-' + i, dataArray.all_data[i].id);
      jQuery(element).find('select.unit').append('<option value="' + dataArray.all_data[i].unit_reference + '">' + unit + '</option>');
    });
    var defualtValue = jQuery(element).find('select.unit').val();
    if (defualtValue === 'Meuro') {
      var numberValueInCurrency = dataArray.all_data[1].value;
      var formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numberValueInCurrency);
      jQuery(element).find('.product-result').text(formatted);
      jQuery(element).find('.product-result-unit').text('price CO2eq'); // ???
    }
    if (defualtValue === 'tonnes') {
      // Number in tonnes. It has to be converted to kg
      var numberValueInWeight = dataArray.all_data[0].value;
      // Overwriting Number with the new value in kg
      var _formatted4 = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numberValueInWeight);
      jQuery(element).find('.product-result').text(_formatted4);
      jQuery(element).find('.product-result-unit').text('kg CO2eq');
    }
    var defaultValue = parseFloat(jQuery('.product-result', element).text());
    jQuery(element).find('select.unit').on('change', function () {
      var chosenValue = jQuery(this).val();

      // Reset number in .amount field when changing the unit
      jQuery('.search-result .col:nth-child(2) .amount').each(function () {
        jQuery(this).val('1');
      });
      jQuery('.search-result .col:nth-child(2) select.unit').each(function () {
        jQuery(this).val(chosenValue);
        var newElement = jQuery(this).closest('.col-inner');
        if (chosenValue === 'Meuro') {
          var _numberValueInCurrency2 = dataArray.all_data[1].value;
          var _formatted5 = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(_numberValueInCurrency2);
          var numberInput = jQuery('.amount', newElement).val();
          // console.log(numberInput);

          jQuery(newElement).find('.product-result').text(_formatted5);
          jQuery(newElement).find('.product-result-unit').text('price CO2eq'); // ???
          defaultValue = parseFloat(jQuery('.product-result', newElement).text());
        }
        if (chosenValue === 'tonnes') {
          // Number in tonnes. It has to be converted to kg
          var _numberValueInWeight2 = dataArray.all_data[0].value;
          // Overwriting Number with the new value in kg
          var _formatted6 = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(_numberValueInWeight2);
          var _numberInput2 = jQuery('.amount', newElement).val();
          // console.log(numberInput);

          jQuery(newElement).find('.product-result').text(_formatted6);
          jQuery(newElement).find('.product-result-unit').text('kg CO2eq');
          defaultValue = parseFloat(jQuery('.product-result', newElement).text());
        }
      });

      // adt_update_recipe(dataArray, 'comparison', true);
    });

    // This changes the number foreach input in the .amount field
    jQuery('.amount', element).each(function () {
      var inputElement = jQuery(this).closest('.col-inner');
      jQuery('.amount', inputElement).on('input', function () {
        console.log('test');
        var numberInput = jQuery(this).val();
        var calculatedValue = defaultValue * numberInput;
        jQuery('.search-result .col:nth-child(2) .amount').each(function () {
          jQuery(this).val(numberInput);
        });
        jQuery('.search-result .col:nth-child(2) .product-result').each(function () {
          jQuery(this).text(calculatedValue);
        });

        // adt_update_recipe(dataArray, 'comparison');
      });
    });
  });

  // adt_update_recipe(dataArray, 'comparison');
}
function adt_update_recipe(dataArray, boxToUpdate) {
  var isChanged = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var tableMarkup = '';
  var otherRowMarkup = '';
  var rowMarkup = '';
  var whichChild = 'first-child';
  // Recipe return structure changed
  var recipeArray = dataArray.recipe.results;

  // Get the amount and unit of the product
  var amount = jQuery('.search-result .col:' + whichChild + ' .amount').val();
  var unit = jQuery('.search-result .col:' + whichChild + ' select.unit').val();
  var chosenCountry = jQuery('select#location').val();
  // Just get the version from the currently available data
  // let newestVersion = dataArray.recipe[0].version;

  // console.log(dataArray);

  // Convert the tonnes amount to kg
  // if (unit === 'tonnes') {
  //     amount = amount;
  // }

  jQuery.each(recipeArray, function (index, recipe) {
    // https://lca.aau.dk/api/footprint/?flow_code=A_Pears&region_code=DK&version=v1.1.0
    rowMarkup = '<tr>';
    rowMarkup += '<td><a href="#" data-code="' + recipe.flow_input + '" data-uuid="' + recipe.id + '" data-country="' + recipe.region_inflow + '">' + recipe.flow_input + '</a></td>';
    rowMarkup += '<td>' + recipe.region_inflow + '</td>';
    rowMarkup += '<td>' + recipe.value_inflow + '</td>';
    rowMarkup += '<td>' + recipe.value_emission + '</td>';
    rowMarkup += '</tr>';
    if (recipe.flow_input.toLowerCase() === "other") {
      otherRowMarkup = rowMarkup; // Store "other" row separately
    } else {
      tableMarkup += rowMarkup; // Append all other rows normally
    }

    // jQuery.ajax({
    //     type: 'POST',
    //     url: localize._ajax_url,
    //     data: {
    //         _ajax_nonce: localize._ajax_nonce,
    //         action: 'adt_get_product_footprint',
    //         code: recipe.flow_input,
    //         uuid: recipe.id,
    //         footprint_location: recipe.region_inflow,
    //     },
    //     beforeSend: function() {

    //     },
    //     success: (response) => {
    //         let dataArray = response.data;

    //         tableMarkup += '<tr>';
    //         tableMarkup += '<td><a href="#" data-code="'+recipe.flow_input+'" data-uuid="'+recipe.id+'" data-country="'+recipe.region_inflow+'">' + dataArray.title + '</a></td>';
    //         tableMarkup += '<td>' + recipe.region_inflow + '</td>';
    //         tableMarkup += '<td>' + recipe.value_inflow + '</td>';
    //         tableMarkup += '<td>' + recipe.value_emission + '</td>';
    //         tableMarkup += '</tr>';

    //         // Insert new markup here
    //         jQuery('.search-result > .col:'+whichChild+' .emissions-table tbody').html(tableMarkup);

    //         adt_switch_between_recipe_items();
    //     }
    // });
  });

  // Append "other" row at the end if it exists
  tableMarkup += otherRowMarkup;
  jQuery('.search-result > .col:' + whichChild + ' .emissions-table tbody').html(tableMarkup);
  if (boxToUpdate === 'comparison') {
    whichChild = 'nth-child(2)';
  }

  // If unit is changed, then get new information from API
  // let newTableMarkup = '';

  // console.log(isChanged);
  // if (isChanged) {
  //     jQuery.ajax({
  //         type: 'POST',
  //         url: localize._ajax_url,
  //         data: {
  //             _ajax_nonce: localize._ajax_nonce,
  //             action: 'adt_get_updated_recipe_info',
  //             unitInflow: unit,
  //             productCode: dataArray.flow_code,
  //             country: chosenCountry,
  //             version: newestVersion,
  //         },
  //         beforeSend: function() {
  //             jQuery('.search-result > .col:'+whichChild+' .emissions-table tbody').html('');
  //         },
  //         success: (response) => {
  //             let newRecipeArray = response.data;

  //             console.log(newRecipeArray);

  //             jQuery.each(newRecipeArray, function(index, recipe) {
  //                 newTableMarkup += '<tr>';
  //                 newTableMarkup += '<td><a href="#">' + recipe.flow_input + '</a></td>';
  //                 newTableMarkup += '<td>' + recipe.region_inflow + '</td>';
  //                 newTableMarkup += '<td>' + recipe.value_inflow + '</td>';
  //                 newTableMarkup += '<td>' + recipe.value_emission + '</td>';
  //                 newTableMarkup += '</tr>';
  //             });

  //             if (boxToUpdate === 'comparison') {
  //                 whichChild = 'nth-child(2)';
  //             }

  //             // Insert new markup here
  //             jQuery('.search-result > .col:'+whichChild+' .emissions-table tbody').html(newTableMarkup);
  //         }
  //     });
  // }
}

// Animations
function adt_show_search_results() {
  jQuery('.co2-form-wrapper .text-center:has(.divider)').show();
  jQuery('.co2-form-result').slideDown('slow', function () {
    // Might need something happening here
  });
}

// Download CSV
function adt_download_recipe_csv() {
  jQuery(".download .button").each(function () {
    jQuery(this).click(function (e) {
      e.preventDefault();
      var csvContent = "";
      jQuery(this).closest('.col-inner').find('.emissions-table tr').each(function () {
        var rowData = [];
        jQuery(this).find("th, td").each(function () {
          rowData.push(jQuery(this).text());
        });
        csvContent += rowData.join(",") + "\n";
      });
      var blob = new Blob([csvContent], {
        type: "text/csv"
      });
      var url = URL.createObjectURL(blob);
      var a = jQuery("<a></a>").attr("href", url).attr("download", "table_data.csv").appendTo("body");
      a[0].click();
      a.remove();
    });
  });
}
function adt_dynamic_search_input(productTitleArray, productCodeArray, productUuidArray) {
  var words = productTitleArray;
  var $input = jQuery('#autocomplete-input');
  var $suggestionsWrapper = jQuery('#suggestions-wrapper');
  var $suggestions = jQuery('#suggestions');
  var $submitBtn = jQuery('.search-input-wrapper button'); // Ensure this ID matches your button's ID
  var currentIndex = -1;
  var suggestionSelected = false;
  var chosenValuesArray = adt_get_chosen_values();
  $input.on('input', function () {
    var query = $input.val().toLowerCase();
    var matches = words.map(function (word, index) {
      return {
        word: word,
        code: productCodeArray[index],
        uuid: productUuidArray[index]
      };
    }).filter(function (item) {
      return item.word.toLowerCase().includes(query);
    });
    $suggestions.empty();
    currentIndex = -1;
    suggestionSelected = false;
    if (matches.length > 0 && query) {
      jQuery(this).css('border-radius', '50px 50px 0 0').css('border-bottom', 'none');
      $suggestionsWrapper.show();
      matches.forEach(function (match) {
        var $div = jQuery('<div>').text(match.word).addClass('suggestion-item').attr('data-code', match.code).attr('data-uuid', match.uuid).on('click', function () {
          selectSuggestion(match.word, match.code, match.uuid);
        });
        $suggestions.append($div);
      });
    } else {
      jQuery(this).css('border-radius', '50px').css('border-bottom', '1px solid #ddd');
      $suggestionsWrapper.hide();
    }
  });
  $input.on('keydown', function (e) {
    var $items = $suggestions.find('.suggestion-item');
    if ($items.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % $items.length;
        markCurrentItem($items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + $items.length) % $items.length;
        markCurrentItem($items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentIndex >= 0) {
          var selectedItem = $items.eq(currentIndex);
          selectSuggestion(selectedItem.text(), selectedItem.data('code'), selectedItem.data('uuid'));
        } else if (!suggestionSelected && $items.length > 0) {
          var firstItem = $items.eq(0);
          selectSuggestion(firstItem.text(), firstItem.data('code'), firstItem.data('uuid'));
        }
      }
    }
  });
  $submitBtn.on('click', function (e) {
    e.preventDefault();
    var $items = $suggestions.find('.suggestion-item');
    if (!suggestionSelected && $items.length > 0) {
      var firstItem = $items.eq(0);
      selectSuggestion(firstItem.text(), firstItem.data('code'), firstItem.data('uuid'));
    }
  });
  jQuery(document).on('click', function (e) {
    if (!jQuery(e.target).is($input)) {
      $suggestionsWrapper.hide();
      jQuery($input).css('border-radius', '50px').css('border-bottom', '1px solid #ddd');
    }
  });
  function markCurrentItem($items) {
    $items.removeClass('highlight');
    if (currentIndex >= 0) {
      $items.eq(currentIndex).addClass('highlight');
    }
  }
  function selectSuggestion(text, code, uuid) {
    $input.val(text).attr('data-code', code).attr('data-uuid', uuid);
    $suggestionsWrapper.hide();
    jQuery($input).css('border-radius', '50px').css('border-bottom', '1px solid #ddd');
    suggestionSelected = true;
    chosenValuesArray = adt_get_chosen_values();
    adt_get_product_info(text, code, uuid, chosenValuesArray);
  }
}
function adt_switch_between_recipe_items() {
  jQuery('.emissions-table a').on('click', function (e) {
    e.preventDefault();
    var productTitle = jQuery(this).text();
    var productCode = jQuery(this).data('code');
    var productUuid = jQuery(this).data('uuid');
    var chosenValues = adt_get_chosen_values();
    chosenValues['footprint_location'] = jQuery(this).data('country');
    console.log('Make sure this only run once!');
    // adt_get_product_info(productTitle, productCode, productUuid, chosenValues);
  });
}
function adt_save_search_history_on_click(data) {
  var dummyData = {
    amount_chosen: "1",
    amount_chosen_compared: "2",
    content: "Cauliflowers and broccoli, market of",
    content_compared: "Cucumbers and gherkins, market of",
    footprint: "product",
    footprint_climate_metrics: "gwp100",
    footprint_climate_metrics_compared: "gwp100",
    footprint_compared: "product",
    footprint_country: "AT",
    footprint_country_compared: "DK",
    footprint_type: "product",
    footprint_type_compared: "product",
    footprint_year: "2016",
    footprint_year_compared: "2016",
    product_code: "M_Cauli",
    product_code_compared: "M_Cucus",
    title: "Cauliflowers and broccoli, market of",
    title_compared: "Cucumbers and gherkins, market of",
    unit_chosen: "tonnes",
    unit_chosen_compared: "Meuro"
  };
  jQuery.ajax({
    type: 'POST',
    url: localize._ajax_url,
    data: {
      _ajax_nonce: localize._ajax_nonce,
      action: 'adt_save_shared_search',
      data: data
    },
    beforeSend: function beforeSend() {},
    success: function success(response) {
      console.log(response);
    }
  });
}

/***/ }),

/***/ "./assets/scss/style.scss":
/*!********************************!*\
  !*** ./assets/scss/style.scss ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./assets/scss/adt-searchform.scss":
/*!*****************************************!*\
  !*** ./assets/scss/adt-searchform.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./assets/scss/adt-blog-posts.scss":
/*!*****************************************!*\
  !*** ./assets/scss/adt-blog-posts.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./assets/scss/adt-issues.scss":
/*!*************************************!*\
  !*** ./assets/scss/adt-issues.scss ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/dist/js/adt-searchform": 0,
/******/ 			"dist/css/adt-issues": 0,
/******/ 			"dist/css/adt-blog-posts": 0,
/******/ 			"dist/css/adt-searchform": 0,
/******/ 			"style": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunklca_aau"] = self["webpackChunklca_aau"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["dist/css/adt-issues","dist/css/adt-blog-posts","dist/css/adt-searchform","style"], () => (__webpack_require__("./assets/js/adt-searchform.js")))
/******/ 	__webpack_require__.O(undefined, ["dist/css/adt-issues","dist/css/adt-blog-posts","dist/css/adt-searchform","style"], () => (__webpack_require__("./assets/scss/style.scss")))
/******/ 	__webpack_require__.O(undefined, ["dist/css/adt-issues","dist/css/adt-blog-posts","dist/css/adt-searchform","style"], () => (__webpack_require__("./assets/scss/adt-searchform.scss")))
/******/ 	__webpack_require__.O(undefined, ["dist/css/adt-issues","dist/css/adt-blog-posts","dist/css/adt-searchform","style"], () => (__webpack_require__("./assets/scss/adt-blog-posts.scss")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["dist/css/adt-issues","dist/css/adt-blog-posts","dist/css/adt-searchform","style"], () => (__webpack_require__("./assets/scss/adt-issues.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;