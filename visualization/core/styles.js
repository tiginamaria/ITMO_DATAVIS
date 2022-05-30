import {selectCountriesNocsData} from "./data.js";

export let color;

export function initStyles() {
    color = d3.scaleOrdinal()
        .domain(selectCountriesNocsData().map(d => d.NOC))
        .range(d3.schemeSet1)
}
