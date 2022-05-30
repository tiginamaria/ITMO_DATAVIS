import {
    prepareHostsData,
    prepareMapData,
    prepareMedalsData,
    selectHostsData,
    selectMapData,
    selectMedalsData
} from "./data.js";

import {drawMap} from "./map.js";
import {drawData} from "./plot.js";
import {addObserver} from "./state.js";

addObserver(updatePlot)

export function updateMap() {
    const mapData = selectMapData();
    const preparedMapData = prepareMapData(mapData);

    drawMap(preparedMapData)
}

export function updatePlot() {
    const hostsData = selectHostsData();
    const medalsData = selectMedalsData();
    const preparedMedalsData = prepareMedalsData(medalsData);
    const preparedHostsData = prepareHostsData(medalsData, hostsData);

    console.log('data', hostsData, preparedMedalsData)
    drawData(preparedMedalsData, preparedHostsData)
}