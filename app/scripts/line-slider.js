
var chartID = "#chart";
var quarterChar = "○";
var X_AXIS_PADDING = 30;
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom + X_AXIS_PADDING ;

var MIN_YEAR = 2007;
var MAX_YEAR = 2015;
// var ticks = (MAX_YEAR - MIN_YEAR)*4 - 1;
var colors =["steelblue","orange","#31a354"];
var FOCUS_YEAR = 2010;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickPadding(X_AXIS_PADDING)
    .tickFormat(d3.format("d"))
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(5)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) {
        return y(d.close); }
    );

var svg = d3.select(chartID).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + X_AXIS_PADDING )
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", type, function(error, data) {
    console.log(data);
  if (error) throw error;
  createGraph(data);
});

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 50])
  .html(function(d) {
    return "<strong>Value </strong> <span style='color:red'>" + d.close + "</span>";
  })

function createGraph( data ) {
  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d){ return d.close; })])

  var timeSelector = svg.append("g");
  var yTimeSelector = height + 20;
  timeSelector.append("line")
      .attr("x1", 0 )
      .attr("x2", width )
      .attr("y1", yTimeSelector )
      .attr("y2", yTimeSelector )
      .attr("class", "year-selector" )
      .style("stroke", "black");

  timeSelector.append("g")
    .selectAll('circle')
    .data(data)
    .enter().append('circle')
    .attr("class", "year-bullet")
    .classed("selected", function(d){
        return d.year == FOCUS_YEAR;
    })
    .attr("cx", function(d) {
        return x(d.year);
      })
    .attr("cy", yTimeSelector )
    .attr("r", 8 )
    .on("click", function(d,i){
        var xPos = x(d.year);
        currentYearLine.attr("x1", xPos )
            .attr("x2", xPos );

        d3.select(chartID)
            .selectAll(".year-bullet")
            .classed("selected",function(e,j){
                return i == j;
            });
    });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);


  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + -20 + ",0)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Submission");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("stroke", colors[1])
      .attr("d", line);

    svg.call(tip);

   var focusLine = svg.append("line")
        .attr("class", "focus-line")
        .attr("x1", 5)
        .attr("y1", 0)
        .attr("x2", 50)
        .attr("y2", height + X_AXIS_PADDING/4 )
        .style("opacity", 0 )

    var currentX = x(FOCUS_YEAR);
    var currentYearLine = svg.append("line")
        .attr("class", "focus-line current" )
        .attr("x1", currentX )
        .attr("x2", currentX )
        .attr("y1", 0)
        .attr("y2", height + X_AXIS_PADDING/4 )


  var radius = 5;
  svg.append("g")
    .attr("class", "line-point")
    .selectAll('circle')
    .data(data)
    .enter().append('circle')
    .attr("cx", function(d) {
        return x(d.year);
      })
    .attr("cy", function(d, i) { return y(d.close) })
    .attr("r", radius )
    .style("fill", colors[1] )
    .on("mouseover", function(d,i) {
        tip.show(d);

        var positionX = x(d.year);
        var positionY = y(d.close);
        focusLine
            .attr("x1", positionX )
            .attr("x2", positionX )
            .attr("y1", positionY )
            .style("opacity", 0.7 );
    })
    .on("mouseout", function(d) {
        tip.hide(d);
        focusLine.style("opacity", 0 );
    });
}

function type(d) {
  d.year =  +d.year;
  d.close = +d.close;
  // d.quarter = +d.quarter;
  return d;
}
