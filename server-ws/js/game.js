var cls = require("./lib/class"),
    _ = require("underscore"),
    Log = require('log');

// ======= GAME SERVER ========

module.exports = World = cls.Class.extend({
    init: function(id, websocketServer) {
        var self = this;

        this.id = id;

        this.players = {};
        this.server = websocketServer;

        this.onPlayerConnect(function(player) {
            this.addPlayer(player);
        });

        this.onPlayerDisconnect(function(player) {
            this.removePlayer(player);
        });
    },

    run: function() {
        var self = this;

        var regenCount = this.ups * 2;
        var updateCount = 0;
        setInterval(function() {
            self.processQueues();

            if(updateCount < regenCount) {
                updateCount += 1;
            } else {
                if(self.regen_callback) {
                    self.regen_callback();
                }
                updateCount = 0;
            }
        }, 1000 / this.ups);

        log.info(""+this.id+" created");
    },

    setUpdatesPerSecond: function(ups) {
        this.ups = ups;
    },

    onInit: function(callback) {
        this.init_callback = callback;
    },

    onPlayerConnect: function(callback) {
        this.connect_callback = callback;
    },

    onPlayerDisconnect: function(callback) {
        this.disconnect_callback = callback;
    },

    pushToPlayer: function(player, message) {
        if(player && player.id in this.outgoingQueues) {
            this.outgoingQueues[player.id].push(message.serialize());
        } else {
            log.error("pushToPlayer: player was undefined");
        }
    },

    pushBroadcast: function(message, ignoredPlayer) {
        for(var id in this.outgoingQueues) {
            if(id != ignoredPlayer) {
                this.outgoingQueues[id].push(message.serialize());
            }
        }
    },

    processQueues: function() {
        var self = this,
            connection;

        for(var id in this.outgoingQueues) {
            if(this.outgoingQueues[id].length > 0) {
                connection = this.server.getConnection(id);
                connection.send(this.outgoingQueues[id]);
                this.outgoingQueues[id] = [];
            }
        }
    },

    addPlayer: function(player) {
        this.addEntity(player);
        this.players[player.id] = player;
        this.outgoingQueues[player.id] = [];

        //log.info("Added player : " + player.id);
    },

    getPlayerCount: function() {
        var count = 0;
        for(var p in this.players) {
            if(this.players.hasOwnProperty(p)) {
                count += 1;
            }
        }
        return count;
    },

});
