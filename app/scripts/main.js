mapboxgl.accessToken = 'pk.eyJ1IjoiaGV5dGl0bGUiLCJhIjoiY2lqNW8zZnhkMDA2b3Y2a3Jsbmh1a3JsNiJ9.p3e9Zm5lDqv2nX6jaQ5VEg';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/heytitle/cij5oaknb0031azkjc07pztam', //hosted style id
    center: [
        NETHERLAND_COORDINATE.lng,
        NETHERLAND_COORDINATE.lat
    ],
    zoom: 3 // starting zoom
});

var start = {
    x: NETHERLAND_COORDINATE.lng,
    y: NETHERLAND_COORDINATE.lat,
};
var end = {
    x: 34.5333,
    y: 69.1333
};

var generator = new arc.GreatCircle( start, end, {'name': 'Seattle to DC'});
generator.Arc(100,{offset:10} );

var closeButton = d3.select('#close-button');

closeButton.on("click", function() {
  var graph = d3.select('#country-graph');
  graph.classed('show', !graph.classed('show') );
});

d3.select('#show-graph').on('click',function(){
  var graph = d3.select('#country-graph');
  graph.classed('show', !graph.classed('show') );
});
