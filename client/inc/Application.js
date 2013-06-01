"use strict";
var Application = function(width, height) {
    this.first_planets = [];
    this.second_planets = [];
    this.planets = [];
    this.canvas;
    this.ctx;
    this.mouse;

    this.divExists = false;
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
        $(this.canvas).appendTo("#application");
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
        shuffle(names);
        shuffle(tiles);
        time  = 40;

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

        var showFirstInfo = -1;
        //var showFirstDetail = -1;
        var showSecondInfo = -1;
       //var showSecondDetail = -1;

        for (var i = 0, il = firstPlanets.length; i < il; ++i) {
            firstPlanets[i].orbit.draw();
            firstPlanets[i].render(curTime - lastTime);
            if (Math.abs(firstPlanets[i].pos.x - mouse.pos.x) < firstPlanets[i].radius
                && Math.abs(firstPlanets[i].pos.y - mouse.pos.y) < firstPlanets[i].radius)
            {
                if (i != 0){
                    showFirstInfo = i;
                    if (mouse.pressed) {
                        if(firstPlanets[i].detail){
                            $('#planet').remove();
                            this.divExists = false;
                            firstPlanets[i].detail = false;
                        }else{
                            if(this.divExists){
                                $('#planet').remove();
                            }
                            this.div = document.createElement('div');
                            this.div.id = 'planet';
                            $(this.div).appendTo('#controls');
                            $('#planet').html(firstPlanets[i].planetInfo());
                            this.divExists = true;
                            firstPlanets[i].detail = true;
                            for (var j = 0; j < il; j++){
                                if(j != i){
                                    firstPlanets[j].detail = false;
                                }
                            }
                        }
                    }
                }
            }
        }

        for (var i = 0, il = secondPlanets.length; i < il; ++i) {
            secondPlanets[i].orbit.draw();
            secondPlanets[i].render(curTime - lastTime);
            if (Math.abs(secondPlanets[i].pos.x - mouse.pos.x) < secondPlanets[i].radius
                && Math.abs(secondPlanets[i].pos.y - mouse.pos.y) < secondPlanets[i].radius)
            {
                if (i != 0){
                    showSecondInfo = i;
                    if (mouse.pressed) {
                        if(secondPlanets[i].detail){
                            $('#planet').remove();
                            this.divExists = false;
                            secondPlanets[i].detail = false;
                        }else{
                            if(this.divExists){
                                $('#planet').remove();
                            }
                            this.div = document.createElement('div');
                            this.div.id = 'planet';
                            $(this.div).appendTo('#controls');
                            $('#planet').html(secondPlanets[i].planetInfo());
                            this.divExists = true;
                            secondPlanets[i].detail = true;
                            for (var j = 0; j < il; j++){
                                if(j != i){
                                    secondPlanets[j].detail = false;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (showFirstInfo > 0) {
            firstPlanets[showFirstInfo].showInfo();
            firstPlanets[showFirstInfo].drawBorder();
            document.body.style.cursor = 'pointer';
        } else {
        if (showSecondInfo > 0) {
            secondPlanets[showSecondInfo].showInfo();
            secondPlanets[showSecondInfo].drawBorder();
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }}
//        if(firstPlanets[i].detail){
//
//        }
//        if (showFirstDetail > -1) {
//            firstPlanets[showFirstDetail].detailInfo();
//            //firstPlanets[showFirstDeatail].drawBorder();
//            document.body.style.cursor = 'pointer';
//        } else {
//            document.body.style.cursor = 'default';
//        }
//
//        if (showSecondDetail > -1) {
//            secondPlanets[showSecondDetail].detailInfo();
//            //firstPlanets[showFirstDeatail].drawBorder();
//            document.body.style.cursor = 'pointer';
//        } else {
//            document.body.style.cursor = 'default';
//        }
        mouse.pressed = false;
    }
}