!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define("queue",t):n.queue=t()}(this,function(){"use strict";function n(){}function t(t){function r(){if(!c)try{e()}catch(n){a[w+s-1]&&i(n)}}function e(){for(;c=h&&t>s;){var n=w+s,r=a[n],u=r.length-1,e=r[u];r[u]=f(n),--h,++s,r=e.apply(null,r),a[n]&&(a[n]=r||o)}}function f(n){return function(t,u){a[n]&&(--s,++w,a[n]=null,null==d&&(null!=t?i(t):(p[n]=u,h?r():s||y(d,p))))}}function i(n){var t,r=a.length;for(d=n,p=void 0,h=NaN;--r>=0;)if((t=a[r])&&(a[r]=null,t.abort))try{t.abort()}catch(n){}s=NaN,y(d,p)}if(!(t>=1))throw new Error;var l,c,a=[],p=[],h=0,s=0,w=0,d=null,y=n;return l={defer:function(t){if("function"!=typeof t||y!==n)throw new Error;if(null!=d)return l;var o=u.call(arguments,1);return o.push(t),++h,a.push(o),r(),l},abort:function(){return null==d&&i(new Error("abort")),l},await:function(t){if("function"!=typeof t||y!==n)throw new Error;return y=function(n,r){t.apply(null,[n].concat(r))},s||y(d,p),l},awaitAll:function(t){if("function"!=typeof t||y!==n)throw new Error;return y=t,s||y(d,p),l}}}function r(n){return t(arguments.length?+n:1/0)}var u=[].slice,o={};return r.version="1.2.2",r});
var ColorProvider = {
    maps: {},
    availableColors : ["#31a354", "orange" ,"steelblue"],
    colorForKey: function(k){
        if( !this.maps[k] ) {
            var color = this.availableColors.pop();
            this.maps[k] = color;
        }
        return this.maps[k];
    },
    releaseColor: function(k){
        var color = this.maps[k];
        if( color ){
            this.availableColors.push(color);
            delete this.maps[k];
        }
    }
}


function Map( id ){
    this.element = d3.select(id);

    /*var rect = document.getElementById('map').offsetWidth
    this.width  = rect.width;
    this.height = rect.height;*/

    this.width  = document.getElementById('map').offsetWidth;
    this.height = this.width/2;

    var projection = d3.geo.mercator()
    	.translate([(this.width/2)-30, (this.height/2)+50])
    	.scale( this.width / 2 / Math.PI);

    /*var projection = d3.geo.mercator()
    	.center([80,40])
        .translate([(this.width/2), (this.height/2)])
    	.scale( this.width / 3 / Math.PI) */

    var path = d3.geo.path().projection(projection);
    this.path = path;

    var svg = this.element.append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g");

    this.svg = svg;

    var tooltip = this.element
        .append("div")
        .attr("class", "tooltip hidden");

    this.tooltip = tooltip;

    this.topo = null;
}

Map.prototype.draw = function(){
    var self     = this;

    var country = this.svg
        .selectAll(".country").data(this.topo);

    var path = this.path;

	var graticule = d3.geo.graticule();
	this.svg.append("path")
     .datum(graticule)
     .attr("class", "graticule")
     .attr("d", path);


    this.svg.append("path")
   .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
   .attr("class", "equator")
   .attr("d", path);

    country.enter().insert("path")
        .attr("class", "country")
        .attr("d", path )
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.properties.name; });

    //fill color
    this.colorMap(2013);

    //offsets for tooltips
    var boundary = this.element.node().getBoundingClientRect();
    var offsetL = boundary.left+20;
    var offsetT = boundary.top+10;

    //tooltips
    country.on("mousemove", function(d,i) {
        var mouse = d3.mouse(self.svg.node()).map( function(d) { return parseInt(d); } );

        self.tooltip.classed("hidden", false)
             .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
             .html(d.properties.name);

      })
      .on("mouseout",  function(d,i) {
        self.tooltip.classed("hidden", true);
      });

	country.on("click", this.onClick );

}

