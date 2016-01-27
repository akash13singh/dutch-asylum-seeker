var ColorProvider = {
    maps: {},
    availableColors : ["#31a354", "orange" ,"steelblue"],
    colorForKey: function(k){
        if( !this.maps[k] ) {
            var color = this.availableColors.pop();
            this.maps[k] = color;
        }
        return this.maps[k];
    },
    releaseColor: function(k){
        var color = this.maps[k];
        if( color ){
            this.availableColors.push(color);
            delete this.maps[k];
        }
    }
}


function toggleVisibility(id) {
       var e = document.getElementById(id);
       if(e.style.display == 'block')
          e.style.display = 'none';
       else
          e.style.display = 'block';
}
