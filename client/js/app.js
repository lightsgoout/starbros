define(['jquery', 'gameclient'], function($, GameClient) {

    var App = Class.extend({
        init: function() {
            this.start();
            this.connect();
        },

        connect: function() {
            this.client = new GameClient(this.host, this.port);
            this.client.connect();
        },

        start: function() {
            this.host = '127.0.0.1';
            this.port = '8005';
        }
    });

    return App;
});
