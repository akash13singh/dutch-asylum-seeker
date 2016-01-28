function LeftPanel(){
	nv.addGraph(function() {
	  var chart = nv.models.lineChart()
                    .margin({ left: 20, right: 20 })
                    .isArea(true)
		            .useInteractiveGuideline(false)  //We want nice looking tooltips and a guideline!
		            .showLegend(false)       //Show the legend, allowing users to turn on/off line series.
		            .showYAxis(false)        //Show the y-axis
		            .showXAxis(true)        //Show the x-axis
	  ;

	  chart.xAxis     //Chart x-axis settings
		  .axisLabel('')
		  .tickFormat(function(d){
              return d;
          });

	  chart.yAxis     //Chart y-axis settings
		  .axisLabel('Asylum Requests')
		  .tickFormat(d3.format(','));

	  /* Done setting the chart up? Time to render it!*/
      var trend = _.map( totalYearlyData, function(d,k){
          return {
              x: k,
              y: d.number
          }
      });

	  d3.select('#overall-trend svg')    //Select the <svg> element you want to render the chart in.
		  .datum([{
              values: trend,
              key: "Asylum requests",
              color: "#E2E9F5"
          }])         //Populate the <svg> element with chart data...
		  .call(chart);          //Finally, render the chart!

	  //Update the chart when window resizes.
	  nv.utils.windowResize(function() { chart.update() });
	  return chart;
	});

}

LeftPanel.prototype.setYear = function(d, firstTime ){
    var leftPanel = d3.select(".left.column");
    leftPanel.select("#total-number")
        .html( d3.format(",")( totalYearlyData[d].number ) );

    yearSelector.setYear(d);

    if( !firstTime ){
        genderPie.updateData( totalYearlyData[d].data('gender'));
        agePie.updateData( totalYearlyData[d].data('age'));
    }

    leftPanel.selectAll(".country")
        .remove("*");

    leftPanel.select("#rank").selectAll(".country")
        .data( totalYearlyData[d].countries.slice(0,3)  )
        .enter()
        .append('tr')
        .attr("class", "country")
        .html(function(d,i){
            return "<td>"+ (i+1) + "</td>"+
            "<td>"+d.country+"</td>"+
            "<td>"+d3.format(",")(d.number)+"</td";
        });
}
