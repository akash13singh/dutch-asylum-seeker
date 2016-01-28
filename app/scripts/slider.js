function TimelineGraph( id, options ){
    var self     = this;
    this.element = d3.select(id);
    this.datasets = [];

    var YEAR_RANGE     = [MIN_YEAR, MAX_YEAR -1 ];
    var X_AXIS_PADDING = 30;

    var boxWidth = document.getElementById(id.replace("#","")).offsetWidth;
    var margin   = {top: 20, right: 50, bottom: 30, left: 50};
    var width    = boxWidth - margin.left - margin.right - 10;
    var rawHeight   = width / 7;
    height = rawHeight - margin.top - margin.bottom + X_AXIS_PADDING;

    this.height = height;
    this.width  = width;

    this.xScale = d3.scale.linear()
        .domain(YEAR_RANGE)
        .range([0, width]);

    var xScale = this.xScale;

    this.element
        .select("select")
        .on("change", function(){
            var i = parseInt(self.element.select("select").node().value);
            self.graphs[(i+1)%2].element.style("display","none");
            self.graphs[i].element.style("display", "block");
        });


    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickPadding(X_AXIS_PADDING)
        .tickFormat(d3.format("d"))
        .orient("bottom");

    this.svg = this.element.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + X_AXIS_PADDING )
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var timeSelector = this.svg.append("g");
    var yTimeSelector = height + 20;
    timeSelector.append("line")
      .attr("x1", 0 )
      .attr("x2", width )
      .attr("y1", yTimeSelector )
      .attr("y2", yTimeSelector )
      .attr("class", "year-selector" )
      .style("stroke", "black");

    var currentX = xScale(config.year);
    var currentYearLine = this.svg.append("line")
        .attr("class", "focus-line current" )
        .attr("x1", currentX )
        .attr("x2", currentX )
        .attr("y1", 0 )
        .attr("y2", height + X_AXIS_PADDING/4 )
    this.currentYearLine = currentYearLine;

    timeSelector.append("g")
        .selectAll('circle')
        .data(d3.range(MIN_YEAR, MAX_YEAR))
        .enter().append('circle')
        .attr("class", "year-bullet")
        .classed("selected", function(d){
            return d == config.year;
        })
        .attr("cx", function(d) {
            return xScale(d);
          })
        .attr("cy", yTimeSelector )
        .attr("r", 8 )
        .on("click", function(d,i){

            self.setPointerToYear(d);

            /* Call event outside */
            self.onClick(d,i);
        });

    this.tip = d3.tip()
        .attr('class', 'timeline-tip')
        .html(function(str) {
            return str;
        });

        try{
            this.svg.call(this.tip);
        } catch(err) {
            console.log(err);
        }
    this.tip._template = Handlebars.compile(
        d3.select("template#timeline-tooltip")
            .html()
    );
    this.tip.display = function(d){
        var str = this._template(d);
        this.show(str);
    }

    this.focusLine = this.svg.append("line")
        .attr("class", "focus-line")
        .attr("x1", 5)
        .attr("y1", 0)
        .attr("x2", 50)
        .attr("y2", height + X_AXIS_PADDING/4 )
        .style("opacity", 0 )


    this.highestValueForYear = function(year){
        var data = _.filter( _.flatten(self.datasets), function(d){
            console.log(d);
            return d.year == year;
        });

        return _.max( data, function() { return d.number } );
    }

    var valuesKey = [ 'number', 'relative' ];
    this.graphs = _.map( ['absolute-chart', 'relative-chart'], function(id, i){
        var l = new LineGraph( self, id, valuesKey[i] );
        return l;
    });


    var countryPanel = self.element.select(".country-panel");
        countryPanel.select("input")
            .on("keydown", function(){
                var query = d3.select(this)
                    .property("value")
                    .toLowerCase();

                countryPanel.selectAll(".country")
                  .classed("hide", function(d,i){
                      if( query.length < 1 ){
                          return false;
                      }
                      return !d.toLowerCase().match(query);
                  });
            });
    var countryPanelHeight = 300;
    countryPanel
        .style("height", countryPanelHeight + "px" );

    countryPanel.select(".country-wrapper")
        .style("height", countryPanelHeight - 30 + "px");

    this.element.select(".more-country-button")
        .on("click",function(e){
            var r    = d3.select(".more-country-button")
                .node()
                .getBoundingClientRect();
                console.log(r);


            countryPanel.selectAll(".country")
                .remove();

            countryPanel.select("input")
                .property("value", "" )
                .node()
                .focus();

            var countryList = Object.keys(asylum).sort();
            var data = _.filter( countryList, function(c){
                return !_.find( self.datasets, function(obj){
                    return obj[0].country == c;
                });
            });

            countryPanel
                .select(".country-wrapper")
                .selectAll("div")
                .data(data)
                .enter()
                .append("div")
                .attr("class","country")
                .html(function(d){ return  d })
                .on("click", function(d){
                    self.addData( asylum[d].toYearlyData() );
                    toggleCountryList();
                });


            var paddingAndBorder = 25;
            self.element.select(".country-panel")
                .style("top", (r.top-countryPanelHeight- paddingAndBorder )+"px" );
            toggleCountryList();

            function toggleCountryList(){
                countryPanel.classed("showed", function(d,i){
                    return !countryPanel.classed("showed");
                });

                d3.select(".more-country-button")
                    .classed("clicked", function(d,i){
                        return !d3.select(".more-country-button").classed("clicked");
                    });
            }
        });


}

