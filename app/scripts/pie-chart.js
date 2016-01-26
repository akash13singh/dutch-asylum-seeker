var d3pieConfig = {
	"header": {
		"title": {
			"text": "Genders"
		}
	},
	"size": {
		"canvasHeight": 150,
		"canvasWidth": 150
		// "pieOuterRadius": "60%"
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

var genderPie = new PieChart("#gender-chart", "Gender", [
    {
        "label": "Male",
        "value": 200
    },
    {
        "label": "Female",
        "value": 100
    }
]);
var agePie    = new PieChart("#age-group-chart", "Age", [
    {
        "label": "< 18 years old",
        "value": 20
    },
    {
        "label": "18 > years",
        "value": 300
    }
]);

function PieChart( id, title, data ){
    var options = _.extend( d3pieConfig );
    options.header.title.text = title;

    if( data ){
        options.data.content = data;
    }
    this.element = new d3pie( id.replace('#',''), options );
}

PieChart.prototype.updateData = function( data ) {
    this.element.options.data.content = data;
    this.element.redraw();
}
