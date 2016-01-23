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
