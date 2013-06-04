var cls = require("./lib/class"),
    Log = require('log'),
    player = require('./player')
    Types = require("../../shared/js/gametypes");

// ======= GAME SERVER ========

GameContainer = cls.Class.extend({
    init: function(id, gameServer) {
        this.id = id;
        this.game_server = gameServer;
        this.left_player = new player.HumanPlayer();
        this.right_player = new player.HumanPlayer();

    }
});

BotContainer = GameContainer.extend({
    init: function(id, gameServer) {
        this.id = id;
        this.game_server = gameServer;
        this.left_player = new player.HumanPlayer();
        this.right_player = new player.BotPlayer();
    }
})

module.exports.GameContainer = GameContainer;
module.exports.BotContainer = BotContainer;
