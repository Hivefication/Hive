var dbhandler = require("../lib/dbhandler");
var mongoose = dbhandler.mongoose;
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId;
var validate = require('mongoose-validator').validate;

// https://github.com/chriso/node-validator
// https://npmjs.org/package/mongoose-validator

var playerSchema = new Schema({
	// no need to specify id... it is automanaged by mongodb
    // ObjectId can be used as a type!
    score: {
        type: Number,
        validate: [validate('isInt'),validate('min',0)] // only positive scores
    },
    badges: ['Badge'],
    name: {
        type: String,
        required: true,
        validate: [validate('len', 8)] // minimum 8 chars
    },
    ref: {
        type: String,
        validate: [validate('len',3)] // minimum 3 chars
    }    
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


var leaderBoardProperties = {
    _id: 0,
    score: 1,
    name: 1,
    ref: 1,
    badges: 0
};

exports.findByScore = function(callback){
    //Player.find({},leaderBoardProperties,{sort:{'score':-1}},callback);
    Player.find({},callback);
};

exports.findByBadges = function(callback){
    //Player.find({},leaderBoardProperties,{sort:{'badges':-1}},callback);
    //Player.find({},leaderBoardProperties,{sort:{'badges.count':1}},callback);

    Player.aggregate(
        { $project : leaderBoardProperties }, 
        { $unwind : "$badges" }, 
        { $group : {  _id : '$_id', numBadges : { $sum : 1 } } },
        { $sort : { 'numBadges' : 1} },
        callback
    ) 
}; 
