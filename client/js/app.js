define(['jquery', 'gameclient', 'config', 'parchment'], function($, GameClient, config, Parchment) {

    var App = Class.extend({
        init: function() {
            this.config = config.dev;
            this.host = this.config.host;
            this.port = this.config.port;
            this.connect();
            this.parchment = new Parchment(1640, 840);
        },

        connect: function() {
            this.client = new GameClient(this.host, this.port);
            this.client.connect();
        }
    });

    return App;
});
