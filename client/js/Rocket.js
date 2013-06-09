define(['Point'], function(Point) {

    var Rocket = Class.extend({
        init: function(speed, player_id, power, target_id, life_time) {
            this.pos    = new Point(0, 0);
            this.radius = 1;
            this.life_time = life_time;
            this.speed  = speed;
            this.sprite = sprite;
            this.target_id = target_id;
            this.player_id = player_id;
            this.power = power;
            this.ctx;
        },

        update: function(deltaTime){
            this.pos.x =
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
