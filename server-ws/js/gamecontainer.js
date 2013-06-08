var cls = require("./lib/class"),
    Log = require('log'),
    player = require('./player')
    Types = require("../../shared/js/gametypes");

// ======= GAME SERVER ========

GameContainer = cls.Class.extend({
    init: function(id, gameServer, ws) {
        this.id = id;
        this.game_server = gameServer;
        this.ws = ws;
        this.left_player = new player.HumanPlayer();
        this.right_player = new player.HumanPlayer();
    },
    setup: function(width, height, planets_count) {

        if (!(planets_count in Types.SystemSizes)) {
            log.error('Invalid planets_count: ' + planets_count);
            planets_count = 9;
        }

        this.createWorld(width, height, planets_count);
        this.createStar(this.left_player, Types.Positions.LEFT, 'sun.png');
        this.createStar(this.right_player, Types.Positions.RIGHT, 'sun.png');
    },
    createWorld: function(width, height, planets_count) {
        this.game_server.sendCommand(this.ws, Types.Messages.MAKE_WORLD, {
            width: width,
            height: height,
            planets_count: planets_count,
        });
    },
    createStar: function(player, position, sprite) {
        this.game_server.sendCommand(this.ws, Types.Messages.MAKE_STAR, {
            player_id: player.id,
            sprite: sprite,
            position: position
        });
    }
});

BotContainer = GameContainer.extend({
    init: function(id, gameServer, ws, player_id, bot_difficulty) {
        this.id = id;
        this.game_server = gameServer;
        this.ws = ws;
        this.left_player = new player.HumanPlayer(player_id);
        this.right_player = new player.BotPlayer(bot_difficulty);
    }
})

module.exports.GameContainer = GameContainer;
module.exports.BotContainer = BotContainer;
