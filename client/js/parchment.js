define(['MouseController', 'Orbit', 'Planet', 'Point', 'System', 'Tile', 'Star', 'shared/js/gametypes'],
    function(MouseController, Orbit, Planet, Point, System, Tile, Star) {

    var Parchment = Class.extend({
        init: function(width, height, planet_count) {
            this.initRunTime = new Date();
            this.left_counter = 90;
            this.right_counter = 90;
            this.planets = {};
            this.stars = {};
            this.rockets = [];
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

        updateHUD: function(position, resources, workout) {
            if($('#hud')) {
                $('#hud_resources_value').html(resources);
                $('#hud_workout_value').html(workout);
            }
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
        },

        initMouse: function() {
            this.mouse = new MouseController(this.canvas);
        },

        makeStar: function(player_id, sprite, position, name) {
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
            this.stars[player_id] = star;

        },

        makePlanet: function(player_id, sprite, speed, richness, name, planet_id, angle){
            if (this.stars[player_id].position === Types.Positions.LEFT){
                var center = this.leftCenter;
                this.left_counter += this.orbitWidth;
                var counter = this.left_counter;
            }else if(this.stars[player_id].position === Types.Positions.RIGHT){
                var center = this.rightCenter;
                this.right_counter += this.orbitWidth;
                var counter = this.right_counter;
            }
            var orbit  = new Orbit(center.clone(), counter).setProperty({
                ctx:   this.ctx,
                mouse: this.mouse
            }, true);
            var planet = new Planet(orbit, 13, name, player_id, sprite, speed, richness, planet_id, angle);
            planet.setProperty({
                tile: new Tile(this.ctx, this._resources['planets'], planet.sprite*26, 0, 26, 26),
                ctx:  this.ctx
            }, true);
            this.planets[planet_id] = planet;
        },

        syncPlanet: function(player_id, sprite, speed, richness, name, planet_id, angle){
            this.planets[planet_id].player_id = player_id;
            this.planets[planet_id].sprite = sprite;
            this.planets[planet_id].speed = speed;
            this.planets[planet_id].richness = richness;
            this.planets[planet_id].name = name;
            this.planets[planet_id].angle = angle;
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
            for (var star in stars){
               if (star !== 'setProperty'){
                   stars[star].render(curTime - lastTime);
               }
            }
            for (var planet in planets) {
                if (planet !== 'setProperty'){
                    planets[planet].orbit.draw();
                    setInterval(planets[planet].update(curTime - lastTime), Types.UpdateRatio.PLANET);
                    planets[planet].render();
                    if (Math.abs(planets[planet].pos.x - mouse.pos.x) < planets[planet].radius
                        && Math.abs(planets[planet].pos.y - mouse.pos.y) < planets[planet].radius)
                    {
                        showInfo = planet;
                        if (mouse.pressed) {
                            if(planets[planet].detail){
                                $('#planet').remove();
                                this.divExists = false;
                                planets[planet].detail = false;
                            }else{
                                if(this.divExists){
                                    $('#planet').remove();
                                }
                                this.div = document.createElement('div');
                                this.div.id = 'planet';
                                $(this.div).appendTo('#controls');
                                $('#planet').html(planets[planet].planetInfo());
                                this.divExists = true;
                                planets[planet].detail = true;
                                for (var planet2 in planets){
                                    if((planet2 != planet) && (planet2 !== 'setProperty')){
                                        planets[planet2].detail = false;
                                    }
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
