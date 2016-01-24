var chartID        = "#chart";

// var MIN_YEAR = 2007;
// var MAX_YEAR = 2015;
// var ticks = (MAX_YEAR - MIN_YEAR)*4 - 1;




function createGraph( data ) {
  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d){ return d.close; })])

  var timeSelector = svg.append("g");
  var yTimeSelector = height + 20;




    svg.call(tip);


    var currentX = x(FOCUS_YEAR);
    var currentValue = _.find( data, function(d){
            return d.year == FOCUS_YEAR
        });


  var radius = 5;

}
