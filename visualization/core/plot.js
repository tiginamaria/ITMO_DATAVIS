const H_MARGIN = 100
const V_MARGIN = 100

let svg;
let width, height;
let xScale, yScale;
let color;

export function setSvg(pltSvg) {
    svg = pltSvg;
    width = svg.attr("width") - 2 * H_MARGIN;
    height = svg.attr("height") - 2 * V_MARGIN;
}

export function drawData(medalsData, hostsData) {
    console.log('medals', medalsData);
    console.log('hosts', hostsData);

    drawAxis(medalsData);
    drawLegend(medalsData);
    drawLine(medalsData);
    drawPulsingCircles(hostsData);
}

function drawAxis(data) {

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
    console.log('medal', medalRange)

    xScale = d3.scaleTime()
        .domain(dateRange)
        .range([0, width]);

    yScale = d3.scaleLinear()
        .domain(medalRange)
        .range([height, 0]);

    // Title
    svg.append('text')
        .attr('x', width / 2 + H_MARGIN)
        .attr('y', V_MARGIN / 1.5)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Arial')
        .style('font-size', 20)
        .text('Line Chart');

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
        .attr('y', 50)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .style('font-family', 'Arial')
        .style('font-size', 12)
        .text('Medals (%)');

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

}

function drawLegend(data) {
    const nocsRange = ['USA', 'JPN', 'ITA']

    color = d3.scaleOrdinal()
        .domain(nocsRange)
        .range(d3.schemeSet1)

    const legend = svg.selectAll(".legend")
        .data(nocsRange)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(" + width + "," + (i * 15) + ")";
        });

    legend.append("text").text(function (d) {
        return d;
    })
        .style('font-family', 'Arial')
        .style('font-size', 12)
        .attr("transform", "translate(40, 155)");

    legend.append("rect")
        .attr("fill", function (d, i) {
            return color(d);
        })
        .attr("transform", "translate(0, 150)")
        .attr("width", 30)
        .attr("height", 3);
}

function drawPulsingCircles(data) {

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
        console.log('text', d);
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
        console.log(g, d)
        svg.append("path")
            .datum(d)
            .attr("class", "line")
            .attr("id", function (d) {
                return d[0][2];
            })
            .attr("transform", `translate(${H_MARGIN}, ${V_MARGIN})`)
            .attr("d", line)
            .attr("stroke", color(g))
            .style("fill", "none")
            .style("stroke-width", "4")
            .attr('stroke-opacity', 0.5)
            .on("mouseover", function (d, i) {
                const id = d3.select(this).attr('id')
                d3.selectAll("#" + id).transition()
                    .duration('50')
                    .attr('stroke-opacity', 1)
                    .attr('fill-opacity', 1);
            })
            .on("mouseout", function (d, i) {
                const id = d3.select(this).attr('id')
                d3.selectAll("#" + id).transition()
                    .duration('50')
                    .attr('stroke-opacity', 0.5)
                    .attr('fill-opacity', 0.5);
            })

    });
}
