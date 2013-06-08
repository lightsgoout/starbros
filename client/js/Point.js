define([], function() {

    var Point = Class.extend({
        init: function(x, y) {
            this.set(x, y);
        },
        set: function(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        },
        getDis: function(other) {
            return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
        },
        clone: function() {
            return new Point(this.x, this.y);
        }
    });

    return Point;
});
