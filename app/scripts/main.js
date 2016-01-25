    queue().defer(d3.json, "data/world-topo-min.json")
        .defer(d3.csv, "data/dutch.csv")
        .defer(d3.tsv, "data.tsv")
        .await(ready);

var asylum = {};

var datasets = [[],[]];
var map;
var timeline;

function ready(error,world, asylumRequests, patMock){
    map = new Map("#map");
    timeline = new TimelineGraph("#timeline");

    var countries = topojson.feature(world, world.objects.countries).features;
    map.topo = countries;

    //* Mock data //
      for( var i = 0; i< patMock.length; i++ ){
          var index = 0;
          if( patMock[i].country == "India" ){
              index = 1;
          }
          datasets[index].push(patMock[i]);

      }

  timeline.addData( datasets[0] );
  console.log(datasets[0]);

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

    map.draw( asylum );
}


d3.tsv("data.tsv", type, function(error, data) {
  if (error) throw error;


});
