define(['jquery', 'gameclient', 'config'], function($, GameClient, config) {

    var App = Class.extend({
        init: function() {
            this.config = config.dev;
            this.host = this.config.host;
            this.port = this.config.port;
            this.connect();
        },

        connect: function() {
            this.client = new GameClient(this.host, this.port);
            this.client.connect();
        }
    });

    return App;
});