TimelineGraph.prototype.addData = function(data){
    var self    = this;
    var country = data[0].country;
    if( _.find( self.datasets, function(d){ return d[0].country == country } ) ){
        console.log("country in the list already");
        return;
    }

    _.each( data, function(d,i) {
        if( i == 0 ) {
            d.relative = 0;
        } else {
            var dominator = data[i-1].number;
            if( dominator == 0 ) {
                d.relative = 0;
            }else {
                d.relative = ( d.number - data[i-1].number ) / dominator;
            }
        }
    })

    /* Legend */
    var element = this.element;
    var index   = this.datasets.length;

    var legend = element.select("ul")
        .append("li")
        .attr("class", "legend" )
        .html(function(d){
            return "<span>●</span>" + country + " <span class=\"close\">"
            + "<i class=\"fa fa-times\"></i>"
            "</span>";
        })

    legend.on("click",function(){
            self.removeData(country);
            legend.remove();
        })

    legend.select("span")
        .style("color", ColorProvider.colorForKey(country) );

    /* Render Both Graph */
    this.datasets.push(data);
    this.render();
}

TimelineGraph.prototype.removeData = function(country){
    var index = _.findIndex( this.datasets, function(d){
        return country == d[0].country;
    });
    this.datasets.splice(index, 1 );

    this.render();
}

TimelineGraph.prototype.render = function(){
    var self = this;
    _.each( this.graphs, function(g){
        g.render(self.datasets);
    });
}

TimelineGraph.prototype.setPointerToYear = function(year){
    var xPos   = this.xScale(year);

    this.currentYearLine.attr("x1", xPos )
        .attr("x2", xPos )
        .attr("y1", 0 );


    d3.select("#chart")
        .selectAll(".year-bullet")
        .classed("selected",function(d){
            return year == d;
        });
}

function LineGraph( parent, id, valueKey ){
    this.parent = parent;
    this.element = parent.svg.append("g").attr("id", id );

    var yScale = d3.scale.linear()
        .range([ parent.height, 0]);

    this.valueKey = valueKey;

}

LineGraph.prototype.render = function( datasets ) {
    this.element.selectAll("*").remove();

    var tip       = this.parent.tip;
    var xScale    = this.parent.xScale;
    var yScale    = d3.scale.linear().range([ this.parent.height, 0]);
    var focusLine = this.parent.focusLine;
    var valueKey  = this.valueKey;

    var flattenedDataset = _.flatten(datasets);
    var highestValue = _.maxBy( flattenedDataset, valueKey );

    if( !highestValue ) {
        return;
    }

    var yDomain = [0,highestValue[valueKey]];
    var yLabel = "Requests";
    if( valueKey == "relative" ){
        var lowestValue = _.minBy( flattenedDataset, valueKey );
        var candidates = _.map( [ highestValue[valueKey], lowestValue[valueKey] ],
            function(d){
                return Math.abs(d)
            });

        var max = _.max(candidates);
        yDomain = [ -max, max ];
        yLabel  = "";
    }

    yScale.domain( yDomain ).nice();

    var format = d3.format('2s');
    if( valueKey == "relative" ){
        format = d3.format("%");
    }
    var shiftY = 20;
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(5)
        .tickFormat(format)
        .innerTickSize( -xScale(MAX_YEAR-1) - shiftY )
        .outerTickSize(0)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return xScale(d.year); })
        .y(function(d) {
            return yScale(d[valueKey]); }
        );

    this.element.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + -shiftY + ",0)")
      .call(yAxis)
      .append("text")
      .text(yLabel)
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("x", -6*yLabel.length )
      .attr("dy", ".71em");

    this.element.selectAll(".country")
        .data(datasets)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("stroke", function(d){
            return ColorProvider.colorForKey(d[0].country);
        })
        .attr("d", line);

    if( valueKey == "relative" ){
        this.element.append("line")
            .attr("x1", -shiftY )
            .attr("x2", this.parent.width )
            .attr("y1", yScale(0) )
            .attr("y2", yScale(0) )
            .attr("stroke", "black" )
            .attr("stroke-width", "2px")
            .attr("opacity", 0.2 );
    }

    this.element.append("g")
        .attr("class", "line-point")
        .selectAll('circle')
        .data(flattenedDataset)
        .enter()
        .append('circle')
        .attr("cx", function(d) {
            return xScale(d.year);
        })
        .attr("cy", function(d, i) { return yScale(d[valueKey]) })
        .attr("r", 5 )
        .style("fill", function(d){
            return ColorProvider.colorForKey(d.country);
        }).on("mouseover", function(d,i) {

            var data = _.filter( flattenedDataset, function( i ){
                return i.year == d.year;
            });


            var c = {
                country: d.country,
                number: d3.format(",")(d.number),
                percentage: d3.format("%")(d.relative),
                isNotZero: d.relative != 0 && valueKey != "relative",
                sign: d.relative > 0 ? "positive" : "negative"
            };

            tip.display(c);

            var max = _.maxBy( data, valueKey );

            var positionX = xScale(d.year);
            var positionY = yScale(max[valueKey]);
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
