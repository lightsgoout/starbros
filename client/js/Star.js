define(['Point'], function(Point) {
   var Star = Class.extend({
       init: function(orbit, radius, time, player_id, sprite, position, name) {
           this.pos    = new Point(0, 0);
           this.orbit  = orbit;
           this.radius = radius;
           this.speed  = Math.PI*2 / (time * 1000);
           this.name = name;
           this.player_id = player_id;
           this.sprite = sprite;
           this.position = position;
           this.ctx;
           this.orbit.setProperty({'star': this});
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
       render: function() {
           this.pos.x = this.orbit.center.x;
           this.pos.y = this.orbit.center.y;
           if (typeof this.tile !== 'undefined') {
               this.tile.draw(this.pos.x, this.pos.y, // Центр тайла
                   this.orbit.center, this.radius);
           }
       }
   });
   return Star;
});