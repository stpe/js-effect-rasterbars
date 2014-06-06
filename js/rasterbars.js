/**
 * Rotating raster bars with blend effect using canvas.
 *
 * Stefan Pettersson. stefpet@gmail.com @stpe
 *
 * Originally done December 2008:
 *   http://ajaxian.com/archives/javascript-raster-bar-effect
 *
 * Now slightly cleaned up code...
 */
(function(canvasId) {
    "use strict";

    // setup canvas
    var canvas = document.getElementById(canvasId);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    var ctx = canvas.getContext('2d');

    // bar parameters
    var resolution = 25;
    var speed = 0.01;
    var position = 150;
    var size = 50;
    var step = Math.PI * 2 / resolution;

    // create bars
    var bars = [
        new RasterBar(step, size, speed, [255, 32, 255]),
        new RasterBar(step, size, speed, [32, 255, 255]),
        new RasterBar(step, size, speed, [255, 255, 32])
    ];

    var t = 0;
    function draw() {
        ctx.clearRect(0,0,600,400);

        t += 0.03;
        if (t > Math.PI*2) t = 0;

        // do two pass, draw bar going one direction over
        // those in the other direction to get a sense of depth
        var pass = 3;
        var sinValue, drawPosition, y;
        while (--pass) {
            for (var i = 0; i < bars.length; i++) {
                sinValue = t + i * Math.PI * 2 / bars.length;
                drawPosition = Math.sin(sinValue - Math.PI/2);
                y = position + Math.round(120 * Math.sin(sinValue));

                if (pass == 2 && drawPosition < 0) {
                    bars[i].draw(y);
                } else if (pass == 1 && drawPosition >= 0) {
                    bars[i].draw(y);
                }
            }
        }

        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);

    // the rasterbar
    function RasterBar(step, size, speed, color) {
        this.step = step;
        this.size = size;
        this.speed = speed;
        this.color = color;

        this.offset = 0;
    }

    RasterBar.prototype.draw = function(position) {
        this.offset += this.speed;
        if (this.offset > this.step) this.offset = 0;

        var prevY = 0;
        var t = this.offset;
        var y, height, f, rgb;

        // draw each facet
        while (t < Math.PI + this.offset) {
            // height of facet in bar
            y = Math.round( this.size * Math.sin(3/2 * Math.PI + t) ) + this.size;
            height = y - prevY;

            // color
            f = 1 - Math.abs(this.size - prevY - height/2) / this.size;
            rgb = this.color.map(function(c) {
                return Math.round((f * c / 255) * 255);
            });

            // draw
            ctx.fillStyle = 'rgb(' + rgb + ')';
            ctx.fillRect(0, prevY + position, canvas.width, height);

            t += this.step;
            prevY = y;
        }
    };
})('rasterbars');
