define(['jquery',], function($) {

    var App = Class.extend({
        init: function() {
        },

        setGame: function(game) {
            this.game = game;
            this.supportsWorkers = !!window.Worker;
            this.ready = true;
        },

        center: function() {
            window.scrollTo(0, 1);
        },

        canStartGame: function() {
            return true;
        },

        startGame: function(username, starting_callback) {
            var self = this;

            if(starting_callback) {
                starting_callback();
            }
            self.start(username);
        },

        start: function(username) {
            var self = this,
                firstTimePlaying = !self.storage.hasAlreadyPlayed();

            if(username && !this.game.started) {
                var optionsSet = false,
                    config = this.config;

                //>>includeStart("devHost", pragmas.devHost);
                if(config.local) {
                    log.debug("Starting game with local dev config.");
                    this.game.setServerOptions(config.local.host, config.local.port, username);
                } else {
                    log.debug("Starting game with default dev config.");
                    this.game.setServerOptions(config.dev.host, config.dev.port, username);
                }
                optionsSet = true;
                //>>includeEnd("devHost");

                //>>includeStart("prodHost", pragmas.prodHost);
                if(!optionsSet) {
                    log.debug("Starting game with build config.");
                    this.game.setServerOptions(config.build.host, config.build.port, username);
                }
                //>>includeEnd("prodHost");

                this.center();
                this.game.run(function() {
                    $('body').addClass('started');
                	if(firstTimePlaying) {
                	    self.toggleInstructions();
                	}
            	});
            }
        }
    });

    return App;
});
