define(['gameclient', 'config', '../shared/js/gametypes'],
function(GameClient, config) {

    var Game = Class.extend({
        init: function(app) {
            this.app = app;
            this.ready = false;
            this.started = false;
            this.hasNeverStarted = true;
            this.host = config.dev.host;
            this.port = config.dev.port;
        },
        run: function(started_callback) {

        },

        connect: function(started_callback) {
            var self = this,
                connecting = false; // always in dispatcher mode in the build version

            console.log(this.host, this.port);
            this.client = new GameClient(this.host, this.port);
            this.client.connect();
        }

    });
    return Game;
});
