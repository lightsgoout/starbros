define(['MouseController', 'Orbit', 'Planet', 'Point', 'System', 'Tile', 'Star', 'shared/js/gametypes'],
    function(MouseController, Orbit, Planet, Point, System, Tile, Star) {

    var Parchment = Class.extend({
        init: function(width, height, planet_count) {
            this.initRunTime = new Date();
            this.left_counter = 90;
            this.right_counter = 90;
            this.planets = [];
            this.stars = [];
            this.star_data = [];
            this.planet_data =[];
            this.planet_count = planet_count;
            this.canvas = null;
            this.ctx = null;
            this.mouse = null;
            this.divExists = false;
            this.width  = width;
            this.height = height;
            this.leftCenter = new Point(this.width / 4, this.height / 2);
            this.rightCenter = new Point((this.width / 4) * 3, this.height / 2);
            this.orbitWidth = 300/this.planet_count;
            this._resources = {};
            try {
                this.initCanvas();
                this.initResources();
                this.initMouse();
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
            IM.add('img/sun.png', 'sun.png');
            IM.add('img/planets.png', 'planets');
            IM.add('img/rocket.png', 'rocket');
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
            this.star_data[player_id] = arr;
            if (position === Types.Positions.LEFT){
                var center = this.leftCenter;
            }else if(position === Types.Positions.RIGHT){
                var center = this.rightCenter;
            }
            var orbit  = new Orbit(center.clone(), 0).setProperty({
                ctx:   this.ctx,
                mouse: this.mouse
            }, true);
            var star = new Star(orbit, 50, 1, player_id, sprite, position, name);
            star.setProperty({
                tile: new Tile(this.ctx, this._resources[star.sprite], 0, 0, 100, 100),
                ctx:  this.ctx
            }, true);
            this.stars.push(star);
        },

        makePlanet: function(player_id, sprite, speed, richness, name, planet_id){
            var arr = [];
            arr['player_id'] = player_id;
            arr['sprite'] = sprite;
            arr['speed'] = speed;
            arr['richness'] = richness;
            arr['name'] = name;
            arr['planet_id'] = planet_id;
            this.planet_data[planet_id] = arr;
            if (this.star_data[player_id]['position'] === Types.Positions.LEFT){
                var center = this.leftCenter;
                this.left_counter += this.orbitWidth;
                var counter = this.left_counter;
            }else if(this.star_data[player_id]['position'] === Types.Positions.RIGHT){
                var center = this.rightCenter;
                this.right_counter += this.orbitWidth;
                var counter = this.right_counter;
            }
            var orbit  = new Orbit(center.clone(), counter).setProperty({
                ctx:   this.ctx,
                mouse: this.mouse
            }, true);
            var planet = new Planet(orbit, 13, name, player_id, sprite, speed, richness, planet_id);
            planet.setProperty({
                tile: new Tile(this.ctx, this._resources['planets'], planet.sprite*26, 0, 26, 26),
                ctx:  this.ctx
            }, true);
            this.planets.push(planet);
        },

        render: function(lastTime) {
            var curTime = new Date();
            var self    = this,
                ctx     = this.ctx,
                planets = this.planets,
                stars = this.stars,
                mouse   = this.mouse;
            requestAnimationFrame(function(){
                self.render(curTime);
            });
            ctx.clearRect(0, 0, this.width, this.height);

            var showInfo = -1;
            for (var i = 0; i < this.stars.length; i++){
                stars[i].render(curTime - lastTime);
            }
            for (var i = 0, il = this.planets.length; i < il; ++i) {
                planets[i].orbit.draw();
                setInterval(planets[i].update(curTime - lastTime), Types.UpdateRatio.PLANET);
                planets[i].render();
                if (Math.abs(planets[i].pos.x - mouse.pos.x) < planets[i].radius
                    && Math.abs(planets[i].pos.y - mouse.pos.y) < planets[i].radius)
                {
                    showInfo = i;
                    if (mouse.pressed) {
                        if(planets[i].detail){
                            $('#planet').remove();
                            this.divExists = false;
                            planets[i].detail = false;
                        }else{
                            if(this.divExists){
                                $('#planet').remove();
                            }
                            this.div = document.createElement('div');
                            this.div.id = 'planet';
                            $(this.div).appendTo('#controls');
                            $('#planet').html(planets[i].planetInfo());
                            this.divExists = true;
                            planets[i].detail = true;
                            for (var j = 0; j < il; j++){
                                if(j != i){
                                    planets[j].detail = false;
                                }
                            }
                        }
                    }
                }
            }

            if (showInfo > -1) {
                planets[showInfo].showInfo();
                planets[showInfo].drawBorder();
                document.body.style.cursor = 'pointer';
            }
            mouse.pressed = false;
        }
    });

    return Parchment;
});
