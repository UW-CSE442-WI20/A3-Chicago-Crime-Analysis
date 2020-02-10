// set the dimensions and margins of the graph
var margin = {top: 50, right: 50, bottom: 30, left: 80},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var year = 2010;

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

goBack();

const radius = Math.min(width,height) / 2;

const color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
    "#e78ac3","#a6d854","#ffd92f"]);

const pie = d3.pie()
    .value(d => d.count)
    .sort(null);

const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

function type(d) {
    d.time_percentage = Number(d.time_percentage);
    d.arrested_percentage = Number(d.arrested_percentage);
    return d;
}

function arcTween(a) {
    const i = d3.interpolate(this._current, a);
    this._current = i(1);
    return (t) => arc(i(t));
}

function update(val = this.value) {
    var butt = document.getElementById("control");
    butt.style.display = "block";

    svg.attr("transform", `translate(${300}, ${height - 150})`);

    d3.json('./data.json').then(function(data) {
        d3.selectAll("input")
            .on("change", update);

        svg.append("circle").attr("cx", 300).attr("cy", 0).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#66c2a5");
        svg.append("circle").attr("cx", 300).attr("cy", 30).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#fc8d62");
        svg.append("circle").attr("cx", 300).attr("cy", 60).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#8da0cb");
        svg.append("circle").attr("cx", 300).attr("cy", 90).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#e78ac3");
        svg.append("circle").attr("cx", 300).attr("cy", 120).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#a6d854");
        svg.append("circle").attr("cx", 300).attr("cy", 150).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#ffd92f");
        svg.append("text").attr("x", 320).attr("y", 0).text("0:00-4:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");
        svg.append("text").attr("x", 320).attr("y", 30).text("4:00-8:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");
        svg.append("text").attr("x", 320).attr("y", 60).text("8:00-12:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");
        svg.append("text").attr("x", 320).attr("y", 90).text("12:00-16:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");
        svg.append("text").attr("x", 320).attr("y", 120).text("16:00-20:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");
        svg.append("text").attr("x", 320).attr("y", 150).text("20:00-0:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");

        svg.append("circle").attr("cx", 300).attr("cy", 0).attr("r", 6).attr("opacity", 0).attr("class", "label2").style("fill", "#66c2a5");
        svg.append("circle").attr("cx", 300).attr("cy", 30).attr("r", 6).attr("opacity", 0).attr("class", "label2").style("fill", "#fc8d62");
        svg.append("text").attr("x", 320).attr("y", 0).text("arrested").attr("opacity", 0).attr("class", "label2").style("font-size", "15px").attr("alignment-baseline", "middle");
        svg.append("text").attr("x", 320).attr("y", 30).text("not arrested").attr("opacity", 0).attr("class", "label2").style("font-size", "15px").attr("alignment-baseline", "middle");

        const path = svg.selectAll("path")
            .data(pie(data[val][year]));

        // Update existing arcs
        path.transition().duration(200).attrTween("d", arcTween);
 

        var tip2 = d3.tip().attr('class', 'd3-tip2').offset([0, 0])
            .html(function(d,i) {
                var content = "<span style='margin-left: 2.5px;'><b>" + Math.round(data[val][year][i].count * 100) + "%" + "</b></span><br>";   
                return content;
            });

        svg.call(tip2);

        // Enter new arcs
        path.enter().append("path")
            .attr("fill", (d, i) => color(i))
            .attr("d", arc)
            .attr("stroke", "white")
            .attr("stroke-width", "6px")
            .on("mouseover", function(d,i) {
                tip2.show;
                d3.select(this).transition().duration('50').attr('opacity', '0.6');
            })
            .on("mouseout", function(d,i) {
                tip2.hide;
                d3.select(this).transition().duration('50').attr('opacity', '1');
            })  
            .each(function(d) { this._current = d; });

        var app = document.getElementsByClassName("label1");
        var app2 = document.getElementsByClassName("label2");
        if (val == "time_percentage") {
            for (var i = 0; i < app2.length; i++) {
                app2[i].style.opacity = 0;
            }
            for (var k = 0; k < app.length; k++) {
                app[k].style.opacity = 1;
            }
        } else {
            for (var l = 0; l < app.length; l++) {
                app[l].style.opacity = 0;
            }
            for (var j = 0; j < app2.length; j++) {
                app2[j].style.opacity = 1;
            }

        }
    }).catch(function(error) {console.log(error)});
}

document.getElementById("button").onclick = function() {goBack()};

function goBack() {
    var butt = document.getElementById("control");
    butt.style.display = "none";
    svg.selectAll("*").remove();
    svg.attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    // get the data
    // d3.csv('./crime_number.csv', type).then(data => {
    var csvFile = require('./crime_number.csv');
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
            .on("mouseout", tip.hide)
            .on("click", function(d) {
                year = d.year;
                svg.selectAll("*").remove();                    
                update("time_percentage");  
                d3.select(".d3-tip").remove(); 
            });


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

        svg.append("text")
            .attr("x", -250)
            .attr("y", -60)
            .attr("transform", "rotate(-90)")
            .text("Total Cases");

    });

}
