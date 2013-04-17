var model = require('../models/player');

exports.list = function (req, res) {
    // do pre-processing here    
    model.findAll(function(err, items) {
        console.log('received a callback', err, items)
        // do post-processing here
        res.send(items);
    })	
};

exports.view = function (req, res) {
    var id = req.params.id;

    // do pre-processing here
    model.findById(id,function(err, item) {
        // do post-processing here
        res.send(item);
    })
};

exports.add = function (req, res) {
    var player = req.body;

    // do pre-processing here
    model.add(player,function(err, result) {
        // do post-processing here
        if (err){
            res.send({'error':err});
        }
        else {
            console.log('Success: ',result);
            res.send(result);
        }
    })
};

exports.update = function (req, res) {
    var id = req.params.id;
    var player = req.body;

    // do pre-processing here
    model.update(id, player,function(err, result) {
        // do post-processing here
        if (err){
            res.send({'error':err});
        }
        else {
            console.log('Success: ',result);
            res.send({status:'updated'});
        }
    });
};

exports.remove = function (req, res) {
    var id = req.params.id;

    // do pre-processing here
    model.remove(id, function(err, result) {
        // do post-processing here
        if (err){
            console.warn('Error deleting player: ' + err);
            res.send({'error':err});
        }
        else {
            console.log('Success: ',result);
            // ??? we should have some sort of standardized confirmation/error messages
            res.send({'success':'removed'});
        }
    });
};

exports.rewards = function (req, res) {
    var playerid = req.params.id;
    
    // do pre-processing here
    model.findRewards(playerid,function(err, item) {
        // do post-processing here
        res.send(item);
    });
};

exports.badges = function (req, res) {
    var playerid = req.params.id;
    
    // do pre-processing here
    model.findBadges(playerid,function(err, item) {
        // do post-processing here
        res.send(item);
    });
};

exports.events = function (req, res) {
    var playerid = req.params.id;
    
    // do pre-processing here
    model.findEvents(playerid,function(err, item) {
        // do post-processing here
        res.send(item);
    });
};

exports.addEvent = function (req, res) {
    var playerid = req.params.id;
    var evt = req.body;

    var EventType = require('../models/eventtype');

    // check that the event type exists, overwrites evt's scope
    EventType.findById(evt._id,function(err,evt){
        if (err){
            console.warn('The event does not exist: ' + err);
            res.send({'error':err});
            return;
        }

        // check that the player exists
        model.findById(playerid,function(err,player){
            if (err){
                console.warn('The player does not exist: ' + err);
                res.send({error:err})
                return;
            }

            // and now add the event to the player
            model.addEvent(player, evt,function(err, result) {
                // do post-processing here
                if (err){
                    console.warn('Error adding player\'s event: ' + err);
                    res.send({'error':err});
                }
                else {
                    console.log('Success: ',result);
                    res.send({status:'success'});
                }
            })
        });
        
        
    });

};


exports.addReward = function (req, res) {
    var playerid = req.params.id;
    var badge = req.body;

    // just copy the pattern of exports.addEvent

    res.send({status:'success'});
}

exports.addBadge = function (req, res) {
    var playerid = req.params.id;
    var badge = req.body;

    // just copy the pattern of exports.addEvent

    res.send({status:'success'});
}



/**
 * Always define the routes after the rest of functions!
 */
exports.routes = [
    // Player
    {
        'path': '/players',
        'route': exports.list
    },
    {
        'path': '/players/:id',
        'route': exports.view
    },
    {
        'verb': 'post',
        'path': '/players',
        'route': exports.add
    },
    {
        'verb': 'put',
        'path': '/players/:id',
        'route': exports.update
    },
    {
        'verb': 'delete',
        'path': '/players/:id',
        'route': exports.remove
    },
    // Player's rewards
    {
        'path': '/players/:id/rewards',
        'route': exports.rewards
    },
    {
        'verb': 'post',
        'path': '/players/:id/rewards',
        'route': exports.addReward
    },
    // Player's badges
    {
        'path': '/players/:id/badges',
        'route': exports.badges
    },
    {
        'verb': 'post',
        'path': '/players/:id/badges',
        'route': exports.addBadge
    },
    // Player's events
    {
        'path': '/players/:id/events',
        'route': exports.events
    },
    {
        'verb': 'post',
        'path': '/players/:id/events',
        'route': exports.addEvent
    }
];