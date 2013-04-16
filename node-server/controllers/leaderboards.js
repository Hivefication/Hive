var model = require('../models/player');

exports.byBadge = function (req, res) {
    model.findByBadges(function(err,items){
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
        'path': '/leaderboards/bybadge',
        'route': exports.byBadge
    }
];