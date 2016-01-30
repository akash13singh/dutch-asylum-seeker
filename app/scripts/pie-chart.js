var d3pieConfig = {
	"header": {
		"title": {
			"text": "Genders"
		}
	},
	"size": {
		// "canvasHeight": 150,
		// "canvasWidth": 150,
		"pieOuterRadius": "55%"
	},
	"data": {
		"sortOrder": "value-desc",
		"content": []
	},
	"labels": {
		"outer": {
			"hideWhenLessThanPercentage": 0,
			"pieDistance": 2
		},
		"mainLabel": {
			"fontSize": 9
		},
		"percentage": {
			"color": "#ffffff",
			"decimalPlaces": 0
		},
		"value": {
			"color": "#adadad",
			"fontSize": 8
		}
	},
	"tooltips": {
		"enabled": true,
		"type": "placeholder",
		"string": "{value} requests"
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
    options.size.canvasWidth  = width/1.8;

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
