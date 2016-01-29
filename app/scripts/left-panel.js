function LeftPanel(){}

LeftPanel.prototype.setYear = function(d, firstTime ){
    var self = this;

    var leftPanel = d3.select(".left.column");
    var number = totalYearlyData[d].number
    leftPanel.select("#total-number")
        .html( d3.format(",")(number) );

    yearSelector.setYear(d);


    if( !firstTime ){
        genderPie.updateData( totalYearlyData[d].data('gender'));
        agePie.updateData( totalYearlyData[d].data('age'));
    }

    leftPanel.selectAll(".country")
        .remove("*");

    leftPanel.select("#rank").selectAll(".country")
        .data( totalYearlyData[d].countries.slice(0,3)  )
        .enter()
        .append('tr')
        .attr("class", "country")
        .html(function(d,i){
            return "<td>"+ (i+1) + "</td>"+
            "<td>"+d.country+"</td>"+
            "<td>"+d3.format(",")(d.number)+"</td";
        });

    this.yearPointer
        .attr("cx", function(){ return self.xScale(d); })
        .attr("cy", function(){ return self.yScale(number) });


    this.focusLine
        .attr("x1", function(){ return self.xScale(d);} )
        .attr("x2", function(){ return self.xScale(d);} )
        .attr("y1", function(){ return self.yScale(number)} )
}

LeftPanel.prototype.drawTrends = function(){
    var trend = _.map( totalYearlyData, function(d,k){
        return {
            x: parseInt(k),
            y: parseInt(d.number)
        }
    });

    var max = _.maxBy( trend, "y" );

    var margin = {
        left: 20,
        bottom: 30,
        top: 10,
        right: 20,
    };
    var pos = d3.select("#overall-trend").node().getBoundingClientRect();
    var width = pos.width -  margin.left - margin.right;
    var height = 130 - margin.bottom - margin.top;
    var x = d3.scale.linear()
        .domain([MIN_YEAR, MAX_YEAR-1])
        .range([0, width])
        ;

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, max.y ])
        .nice();

    this.xScale = x;
    this.yScale = y;

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(function(d, i ){
            if( d == MIN_YEAR || d == MAX_YEAR - 1 ) {
                return d3.format("y")(d);
            }
            return "'"+d3.format("02d")(d%100);
        })
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(5)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });
    var area = d3.svg.area()
        .x(function(d) { return x(d.x); })
        .y0(height)
        .y1(function(d) { return y(d.y); });

    var svg = d3.select('#overall-trend')
        .append('svg')    //Select the <svg> element you want to render the chart in.
        .attr("width", width + margin.left+ margin.right )
        .attr("height", height + margin.bottom + margin.top )
        .append("g")
        .attr("transform", "translate(" + margin.left +" ," + margin.top +")" );

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Price ($)");


      svg.append("path")
          .datum(trend)
          .attr("class", "area")
          .attr("d", area );



      svg.append("path")
          .datum(trend)
          .attr("class", "line")
          .attr("d", line );

    this.focusLine = svg.append("line")
        .attr("class", "focus line")
        .attr("x1", 20 )
        .attr("x2", 20 )
        .attr("y1", 0 )
        .attr("y2", height  );

    this.yearPointer = svg.append("circle")
        .attr("class", "year-pointer")
        .attr("r", 5 );

    // this.tooltip = svg.append("text")
    //     .attr("class", "tooltip")
    //     .text("xxxx");



}
