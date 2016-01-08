'use strict';
var assert = require('assert');
var fs = require('fs');
var myCode = fs.readFileSync('./app/scripts/lib/Geo.js','utf-8');

eval.call(null,myCode);

describe('Point', function () {
    it('create point', function(){
        var p = new Point(10,20);
        assert.equal(p.x, 10 );
        assert.equal(p.y, 20 );
    });
});

describe('Line', function(){
    it('regular and horizontal line', function(){
        var p = new Point( 1, 1 );
        var l = new Line( 1, 5, p );
        assert.equal( l.m, 5, 'Correct slope' );
        assert.equal( l.c, -4, 'Correct c' );

        assert.ok( l.isPointOnLine( new Point( 2, 6 ) ), 'Point is on the line' );
        assert.ok( !l.isPointOnLine( new Point( 2, 3 ) ), 'Point is NOT on the line' );

        assert.ok( l.isPointAbove( new Point( 2, 10 ) ), 'Point is above the line.' );
        assert.ok( !l.isPointAbove( new Point( 2, 3 ) ), 'Point is below the line.' );
    });

    it('vertical line', function(){
        var p = new Point(5,2);
        var l = new Line( 0, 6, p );
        assert.equal( l.m, Infinity, 'Slope is zero' );
        assert.equal( l.c, -Infinity, 'Correct c');
        assert.ok( l.isPointOnLine( new Point( 5, -10 ) ), 'Point is on the line' );
        assert.ok( !l.isPointOnLine( new Point( 10, 3 ) ), 'Point is NOT on the line' );

        assert.ok( l.isPointAbove( new Point( 3, 2 ) ), 'Point is above the line.' );
        assert.ok( !l.isPointAbove( new Point( 10, 3 ) ), 'Point is below the line.' );
    });

});
