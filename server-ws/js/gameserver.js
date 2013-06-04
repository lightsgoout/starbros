var cls = require("./lib/class"),
    _ = require("underscore"),
    Log = require('log'),
    containers = require('./gamecontainer'),
    Types = require("../../shared/js/gametypes");

// ======= GAME SERVER ========

module.exports = GameServer = cls.Class.extend({
    init: function(id, websocketServer) {
        this.id = id;
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

        log.info(""+this.id+" created");
    },

    setUpdatesPerSecond: function(ups) {
        this.ups = ups;
    },

    sendCommand: function(command, args) {
        var json = {
            'command': command,
            'args': args
        }
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
        }

    },

    receiveMessage: function(message) {
        var data, action;
        if(this.useBison) {
            data = BISON.decode(message);
        } else {
            data = JSON.parse(message);
        }

        this.receiveAction(data[0], data[1]);
    },

    receiveAction: function(action, args) {
        if(this.handlers[action] && _.isFunction(this.handlers[action])) {
            this.handlers[action].call(this, args);
        }
        else {
            log.error("Unknown action : " + action);
        }
    },

    receiveHello: function(args) {
        log.info("Hello received");
        this.containers.push(new containers.BotContainer());

    }


});