Map.prototype.colorMap = function(year){
    var self     = this;
    var present = [];
    //Define default colorbrewer scheme
	var colorSchemeSelect = "Greens";
	var colorScheme = colorbrewer[colorSchemeSelect];

	//define default number of quantiles
	var quantiles = 5;

	//Define quantile scale to sort data values into buckets of color
	var color = d3.scale.quantile()
	   .range(colorScheme[quantiles]);

    var colorDomain =  [];
    var minDomain = 999999;
    var maxDomain = 0;
    for (var key in asylum){
    	present.push(key);
    	colorDomain.push[asylum[key][year]["Total"]];
    	if(minDomain > asylum[key][year]["Total"]){
    		minDomain = asylum[key][year]["Total"];
    	}
    	if(maxDomain < asylum[key][year]["Total"]){
    		maxDomain = asylum[key][year]["Total"];
    	}
    }
    color.domain([minDomain,maxDomain]);

    console.log("minmax"+"::"+minDomain+"::"+maxDomain);

    this.svg
        .selectAll(".country")
        .style("fill", function(d, i) {
            if(asylum[d.properties.name]){
                return color(asylum[d.properties.name][year]['Total']);
            }
            return "#DDE7EB";
        });

    var legend = this.svg.selectAll('g.legend')
		.data(color.range())
		.enter()
		.append('g').attr('class', 'legend');

	legend
		.append('rect')
		.attr("x",this.width - (this.width-30))
		.attr("y", function(d, i) {
		   return ((self.height-200)+(i * 20));
		})
	   .attr("width", 10)
	   .attr("height", 10)
	   .style("stroke", "black")
	   .style("stroke-width", 1)
	   .style("fill", function(d){return d;});
		   //the data objects are the fill colors

	legend
		.append('text')
		.attr("x", this.width - (this.width-45)) //leave 5 pixel space after the <rect>
		.attr("y", function(d, i) {
		   return ((self.height-200)+(i * 20));
		})
		.attr("dy", "0.8em") //place text one line *below* the x,y point
		.text(function(d,i) {
		    var extent = color.invertExtent(d);
		    //extent will be a two-element array, format it however you want:
		    var format = d3.format("0.2f");
		    return format(+extent[0]) + " - " + format(+extent[1]);
		});

	//console.log(present);
	//downloading json
    /*var url = 'data:text/json;charset=utf8,' + encodeURIComponent(present);
	window.open(url, '_blank');
	window.focus();*/

}

function TimelineGraph( id, options ){
    var self     = this;
    this.element = d3.select(id);
    this.datasets = [];

    var FOCUS_YEAR = 2010;

    var MIN_YEAR       = 2007;
    var MAX_YEAR       = 2015;
    var YEAR_RANGE     = [MIN_YEAR, MAX_YEAR -1 ];
    var X_AXIS_PADDING = 30;

    var boxWidth = document.getElementById("timeline").offsetWidth;
    var margin   = {top: 20, right: 20, bottom: 30, left: 50};
    var width    = boxWidth - margin.left - margin.right;
    var height   = 200 - margin.top - margin.bottom + X_AXIS_PADDING;

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
            self.graphs[i].element.attr("opacity", 1 );
            self.graphs[(i+1)%2].element.attr("opacity", 0 );
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

    var currentX = xScale(FOCUS_YEAR);
    var currentYearLine = this.svg.append("line")
        .attr("class", "focus-line current" )
        .attr("x1", currentX )
        .attr("x2", currentX )
        .attr("y1", 0 )
        .attr("y2", height + X_AXIS_PADDING/4 )

    timeSelector.append("g")
        .selectAll('circle')
        .data(d3.range(MIN_YEAR, MAX_YEAR))
        .enter().append('circle')
        .attr("class", "year-bullet")
        .classed("selected", function(d){
            return d== FOCUS_YEAR;
        })
        .attr("cx", function(d) {
            return xScale(d);
          })
        .attr("cy", yTimeSelector )
        .attr("r", 8 )
        .on("click", function(d,i){
            var xPos = xScale(d);
            currentYearLine.attr("x1", xPos )
                .attr("x2", xPos )
                .attr("y1", 0 );


            d3.select("#chart")
                .selectAll(".year-bullet")
                .classed("selected",function(e,j){
                    return i == j;
                });

            /* Call event outside */
            self.onClick(d,i);
        });

    this.tip = d3.tip()
        .attr('class', 'timeline-tip')
        .offset([-10, 50])
        .html(function(data) {
            return JSON.stringify(data);
        });

    this.svg.call(this.tip);

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

    this.graphs[1].element.attr("opacity", 0 );

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
                console.log(data[i-1]);
                dominator = 1;
            }
            d.relative = ( d.number - data[i-1].number ) / dominator;
        }
    })

    /* Legend */
    var element = this.element;
    var index   = this.datasets.length;

    var legend = element.select("ul")
        .append("li")
        .attr("class", "legend" )
        .html(function(d){
            return "<li><span>●</span>" + country + " <span class=\"close\">[x]</span></li>";
        })

    legend.select("span.close")
        .on("click",function(){
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
    if( valueKey == "relative" ){
        var lowestValue = _.minBy( flattenedDataset, valueKey );
        var candidates = _.map( [ highestValue[valueKey], lowestValue[valueKey] ],
            function(d){
                return Math.abs(d)
            });

        var max = _.max(candidates);
        yDomain = [ -max, max ];
    }

    yScale.domain( yDomain );

    var format = d3.format('.2s');
    if( valueKey == "relative" ){
        format = d3.format("1.1f");
    }
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(5)
        .tickFormat(format)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return xScale(d.year); })
        .y(function(d) {
            return yScale(d[valueKey]); }
        );

    this.element.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + -20 + ",0)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
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
            .attr("x1", 0 )
            .attr("x2", this.parent.width )
            .attr("y1", yScale(0) )
            .attr("y2", yScale(0) )
            .attr("stroke", "black" )
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

            tip.show(data);

            var max = _.max( data, function(d){ return d[valueKey] } );

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

