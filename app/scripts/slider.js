var MIN_YEAR = 2007;
var MAX_YEAR = 2015;
var ticks = (( MAX_YEAR - MIN_YEAR  )* 4 ) ;
var slider = d3
    .slider()
    .axis(
        d3
        .svg
        .axis()
        .ticks(ticks)
        .tickFormat(function(d){
            var year = d%4;
            if( year == 0 ) {
                return MIN_YEAR + Math.floor(d/4);
            }else {
                return '';
            }
        })
    )
    .min(0)
    .max(ticks-1)
    .step(1)
    .on('slide', function(evt,val){
        var year = MIN_YEAR + Math.floor(val/4);
        var quarter = ( val % 4 ) + 1;
    });
d3.select('#year-slider').call(slider);


nv.addGraph(function() {
  var chart = nv.models.lineChart()
                // .margin({left: 30})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                // .transitionDuration(350)  //how fast do you want the lines to transition?
                // .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                // .showYAxis(true)        //Show the y-axis
                // .showXAxis(true)        //Show the x-axis
  ;

  // chart.xAxis     //Chart x-axis settings
      // .axisLabel('Time (ms)')
      // .tickFormat(function(){return""});

  chart.yAxis     //Chart y-axis settings
  //     .axisLabel('Voltage (v)')
      .tickFormat(d3.format('.02f'));

  /* Done setting the chart up? Time to render it!*/
  var myData = sinAndCos();   //You need data...

  d3.select('#chart svg')    //Select the <svg> element you want to render the chart in.
      .datum(myData)         //Populate the <svg> element with chart data...
      .call(chart);          //Finally, render the chart!

  //Update the chart when window resizes.
  nv.utils.windowResize(function() { chart.update() });
  return chart;
});

function sinAndCos() {
  var sin = [],sin2 = [],
      cos = [];

  //Data is represented as an array of {x,y} pairs.
  for (var i = 0; i < ticks; i++) {
    sin.push({x: i, y: Math.abs(Math.sin(i/10))});
    sin2.push({x: i, y: Math.abs(Math.sin(i/10) *0.25 + 0.5)});
    // cos.push({x: i, y: .5 * Math.cos(i/10)});
  }

  //Line chart data should be sent as an array of series objects.
  return [
    {
      values: sin,      //values - represents the array of {x,y} data points
      key: 'Thailand', //key  - the name of the series.
      color: '#ff7f0e'  //color - optional: choose your own line color.
    },
    {
      values: sin2,
      key: 'India',
      color: '#7777ff',
      // area: true      //area - set to true if you want this line to turn into a filled area chart.
    }
  ];
}

