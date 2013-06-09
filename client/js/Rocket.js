define(['Point'], function(Point) {

    var Rocket = Class.extend({
        init: function(speed, player_id, power, target_id, life_time) {
            this.pos    = new Point(0, 0);
            this.radius = 10;
            this.life_time = life_time;
            this.speed  = speed;
            this.sprite = sprite;
            this.target_id = target_id;
            this.player_id = player_id;
            this.power = power;
            this.ctx;
            this.tile;
        },
        render: function() {
            if (typeof this.tile !== 'undefined') {
                this.tile.draw(this.pos.x, this.pos.y, this.radius);
            }
        }

    });

    return Rocket;
});
