
define(['lib/bison', 'parchment', 'shared/js/gametypes'], function(BISON, Parchment) {

    var GameClient = Class.extend({
        init: function(host, port) {
            this.host = host;
            this.port = port;
            this.useBison = false;

            this.handlers = [];
            this.handlers[Types.Messages.ERROR] = this.receiveError;
            this.handlers[Types.Messages.MAKE_WORLD] = this.receiveMakeWorld;
            this.parchment = null;
        },

        connect: function() {
            var url = "ws://"+ this.host +":"+ this.port +"/",
                self = this;

            console.log("Trying to connect to server : "+url);

            if(window.MozWebSocket) {
                this.connection = new MozWebSocket(url);
            } else {
                this.connection = new WebSocket(url);
            }

            this.connection.onopen = function(e) {
                console.log("Connected to server "+self.host+":"+self.port);
                var player_id = '123456';
                self.sendHello(player_id, true);
            };

            this.connection.onmessage = function(e) {
                self.receiveMessage(e.data);
            };

            this.connection.onerror = function(e) {
                console.log(e, true);
            };

            this.connection.onclose = function() {
                console.log("Connection closed");
                $('#container').addClass('error');
            };
        },

        sendHello: function(player_id, with_bot) {
            if (!player_id) {
                return this.sendCommand(Types.Messages.HELLO);
            } else {
                return this.sendCommand(Types.Messages.HELLO, {
                    player_id: player_id,
                    with_bot: with_bot
                });
            }
        },

        sendCommand: function(command, args) {
            var json = [
                command,
                args
            ];
            return this.sendMessage(json);
        },

        sendMessage: function(json) {
            var data;
            if(this.connection.readyState === 1) {
                if(this.useBison) {
                    data = BISON.encode(json);
                } else {
                    data = JSON.stringify(json);
                }
                this.connection.send(data);
                console.log('Sent: ' + data);
            }

        },

        receiveMessage: function(message) {
            var data;

            if(this.useBison) {
                data = BISON.decode(message);
            } else {
                data = JSON.parse(message);
            }

            console.log("Received: " + message);

            if(data instanceof Array) {
                this.receiveAction(data);
            }
        },

        receiveAction: function(data) {
            var action = data[0];
            if(this.handlers[action]) {
                this.handlers[action].call(this, data);
            }
            else {
                console.log("Unknown action : " + action);
            }
        },

        receiveError: function(data) {
            console.log("Error: " + data[1]);
        },

        receiveMakeWorld: function(width, height, planet_count) {
            this.parchment = new Parchment(1640, 840);
        },

        receiveMakeStar: function(player_id, sprite) {
            if (this.parchment) {
                this.parchment.makeStar(player_id, sprite);
            }
        }
    });

    return GameClient;
});
