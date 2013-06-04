
define(['lib/bison', 'shared/js/gametypes'], function(BISON) {

    var GameClient = Class.extend({
        init: function(host, port) {
            this.connection = null;
            this.host = host;
            this.port = port;

            this.useBison = false;
            this.enable();
        },

        enable: function() {
            this.isListening = true;
        },

        disable: function() {
            this.isListening = false;
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
                self.sendHello();
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

        sendHello: function(game_id) {

            var self = this;

            if (!game_id) {
                return self.sendCommand(Types.Messages.HELLO);
            } else {
                return self.sendCommand(Types.Messages.HELLO, game_id);
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
                console.log('sent message');
            }

        },

        receiveMessage: function(message) {
            var data, action;

            if(this.isListening) {
                if(this.useBison) {
                    data = BISON.decode(message);
                } else {
                    data = JSON.parse(message);
                }

                console.log("data: " + message);

                if(data instanceof Array) {
                    if(data[0] instanceof Array) {
                        // Multiple actions received
                        this.receiveActionBatch(data);
                    } else {
                        // Only one action received
                        this.receiveAction(data);
                    }
                }
            }
        },

        receiveAction: function(data) {
            var action = data[0];
            if(this.handlers[action] && _.isFunction(this.handlers[action])) {
                this.handlers[action].call(this, data);
            }
            else {
                console.log("Unknown action : " + action);
            }
        },

        receiveActionBatch: function(actions) {
            var self = this;

            _.each(actions, function(action) {
                self.receiveAction(action);
            });
        }

    });

    return GameClient;
});
