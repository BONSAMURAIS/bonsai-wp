class UserSelection{
    constructor() {
        this.title = "title";
        this.code = "code";
        this.uuid = "uuid";
        this.countryCode = "";
        this.country = "";
        this.db_version = 'v1.0.0';
        this.year = '1999';
        this.income_gpe = "";
        this.household_compo = "";
        this.climate_metric = "GWP100";
        this.footprint_type = "";
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
        this.country =  json.location;
        this.db_version = json.db_version;
        this.year = json.year;
        this.income_gpe = json.income_gpe;
        this.household_compo = json.household_compo;
        this.climate_metric = json.climate_metric;
        this.footprint_type = json.footprint_type;
    }
    
    get_from_form(){
        this.title = jQuery('#autocomplete-input').val();
        this.code = jQuery('#autocomplete-input').attr('data-code');
        this.uuid = "uuid";
        this.countryCode = jQuery('#location').val();
        this.country = jQuery('#location option:selected').text();
        this.db_version = jQuery('#database-version').val();
        this.year = jQuery('#year').val();
        this.income_gpe = jQuery('#income-group').val();
        this.household_compo = jQuery('#household-composition').val();
        this.climate_metric = jQuery('#climate-metric').val();
        const typeValue = jQuery('input[name="footprint_type_extend"]:checked').val();
        this.footprint_type = 'Cradle to gate'; //typeValue= product or default
        if (typeValue == 'market') {
            this.footprint_type = 'Cradle to consumer';
        } else if (typeValue == 'grave') {
            this.footprint_type = 'Cradle to grave';
        }
    }

    set_product(title,code,uuid){
        this.title = title;
        this.code = code;
        this.uuid = uuid;
    }

    to_string() {
        return `[title:${this.title}, code:${this.code}, uuid:${this.uuid}, countryCode:${this.countryCode}, country:${this.country}, db_version:${this.db_version}, year:${this.year}, income_gpe:${this.income_gpe}, household_compo:${this.household_compo}, climate_metric:${this.climate_metric}, footprint_type:${this.footprint_type}]`;
    }
}

export default UserSelection;