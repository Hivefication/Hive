var model = require('../models/player');

exports.byNumBadges = function (req, res) {
    model.findByNumBadges(function(err,items){
        console.log(err)
        console.log(items)
        res.send(items);
    });
};

exports.byScore = function (req, res) {
    model.findByScore(function(err,items){
        res.send(items);
    });
};

/**
 * Always define the routes after the rest of functions!
 */
exports.routes = [
    {
        'path': '/leaderboards/byscore',
        'route': exports.byScore
    },
    {
        'path': '/leaderboards/bynumbadges',
        'route': exports.byNumBadges
    }
];