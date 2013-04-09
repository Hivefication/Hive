var dbhandler = require("../lib/dbhandler");
var mongoose = dbhandler.mongoose;
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId;

var playerSchema = new Schema({
	// no need to specify id... it is automanaged by mongodb
    score: Number,
    name: String,
    ref: String
    // ObjectId can be used as a type!
});

var collectionName = 'players';

var Player = mongoose.model('Player', playerSchema,collectionName);

exports.findById = function(id, callback) {
    console.log('Retrieving player: ' + id);
    Player.findById(id,callback);
};

exports.findAll = function(callback) {
	console.log('Retrieving all players');
	Player.find({},callback);
};

exports.add = function(player, callback) {
    console.log('Adding player: ' + JSON.stringify(player));
    var player = new Player(player);
    player.save(callback);
};

exports.update = function(id, player, callback) {
    console.log('Updating player: ' + id);
    Player.findByIdAndUpdate(id, player, callback);
};

exports.remove = function(id, callback) {
    console.log('Deleting player: ' + id);
    Player.findByIdAndRemove(id,callback);
};

exports.findRewards = function(playerid, callback) {
    console.log('Retrieving ' + playerid + '\' rewards');
    //
};

exports.findBadges = function(playerid, callback) {
    console.log('Retrieving ' + playerid + '\' badges');
    //
};

exports.findEvents = function(playerid, callback) {
    console.log('Retrieving ' + playerid + '\' events history');
    //
};

exports.addEvent = function(playerid, event) {
    console.log('Adding ' + playerid + '\'s an event : ' + JSON.stringify(event));
    //
};