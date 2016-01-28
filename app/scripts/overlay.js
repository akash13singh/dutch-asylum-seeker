function Overlay(id){
	this.element = d3.select(id);

	this.width  = document.getElementById('country-overlay').offsetWidth;
    this.height = this.width/2;
	this.closeOverlayButton = document.getElementById('close-overlay-button');

	this.closeOverlayButton.onclick = function() {
		var div = document.getElementById('country-overlay');
		if (div.style.display !== 'none') {
		    div.style.display = 'none';
		}
	};
}


Overlay.prototype.createOverlayData = function(country){
	this.male = [];
	this.female = [];
	this.below18 = [];
	this.above18 =[ ];
	this.total = [];
	countryData = asylum[country];
	console.log(JSON.stringify(countryData))
	for( var year in countryData){
	    if(!parseInt(year)) continue;
		this.total.push({x:year,y:countryData[year]['Total']});
		console.log(year+"::"+countryData[year]);
		this.male.push({x:year,y:(countryData[year]["M"]["1"]+countryData[year]["M"]["2"])});
		this.female.push({x:year,y:(countryData[year]['F']['1']+countryData[year]['F']['2'])});
		this.below18.push({x:year,y:(countryData[year]['M']['1']+countryData[year]['F']['1'])});
		this.above18.push({x:year,y:(countryData[year]['F']['1']+countryData[year]['F']['2'])});
	}
}


Overlay.prototype.createOverlayCharts = function(country){

    self = this;
 	this.createOverlayData(country);

	/*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
	nv.addGraph(function() {
	  var chart = nv.models.lineChart()
		            .margin({left: 200})  //Adjust chart margins to give the x-axis some breathing room.
		            .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
		            //.transitionDuration(350)  //how fast do you want the lines to transition?
		            .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
		            .showYAxis(true)        //Show the y-axis
		            .showXAxis(true)        //Show the x-axis
	  ;

	  chart.xAxis     //Chart x-axis settings
		  .axisLabel('Year')
		  .tickFormat(d3.format(',r'));

	  chart.yAxis     //Chart y-axis settings
		  .axisLabel('Asylum Requests')
		  .tickFormat(d3.format('.02f'));

	  /* Done setting the chart up? Time to render it!*/
	  var myData = totalCountryData();   //You need data...

	  d3.select('#totalChart svg')    //Select the <svg> element you want to render the chart in.
		  .datum(myData)         //Populate the <svg> element with chart data...
		  .call(chart);          //Finally, render the chart!

	  //Update the chart when window resizes.
	  nv.utils.windowResize(function() { chart.update() });
	  return chart;
	});


	/*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
	nv.addGraph(function() {
	  var chart = nv.models.lineChart()
		            .margin({left: 200})  //Adjust chart margins to give the x-axis some breathing room.
		            .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
		            //.transitionDuration(350)  //how fast do you want the lines to transition?
		            .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
		            .showYAxis(true)        //Show the y-axis
		            .showXAxis(true)        //Show the x-axis
	  ;

	  chart.xAxis     //Chart x-axis settings
		  .axisLabel('Year')
		  .tickFormat(d3.format(',r'));

	  chart.yAxis     //Chart y-axis settings
		  .axisLabel('Asylum Requests')
		  .tickFormat(d3.format('.02f'));

	  /* Done setting the chart up? Time to render it!*/
	  var myData = genderData();   //You need data...

	  d3.select('#genderChart svg')    //Select the <svg> element you want to render the chart in.
		  .datum(myData)         //Populate the <svg> element with chart data...
		  .call(chart);          //Finally, render the chart!

	  //Update the chart when window resizes.
	  nv.utils.windowResize(function() { chart.update() });
	  return chart;
	});


	/*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
	nv.addGraph(function() {
	  var chart = nv.models.lineChart()
		            .margin({left: 200})  //Adjust chart margins to give the x-axis some breathing room.
		            .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
		            //.transitionDuration(350)  //how fast do you want the lines to transition?
		            .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
		            .showYAxis(true)        //Show the y-axis
		            .showXAxis(true)        //Show the x-axis
	  ;

	  chart.xAxis     //Chart x-axis settings
		  .axisLabel('Year')
		  .tickFormat(d3.format(',r'));

	  chart.yAxis     //Chart y-axis settings
		  .axisLabel('Asylum Requests')
		  .tickFormat(d3.format('.02f'));

	  /* Done setting the chart up? Time to render it!*/
	  var myData = ageData();   //You need data...

	  d3.select('#ageChart svg')    //Select the <svg> element you want to render the chart in.
		  .datum(myData)         //Populate the <svg> element with chart data...
		  .call(chart);          //Finally, render the chart!

	  //Update the chart when window resizes.
	  nv.utils.windowResize(function() { chart.update() });
	  return chart;
	});




	/**************************************
	 * Simple test data generator
	 */
	function totalCountryData() {
	  //Line chart data should be sent as an array of series objects.
	  return [
		{
		  values: self.total,      //values - represents the array of {x,y} data points
		  key: 'total', //key  - the name of the series.
		  color: '#ff7f0e'  //color - optional: choose your own line color.
		}
	  ];
	}

	function genderData() {
		  //Line chart data should be sent as an array of series objects.
		  return [
			{
			  values: self.male,      //values - represents the array of {x,y} data points
			  key: 'Male', //key  - the name of the series.
			  color: '#ff7f0e'  //color - optional: choose your own line color.
			},
			{
			  values: self.female,
			  key: 'Female',
			  color: '#2ca02c'
			}
		  ];
	}

	function ageData() {
		  //Line chart data should be sent as an array of series objects.
		  return [
			{
			  values: self.below18,      //values - represents the array of {x,y} data points
			  key: 'below 18', //key  - the name of the series.
			  color: '#ff7f0e'  //color - optional: choose your own line color.
			},
			{
			  values: self.above18,
			  key: '18 & above',
			  color: '#2ca02c'
			}
		  ];
	}
}



Overlay.prototype.show = function(country){
    this.createOverlayCharts(country);
	toggleVisibility("country-overlay");
}











