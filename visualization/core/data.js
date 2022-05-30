import {countries, season} from "./state.js";

let medalsData;
let hostsData;
let mapData;
let countriesCodesData;
let countriesNocsData;
let RAW_GITHUB_BASE_URL = 'https://raw.githubusercontent.com'
let GIST_GITHUB_BASE_URL = 'https://gist.githubusercontent.com'

// Preload data
async function preloadData() {
    medalsData = await d3.csv(`${RAW_GITHUB_BASE_URL}/tiginamaria/ITMO_DATAVIS/main/data/medals_by_nocs.csv`, function (d) {
        d.Year = d3.timeParse("%Y")(d.Year)
        return d;
    });

    hostsData = await d3.csv(`${RAW_GITHUB_BASE_URL}/tiginamaria/ITMO_DATAVIS/main/data/hosts_by_nocs.csv`, function (d) {
        d.Year = d3.timeParse("%Y")(d.Year)
        return d;
    });

    countriesCodesData = await d3.tsv(`${GIST_GITHUB_BASE_URL}/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/world-country-names.tsv`, function (d) {
        d["id"] = parseInt(d["id"])
        return d;
    });

    countriesNocsData = await d3.csv(`${RAW_GITHUB_BASE_URL}/tiginamaria/ITMO_DATAVIS/main/data/nocs.csv`);

    mapData = await d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json', function (d) {
        console.log(d);
        return d;
    });
}

// Select data
function selectMedalsData() {
    console.log(countries, countriesNocsData)
    let nocs = countriesNocsData.filter(d => countries.includes(d.Region)).map(d => d.NOC)
    console.log(nocs)
    return medalsData.filter(function (d) {
        return nocs.includes(d.NOC) && (d.Season === season)
    });
}

function selectHostsData() {
    console.log(countries, countriesNocsData)
    let nocs = countriesNocsData.filter(d => countries.includes(d.Region)).map(d => d.NOC)
    console.log(nocs)
    return hostsData.filter(function (d) {
        return nocs.includes(d.NOC) && (d.Season === season)
    });
}

function selectCountriesNocsData() {
    return countriesNocsData;
}

function selectMapData() {
    return mapData;
}

// Preprocess data
function prepareMedalsData(data) {
    return data.map(function (d) {
        return [d.Year, d.Medals, d.NOC];
    })
}

function prepareHostsData(medalsData, hostsData) {
    const groupedMedalsData = d3.group(medalsData, d => d.NOC, d => d.Year, d => d.Season);

    return hostsData.map(function (d) {
        if (groupedMedalsData.get(d.NOC) !== undefined && groupedMedalsData.get(d.NOC).get(d.Year) !== undefined) {
            const hostResults = groupedMedalsData.get(d.NOC).get(d.Year).get(d.Season)
            return [hostResults[0].Year, hostResults[0].Medals, hostResults[0].NOC, d.Region, d.City];
        }
    }).filter(d => d !== undefined);
}

function prepareMapData(mapData) {
    const groupedCountriesCodesData = d3.group(countriesCodesData, d => d.id)

    return topojson.feature(mapData, mapData.objects.countries).features.map(function (d) {
        d["id"] = parseInt(d["id"])
        let country = groupedCountriesCodesData.get(d["id"])
        if (country !== undefined) {
            d["Country"] = country[0].name;
        }
        return d;
    })
}

export {
    preloadData,
    selectMapData,
    selectHostsData,
    selectMedalsData,
    selectCountriesNocsData,
    prepareMedalsData,
    prepareMapData,
    prepareHostsData
}
