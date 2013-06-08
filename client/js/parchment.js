define(['MouseController', 'Orbit', 'Planet', 'Point', 'System', 'Tile', 'shared/js/gametypes'],
    function(MouseController, Orbit, Planet, Point, System, Tile) {

    var Parchment = Class.extend({
        init: function(width, height, planet_count) {
            this.initRunTime = new Date();
            this.first_planets = [];
            this.second_planets = [];
            this.planets = [];
            this.star_data = [];
            this.planet_data =[];
            this.planet_count = planet_count;
            this.canvas = null;
            this.ctx = null;
            this.mouse = null;
            this.divExists = false;
            this.width  = width;
            this.height = height;
            this._resources = {};
            try {
                this.initCanvas();
                this.initResources();
                this.initMouse();
                this.initStuff();
                this.render(this.initRunTime);
            } catch (err) {
                console.log('Initialization error: ' + err);
                document.body.innerHTML = '<center>' + err + '</center>';
            }
        },

        initCanvas: function() {
            this.canvas = document.createElement('canvas');
            $(this.canvas).appendTo("#application");
            this.canvas.width  = this.width;
            this.canvas.height = this.height;
            if (!this.canvas.getContext('2d')) {
                throw "No canvas support";
            }
            this.ctx = this.canvas.getContext('2d');
            this.ctx.font = '16px monospace';
            this.ctx.textAlign = 'center';
        },

        initResources: function() {
            var self  = this;
            var IM = {
                store: this._resources,
                imagesAdded: 0,
                imagesLoaded: 0,
                add: function(url, name) {
                    var image = new Image();
                    var im = this;
                    image.onload = function() {
                        im.imagesLoaded++;
                        if (im.imagesAdded == im.imagesLoaded) {
                            im.app.render(new Date());
                            console.log('Resources loaded in ' + (new Date() - self.initRunTime) + 'ms');
                        }
                    };
                    image.src = url;
                    this.store[name] = image;
                    this.imagesAdded++;
                },
                app: this
            };
            IM.add('img/sun.png', 'sun');
            IM.add('img/planets.png', 'planets');
        },

        initMouse: function() {
            this.mouse = new MouseController(this.canvas);
        },

        makeStar: function(player_id, sprite, position, name) {
            var arr = [];
            arr['name'] = name;
            arr['player_id'] = player_id;
            arr['sprite'] = sprite;
            arr['position'] = position;
            this.star_data[position] = arr;
        },

        makePlanet: function(player_id, sprite, speed, richness, name){
            var arr = [];
            arr['player_id'] = player_id;
            arr['sprite'] = sprite;
            arr['speed'] = speed;
            arr['richness'] = richness;
            arr['name'] = name;
            this.planet_data[name] = arr;
        },
        initStuff: function() {

            var orbitWidth = 320/this.planet_count;
            var firstCenter = new Point(this.canvas.width / 4, this.canvas.height / 2);
            var secondCenter = new Point((this.canvas.width / 4) * 3, this.canvas.height / 2);

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
            var time  = Math.ceil(Math.random()*30 + 20);
            shuffle(names);
            shuffle(tiles);
            for (var i = 0; i < this.planet_count; ++i) {
                firstOrbit  = new Orbit(firstCenter.clone(), 90+i*orbitWidth).setProperty({
                    ctx:   this.ctx,
                    mouse: this.mouse
                }, true);
                firstPlanet = new Planet(firstOrbit, 13, time).setProperty({
                    tile: new Tile(this.ctx, this._resources['planets'], tiles[i]*26, 0, 26, 26),
                    name: names[i],
                    ctx:  this.ctx
                }, true);
                this.first_planets.push(firstPlanet);
                time += Math.ceil(Math.random()*10 + 20);
            }
            shuffle(names);
            shuffle(tiles);
            time  = Math.ceil(Math.random()*30 + 20);;

            for (var i = 0; i < this.planet_count; ++i) {
                secondOrbit  = new Orbit(secondCenter.clone(), 90+i*orbitWidth).setProperty({
                    ctx:   this.ctx,
                    mouse: this.mouse
                }, true);
                secondPlanet = new Planet(secondOrbit, 13, time).setProperty({
                    tile: new Tile(this.ctx, this._resources['planets'], tiles[i]*26, 0, 26, 26),
                    name: names[i],
                    ctx:  this.ctx
                }, true);
                this.second_planets.push(secondPlanet);
                time += Math.ceil(Math.random()*10 + 20);
            }
        },

        render: function(lastTime) {
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

            for (var i = 0, il = this.planet_count; i <= il; ++i) {
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

            for (var i = 0, il = this.planet_count; i <= il; ++i) {
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
                }
            }
            mouse.pressed = false;
        }
    });

    return Parchment;
});
