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

var CategoryKey = {
    'gender': {
        'M': "Male",
        'F': "Female"
    },
    'age': {
        '2': "18 & Above",
        '1': "Below 18"
    },
    defaultValue: function(){
        return {
            "Male": 0,
            "Female": 0,
            "Below 18": 0,
            "18 & Above": 0
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

function ordinal(num) {
    var ones = num % 10;
    var tens = Math.floor(num / 10) % 10;
    var suff;
    if (tens == 1) {
        suff = "th";
    } else {
        switch (ones) {
            case 1 : suff = "st"; break;
            case 2 : suff = "nd"; break;
            case 3 : suff = "rd"; break;
            default : suff = "th";
        }
    }
    return num + suff;
}
