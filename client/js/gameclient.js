
define(['player', 'lib/bison'], function(Player, BISON) {

    var GameClient = Class.extend({
        init: function(host, port) {
            this.connection = null;
            this.host = host;
            this.port = port;

            this.connected_callback = null;
            this.useBison = false;
            this.enable();
        },

        enable: function() {
            this.isListening = true;
        },

        disable: function() {
            this.isListening = false;
        },

        connect: function(dispatcherMode) {
            var url = "ws://"+ this.host +":"+ this.port +"/",
                self = this;

            console.log("Trying to connect to server : "+url);

            if(window.MozWebSocket) {
                this.connection = new MozWebSocket(url);
            } else {
                this.connection = new WebSocket(url);
            }

            if(dispatcherMode) {
                this.connection.onmessage = function(e) {
                    var reply = JSON.parse(e.data);

                    if(reply.status === 'OK') {
                        self.dispatched_callback(reply.host, reply.port);
                    } else if(reply.status === 'FULL') {
                        alert("BrowserQuest is currently at maximum player population. Please retry later.");
                    } else {
                        alert("Unknown error while connecting to BrowserQuest.");
                    }
                };
            } else {
                this.connection.onopen = function(e) {
                    console.log("Connected to server "+self.host+":"+self.port);
                };

                this.connection.onmessage = function(e) {
                    if(e.data === "go") {
                        if(self.connected_callback) {
                            self.connected_callback();
                        }
                        return;
                    }
                    if(e.data === 'timeout') {
                        self.isTimeout = true;
                        return;
                    }

                    self.receiveMessage(e.data);
                };

                this.connection.onerror = function(e) {
                    log.error(e, true);
                };

                this.connection.onclose = function() {
                    log.debug("Connection closed");
                    $('#container').addClass('error');

                    if(self.disconnected_callback) {
                        if(self.isTimeout) {
                            self.disconnected_callback("You have been disconnected for being inactive for too long");
                        } else {
                            self.disconnected_callback("The connection to BrowserQuest has been lost");
                        }
                    }
                };
            }
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

                log.debug("data: " + message);

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
                log.error("Unknown action : " + action);
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
