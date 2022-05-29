let data;
let GITHUB_BASE_URL = 'https://raw.githubusercontent.com/tiginamaria/ITMO_DATAVIS/main/data/'

// Preload data
async function preloadData() {
    data = await d3.csv(`${GITHUB_BASE_URL}medals_by_nocs.csv`, function (d) {
        d.Year = d3.timeParse("%Y")(d.Year)
        return d;
    });
}

function selectData(nocs = ['USA', 'JPN', 'ITA'], season = 'Summer') {
    return data.filter(function (d) {
        return nocs.includes(d.NOC) && (d.Season === season)
    });
}

export {preloadData, selectData}