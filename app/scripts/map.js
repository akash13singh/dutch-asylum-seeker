function Map( id ){
    this.element = d3.select(id);

    var rect = this.element.node().getBoundingClientRect();
    var width  = rect.width;
    var height = width/2;

    var projection = d3.geo.mercator()
        .translate([(width/2), (height/2)])
        .scale( width / 2 / Math.PI);

    var path = d3.geo.path().projection(projection);
    this.path = path;

    var svg = this.element.append("svg")
      .attr("width", width)
      .attr("height", height)
      .on("click", function(){ alert("xx") })
      .append("g");

    this.svg = svg;

    var tooltip = this.element
        .append("div")
        .attr("class", "tooltip hidden");
    this.tooltip = tooltip;

    this.topo = null;
}

Map.prototype.draw = function(data){
    var self     = this;
    var color    = ["#D4B9DA","#C994C7","#DF65B0","#DD1C77","#980043"];
    var quantize = d3.scale.quantize()
        .domain([0, 9000])
        .range(d3.range(5).map(function(i) { return color[i] }));

    var country = this.svg.append("g")
        .selectAll(".country").data(this.topo);

    var path = this.path;

    country.enter().insert("path")
        .attr("class", "country")
        .attr("d", path )
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.properties.name; })
        .style("fill", function(d, i) {
            if(data[d.properties.name]){
                return quantize(data[d.properties.name]['2007']['Total']);
            }
            return "#DDE7EB";
        });

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
}


queue().defer(d3.json, "data/world-topo-min.json")
	.defer(d3.csv, "data/dutch.csv")
    .await(ready);

var map = new Map("#map");

var asylum = {};
function ready(error,world, asylumRequests){
    var countries = topojson.feature(world, world.objects.countries).features;
    map.topo = countries;

    //load csv and build json
    for (var i = 0; i < asylumRequests.length; i++) {
        var obj = asylumRequests[i];
        //console.log(obj);
        if(asylum[obj["Country"]]== null){
        	 tmp ={};
        	 //TODO : remove later done to simplify json building
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
        	//var tmp = {'Citizenship' : obj['Citizenship'], obj['Periods'] : { 'Total': obj['numbers'], obj['Sex'] : { obj['Age'] : obj['numbers'] }}};
        	//asylum[obj["Country"]] = {'Citizenship' : obj['Citizenship'], obj['Periods'] :{ Total:obj['numbers'], obj['Sex']:{ obj['Age']:obj['numbers'] }}};
        }
       else{
         tmp[obj['Periods']]['Total'] += +obj['number'];
         tmp[obj['Periods']][obj['Sex']][obj['Age']] +=  +obj['number'];
       }
    }

    map.draw( asylum );
}
