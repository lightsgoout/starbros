define([], function() {

    var Tile = Class.extend({
        init: function(ctx, img, x, y, w, h) {
            this.ctx    = ctx;
            this.img    = img;
            this.x      = x;
            this.y      = y;
            this.width  = w;
            this.height = h;
        },
        draw: function(x, y, p) {
            var ctx = this.ctx;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.atan2(p.y - y, p.x - x) + Math.PI / 2);
            this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height,
                -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
    });

    return Tile;
});
