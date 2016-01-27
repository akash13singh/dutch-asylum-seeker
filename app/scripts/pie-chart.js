var d3pieConfig = {
	"header": {
		"title": {
			"text": "Genders"
		},
        "subtitle": {
			"text": "A full pie chart"
        }
	},
	"size": {
		"pieOuterRadius": "60%"
	},
	"data": {
		"sortOrder": "value-desc",
		"content": []
	},
	"labels": {
		"outer": {
			"hideWhenLessThanPercentage": 50,
			"pieDistance": 5
		},
		"mainLabel": {
			"fontSize": 11
		},
		"percentage": {
			"color": "#ffffff",
			"decimalPlaces": 0
		},
		"value": {
			"color": "#adadad",
			"fontSize": 11
		}
	},
	"tooltips": {
		"enabled": true,
		"type": "placeholder",
		"string": "{value} submissions"
	},
	"effects": {
		"pullOutSegmentOnClick": {
			"effect": "linear",
			"speed": 400,
			"size": 4
		}
	},
	"callbacks": {}
};

function PieChart( id, title, data ){
    var options = _.extend( d3pieConfig );
    options.header.title.text = title;
    var width = d3.select(".left.column")
        .node()
        .getBoundingClientRect()
        .width;

    options.size.canvasHeight = width/2;
    options.size.canvasWidth  = width/2;

    if( data ){
        options.data.content = data;
    }
    this.element = new d3pie( id.replace('#',''), options );
}

PieChart.prototype.updateData = function( data ) {
    console.log(data);
    // this.element.select("*").remove();
    this.element.options.data.content = data;
    this.element.destroy();
    this.element.recreate();
}
