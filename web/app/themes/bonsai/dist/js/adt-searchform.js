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
  var chosenFootprintType = $('#footprint-type input[name="footprint_type"]').val();
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
      console.log(dataArray);

      // Error message
      if (!dataArray.title) {
        jQuery('.error-message').slideDown('fast');
        return;
      } else {
        jQuery('.error-message').slideUp('fast');
      }
      localStorage.setItem("footprint_data", JSON.stringify(dataArray));
      var compareButtons = jQuery('.search-result .col:nth-child(2)').find('a.col-inner');
      if (compareButtons.length > 0) {
        adt_update_original_info(dataArray);
      } else {
        adt_update_comparison_info(dataArray);
      }
      adt_show_search_results();
      jQuery('html, body').animate({
        scrollTop: jQuery(".co2-form-result").offset().top - 90
      }, 500); // 500ms = 0.5 second animation time
    }
  });

  // jQuery.ajax({
  //     type: 'POST',
  //     url: localize._ajax_url,
  //     data: {
  //         _ajax_nonce: localize._ajax_nonce,
  //         action: 'adt_get_product_recipe',
  //         title: productTitle,
  //         code: productCode,
  //         uuid: productUuid,
  //     },
  //     beforeSend: function() {

  //     },
  //     success: (response) => {
  //     }
  // });

  // return productInfo;

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
  var typeValue = jQuery('#footprint-type option:selected').val();
  var type = 'Cradle to gate';
  if (typeValue === 'market') {
    type = 'Cradle to consumer';
  }
  var country = jQuery('#location option:selected').text();
  var year = jQuery('#year option:selected').text();
  var whichChild = ':first-child';
  if (boxToUpdate === 'comparison') {
    whichChild = ':nth-child(2)';
  }
  jQuery('.search-result > .col' + whichChild + ' .product-tag.footprint-type').each(function () {
    jQuery(this).text(type);
  });
  jQuery('.search-result > .col' + whichChild + ' .product-tag.country').each(function () {
    jQuery(this).text(country);
  });
  jQuery('.search-result > .col' + whichChild + ' .product-tag.year').each(function () {
    jQuery(this).text(year);
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
  });
  var element = '';
  jQuery('.search-result .col:first-child').each(function () {
    // This loops over the basic and advanced search result
    element = jQuery(this);
    jQuery(element).find('select.unit').empty();
    jQuery(dataArray.all_data).each(function (i) {
      var unit = 'kg';
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
      numberValueInCurrency = numberValueInCurrency.toFixed(2);
      jQuery(element).find('.product-result').text(numberValueInCurrency);
      jQuery(element).find('.product-result-unit').text('price CO2eq'); // ???
    }
    if (defualtValue === 'tonnes') {
      // Number in tonnes. It has to be converted to kg
      var numberValueInWeight = dataArray.all_data[0].value;
      // Overwriting Number with the new value in kg
      numberValueInWeight = numberValueInWeight * 1000;
      numberValueInWeight = numberValueInWeight.toFixed(2);
      jQuery(element).find('.product-result').text(numberValueInWeight);
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
          _numberValueInCurrency = _numberValueInCurrency.toFixed(2);
          var numberInput = jQuery('.amount', newElement).val();
          console.log(numberInput);
          jQuery(newElement).find('.product-result').text(_numberValueInCurrency);
          jQuery(newElement).find('.product-result-unit').text('price CO2eq'); // ???
          defaultValue = parseFloat(jQuery('.product-result', newElement).text());
        }
        if (chosenValue === 'tonnes') {
          // Number in tonnes. It has to be converted to kg
          var _numberValueInWeight = dataArray.all_data[0].value;
          // Overwriting Number with the new value in kg
          _numberValueInWeight = _numberValueInWeight * 1000;
          _numberValueInWeight = _numberValueInWeight.toFixed(2);
          var _numberInput = jQuery('.amount', newElement).val();
          console.log(_numberInput);
          jQuery(newElement).find('.product-result').text(_numberValueInWeight);
          jQuery(newElement).find('.product-result-unit').text('kg CO2eq');
          defaultValue = parseFloat(jQuery('.product-result', newElement).text());
        }
      });
      adt_update_recipe(dataArray, 'original', true);
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
        adt_update_recipe(dataArray, 'original');
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
      clone.append('<span class="close-god-damn"></span>');
      $('a:has(.add)').closest('.col').css('display', 'none');
      $('.close-god-damn').click(function () {
        $('.close-god-damn').each(function () {
          $(this).closest('.col').remove();
        });
        $('a:has(.add)').closest('.col').css('display', 'flex');
      });
    });
    adt_download_recipe_csv();
  });
});
function adt_update_comparison_info(dataArray) {
  localStorage.getItem("footprint_data");
  adt_update_tags('comparison');
  jQuery('.search-result .col:nth-child(2) p.product-title').each(function () {
    jQuery(this).text(dataArray.title);
  });
  var element = '';
  jQuery('.search-result .col:nth-child(2)').each(function () {
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
      numberValueInCurrency = numberValueInCurrency.toFixed(2);
      jQuery(element).find('.product-result').text(numberValueInCurrency);
      jQuery(element).find('.product-result-unit').text('price CO2eq'); // ???
    }
    if (defualtValue === 'tonnes') {
      // Number in tonnes. It has to be converted to kg
      var numberValueInWeight = dataArray.all_data[0].value;
      // Overwriting Number with the new value in kg
      numberValueInWeight = numberValueInWeight * 1000;
      numberValueInWeight = numberValueInWeight.toFixed(2);
      jQuery(element).find('.product-result').text(numberValueInWeight);
      jQuery(element).find('.product-result-unit').text('kg CO2eq');
    }
    jQuery(element).find('select.unit').on('change', function () {
      var chosenValue = jQuery(this).val();
      jQuery('.search-result .col:nth-child(2) select.unit').each(function () {
        jQuery(this).val(chosenValue);
        var newElement = jQuery(this).closest('.col-inner');
        if (chosenValue === 'Meuro') {
          var _numberValueInCurrency2 = dataArray.all_data[1].value;
          _numberValueInCurrency2 = _numberValueInCurrency2.toFixed(2);
          jQuery(newElement).find('.product-result').text(_numberValueInCurrency2);
          jQuery(newElement).find('.product-result-unit').text('price CO2eq'); // ???
        }
        if (chosenValue === 'tonnes') {
          // Number in tonnes. It has to be converted to kg
          var _numberValueInWeight2 = dataArray.all_data[0].value;
          // Overwriting Number with the new value in kg
          _numberValueInWeight2 = _numberValueInWeight2 * 1000;
          _numberValueInWeight2 = _numberValueInWeight2.toFixed(2);
          jQuery(newElement).find('.product-result').text(_numberValueInWeight2);
          jQuery(newElement).find('.product-result-unit').text('kg CO2eq');
        }
      });
      adt_update_recipe(dataArray, 'comparison', true);
    });
  });
  adt_update_recipe(dataArray, 'comparison');
}
function adt_update_recipe(dataArray, boxToUpdate) {
  var isChanged = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var tableMarkup = '';
  var whichChild = 'first-child';
  var recipeArray = dataArray.recipe;

  // Get the amount and unit of the product
  var amount = jQuery('.search-result .col:' + whichChild + ' .amount').val();
  var unit = jQuery('.search-result .col:' + whichChild + ' select.unit').val();
  var chosenCountry = jQuery('select#location').val();
  // Just get the version from the currently available data
  var newestVersion = dataArray.recipe[0].version;
  console.log(dataArray);

  // Convert the tonnes amount to kg
  if (unit === 'tonnes') {
    amount = amount * 1000;
  }

  // <th>Inputs</th> <!-- flow_input -->
  // <th>Country</th> <!-- region_inflow -->
  // <th>Input</th> <!-- value_inflow + unit_inflow -->
  // <th>Emissions<span>[kg CO2eq]</span></th> <!-- value_emission + unit_emission -->

  // Button 
  // <button 
  // data-code="M_Pines" 
  // data-uuid="dbcd7e97-b343-40b7-85db-8b5e51c00b99" 
  // data-choices="{" footprint_type":="" "product",="" "footprint_year":="" "2016",="" "footprint_location":="" "at"}"="">
  // pineapples
  // </button>

  jQuery.each(recipeArray, function (index, recipe) {
    // https://lca.aau.dk/api/footprint/?flow_code=A_Pears&region_code=DK&version=v1.1.0
    jQuery.ajax({
      type: 'POST',
      url: localize._ajax_url,
      data: {
        _ajax_nonce: localize._ajax_nonce,
        action: 'adt_get_product_footprint',
        code: recipe.flow_input,
        uuid: recipe.id,
        footprint_location: recipe.region_inflow
      },
      beforeSend: function beforeSend() {},
      success: function success(response) {
        var dataArray = response.data;
        console.log(dataArray);
        jQuery('html, body').animate({
          scrollTop: jQuery(".co2-form-result").offset().top - 90
        }, 500); // 500ms = 0.5 second animation time

        tableMarkup += '<tr>';
        tableMarkup += '<td><a href="#" data-code="' + recipe.flow_input + '" data-uuid="' + recipe.id + '" data-country="' + recipe.region_inflow + '">' + recipe.flow_input + '</a></td>';
        tableMarkup += '<td>' + recipe.region_inflow + '</td>';
        if (unit === 'tonnes') {
          var valueInflow = recipe.value_inflow * 1000;
          var valueEmission = recipe.value_emission * 1000;
          valueInflow = valueInflow.toFixed(2);
          valueEmission = valueEmission.toFixed(2);
          tableMarkup += '<td>' + valueInflow + '</td>';
          tableMarkup += '<td>' + valueEmission + '</td>';
        } else {
          tableMarkup += '<td>' + recipe.value_inflow + '</td>';
          tableMarkup += '<td>' + recipe.value_emission + '</td>';
        }
        tableMarkup += '</tr>';
      }
    });
  });
  if (boxToUpdate === 'comparison') {
    whichChild = 'nth-child(2)';
  }

  // Insert new markup here
  jQuery('.search-result > .col:' + whichChild + ' .emissions-table tbody').html(tableMarkup);

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
  var currentIndex = -1; // To track the currently marked suggestion
  var suggestionSelected = false; // Tracks if a suggestion was selected
  // Get default chosen values
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
    currentIndex = -1; // Reset the index when typing
    suggestionSelected = false; // Reset the selection state

    if (matches.length > 0 && query) {
      jQuery(this).css('border-radius', '50px 50px 0 0');
      var screenWidth = jQuery(window).width();
      if (screenWidth < 768) {
        jQuery(this).css('border-radius', '22.5px 22.5px 0 0');
      }
      jQuery(this).css('border-bottom', 'none');
      $suggestionsWrapper.show();
      matches.forEach(function (match) {
        var $div = jQuery('<div>').text(match.word).addClass('suggestion-item').attr('data-code', match.code).attr('data-uuid', match.uuid).on('click', function () {
          $input.val(match.word);
          $input.attr('data-code', match.code); // Set the product code as data attribute
          $input.attr('data-uuid', match.uuid); // Set the product UUID as data attribute
          $suggestionsWrapper.hide();

          // Update chosen values
          chosenValuesArray = adt_get_chosen_values();
          adt_get_product_info(match.word, match.code, match.uuid, chosenValuesArray);
        });
        $suggestions.append($div);
      });
    } else {
      jQuery(this).css('border-radius', '50px');
      jQuery(this).css('border-bottom', '1px solid #ddd');
      $suggestionsWrapper.hide();
    }
  });
  $input.on('keydown', function (e) {
    var $items = $suggestions.find('.suggestion-item');
    if ($items.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % $items.length; // Move down
        markCurrentItem($items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + $items.length) % $items.length; // Move up
        markCurrentItem($items);
      } else if (e.key === 'Enter') {
        if (currentIndex >= 0) {
          e.preventDefault(); // Prevent form submission when selecting a suggestion
          var selectedText = $items.eq(currentIndex).text();
          $input.val(selectedText);
          $input.attr('data-code', $items.eq(currentIndex).data('code'));
          $input.attr('data-uuid', $items.eq(currentIndex).data('uuid'));
          $suggestionsWrapper.hide();
          jQuery($input).css('border-radius', '50px');
          jQuery($input).css('border-bottom', '1px solid #ddd');
          suggestionSelected = true; // Mark a suggestion as selected

          // Update chosen values
          chosenValuesArray = adt_get_chosen_values();
          adt_get_product_info(selectedText, $input.attr('data-code'), $input.attr('data-uuid'), chosenValuesArray);
        } else if (suggestionSelected) {
          suggestionSelected = false; // Allow form submission on next Enter press
        }
      }
    }
  });
  jQuery(document).on('click', function (e) {
    if (!jQuery(e.target).is($input)) {
      $suggestionsWrapper.hide();
      jQuery($input).css('border-radius', '50px');
      jQuery($input).css('border-bottom', '1px solid #ddd');
    }
  });
  function markCurrentItem($items) {
    $items.removeClass('highlight'); // Remove highlight from all items
    if (currentIndex >= 0) {
      $items.eq(currentIndex).addClass('highlight'); // Highlight the current item
    }
  }
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