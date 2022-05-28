const H_MARGIN = 100
const V_MARGIN = 100

let svg;
let width, height;
let xScale, yScale;

function initPlot(initSvg) {
    svg = initSvg;

    width = svg.attr("width") - 2 * H_MARGIN;
    height = svg.attr("height") - 2 * V_MARGIN;

    xScale = d3.scaleTime()
        .domain([d3.timeParse("%Y")("1944"), d3.timeParse("%Y")("2018")])
        .range([0, width]);

    yScale = d3.scaleLinear()
        .domain([0, 0.3])
        .range([height, 0]);

    drawAxis();
}

function drawAxis() {
    // Title
    svg.append('text')
        .attr('x', width / 2 + H_MARGIN)
        .attr('y', V_MARGIN)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text('Line Chart');

    // X label
    svg.append('text')
        .attr('x', width / 2 + H_MARGIN)
        .attr('y', height + V_MARGIN + 50)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 12)
        .text('Year');

    // Y label
    svg.append('text')
        .attr('x', - height / 2 - V_MARGIN)
        .attr('y', 50)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .style('font-family', 'Helvetica')
        .style('font-size', 12)
        .text('Medals (%)');

    // X axis
    const xAxis = d3.axisBottom(xScale).ticks(d3.timeYear.every(4))
    svg.append("g")
        .attr("transform", `translate(${H_MARGIN}, ${height + V_MARGIN})`)
        .call(xAxis)
        .selectAll("text")
        .attr("y", 10)
        .attr("x", 5)
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");

    // Y axis
    const yAxis = d3.axisLeft(yScale)
    svg.append("g")
        .attr("transform", `translate(${H_MARGIN}, ${V_MARGIN})`)
        .call(yAxis);

    // X axis grid
    const xAxisGrid = d3.axisBottom(xScale).ticks(d3.timeYear.every(4)).tickSize(-height).tickFormat('');
    svg.append('g')
        .attr('class', 'axis-grid')
        .attr("transform", `translate(${H_MARGIN}, ${height + V_MARGIN})`)
        .call(xAxisGrid);

    // Y axis grid
    const yAxisGrid = d3.axisLeft(yScale).tickSize(-width).tickFormat('');
    svg.append('g')
        .attr('class', 'axis-grid')
        .attr("transform", `translate(${H_MARGIN}, ${V_MARGIN})`)
        .call(yAxisGrid);

}


function drawLine(data) {
    console.log(data)

    // Line Generator
    const line = d3.line()
        .x(function (d) {
            return xScale(d[0]);
        })
        .y(function (d) {
            return yScale(d[1]);
        })
        .curve(d3.curveMonotoneX)

    // Line
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("transform", `translate(${H_MARGIN}, ${V_MARGIN})`)
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2");

    // Line Dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d[0]);
        })
        .attr("cy", function (d) {
            return yScale(d[1]);
        })
        .attr("r", 5)
        .attr("transform", `translate(${H_MARGIN}, ${V_MARGIN})`)
        .style("fill", "#CC0000");
}

export {initPlot, drawLine}