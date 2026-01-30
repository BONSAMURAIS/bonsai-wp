import * as CONFIG from "../constants/config.js";
import * as CONST from "../constants/constants.js";

export function capitalize(str) {
  if (!str) return "";
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function reformatValue(value) {
  const precise = Number.parseFloat(value).toPrecision(CONFIG.SIGNIFICANT_NB); // Keep 3 significant digits
  const rounded = Number(precise); // Convert to number to remove scientific notation
  let result = new Intl.NumberFormat(CONFIG.NUMBERFORMAT).format(rounded);
  if ((Math.abs(value) < 1e-3 && value != 0) || Math.abs(value) > 1e9) {
    result = value.toExponential(CONFIG.SIGNIFICANT_NB - 1);
  }

  return result;
}

export function displayLoading() {
  jQuery("#co2-form-result-header").after('<div class="loading"></div>');
  jQuery("#co2-form-result-header").prop("disabled", true);
  jQuery("#error-message-content").remove(); //at the init
}

export function removeLoading() {
  jQuery(".loading").remove();
  jQuery("#co2-form-result-header").prop("disabled", false);
}

export function showLoading() {
  document.getElementById("loadingModal").style.display = "flex";
}

export function hideLoading() {
  document.getElementById("loadingModal").style.display = "none";
}

// Animations
export function show_search_results(id) {
  jQuery(id).slideDown("slow", function () {
    // Might need something happening here
  });
}

export function hide_search_results(id) {
  jQuery(id).slideUp("slow", function () {
    // Might need something happening here
  });
}

export function resizeTextToFit(text) {
  // text needs to be a jquery obj
  let fontSize = CONFIG.FONTSIZE;
  text.style.fontSize = fontSize + "px";

  while (text.offsetWidth > CONFIG.MAX_FONTSIZE && fontSize > 1) {
    fontSize -= 1;
    text.style.fontSize = fontSize + "px";
  }
}

export function parseIfJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value; // not JSON → return original value
  }
}

export function getUnitOptions(dataArray, unit_ref, year) {
  //TODO rename hard coded unit with electricity
  let unitList = [];

  if (unit_ref === CONST.UNIT.MEURO) {
    unitList = [
      { ratio: 1e-3, label: CONST.UNIT.EUR + year }, //ratio is 1e-3 because the unit label changes too ( co2 eq in kg)  1e6 * 1e-3 = 1e-3
      { ratio: 1e-3, label: CONST.UNIT.kEUR + year },
      { ratio: 1, label: CONST.UNIT.mEUR + year },
      {
        ratio: (1 / CONST.RATE_EXCHANGE.EUR_to_DKK_2016) * 1e-3,
        label: CONST.UNIT.DKK + year,
      }, //ratio is 1e-3 because the unit label changes too ( co2 eq in kg)
      {
        ratio: (1 / CONST.RATE_EXCHANGE.EUR_to_DKK_2016) * 1e-3,
        label: CONST.UNIT.kDKK + year,
      },
      {
        ratio: (1 / CONST.RATE_EXCHANGE.EUR_to_DKK_2016) * 1,
        label: CONST.UNIT.mDKK + year,
      },
    ];
  } else if (unit_ref === CONST.UNIT.TONNES) {
    unitList = [
      { ratio: 1, label: CONST.UNIT.KG }, //ratio is 1 because the unit label changes too ( co2 eq in kg)
      // {ratio:1e-3,label:"g"},
      { ratio: 1, label: CONST.UNIT.TONNES }, //ratio is 1 because the unit label changes too ( co2 eq in tonnes)
    ];
  } else if (unit_ref === CONST.UNIT.MJ) {
    //
    if (
      dataArray.all_data[0].flow_code.includes("_elec") ||
      dataArray.all_data[0].flow_code.includes("_POW")
    ) {
      unitList = [{ ratio: 1, label: CONST.UNIT.KWH }];
    } else {
      unitList = [
        { ratio: 1 / 3.6, label: CONST.UNIT.KWH },
        { ratio: 1e-3, label: CONST.UNIT.MJ },
        { ratio: 1, label: CONST.UNIT.GJ }, //ratio is 1 because the unit label changes too ( co2 eq in tonnes)
      ];
    }
  } else if (unit_ref === CONST.UNIT.ITEMS) {
    unitList = [{ ratio: 1, label: CONST.UNIT.ITEMS }];
  } else if (unit_ref === CONST.UNIT.TONNES_SERVICE) {
    unitList = [
      { ratio: 1, label: CONST.UNIT.TONNES }, //requested by Jannick Schmidt
    ];
  } else if (unit_ref == null || unit_ref == CONST.UNIT.PERSON_YEAR) {
    //for person footprint-type
    unitList = [{ ratio: 1, label: CONST.UNIT.PERSON_YEAR }];
  } else if (unit_ref == CONST.UNIT.TJ) {
    unitList = [
      { ratio: 1e-3, label: CONST.UNIT.MJ }, //because co2 eq in kg
      { ratio: 1e3 * (3.6 * 1e-6), label: CONST.UNIT.KWH }, // tonnes to kg + TJ to kWh / 1 TJ = 3.6.10^6
      { ratio: 1e-3, label: CONST.UNIT.GJ }, //ratio is 1 because in TJ in backend
    ];
  } else if (unit_ref === CONST.UNIT.HA_PER_YEAR_WEIGHTED) {
    unitList = [{ ratio: 1, label: CONST.UNIT.HA_PER_YEAR_WEIGHTED }];
  } else if (unit_ref === CONST.UNIT.HA_WEIGHTED) {
    unitList = [{ ratio: 1, label: CONST.UNIT.HA_WEIGHTED }];
  }

  return unitList;
}

