<?php

class SearchParameters {
    public string $flow_reference;
    public string $region_reference;
    public string $version;
    public string $climate_metric;
    public string $footprint_type_label;
    public string $household_compo;
    public string $income_group;

    public function __construct(
        string $flow_reference,
        string $region_reference,
        string $version,
        string $climate_metric,
        string $footprint_type_label,
        string $household_compo,
        string $income_group
    ) {
        $this->flow_reference = $flow_reference;
        $this->region_reference = $region_reference;
        $this->version = $version;
        $this->climate_metric = $climate_metric;
        $this->footprint_type_label = $footprint_type_label;
        $this->household_compo = $household_compo;
        $this->income_group = $income_group;
    }

    function set_flow_reference($flow_reference) {
        $this->flow_reference = $flow_reference;
    }
    function get_flow_reference() {
        return $this->flow_reference;
    }
    function set_region_reference($region_reference) {
        $this->region_reference = $region_reference;
    }
    function get_region_reference() {
        return $this->region_reference;
    }
    function set_version($version) {
        $this->version = $version;
    }
    function get_version() {
        return $this->version;
    }
    function set_climate_metric($climate_metric) {
        $this->climate_metric = $climate_metric;
    }
    function get_climate_metric() {
        return $this->climate_metric;
    }
    function set_footprint_type_label($footprint_type_label) {
        $this->footprint_type_label = $footprint_type_label;
    }
    function get_footprint_type_label() {
        return $this->footprint_type_label;
    }
    function set_household_compo($household_compo) {
        $this->household_compo = $household_compo;
    }
    function get_household_compo() {
        return $this->household_compo;
    }
    function set_income_group($income_group) {
        $this->income_group = $income_group;
    }
    function get_income_group() {
        return $this->income_group;
    }

        public function toJson() {
        return json_encode(get_object_vars($this));
    }


}
?>