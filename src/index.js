// set the dimensions and margins of the graph
var margin = {top: 50, right: 50, bottom: 30, left: 80},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);
var y = d3.scaleLinear()
    .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.tip().attr('class', 'd3-tip').direction('n').offset([-5, 0])
    .html(function(d) {
        var content = "<span style='margin-left: 2.5px;'><b>" + d.number + "</b></span><br>";
        return content;
    });
svg.call(tip);

// get the data
const csvFile = require('./crime_number.csv');
d3.csv(csvFile).then(function(data) {


    // format the data
    data.forEach(function(d) {
        d.number = +d.number;
    });

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) { return d.number; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.year); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.number); })
        .attr("height", function(d) { return height - y(d.number); })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
    svg.append("text")
        .attr("x", 300)
        .attr("y", 460)
        .text("Year");

});
