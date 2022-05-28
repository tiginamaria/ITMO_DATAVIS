let data;
let GITHUB_BASE_URL = 'https://raw.githubusercontent.com/tiginamaria/ITMO_DATAVIS/main/data/'

// Preload data
async function preloadData() {
    data = await d3.csv(`${GITHUB_BASE_URL}medals_by_nocs.csv`, d3.autoType)
}

function selectData(noc = 'USA', season = 'Summer') {
    return data
        .filter(d => (d.NOC === noc) && (d.Season === season))
        .map(d => [d3.timeParse("%Y")(d.Year), d.Medals]);
}

export {preloadData, selectData}