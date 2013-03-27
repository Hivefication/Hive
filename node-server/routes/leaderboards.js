var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('players', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'players' for 'leaderboards' database");
        db.collection('leaderboards', {safe:true}, function(err, collection) {
            if (err) {
                console.error("Error opening the 'players' for 'leaderboards' collection.");
            }
        });
    }else{
        console.error("Error opening the 'players' for 'leaderboards' collection.");
    }
});

// TODO: nom de la méthode -> server.js
exports.XXleaderboardsbyscoreYY = function(req, res) {
	console.log('Retrieving all leaderboards by score');
    db.collection('players', function(err, collection) {
        collection.find().sort({score: -1}).limit(100); // TODO : fixer la constante                
    });
};

// TODO: nom de la méthode
exports.XXleaderboardsbybadgeYY = function(req, res) {
	console.log('Retrieving all leaderboards by badge');
    db.collection('players', function(err, collection) {
        // TODO : requete relative aux nombres de badges en peu plus complexe
        collection.find().sort(
            // TODO: Mettre qqch ici :-)
        ).toArray(function(err, items) {
            res.send(items);
        });            
    });
};

