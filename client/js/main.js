define(['jquery', 'app'], function($, App) {
    var app;

    var initApp = function() {
        $(document).ready(function() {
        	app = new App();
            console.log("App initialized.");
        });
    };
    initApp();
});
