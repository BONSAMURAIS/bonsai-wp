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
  $(searchform.products).each(function () {
    productTitleArray.push(this.title);
    productContentArray.push(this.content);
    productCodeArray.push(this.code);
    productUuidArray.push(this.uuid);
  });
  var words = productTitleArray;
  var $input = $('#autocomplete-input');
  var $suggestionsWrapper = $('#suggestions-wrapper');
  var $suggestions = $('#suggestions');
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
      $(this).css('border-radius', '50px 50px 0 0');
      var screenWidth = $(window).width();
      if (screenWidth < 768) {
        $(this).css('border-radius', '22.5px 22.5px 0 0');
      }
      $(this).css('border-bottom', 'none');
      $suggestionsWrapper.show();
      matches.forEach(function (match) {
        var $div = $('<div>').text(match.word).addClass('suggestion-item').attr('data-code', match.code).attr('data-uuid', match.uuid).on('click', function () {
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
      $(this).css('border-radius', '50px');
      $(this).css('border-bottom', '1px solid #ddd');
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
          $($input).css('border-radius', '50px');
          $($input).css('border-bottom', '1px solid #ddd');
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
  $(document).on('click', function (e) {
    if (!$(e.target).is($input)) {
      $suggestionsWrapper.hide();
      $($input).css('border-radius', '50px');
      $($input).css('border-bottom', '1px solid #ddd');
    }
  });
  function markCurrentItem($items) {
    $items.removeClass('highlight'); // Remove highlight from all items
    if (currentIndex >= 0) {
      $items.eq(currentIndex).addClass('highlight'); // Highlight the current item
    }
  }
  $('.co2-form-result > .select-wrapper select').on('change', function () {
    var jsonObject = localStorage.getItem("footprint_data");
    jsonObject = JSON.parse(jsonObject);
    var chosenValues = adt_get_chosen_values();
    adt_get_product_info(jsonObject.title, jsonObject.flow_code, jsonObject.uuid, chosenValues);
  });
});
function adt_get_product_info(productTitle, productCode, productUuid, chosenValues) {
  productInfo = [];
  console.log(chosenValues);
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
        return;
      } else {
        jQuery('.error-message').slideUp('fast');
      }
      localStorage.setItem("footprint_data", JSON.stringify(dataArray));
      var compareButtons = jQuery('.search-result .col:last-child').find('a.col-inner');
      if (compareButtons.length > 0) {
        adt_update_original_info(dataArray);
      } else {
        adt_update_comparison_info(dataArray);
      }
      adt_show_search_results();
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
  //         console.log(response);
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
    success: function success(response) {
      console.log(response.data);
    }
  });
}
function adt_get_chosen_values() {
  var chosenArray = [];
  chosenArray['footprint_type'] = jQuery('#footprint-type').val();
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
    whichChild = ':last-child';
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
    element = jQuery(this);
    jQuery(element).find('select#unit').empty();
    jQuery(dataArray.all_data).each(function (i) {
      var unit = 'kg';
      if (dataArray.all_data[i].unit_reference === 'Meuro') {
        unit = 'EUR';
      } else if (dataArray.all_data[i].unit_reference === 'tonnes') {
        unit = 'kg';
      }
      jQuery(element).attr('data-set-' + i, dataArray.all_data[i].id);
      jQuery(element).find('select#unit').append('<option value="' + dataArray.all_data[i].unit_reference + '">' + unit + '</option>');
    });
  });
}

// Comparison code
jQuery(document).ready(function ($) {
  $('a:has(.add)').click(function (e) {
    e.preventDefault();
    $('.search-result').each(function () {
      var original = $(this).find('.col:first-child');
      var clone = original.clone();
      $(this).find('.col:last-child').remove();
      original.after(clone);
    });
  });
});
function adt_update_comparison_info(dataArray) {
  localStorage.getItem("footprint_data");
  adt_update_tags('comparison');
  jQuery('.search-result .col:last-child p.product-title').each(function () {
    jQuery(this).text(dataArray.title);
  });
  var element = '';
  jQuery('.search-result .col:last-child').each(function () {
    element = jQuery(this);
    jQuery(element).find('select#unit').empty();
    jQuery(dataArray.all_data).each(function (i) {
      var unit = 'kg';
      if (dataArray.all_data[i].unit_reference === 'Meuro') {
        unit = 'EUR';
      } else if (dataArray.all_data[i].unit_reference === 'tonnes') {
        unit = 'kg';
      }
      jQuery(element).attr('data-set-' + i, dataArray.all_data[i].id);
      jQuery(element).find('select#unit').append('<option value="' + dataArray.all_data[i].unit_reference + '">' + unit + '</option>');
    });
  });
}

// Animations
function adt_show_search_results() {
  jQuery('.co2-form-wrapper .text-center:has(.divider)').show();
  jQuery('.co2-form-result').slideDown('slow', function () {
    // Might need something happening here
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