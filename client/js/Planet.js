define(['Point'], function(Point) {

    var Planet = Class.extend({
        init: function(orbit, radius, name, player_id, sprite, speed, richness) {
            this.pos    = new Point(0, 0);
            this.orbit  = orbit;
            this.radius = radius;
            this.speed  = Math.PI*2 / (speed * Types.SpeedRatio.PLANET);
            this.angle  = ~~(Math.random() * 360);
            this.sprite = sprite;
            this.mines = 5;
            this.player_id = player_id;
            this.power= 120;
            this.attack = 300;
            this.detail = false;
            this.animate = true;
            this.richness = richness;
            this.name = name;
            this.tile;
            this.ctx;
            this.orbit.setProperty({'planet': this});
        },

        drawBorder: function() {
            var ctx = this.ctx;
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgb(0,192,255)';
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius * 1.1, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.stroke();
        },
        showInfo: function() {
            var x = this.pos.x + this.radius * 0.7;
            var y = this.pos.y + this.radius * 0.9;

            var ctx = this.ctx;
            ctx.fillStyle = '#002244';
            ctx.fillRect(x, y, 100, 24);
            ctx.fillStyle = '#0ff';
            ctx.fillText(this.name, x + 50, y + 17);
        },
        update: function(deltaTime){
            this.pos.x = this.orbit.center.x + this.orbit.radius * Math.cos(this.angle);
            this.pos.y = this.orbit.center.y + this.orbit.radius * Math.sin(this.angle);
            this.angle += this.speed * deltaTime;
        },
        render: function() {
            if (this.detail){
                var x = this.pos.x;
                var y = this.pos.y;
                var r = this.attack;

                var ctx = this.ctx;
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgb(0,192,255)';
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(this.pos.x, this.pos.y, this.radius * 1.1, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.stroke();
            }

            if (typeof this.tile !== 'undefined') {
                this.tile.draw(this.pos.x, this.pos.y, // Центр тайла
                    this.orbit.center, this.radius);
            }
        },
        planetInfo: function(){
            var str = ''
            //str += '<div id="closeButton">X</div>';
            str += '<h3>' + this.name + '</h3>';
            str += '<p>Mines level :' + this.mines + '</p>';
            str += '<p>Fire power :' + this.power + '</p>';
            str += '<a class="btn-glow-inverse">Upgrade Mine</a>';
            str += '<a class="btn-glow-inverse">Upgrade Cannon</a>';
            return str;
        }
    });

    return Planet;
});
