var asylum = {};
var map;
var timeline;
var yearSelector;
var genderPie;
var agePie;
var leftPanel;
var overlay;

var totalYearlyData = {};

queue().defer(d3.json, "./data/world-topo-min.json")
    .defer(d3.csv, "./data/dutch.csv")
    .await(ready);

function ready(error,world, asylumRequests ){

    map = new Map("#map");
    overlay = new Overlay("country-overlay");
    timeline = new TimelineGraph("#timeline");
    yearSelector = new YearSelector("#year-selector");
    leftPanel = new LeftPanel();

    map.onClick = function( d, i ){
        var countryName = d.properties.name;
        if( asylum[countryName] ) {
       	    //overLayTimeLine = new TimelineGraph("#country-overlay");
            overlay.show(countryName);
        }
    }

    timeline.onClick = function( d, i ){
        map.colorMap( d );
        leftPanel.setYear(d);
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
		     tmp[2015] = {'Total':0,'M':{1:0,2:0},F:{1:0,2:0}};
        	 tmp[obj['Periods']]['Total'] = +obj['number'];
        	 tmp[obj['Periods']][obj['Sex']][obj['Age']] =  +obj['number'];
        	 //console.log(JSON.stringify(tmp));
        	 asylum[obj["Country"]]  = tmp;
        }
       else{
         tmp[obj['Periods']]['Total'] += +obj['number'];
         tmp[obj['Periods']][obj['Sex']][obj['Age']] +=  +obj['number'];
       }

       var number =  parseInt(obj['number']);
       if( !totalYearlyData[obj['Periods']] ){
           var d = {
               number : number,
               countries: {}
           };

           _.merge( d, CategoryKey.defaultValue() );
           d[CategoryKey['gender'][obj['Sex']]] = d.number;
           d[CategoryKey['age'][obj['Age']]]    = d.number;

           totalYearlyData[obj['Periods']]      = d;

       }else {
            var data = totalYearlyData[obj['Periods']];
            data['number']                          += number;
            data[CategoryKey['gender'][obj['Sex']]] += number;
            data[CategoryKey['age'][obj['Age']]]    += number;
       }

       var countriesData = totalYearlyData[obj['Periods']]['countries'];
       if( !countriesData[obj['Country']] ){
           countriesData[obj['Country']] = number;
       }else {
           countriesData[obj['Country']] += number;
       }

    }


    _.forEach( totalYearlyData, function(obj){
        /* Prepare number for each counties */
        var temp = _.map( obj.countries, function(d,k){
            return { country: k, number: d }
        })

        obj.countries = _.sortBy( temp, 'number' ).reverse();

       obj.data = function(cat){
           var keys = Object.keys( CategoryKey[cat] );
           var res = [];
           _.forEach( keys, function(k){
               var label = CategoryKey[cat][k];
               res.push( {
                   label: label,
                   value: obj[label]
                   // color: '#BCC7DC'
               } );
           });
           return res;
       }
    });

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

    genderPie = new PieChart("#gender-chart", "Gender",
        totalYearlyData[config.year].data('gender')
    );

    agePie    = new PieChart("#age-group-chart", "Age",
        totalYearlyData[config.year].data('age')
    );

    map.draw();
    map.colorMap(config.year);
    timeline.addData( asylum[config.country].toYearlyData() );
    d3.select("#total-number").
        html( d3.format(",")( totalYearlyData[config.year].number ) );
    leftPanel.setYear(config.year, true );

    yearSelector.onChange = function(d){
        timeline.setPointerToYear(d);
        map.colorMap(d);

        leftPanel.setYear(d);

    }


}
