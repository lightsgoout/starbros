var cls = require("./lib/class"),
    _ = require("underscore"),
    Log = require('log'),
    Types = require("../../shared/js/gametypes");

// ======= GAME SERVER ========

PlayerInterface = cls.Class.extend({
    init: function() {
        log.info('Bot created');
    },

    setStarPosition: function(x,y) {

    }

});

HumanPlayer = PlayerInterface.extend({

});

BotPlayer = PlayerInterface.extend({});

module.exports.HumanPlayer = HumanPlayer;
module.exports.BotPlayer = BotPlayer;
