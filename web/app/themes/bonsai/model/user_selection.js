class UserSelection{
    constructor() {
        this.countryCode = "";
        this.version = 'v1.0.0';
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
        const obj = JSON.parse(jsonString);
        
        this.countryCode =  obj.footprint_location;;
        this.version = obj.database_version;
        this.year = obj.footprint_year;
        this.income_gpe = obj.income_gpe;
        this.household_compo = obj.household_compo;
        this.climate_metric = obj.climate_metric;
        this.footprint_type = obj.footprint_type;
    }
    
    get_from_form(){
        this.countryCode = jQuery('#location').val();
        this.version = jQuery('#database-version').val();
        this.year = jQuery('#year').val();
        this.income_gpe = jQuery('#income-group').val();
        this.household_compo = jQuery('#household-composition').val();
        this.climate_metric = jQuery('#climate-metric').val();
        this.footprint_type = jQuery('#footprint-type input[name="footprint_type_extend').val();

    }
}

export default UserSelection;