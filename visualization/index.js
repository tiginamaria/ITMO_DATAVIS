import {preloadData} from "./core/data.js";
import {initStyles} from "./core/styles.js";
import {initMap} from "./core/map.js";
import {initPlot} from "./core/plot.js";
import {updateMap, updatePlot} from "./core/updaters.js";

const body = d3.select("body");

// Load data
await preloadData();

const header = body
    .append("div")
    .attr("id", "header")
    .attr("align", "center");

header.append("h2")
    .text("Summer Olympic Games 1844-2016")
    .style("font", "bold");

// let logoSvg = header.append('svg')
//     .attr("width", 100)
//     .attr("height", 50);
//
// logoSvg.append("svg:image")
//     .attr("xlink:href", "resources/logo.png")
//     .attr("x", 0)
//     .attr("y", 0)
//     .attr("width", 100)
//     .attr("height", 50);

const plotWidth = 1000;
const plotHeight = 500;
const mapWidth = 1000;
const mapHeight = 200;

const map = body
    .append("div")
    .attr("id", "map")
    .attr("align", "center");
const mapSvg = map.append('svg')
    .attr("id", "map-svg")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", mapWidth)
    .attr("height", mapHeight);

const plot = body
    .append("div")
    .attr("id", "plot")
    .attr("align", "center");
const plotSvg = plot.append('svg')
    .attr("align", "right")
    .attr("id", "plot-svg")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", plotWidth)
    .attr("height", plotHeight);

initStyles();
initMap(mapSvg);
initPlot(plotSvg);

updateMap();
updatePlot();