const unitList_for_kgco2 = [
  CONST.UNIT.KG.toLowerCase(),
  CONST.UNIT.MJ.toLowerCase(),
  CONST.UNIT.KWH.toLowerCase(),
  CONST.UNIT.EUR.toLowerCase(),
  CONST.UNIT.DKK.toLowerCase(),
];
export function getResultUnitCO2(unit_ref) {
  let finalUnit = unitList_for_kgco2.includes(unit_ref.toLowerCase())
    ? CONST.UNIT.KGCO2
    : CONST.UNIT.TONNESCO2;
  return finalUnit;
}
export function getUnitContriAnalysis(
  selectedUnit,
  unit_inflow,
  unit_reference,
  year
) {
  if (unit_inflow == null) {
    return { ratio: 0, label: "" };
  }
  unit_inflow = unit_inflow.toLowerCase();
  unit_reference = unit_reference.toLowerCase();
  selectedUnit = selectedUnit.toLowerCase();
  console.log(
    "unit_inflow, unit_ref, selecUni=",
    unit_inflow,
    unit_reference,
    selectedUnit
  );

  let finalUnit = { ratio: 1, label: unit_inflow };
  if (unitList_for_kgco2.includes(selectedUnit.toLowerCase())) {
    //emission in kg
    switch (unit_inflow) {
      case CONST.UNIT.TJ.toLowerCase():
        if (unit_reference === CONST.UNIT.TJ.toLowerCase()) {
          if (selectedUnit === CONST.UNIT.MJ.toLowerCase()) {
            finalUnit = { ratio: 1, label: CONST.UNIT.MJ };
          } else if (selectedUnit === CONST.UNIT.KWH.toLowerCase()) {
            finalUnit = { ratio: 3.6, label: CONST.UNIT.KWH };
          }
        } else {
          finalUnit = { ratio: 1e3, label: CONST.UNIT.MJ };
        }
        break;
      case CONST.UNIT.ITEMS.toLowerCase():
        finalUnit = { ratio: 1, label: CONST.UNIT.ITEMS };
        break;
      case CONST.UNIT.MEURO.toLowerCase():
        let ratio = 0;
        if (unit_reference === CONST.UNIT.MEURO.toLowerCase()) {
          ratio = 1;
          if (selectedUnit === CONST.UNIT.DKK.toLowerCase()) {
            ratio /= CONST.RATE_EXCHANGE.EUR_to_DKK_2016;
          }
        } else if (unit_reference === CONST.UNIT.TJ.toLowerCase()) {
          if (selectedUnit === CONST.UNIT.MJ.toLowerCase()) {
            ratio = 1; // TJ to MJ and MEUR to EUR 1e-6 * 1e6 = 1
          } else if (selectedUnit === CONST.UNIT.KWH.toLowerCase()) {
            ratio = 3.6; // TJ to kWh and MEUR to EUR 1e-6 * 1e6 * 3.6 = 3.6
          }
        } else {
          ratio = 1e3; // default: CONST.UNIT.EUR : =>  1e-6 * 1e3 = 1e3 : Meuro to Eur and Tonnes to kg. dont know why = 1
          if (selectedUnit === CONST.UNIT.DKK.toLowerCase()) {
            ratio /= CONST.RATE_EXCHANGE.EUR_to_DKK_2016;
          }
        }
        finalUnit = { ratio: ratio, label: CONST.UNIT.EUR + year };
        break;
      case CONST.UNIT.TONNES.toLowerCase():
      case CONST.UNIT.TONNES_SERVICE.toLowerCase():
        ratio = 1;
        if (unit_reference === CONST.UNIT.TJ.toLowerCase()) {
          if (selectedUnit === CONST.UNIT.MJ.toLowerCase()) {
            ratio = 1e-3;
          } else if (selectedUnit === CONST.UNIT.KWH.toLowerCase()) {
            ratio = 1e-3 * 3.6;
          }
        }
        finalUnit = { ratio: ratio, label: CONST.UNIT.KG };

        break;
    }
  } else {
    //emission in tonnes
    switch (unit_inflow) {
      case CONST.UNIT.TJ.toLowerCase():
        if (unit_reference === CONST.UNIT.TJ.toLowerCase()) {
          if (selectedUnit === CONST.UNIT.GJ.toLowerCase()) {
            finalUnit = { ratio: 1, label: CONST.UNIT.GJ };
          } else {
            finalUnit = { ratio: 1e3, label: CONST.UNIT.GJ };
          }
        } else {
          finalUnit = { ratio: 1e3, label: CONST.UNIT.GJ };
        }
        break;
      case CONST.UNIT.ITEMS.toLowerCase():
        finalUnit = { ratio: 1, label: CONST.UNIT.ITEMS };
        break;
      case CONST.UNIT.MEURO.toLowerCase():
        let ratio = 1; // default: CONST.UNIT.mEUR
        if (selectedUnit === CONST.UNIT.kEUR.toLowerCase()) {
          ratio = 1e-3;
        } else if (selectedUnit === CONST.UNIT.kDKK.toLowerCase()) {
          ratio = 1e-3 / CONST.RATE_EXCHANGE.EUR_to_DKK_2016;
        } else if (selectedUnit === CONST.UNIT.mDKK.toLowerCase()) {
          ratio = 1 / CONST.RATE_EXCHANGE.EUR_to_DKK_2016;
        }
        finalUnit = {
          ratio: ratio,
          label: CONST.UNIT.mEUR.toUpperCase() + year,
        };
        break;
      case CONST.UNIT.TONNES.toLowerCase():
      case CONST.UNIT.TONNES_SERVICE.toLowerCase():
        ratio = 1;
        if (unit_reference === CONST.UNIT.TJ.toLowerCase()) {
          if (selectedUnit === CONST.UNIT.GJ.toLowerCase()) {
            ratio = 1e3;
          }
        }
        finalUnit = { ratio: ratio, label: CONST.UNIT.TONNES };
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
