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
    },
    setup: function() {
        this.createStar(this.left_player, 'sun.png');
    },
    createStar: function(player, sprite, x, y) {
        this.game_server.sendCommand(Types.Messages.MAKE_STAR, {
            player_id: player.id,
            sprite: sprite,
            x: x,
            y: y
        });
    }
});

BotContainer = GameContainer.extend({
    init: function(id, gameServer, player_id) {
        this.id = id;
        this.game_server = gameServer;
        this.left_player = new player.HumanPlayer(player_id);
        this.right_player = new player.BotPlayer();
    }
})

module.exports.GameContainer = GameContainer;
module.exports.BotContainer = BotContainer;
