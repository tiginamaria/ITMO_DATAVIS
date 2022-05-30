let medalsData;
let hostsData;
let GITHUB_BASE_URL = 'https://raw.githubusercontent.com/tiginamaria/ITMO_DATAVIS/main/data/'

// Preload data
async function preloadData() {
    medalsData = await d3.csv(`${GITHUB_BASE_URL}medals_by_nocs.csv`, function (d) {
        d.Year = d3.timeParse("%Y")(d.Year)
        return d;
    });

    hostsData = await d3.csv(`${GITHUB_BASE_URL}hosts_by_nocs.csv`, function (d) {
        d.Year = d3.timeParse("%Y")(d.Year)
        return d;
    });
}

function selectMedalsData(nocs = ['USA', 'JPN', 'ITA'], season = 'Summer') {
    return medalsData.filter(function (d) {
        return nocs.includes(d.NOC) && (d.Season === season)
    });
}

function selectHostsData(nocs = ['USA', 'JPN', 'ITA'], season = 'Summer') {
    return hostsData.filter(function (d) {
        return nocs.includes(d.NOC) && (d.Season === season)
    });
}

export {preloadData, selectMedalsData, selectHostsData}