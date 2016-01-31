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

    this.firstColor  = "steelblue";
    this.secondColor = "orange";
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
        this.above18.push({x:year,y:(countryData[year]['M']['2']+countryData[year]['F']['2'])});
    }
}


Overlay.prototype.createOverlayCharts = function(country){

    var self = this;
    this.createOverlayData(country);


    var xAxis;

    nv.addGraph(function() {
        var chart = nv.models.lineChart()
        .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
        .showYAxis(true)        //Show the y-axis
        .showXAxis(true)        //Show the x-axis

        chart.xAxis     //Chart x-axis settings
        .axisLabel('Year')
        .tickFormat(d3.format('y'));


        chart.yAxis     //Chart y-axis settings
        .axisLabel('')
        .tickFormat(d3.format(','));

        /* Done setting the chart up? Time to render it!*/
        var myData = totalCountryData();   //You need data...

        self.chart = d3.select('#totalChart svg')    //Select the <svg> element you want to render the chart in.
        .datum(myData)         //Populate the <svg> element with chart data...
        .call(chart);          //Finally, render the chart!

        //Update the chart when window resizes.
        // nv.utils.windowResize(function() { chart.update() });
        var genderChart = nv.models.lineChart()
        .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
        .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
        .showYAxis(true)        //Show the y-axis
        .showXAxis(true)        //Show the x-axis
        ;

        genderChart.xAxis     //Chart x-axis settings
        .axisLabel('Year')
        .tickFormat(d3.format('y'));

        genderChart.yAxis     //Chart y-axis settings
        .axisLabel('')
        .tickFormat(d3.format(','));

        /* Done setting the chart up? Time to render it!*/
        var myData = genderData();   //You need data...

        d3.select('#genderChart svg')    //Select the <svg> element you want to render the chart in.
        .datum(myData)         //Populate the <svg> element with chart data...
        .call(genderChart);          //Finally, render the chart!

    });


    /*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
    nv.addGraph(function() {

        // nv.utils.windowResize(function() { chart.update() });
        // return chart;
    });


    /*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
    nv.addGraph(function() {
        var chart = nv.models.lineChart()
        // .margin({left: 200})  //Adjust chart margins to give the x-axis some breathing room.
        .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
        //.transitionDuration(350)  //how fast do you want the lines to transition?
        .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
        .showYAxis(true)        //Show the y-axis
        .showXAxis(true)        //Show the x-axis
        ;

        var yearFormat = 'd'
        chart.xAxis     //Chart x-axis settings
        .axisLabel('Year')
        .tickFormat(d3.format(yearFormat));

        chart.yAxis     //Chart y-axis settings
        .axisLabel('')
        .tickFormat(d3.format(','));

        /* Done setting the chart up? Time to render it!*/
        var myData = ageData();   //You need data...
        console.log(myData);

        var c = d3.select('#ageChart svg')    //Select the <svg> element you want to render the chart in.
        .datum(myData)         //Populate the <svg> element with chart data...
        .call(chart);          //Finally, render the chart!

        // chart.interactiveLayer.dispatch.on('elementMousemove.name', self.hover );

        // , function(e) {
        // console.log(">>>>>>>>> ");
        // });


        nv.utils.windowResize(function() { chart.update() });
        return chart;
    });




    function totalCountryData() {
        return [
            {
                values: self.total,      //values - represents the array of {x,y} data points
                key: 'Total', //key  - the name of the series.
                color: self.firstColor
            }
        ];
    }

    function genderData() {
        return [
            {
                values: self.male,      //values - represents the array of {x,y} data points
                key: 'Male', //key  - the name of the series.
                color: self.firstColor
            },
            {
                values: self.female,
                key: 'Female',
                color: self.secondColor
            }
        ];
    }

    function ageData() {
        return [
        	 {
                values: self.above18,
                key: '18 & above',
                color: self.firstColor
            },
            {
                values: self.below18,      //values - represents the array of {x,y} data points
                key: 'below 18', //key  - the name of the series.
                color: self.secondColor  //color - optional: choose your own line color.
            }
        ];
    }
}


Overlay.prototype.hover = function(i){
    // console.log('xxxxx');
    // d3.selectAll("#country-overlay .nvtooltip")
    //     .style("opacity", "1" );
};



Overlay.prototype.show = function(country){
    document.getElementById("country-name").innerHTML = country;
    this.createOverlayCharts(country);
    toggleVisibility("country-overlay");
}











