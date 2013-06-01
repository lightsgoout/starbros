"use strict";
var Application = function(width, height) {
    this.first_planets = [];
    this.second_planets = [];
    this.planets = [];
    this.canvas;
    this.ctx;
    this.mouse;

    this.width  = width;
    this.height = height;
    this._resources = {};
    this.wait();
};

Application.prototype = {
    wait: function() {
        var self = this;
        window.onload = function() {
            self.init(self.width, self.height);
        }
    },
    init: function(width, height) {
        var initRunTime = new Date();
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.canvas.width  = width;
        this.canvas.height = height;
        if (!this.canvas.getContext('2d')) {
            document.body.innerHTML = '<center>No support 2d context.</center>';
            return false;
        }
        this.ctx = this.canvas.getContext('2d');
        this.ctx.font = '16px monospace';
        this.ctx.textAlign = 'center';

        var firstCenter = new Point(this.canvas.width / 4, this.canvas.height / 2);
        var secondCenter = new Point((this.canvas.width / 4) * 3, this.canvas.height / 2);
        this.mouse = new MouseController(this.canvas);

        var IM = {
            store: this._resources,
            imagesAdded: 0,
            imagesLoaded: 0,
            add: function(url, name) {
                var self  = this;
                var image = new Image();
                image.onload = function() {
                    self.imagesLoaded++;
                    if (self.imagesAdded == self.imagesLoaded) {
                        self.app.render(new Date());
                        console.log('init complete over ' + (new Date() - initRunTime) + 'ms');
                    }
                }
                image.src = url;
                this.store[name] = image;
                this.imagesAdded++;
            },
            app: this
        }
        IM.add('img/sun.png', 'sun');
        IM.add('img/planets.png', 'planets');

        var firstOrbit  = new Orbit(firstCenter.clone(), 0).setProperty({
            ctx:   this.ctx,
            mouse: this.mouse
        }, true);
        var firstPlanet = new Planet(firstOrbit, 50, 1).setProperty({
            tile: new Tile(this.ctx, this._resources['sun'], 0, 0, 100, 100),
            name: 'Sun',
            ctx:  this.ctx
        }, true);
        this.first_planets.push(firstPlanet);

        var secondOrbit  = new Orbit(secondCenter.clone(), 0).setProperty({
            ctx:   this.ctx,
            mouse: this.mouse
        }, true);
        var secondPlanet = new Planet(secondOrbit, 50, 1).setProperty({
            tile: new Tile(this.ctx, this._resources['sun'], 0, 0, 100, 100),
            name: 'Sun',
            ctx:  this.ctx
        }, true);
        this.second_planets.push(secondPlanet);

        var names = ['Moon', 'Phobos', 'Deimos', 'Dactyl', 'Linus', 'Io', 'Europa', 'Ganymede',
            'Callisto', 'Amalthea', 'Himalia', 'Elara', 'Pasiphae', 'Taurus', 'Sinope', 'Lysithea',
            'Carme', 'Ananke', 'Leda', 'Thebe', 'Adrastea', 'Metis', 'Callirrhoe', 'Themisto',
            '1975', '2000', 'Megaclite', 'Taygete', 'Chaldene', 'Harpalyke'];
        var tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        var time  = 40;
        shuffle(names);
        shuffle(tiles);

        for (var i = 0; i < 12; ++i) {
            firstOrbit  = new Orbit(firstCenter.clone(), 90+i*26).setProperty({
                ctx:   this.ctx,
                mouse: this.mouse
            }, true);
            firstPlanet = new Planet(firstOrbit, 13, time).setProperty({
                tile: new Tile(this.ctx, this._resources['planets'], tiles[i]*26, 0, 26, 26),
                name: names[i],
                ctx:  this.ctx
            }, true);
            this.first_planets.push(firstPlanet);
            time += 20;
        }

        for (var i = 0; i < 12; ++i) {
            secondOrbit  = new Orbit(secondCenter.clone(), 90+i*26).setProperty({
                ctx:   this.ctx,
                mouse: this.mouse
            }, true);
            secondPlanet = new Planet(secondOrbit, 13, time).setProperty({
                tile: new Tile(this.ctx, this._resources['planets'], tiles[i]*26, 0, 26, 26),
                name: names[i],
                ctx:  this.ctx
            }, true);
            this.second_planets.push(secondPlanet);
            time += 20;
        }
    },
    render: function(lastTime, player) {
        var curTime = new Date();
        var self    = this,
            ctx     = this.ctx,
            firstPlanets = this.first_planets,
            secondPlanets = this.second_planets,
            mouse   = this.mouse;
        requestAnimationFrame(function(){
            self.render(curTime);
        });
        ctx.clearRect(0, 0, this.width, this.height);

        var showInfo = -1;
        for (var i = 0, il = firstPlanets.length; i < il; ++i) {
            firstPlanets[i].orbit.draw();
            firstPlanets[i].render(curTime - lastTime);
            if (Math.abs(firstPlanets[i].pos.x - mouse.pos.x) < firstPlanets[i].radius
                && Math.abs(firstPlanets[i].pos.y - mouse.pos.y) < firstPlanets[i].radius)
            {
                showInfo = i;
                if (mouse.pressed) {
                    firstPlanets[i].animate = firstPlanets[i].animate ? false : true;
                }
            }
        }

        for (var i = 0, il = secondPlanets.length; i < il; ++i) {
            secondPlanets[i].orbit.draw();
            secondPlanets[i].render(curTime - lastTime);
            if (Math.abs(secondPlanets[i].pos.x - mouse.pos.x) < secondPlanets[i].radius
                && Math.abs(secondPlanets[i].pos.y - mouse.pos.y) < secondPlanets[i].radius)
            {
                showInfo = i;
                if (mouse.pressed) {
                    secondPlanets[i].animate = secondPlanets[i].animate ? false : true;
                }
            }
        }

        if (showInfo > -1) {
            firstPlanets[showInfo].showInfo();
            secondPlanets[showInfo].showInfo();
            secondPlanets[showInfo].drawBorder();
            firstPlanets[showInfo].drawBorder();
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
        mouse.pressed = false;
    }
}