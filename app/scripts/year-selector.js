function YearSelector(id){
    var self = this;
    var MIN_YEAR = 2007;
    var MAX_YEAR = 2014;

    this.element = d3.select(id)

    var dropdown = this.element
        .selectAll("option")
        .data( _.range( MIN_YEAR, MAX_YEAR+1 ) )
        .enter()
        .append("option")
        .text(function(d){
            return d;
        })
        .attr("value", function(d){ return d } );

    this.element.property("value", config.year );

    this.element.on("change",function(){
        var year = d3.select(this).property('value');
        console.log(year);
        self.onChange(year);
    });
}

YearSelector.prototype.onChange = function(){console.log("Unimplemented")}
YearSelector.prototype.setYear = function(year){
    this.element.property("value", year );
};
