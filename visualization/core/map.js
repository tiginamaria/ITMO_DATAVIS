import {addCountry, removeCountry} from "./state.js";

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);
let svg;

export function initMap(mapSvg) {

    const projection = d3.geoNaturalEarth1();
    const pathGenerator = d3.geoPath().projection(projection);
    svg = mapSvg;

    svg.append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}))
        .attr('fill', 'white');
}

export function drawMap(data) {
    const g = svg.append("g");

    g.selectAll("path")
        .data(data)
        .join("path")
        .attr('class', 'country')
        .style('fill', 'grey')
        .attr('id', function (d) {
            return d.Country;
        })
        .attr('width', '10')
        .attr("d", pathGenerator)
        .on("click", function (d, i) {
            console.log(d3.select(this).attr('id'), d3.select(this).style('fill'))
            if (d3.select(this).style('fill') === 'black') {
                d3.select(this).style('fill', 'grey');
                removeCountry(d3.select(this).attr('id'));
            } else {
                d3.select(this).style('fill', 'black');
                addCountry(d3.select(this).attr('id'));
            }
        });

    // Zoom
    const zoom = d3
        .zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {

            g.selectAll("path").attr("transform", event.transform);

            g.selectAll("circle")
                .attr("transform", event.transform)
                .attr("r", 5 / event.transform.k);

            g.selectAll("text")
                .attr("transform", event.transform)
                .style("font-size", `${18 / event.transform.k}`)
                .attr("dy", -7 / event.transform.k);
        });

    svg.call(zoom)
}