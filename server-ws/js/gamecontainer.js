var cls = require("./lib/class"),
    Log = require('log'),
    player = require('./player')
    Types = require("../../shared/js/gametypes");

// ======= GAME SERVER ========

function getRandomArbitary (min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

GameContainer = cls.Class.extend({

    getRandomName: function() {
        shuffle(this.names);
        return this.names.pop();
    },

    init: function(id, gameServer, ws, left_player_id, right_player_id) {
        this.id = id;
        this.game_server = gameServer;
        this.ws = ws;
        this.left_player = new player.HumanPlayer(left_player_id, Types.Positions.LEFT);
        this.right_player = new player.HumanPlayer(right_player_id, Types.Positions.RIGHT);
    },

    setup: function(width, height, planets_count) {

        this.sync_interval = 5000;
        this.ups = 50;
        this._planets = [];
        this._stars = [];
        this._world = {};
        this._players = [this.left_player, this.right_player]
        this._planet_counter = 0;

        this.names = ['Moon', 'Phobos', 'Deimos', 'Dactyl', 'Linus', 'Io', 'Europa', 'Ganymede',
        'Callisto', 'Amalthea', 'Himalia', 'Elara', 'Pasiphae', 'Taurus', 'Sinope', 'Lysithea',
        'Carme', 'Ananke', 'Leda', 'Thebe', 'Adrastea', 'Metis', 'Callirrhoe', 'Themisto',
        '1975', '2000', 'Megaclite', 'Taygete', 'Chaldene', 'Harpalyke'];

        if (!(planets_count in Types.SystemSizes)) {
            log.error('Invalid planets_count: ' + planets_count);
            planets_count = 9;
        }

        this.createWorld(width, height, planets_count);
        this.createStar(this.left_player, Types.Positions.LEFT, Types.StarSprites.s0, this.getRandomName());
        this.createStar(this.right_player, Types.Positions.RIGHT, Types.StarSprites.s0, this.getRandomName());
        this.createPlanets(this.left_player, planets_count);
        this.createPlanets(this.right_player, planets_count);
        this.initializePlayer(this.left_player, Types.INITIAL_RESOURCES, Types.INITIAL_WORKOUT);
        this.initializePlayer(this.right_player, Types.INITIAL_RESOURCES, Types.INITIAL_WORKOUT);
    },
    initializePlayer: function(player, resources, workout) {
        player.resources = resources;
        player.workout = workout;
        this.game_server.sendCommand(this.ws, Types.Messages.INIT_PLAYER, player);
    },
    createWorld: function(width, height, planets_count) {
        var world_data = {
            width: width,
            height: height,
            planets_count: planets_count
        };
        this._world = world_data;
        this.game_server.sendCommand(this.ws, Types.Messages.MAKE_WORLD, world_data);
    },
    createStar: function(player, position, sprite, name) {
        var star_data = {
            player_id: player.id,
            sprite: sprite,
            position: position,
            name: name
        };
        this._stars.push(star_data);
        this.game_server.sendCommand(this.ws, Types.Messages.MAKE_STAR, star_data);
    },
    createPlanets: function(player, planets_count) {
        var sizes = null;
        switch (planets_count) {
            case Types.SystemSizes.s3:
                sizes = [Types.PlanetSizes.SMALL, Types.PlanetSizes.AVERAGE, Types.PlanetSizes.LARGE];
                break;
            case Types.SystemSizes.s6:
                sizes = [Types.PlanetSizes.SMALL, Types.PlanetSizes.SMALL,
                        Types.PlanetSizes.AVERAGE, Types.PlanetSizes.AVERAGE,
                        Types.PlanetSizes.LARGE, Types.PlanetSizes.LARGE];
                break;
            case Types.SystemSizes.s9:
                sizes = [Types.PlanetSizes.SMALL, Types.PlanetSizes.SMALL, Types.PlanetSizes.SMALL,
                        Types.PlanetSizes.AVERAGE, Types.PlanetSizes.AVERAGE, Types.PlanetSizes.AVERAGE,
                        Types.PlanetSizes.LARGE, Types.PlanetSizes.LARGE, Types.PlanetSizes.LARGE];
                break;
            default:
                log.error('Unknown system_size: ' + planets_count);
                sizes = [Types.PlanetSizes.SMALL, Types.PlanetSizes.SMALL,
                        Types.PlanetSizes.AVERAGE, Types.PlanetSizes.AVERAGE,
                        Types.PlanetSizes.LARGE, Types.PlanetSizes.LARGE];
                break;
        }
        for(var i = 0; i < planets_count; i++) {
            var speed = null;
            var size = null;
            var richness = null;
            var sprite = null;
            var angle = ~~(Math.random() * 360);

            shuffle(sizes);
            size = sizes.pop();
            richness = size;

            switch (size) {
                case Types.PlanetSizes.SMALL:
                    speed = 1.7;
                    sprite = getRandomArbitary(0, 6);
                    break;
                case Types.PlanetSizes.AVERAGE:
                    speed = 1.2;
                    sprite = getRandomArbitary(7, 8);
                    break;
                case Types.PlanetSizes.LARGE:
                    speed = 0.7;
                    sprite = getRandomArbitary(9, 11);
                    break;
                default:
                    log.error('Unknown planet size: ' + size);
                    speed = 1.0;
                    break;
            }

            speed = Math.PI*2 / (speed * Types.SpeedRatio.PLANET)

            this.createPlanet(
                this._planet_counter++,
                player,
                sprite,
                speed,
                richness,
                this.getRandomName(),
                angle,
                0,
                0,
                0,
                0
            );
        }
    },
    createPlanet: function(id, player, sprite, speed, richness, name, angle,
                           rockets_power, rockets_speed, rockets_attack_rate,
                           mines_workout) {

        var planet_data = {
            id: id,
            player_id: player.id,
            sprite: sprite,
            speed: speed,
            richness: richness,
            name: name,
            angle: angle,
            rockets_power: rockets_power,
            rockets_speed: rockets_speed,
            rockets_attack_rate: rockets_attack_rate,
            mines_workout: mines_workout
        };

        this._planets.push(planet_data);
        this.game_server.sendCommand(this.ws, Types.Messages.MAKE_PLANET, planet_data);
    },

    run: function() {
        var self = this;
        var lastTime = new Date();
        setInterval(function() {
            var curTime = new Date();
            self.update(curTime - lastTime);
            lastTime = curTime;
        }, 1000 / this.ups);
        setInterval(function() {
            self.syncState();
        }, self.sync_interval);
    },

    setUpdatesPerSecond: function(ups) {
        this.ups = ups;
    },

    update: function(deltaTime) {
        this.updatePlayers(deltaTime);
        this.updatePlanets(deltaTime);
    },

    updatePlayers: function(deltaTime) {
        for (var i = 0; i < this._players.length; i++) {
            var player = this._players[i];
            var total_workout = 0;
            for (var j = 0; j < this._planets.length; j++) {
                var planet = this._planets[j];
                if (planet.player_id != player.id) {
                    continue;
                }
                total_workout += planet.mines_workout;
            }
            this._players[i].workout = total_workout;
            this._players[i].resources += Math.floor(total_workout * (1000 / deltaTime));
        }
    },

    updatePlanets: function(deltaTime) {
        for (var i = 0; i < this._planets.length; i++) {
            this._planets[i].angle += this._planets[i].speed * deltaTime;
        }
    },

    syncState: function() {
        var sync_data = {
            planets: this._planets,
            players: this._players
        };
        this.game_server.sendCommand(this.ws, Types.Messages.SYNC, sync_data);
    }

});

BotContainer = GameContainer.extend({
    init: function(id, gameServer, ws, player_id, bot_difficulty) {
        this.id = id;
        this.game_server = gameServer;
        this.ws = ws;
        this.left_player = new player.HumanPlayer(player_id, Types.Positions.LEFT);
        this.right_player = new player.BotPlayer(bot_difficulty, Types.Positions.RIGHT);
    }
});

module.exports.GameContainer = GameContainer;
module.exports.BotContainer = BotContainer;
