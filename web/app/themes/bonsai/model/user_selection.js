class UserSelection{
    constructor() {
        this.countryCode = jQuery('#location').val();
        this.version = jQuery('#database-version').val();
        this.income_gpe = jQuery('#income-group').val();
        this.household_compo = jQuery('#household-composition').val();
        this.climate_metric = jQuery('#climate-metric').val();
    }
}

export default UserSelection;