class UserSelection{
    constructor() {
        this.title = "title";
        this.code = "code";
        this.uuid = "uuid";
        this.countryCode = "";
        this.country = "";
        this.db_version = 'v1.0.0';
        this.year = '1999';
        this.income_group = "";
        this.household_type = "";
        this.climate_metric = "GWP100";
        this.footprint_type = "person";
    }
    
    get_from_url(){
        const params = new URLSearchParams(window.location.search);
        const base64String = params.get('data');
        const jsonString = atob(base64String);  // base64 decode
        const json = JSON.parse(jsonString);

        this.title = json.title;
        this.code = json.code;
        this.uuid = json.uuid;

        this.countryCode =  json.location;
        this.country =  json.country;
        this.db_version = json.db_version;
        this.year = json.year;
        this.income_group = json.income_group;
        this.household_type = json.household_type;
        this.climate_metric = json.climate_metric;
        this.footprint_type = json.footprint_type;
        this.footprint_type_label = json.footprint_type_label;
    }
    
    get_from_form(){
        this.title = jQuery('#autocomplete-input').val();
        this.code = jQuery('#autocomplete-input').attr('data-code');
        this.uuid = "uuid";
        this.countryCode = jQuery('#location option:selected').val();
        this.country = jQuery('#location option:selected').text();
        this.db_version = jQuery('#database-version').val();
        this.year = jQuery('#year option:selected').val();
        this.income_group = jQuery('#income-group option:selected').val();
        this.household_type = jQuery('#household-composition option:selected').val();
        this.climate_metric = jQuery('#climatemetric option:selected').val();
        const typeValue = jQuery('input[name="footprint_type_extend"]:checked').val();
        this.footprint_type = jQuery('input[name="footprint_type"]:checked').val(); //person or product
        this.footprint_type_label = 'Cradle to gate'; //typeValue= product or default
        if (typeValue == 'market') {
            this.footprint_type_label = 'Cradle to consumer';
        } else if (typeValue == 'grave') {
            this.footprint_type_label = 'Cradle to grave';
        }
    }

    get_from_dropdown(){
        this.title = jQuery('#product-analysis-content .product-title').text();
        this.code = jQuery('#product-analysis-content .product-title').attr('data-code');
        this.uuid = jQuery('#product-analysis-content .product-title').attr('data-uuid');
        this.countryCode = jQuery('#location option:selected').val();
        this.country = jQuery('#location option:selected').text();
        this.db_version = jQuery('#database-version').val();
        this.year = jQuery('#year option:selected').val();
        this.income_group = jQuery('#income-group option:selected').val();
        this.household_type = jQuery('#household-composition option:selected').val();
        this.climate_metric = jQuery('#climatemetric option:selected').val();
        const typeValue = jQuery('input[name="footprint_type_extend"]:checked').val();
        this.footprint_type = jQuery('#footprint-type option:selected').val(); //person or product
        this.footprint_type_label = 'Cradle to gate'; //typeValue= product or default
        if (typeValue == 'market') {
            this.footprint_type_label = 'Cradle to consumer';
        } else if (typeValue == 'grave') {
            this.footprint_type_label = 'Cradle to grave';
        }
    }

    set_product(title,code,uuid, year=2016, location="AU"){
        this.title = title;
        this.code = code;
        this.uuid = uuid;
        this.year = year;
        this.countryCode = location;
    }

    to_string() {
        return `[title:${this.title}, code:${this.code}, uuid:${this.uuid}, countryCode:${this.countryCode}, country:${this.country}, db_version:${this.db_version}, year:${this.year}, income_group:${this.income_group}, household_type:${this.household_type}, climate_metric:${this.climate_metric}, footprint_type:${this.footprint_type}]`;
    }
}

export default UserSelection;