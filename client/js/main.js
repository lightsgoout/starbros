define(['jquery', 'app'], function($, App) {
    var app, game;

    var initApp = function() {
        $(document).ready(function() {
        	app = new App();
            app.center();
            console.log("App initialized.");

            initGame();
        });
    };

    var initGame = function() {
        require(['game'], function(Game) {

    		var game = new Game(app);
            game.init(app);
    		app.setGame(game);
            game.connect();

//    		game.onDisconnect(function(message) {
//                console.log('disconnected')
//    		});

//    		game.onNotification(function(message) {
//    		    console.log(message);
//    		});
        });
    };

    initApp();
});
