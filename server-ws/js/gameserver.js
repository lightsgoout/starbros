var cls = require("./lib/class"),
    _ = require("underscore"),
    Log = require('log'),
    containers = require('./gamecontainer'),
    Types = require("../../shared/js/gametypes");

// ======= GAME SERVER ========

module.exports = GameServer = cls.Class.extend({
    init: function(websocketServer) {
        this.server = websocketServer;
        this.containers = [];
        this.handlers = [];
        this.handlers[Types.Messages.HELLO] = this.receiveHello;
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
    },

    setUpdatesPerSecond: function(ups) {
        this.ups = ups;
    },

    sendCommand: function(ws, command, args) {
        var json = [
            command,
            args
        ];
        return this.sendMessage(ws, json);
    },

    sendMessage: function(ws, json) {
        var data;
        if(this.useBison) {
            data = BISON.encode(json);
        } else {
            data = JSON.stringify(json);
        }
        ws.send(data);
        log.info('Sent: ' + data);
    },

    receiveMessage: function(ws, message) {
        var data;
        if(this.useBison) {
            data = BISON.decode(message);
        } else {
            data = JSON.parse(message);
        }
        log.info('Received: ' + message);

        this.receiveAction(ws, data[0], data[1]);
    },

    receiveAction: function(ws, action, args) {
        if(this.handlers[action] && _.isFunction(this.handlers[action])) {
            this.handlers[action].call(this, ws, args);
        }
        else {
            log.error("Unknown action : " + action);
        }
    },

    receiveHello: function(ws, args) {

        if (!('player_id' in (args || {}))) {
            return this.sendError(ws, 'Please specify player_id');
        }

        var player_id = args['player_id'];

        if (!this.playerCanStartGame(player_id)) {
            return this.sendError('You are not allowed to play. Sorry.')
        }

        if ('with_bot' in (args || {})) {
            var bot_difficulty = args['bot_difficulty'],
                planets_count = args['planets_count'],
                width = 1640,
                height = 840,
                container = new containers.BotContainer(
                undefined, this, ws, player_id, bot_difficulty
            );
            container.setup(width, height, planets_count);
            return this.containers.push(container);
        } else {
            return this.sendError(ws, 'Currently only bot games are available. Sorry.');
        }
    },

    sendError: function(ws, reason) {
        return this.sendCommand(ws, Types.Messages.ERROR, reason);
    },

    playerCanStartGame: function(player_id) {
        return true;
    }

});
