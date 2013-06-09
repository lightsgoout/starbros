var cls = require("./lib/class"),
    _ = require("underscore"),
    Log = require('log'),
    Types = require("../../shared/js/gametypes");

// ======= GAME SERVER ========

PlayerInterface = cls.Class.extend({

});

HumanPlayer = PlayerInterface.extend({
    init: function(id, position) {
        this.id = id;
        this.position = position;
    }
});

BotPlayer = PlayerInterface.extend({

    defaultDifficulty: Types.BotLevels.MEDIUM,

    init: function(bot_difficulty, position) {
        this.id = 'bot';
        this.position = position;

        if (!bot_difficulty) {
            bot_difficulty = this.defaultDifficulty;
        }

        if (!(bot_difficulty in Types.BotLevels)) {
            log.error('Invalid difficulty: ' + bot_difficulty)
            bot_difficulty = this.defaultDifficulty;
        }
        log.info('Bot created, difficulty: ' + bot_difficulty);
    }
});

module.exports.HumanPlayer = HumanPlayer;
module.exports.BotPlayer = BotPlayer;