function type(d) {
  d.year =  +d.year;
  d.number = +d.number;
  return d;
}


var datasets = [[],[]];
var timeline = new TimelineGraph("#timeline-panel");

d3.tsv("data.tsv", type, function(error, data) {
  if (error) throw error;

  for( var i = 0; i<data.length; i++ ){
      var index = 0;
      if( data[i].country == "India" ){
          index = 1;
      }
      datasets[index].push(data[i]);

  }

  timeline.addData( datasets[0] );
  console.log(datasets[0]);

});


var config = {
    country : "Turkey",
    year: "2008"
};

var asylum = {};
var datasets = [[],[]];
var map;
var timeline;

function init (){
queue().defer(d3.json, "./data/world-topo-min.json")
    .defer(d3.csv, "./data/dutch.csv")
    .await(ready);
}

init();



function ready(error,world, asylumRequests ){
    console.log(error);

    console.log(world);
    console.log(asylumRequests);
    map = new Map("#map");
    timeline = new TimelineGraph("#timeline");

    map.onClick = function( d, i ){
        var countryName = d.properties.name;
        if( asylum[countryName] ) {
            timeline.addData( asylum[countryName].toYearlyData() );
        }
    }

    timeline.onClick = function( d, i ){
        map.colorMap( d );
    }

    var countries = topojson.feature(world, world.objects.countries).features;
    map.topo = countries;

    //load csv and build json
    for (var i = 0; i < asylumRequests.length; i++) {
        var obj = asylumRequests[i];
        //console.log(obj);
        if(asylum[obj["Country"]]== null){
        	 tmp ={};
        	 //TODO : remove later. done to simplify json building
        	 tmp['Citizenship'] = obj['Citizenship'];
        	 tmp[2007] = {'Total':0,'M':{1:0,2:0},F:{1:0,2:0}};
			 tmp[2008] = {'Total':0,'M':{1:0,2:0},F:{1:0,2:0}};
			 tmp[2009] = {'Total':0,'M':{1:0,2:0},F:{1:0,2:0}};
			 tmp[2010] = {'Total':0,'M':{1:0,2:0},F:{1:0,2:0}};
			 tmp[2011] = {'Total':0,'M':{1:0,2:0},F:{1:0,2:0}};
			 tmp[2012] = {'Total':0,'M':{1:0,2:0},F:{1:0,2:0}};
			 tmp[2013] = {'Total':0,'M':{1:0,2:0},F:{1:0,2:0}};
			 tmp[2014] = {'Total':0,'M':{1:0,2:0},F:{1:0,2:0}};
        	 tmp[obj['Periods']]['Total'] = +obj['number'];
        	 tmp[obj['Periods']][obj['Sex']][obj['Age']] =  +obj['number'];
        	 //console.log(JSON.stringify(tmp));
        	 asylum[obj["Country"]]  = tmp;
        }
       else{
         tmp[obj['Periods']]['Total'] += +obj['number'];
         tmp[obj['Periods']][obj['Sex']][obj['Age']] +=  +obj['number'];
       }
    }


    _.forEach( asylum, function( country, countryName ){
        country.toYearlyData = function(){
            var data =  _.map( country, function( obj, year ) {
                return {
                    country: countryName,
                    number: obj.Total,
                    year: parseInt(year)
                }
            });
            return _.filter( data, "year");
        }
    });


    map.draw( asylum );
    timeline.addData( asylum[config.country].toYearlyData() );
}
