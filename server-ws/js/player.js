var cls = require("./lib/class"),
    _ = require("underscore"),
    Log = require('log'),
    Types = require("../../shared/js/gametypes");

// ======= GAME SERVER ========

PlayerInterface = cls.Class.extend({

});

HumanPlayer = PlayerInterface.extend({
    init: function(player_id) {
        this.id = player_id;
    }
});

BotPlayer = PlayerInterface.extend({
    init: function() {
        log.info('Bot created');
    }
});

module.exports.HumanPlayer = HumanPlayer;
module.exports.BotPlayer = BotPlayer;
