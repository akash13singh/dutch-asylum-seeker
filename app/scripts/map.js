
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

Map.prototype.draw = function(asylum){
    var self     = this;
    self.data = asylum;

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
    var data   = self.data;
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
    for (var key in data){
    	present.push(key);
    	colorDomain.push[data[key][year]["Total"]];
    	if(minDomain > data[key][year]["Total"]){
    		minDomain = data[key][year]["Total"];
    	}
    	if(maxDomain < data[key][year]["Total"]){
    		maxDomain = data[key][year]["Total"];
    	}
    }
    color.domain([minDomain,maxDomain]);

    console.log("minmax"+"::"+minDomain+"::"+maxDomain);

    this.svg
        .selectAll(".country")
        .style("fill", function(d, i) {
            if(data[d.properties.name]){
                return color(data[d.properties.name][year]['Total']);
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
