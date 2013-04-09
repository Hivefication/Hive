var model = require('../models/player');

var exportable = ['routes','list','view','add','update','remove','rewards','badges','events','queue'];

var routes = [
    // Player
    {    
        'path': '/players',
        'route': list
    },{
        'path': '/players/:id',
        'route': view
    },{
        'verb': 'post',
        'path': '/players',
        'route': add
    },{
        'verb': 'put',
        'path': '/players/:id',
        'route': update
    },{
        'verb': 'delete',
        'path': '/players/:id',
        'route': remove
    },
        // Player's items
    {
        'path': '/players/:id/rewards',
        'route': rewards
    },{
        'path': '/players/:id/badges',
        'route': badges
    },
    // Player's events
    {
        'path': '/players/:id/events',
        'route': events
    },{
        'verb': 'post',
        'path': '/players/:id/events',
        'route': queue
    }
];

function list(req, res) {
    // do pre-processing here    
    model.findAll(function(err, items) {
        console.log('received a callback', err, items)
        // do post-processing here
        res.send(items);
    })	
};

function view(req, res) {
    var id = req.params.id;

    // do pre-processing here
    model.findById(id,function(err, item) {
        // do post-processing here
        res.send(item);
    })
};

function add(req, res) {
    var player = req.body;

    // do pre-processing here
    model.add(player,function(err, result) {
        // do post-processing here
        if (err){
            console.warn('Error adding player: ' + err);
            res.send({'error':'An error has occurred'});
        }
        else {
            console.log('Success: ',result);
            res.send(result);
        }
    })
};

function update(req, res) {
    var id = req.params.id;
    var player = req.body;

    // do pre-processing here
    model.update(id, player,function(err, result) {
        // do post-processing here
        if (err){
            console.warn('Error updating player: ' + err);
            res.send({'error':'An error has occurred'});
        }
        else {
            console.log('Success: ',result);
            res.send(result);
        }
    });
};

function remove(req, res) {
    var id = req.params.id;

    // do pre-processing here
    model.remove(id, function(err, result) {
        // do post-processing here
        if (err){
            console.warn('Error deleting player: ' + err);
            res.send({'error':'An error has occurred'});
        }
        else {
            console.log('Success: ',result);
            // ??? we should have some sort of standardized confirmation/error messages
            res.send({'success':'removed'});
        }
    });
};

function rewards(req, res) {
    var playerid = req.params.id;
    
    // do pre-processing here
    model.findRewards(id,function(err, item) {
        // do post-processing here
        res.send(item);
    });
};

function badges(req, res) {
    var playerid = req.params.id;
    
    // do pre-processing here
    model.findBadges(playerid,function(err, item) {
        // do post-processing here
        res.send(item);
    });
};

function events(req, res) {
    var playerid = req.params.id;
    
    // do pre-processing here
    model.findEvents(playerid,function(err, item) {
        // do post-processing here
        res.send(item);
    });
};

function queue(req, res) {
    var id = req.params.id;
    var evt = req.body;

    // do pre-processing here
    model.addEvent(playerid, evt,function(err, result) {
        // do post-processing here
        if (err){
            console.warn('Error adding player\'s event: ' + err);
            res.send({'error':'An error has occurred'});
        }
        else {
            console.log('Success: ',result);
            res.send(result);
        }
    })

};


/**
 * Automatize exportation of public resources
 */
for (var index in exportable){
    var resource = exportable[index];
    // it's not that evil in this controlled context... for automation's sake!
    exports[resource] = eval(resource);
}
