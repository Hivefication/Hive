var express = require('express');
var players = require('./controllers/players');
var eventTypes = require('./controllers/eventtypes');
var badges = require('./controllers/badges');
var leaderboards = require('./controllers/leaderboards');
var rules = require('./controllers/rules');
var rewards = require('./controllers/rewards');
var app = express();

function start() {

    app.configure(function () {
        app.use(express.logger('dev'));     /// 'default', 'short', 'tiny', 'dev'
        app.use(express.compress());
        app.use(express.bodyParser());
    });

    registerRoutes(players.routes);
    registerRoutes(eventTypes.routes);
    registerRoutes(badges.routes);  
    registerRoutes(leaderboards.routes);
    registerRoutes(rules.routes);
    registerRoutes(rewards.routes);
    
    app.listen(8888);

    console.log('Listening on port 8888...');
}

function registerRoutes(routes){
    for (var index in routes){
        var route = routes[index];
        
        route.verb = route.verb || 'get';
        if (!route.path || !route.route) continue;
        
        app[route.verb](route.path,route.route);
        
    }
}

exports.start = start;