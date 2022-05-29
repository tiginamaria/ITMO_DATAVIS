import {selectData, preloadData} from "./core/data.js";
import {drawData, setSvg} from "./core/plot.js";

const body = d3.select("body");

// Load data
await preloadData();

const header = body
    .append("div")
    .attr("id", "header")
    .attr("align", "center");

header.append("h1")
    .text("Olympic games")
    .style("font", "bold");

let logoSvg = header.append('svg')
    .attr("width", 100)
    .attr("height", 50);

logoSvg.append("svg:image")
    .attr("xlink:href", "resources/logo.png")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 100)
    .attr("height", 50);

const width = 1200;
const height = 800;

const canvas = body
    .append("div")
    .attr("id", "canvas")
    .attr("align", "center");

const svg = canvas.append('svg')
    .attr("id", "svg")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height);

setSvg(svg)
showMedalsToYear();

function prepareData(data) {
    return data.map(function (d) {
        return [d.Year, d.Medals, d.NOC]
    })
}

function showMedalsToYear() {

    const data = prepareData(selectData());
    drawData(data);
}