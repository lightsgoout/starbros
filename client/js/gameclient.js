
define(['lib/bison', 'parchment', 'shared/js/gametypes'], function(BISON, Parchment) {

    var GameClient = Class.extend({
        init: function(host, port) {
            this.host = host;
            this.port = port;
            this.useBison = false;

            this.handlers = [];
            this.handlers[Types.Messages.ERROR] = this.receiveError;
            this.handlers[Types.Messages.SYNC] = this.onSync;
            this.handlers[Types.Messages.MAKE_STAR] = this.receiveMakeStar;
            this.handlers[Types.Messages.MAKE_WORLD] = this.receiveMakeWorld;
            this.handlers[Types.Messages.MAKE_PLANET] = this.receiveMakePlanet;
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
                this.handlers[action].call(this, data[1]);
            }
            else {
                console.log("Unknown action : " + action);
            }
        },

        receiveError: function(data) {
            console.log("Error: " + data[1]);
        },

        receiveMakeWorld: function(data) {
            var width = data['width'];
            var height = data['height'];
            var planet_count = data['planets_count'];
            this.parchment = new Parchment(width, height, planet_count);
        },

        receiveMakeStar: function(data) {
            var player_id = data['player_id'];
            var sprite = data['sprite'];
            var position = data['position'];
            var name = data['name'];
            if (this.parchment) {
                this.parchment.makeStar(player_id, sprite, position, name);
            }
        },

        receiveMakePlanet: function(data){
            var player_id = data['player_id'];
            var sprite = data['sprite'];
            var speed = data['speed'];
            var richness = data['richness'];
            var name = data['name'];
            var planet_id = data['id'];
            var angle = data['angle'];
            if (this.parchment) {
                this.parchment.makePlanet(player_id, sprite, speed, richness, name, planet_id, angle);
            }
        },

        onSync: function(data){
            for (var i = 0; i < data['planets'].length; i++){
                var player_id = data['planets'][i]['player_id'];
                var sprite = data['planets'][i]['sprite'];
                var speed = data['planets'][i]['speed'];
                var richness = data['planets'][i]['richness'];
                var name = data['planets'][i]['name'];
                var planet_id = data['planets'][i]['id'];
                var angle = data['planets'][i]['angle'];
                if (this.parchment) {
                    this.parchment.syncPlanet(player_id, sprite, speed, richness, name, planet_id, angle);
                }
            }
        }
    });

    return GameClient;
});
