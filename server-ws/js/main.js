
var fs = require('fs'),
    WebSocketServer = require('ws').Server;


function main(config) {
    var GameServer = require("./gameserver"),
        Log = require('log'),
        server = new WebSocketServer({port: '8005'}),
        game = new GameServer(server);

    switch(config.debug_level) {
        case "error":
            log = new Log(Log.ERROR); break;
        case "debug":
            log = new Log(Log.DEBUG); break;
        case "info":
            log = new Log(Log.INFO); break;
    }

    log.info("Starting StarBros game server...");

    server.on('connection', function(ws) {
        log.info('Someone connected');
        ws.on('message', function(message) {
            game.receiveMessage(ws, message);
        });
    });

    process.on('uncaughtException', function (e) {
        log.error('uncaughtException: ' + e);
    });

}

function getConfigFile(path, callback) {
    fs.readFile(path, 'utf8', function(err, json_string) {
        if(err) {
            console.error("Could not open config file:", err.path);
            callback(null);
        } else {
            callback(JSON.parse(json_string));
        }
    });
}

var defaultConfigPath = './server-ws/config.json',
    customConfigPath = './server-ws/config_local.json';

process.argv.forEach(function (val, index, array) {
    if(index === 2) {
        customConfigPath = val;
    }
});

getConfigFile(defaultConfigPath, function(defaultConfig) {
    getConfigFile(customConfigPath, function(localConfig) {
        if(localConfig) {
            main(localConfig);
        } else if(defaultConfig) {
            main(defaultConfig);
        } else {
            console.error("Server cannot start without any configuration file.");
            process.exit(1);
        }
    });
});
