define(['jquery', 'gameclient', 'config'], function($, GameClient, config) {

    var App = Class.extend({
        init: function() {
            this.config = config.dev;
            this.start();
            this.connect();
        },

        connect: function() {
            this.client = new GameClient(this.host, this.port);
            this.client.connect();
        },

        start: function() {
            this.host = this.config.host;
            this.port = this.config.port;
        }
    });

    return App;
});
