var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('players', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'players' database");
        db.collection('players', {safe:true}, function(err, collection) {
            if (err) {
                console.error("Error opening the 'players' collection.");
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving player: ' + id);
    db.collection('players', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
	console.log('Retrieving all players');
    db.collection('players', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
    var player = req.body;
    console.log('Adding player: ' + JSON.stringify(player));
    db.collection('players', function(err, collection) {
        collection.insert(player, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.update = function(req, res) {
    var id = req.params.id;
    var player = req.body;

    console.log('Updating player: ' + id);

    db.collection('players', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, player, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating player: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(player);
            }
        });
    });
};

exports.delete = function(req, res) {
    var id = req.params.id;

    console.log('Deleting player: ' + id);

    db.collection('players', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

exports.findRewards = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving ' + id + '\' rewards');
    db.collection('players', function(err, collection) {
        // a voir comment on fait pour avoir des relations et tout ça
    });
};

exports.findBadges = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving ' + id + '\' badges');
    db.collection('players', function(err, collection) {
        // a voir comment on fait pour avoir des relations et tout ça
    });
};

exports.findEvents = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving ' + id + '\' events history');
    db.collection('players', function(err, collection) {
        // a voir comment on fait pour avoir des relations et tout ça
    });
};

exports.addEvent = function(req, res) {
    var id = req.params.id;
    var events = req.body;
    console.log('Adding ' + id + '\'s an event : ' + JSON.stringify(player));
    db.collection('events', function(err, collection) {
        // a voir comment ça se passe avec les relations et tout ça
        // collection.insert(events, {safe:true}, function(err, result) {
        //     if (err) {
        //         res.send({'error':'An error has occurred'});
        //     } else {
        //         console.log('Success: ' + JSON.stringify(result[0]));
        //         res.send(result[0]);
        //     }
        // });
    });
};