var config = {
    country : "Turkey",
    year: "2008"
};

var asylum = {};
var map;
var timeline;

queue().defer(d3.json, "./data/world-topo-min.json")
    .defer(d3.csv, "./data/dutch.csv")
    .await(ready);

function ready(error,world, asylumRequests ){
    var config = {
        country : "Turkey",
        year: "2008"
    };

    map = new Map("#map");
    timeline = new TimelineGraph("#timeline");

    map.onClick = function( d, i ){
        var countryName = d.properties.name;
         overLayTimeLine = new TimelineGraph("#countryOverlay");
        if( asylum[countryName] ) {
            timeline.addData( asylum[countryName].toYearlyData() );
        }
        toggleVisibility("countryOverlay")
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


    map.draw();
    timeline.addData( asylum[config.country].toYearlyData() );
}
