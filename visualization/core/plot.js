import {color} from "./styles.js";

const H_MARGIN = 80
const V_MARGIN = 50

let svg;
let width, height;
let xScale, yScale;

export function initPlot(pltSvg) {
    console.log('initPlot')
    svg = pltSvg;
    svg.selectAll("*").remove();

    width = svg.attr("width") - 2 * H_MARGIN;
    height = svg.attr("height") - 2 * V_MARGIN;
    drawAxis()
}

export function drawData(medalsData, hostsData) {
    svg.selectAll("*").remove();
    drawAxis(medalsData);
    drawLegend(medalsData);
    drawLine(medalsData);
    drawPulsingCircles(hostsData);
}

function drawAxis(data = []) {

    if (data.length === 0) {
        data = [[d3.timeParse("%Y")("1944"), 0.0], [d3.timeParse("%Y")("2018"), 0.4]]
    }

    const dateRange = [
        d3.min(data, function (d) {
            return d[0];
        }),
        d3.max(data, function (d) {
            return d[0];
        }),
    ]

    const medalRange = [
        Math.max(d3.min(data, function (d) {
            return d[1];
        }) - 0.05, 0),
        parseFloat(d3.max(data, function (d) {
            return d[1];
        })) + 0.05
    ]
    console.log('axis', dateRange, medalRange)

    xScale = d3.scaleTime()
        .domain(dateRange)
        .range([0, width]);

    yScale = d3.scaleLinear()
        .domain(medalRange)
        .range([height, 0]);

    // X label
    svg.append('text')
        .attr('x', width / 2 + H_MARGIN)
        .attr('y', height + V_MARGIN + 50)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Arial')
        .style('font-size', 12)
        .text('Year');

    // Y label
    svg.append('text')
        .attr('x', -height / 2 - V_MARGIN)
        .attr('y', H_MARGIN - 50)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .style('font-family', 'Arial')
        .style('font-size', 12)
        .text('Medals (%)');

    // X axis grid
    svg.append('g')
        .attr('class', 'axis-grid')
        .attr("transform", `translate(${H_MARGIN}, ${height + V_MARGIN})`)
        .call(d3.axisBottom(xScale).ticks(d3.timeYear.every(4)).tickSize(-height).tickFormat(''));

    // Y axis grid
    svg.append('g')
        .attr('class', 'axis-grid')
        .attr("transform", `translate(${H_MARGIN}, ${V_MARGIN})`)
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));

    // X axis
    svg.append("g")
        .attr("transform", `translate(${H_MARGIN}, ${height + V_MARGIN})`)
        .call(d3.axisBottom(xScale).ticks(d3.timeYear.every(4)))
        .selectAll("text")
        .attr("y", 10)
        .attr("x", 5)
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");

    // Y axis
    svg.append("g")
        .attr("transform", `translate(${H_MARGIN}, ${V_MARGIN})`)
        .call(d3.axisLeft(yScale));
}

function drawLegend(data) {

    const nocsRange = data
        .map(d => d[2])
        .filter((value, index, self) => self.indexOf(value) === index)

    const legend = svg.selectAll(".legend")
        .data(nocsRange)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(" + width + "," + (10 + i * 15) + ")";
        });

    legend.append("text").text(function (d) {
        return d;
    })
        .style('font-family', 'Arial')
        .style('font-size', 12)
        .attr("transform", "translate(40, 55)");

    legend.append("rect")
        .attr("id", function (d) {
            return d[2];
        })
        .attr("transform", "translate(0, 50)")
        .attr("width", 30)
        .attr("height", 5)
        .style("fill", function (d, i) {
            return color(d);
        })
        .style('fill-opacity', 0.5)
        .style('stroke', function (d, i) {
            return color(d);
        })
        .style('stroke-opacity', 0.5)
}

function drawPulsingCircles(data) {

    console.log('drawPulsingCircles', data)

    data.forEach(function (d) {
        let circle = svg.append("circle")
            .attr("cx", xScale(d[0]))
            .attr("cy", yScale(d[1]))
            .attr("r", 8)
            .style("fill", color(d[2]))
            .style("stroke", color(d[2]))
            .attr("transform", `translate(${H_MARGIN}, ${V_MARGIN})`)
            .text(function (d) {
                return d;
            });
        pulse(circle);
    })

    data.forEach(function (d) {
        svg.append("text")
            .attr("x", xScale(d[0]) + 10)
            .attr("y", yScale(d[1]) - 10)
            .attr("dy", ".35em")
            .attr("transform", `translate(${H_MARGIN}, ${V_MARGIN})`)
            .text(`${d[3]}, ${d[4]}, ${d3.timeFormat("%Y")(d[0])}`);
    })

    function pulse(circle) {
        (function repeat() {
            circle
                .transition()
                .duration(200)
                .attr("stroke-width", 0)
                .attr('stroke-opacity', 0)
                .transition()
                .duration(200)
                .attr("stroke-width", 0)
                .attr('stroke-opacity', 0.5)
                .transition()
                .duration(800)
                .attr("stroke-width", 40)
                .attr('stroke-opacity', 0)
                .ease(d3.easeSin)
                .on("end", repeat);
        })();
    }
}

function drawLine(data) {
    console.log(data)
    const dataGroups = d3.group(data, d => d[2]);
    console.log(dataGroups)

    // Line Generator
    const line = d3.line()
        .x(function (d) {
            return xScale(d[0]);
        })
        .y(function (d) {
            return yScale(d[1]);
        })
        .curve(d3.curveMonotoneX)

    // Line Dots
    svg.selectAll(".circle")
        .append("g")
        .data(data)
        .enter()
        .append("circle")
        .attr("id", function (d) {
            return d[2];
        })
        .attr("cx", function (d) {
            return xScale(d[0]);
        })
        .attr("cy", function (d) {
            return yScale(d[1]);
        })
        .attr("r", 5)
        .attr("transform", `translate(${H_MARGIN}, ${V_MARGIN})`)
        .attr('stroke', d => color(d[2]))
        .attr('stroke-opacity', 0.5)
        .attr('fill-opacity', 0.5)
        .style("fill", d => color(d[2]));

    // Line for each NOC
    dataGroups.forEach(function (d, g) {
        svg.append("path")
            .datum(d)
            .attr("class", "line")
            .attr("id", function (d) {
                return d[0][2];
            })
            .attr("transform", `translate(${H_MARGIN}, ${V_MARGIN})`)
            .attr("d", line)
            .style("stroke", color(g))
            .style("fill", "none")
            .style("stroke-width", "4")
            .style('stroke-opacity', 0.5)
            .on("mouseover", function (d, i) {
                const id = d3.select(this).attr('id')
                d3.selectAll("#" + id).transition()
                    .duration('50')
                    .style('stroke-opacity', 1)
                    .style('fill-opacity', 1);
            })
            .on("mouseout", function (d, i) {
                const id = d3.select(this).attr('id')
                d3.selectAll("#" + id).transition()
                    .duration('50')
                    .style('stroke-opacity', 0.5)
                    .style('fill-opacity', 0.5);
            })

    });
}
