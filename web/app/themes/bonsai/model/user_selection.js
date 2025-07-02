class UserSelection{
    constructor() {
        this.countryCode = jQuery('#location').val();
        this.version = jQuery('#database-version').val() ?? 'v1.0.0';
        this.year = jQuery('#year').val() ?? '1999';
        this.income_gpe = jQuery('#income-group').val();
        this.household_compo = jQuery('#household-composition').val();
        this.climate_metric = jQuery('#climate-metric').val() == null ? "GWP100" : jQuery('#climate-metric').val();
        this.footprint_type = jQuery('#footprint-type input[name="footprint_type').val();
    }
}

export default UserSelection;