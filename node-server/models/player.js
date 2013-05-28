var dbhandler = require("../lib/dbhandler");
var mongoose = dbhandler.mongoose;
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId;
var validate = require('mongoose-validator').validate;

var badgeSchema = require("../models/badge").badgeSchema;
var rewardSchema = require("../models/reward").rewardSchema;
var eventSchema = require("../models/event").eventSchema;
var EventModel = require("../models/event").Event;
var BadgeModel = require("../models/badge").Badge;

// https://github.com/chriso/node-validator
// https://npmjs.org/package/mongoose-validator

var collectionName = 'players';

var playerSchema = new Schema({
	// no need to specify id... it is automanaged by mongodb
    // ObjectId can be used as a type!
    score: {
        type: Number,
        required: true,
        default: 0,
        validate: [validate('isInt'),validate('min',0)] // only positive scores
    },
    name: {
        type: String,
        required: true,
        validate: [validate('len', 8)] // minimum 8 chars
    },
    ref: {
        type: String,
        validate: [validate('len',3)] // minimum 3 chars
    },
    rewards: [rewardSchema],
    badges: [badgeSchema],
    events: [eventSchema]
},
{
    // Prevent id duplication
    // https://github.com/LearnBoost/mongoose/issues/1137
    // http://mongoosejs.com/docs/api.html#document_Document-id
    id: false,
    // Prevent to specify later while retrieving both on findById and findAll
    // http://stackoverflow.com/questions/14767902/how-to-get-only-virtual-attributes-node-js-mongoose-mongodb
    toJSON: { virtuals: true }
});

playerSchema.virtual('url').get(function () {
    return "/" + collectionName + "/" + this._id;
});

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
    Player.findById(playerid,function(err, item){
        if (err){
            callback(err,item);
            return;
        }
        
        callback(null,item.rewards||[]);
    })
};

exports.findBadges = function(playerid, callback) {
    console.log('Retrieving ' + playerid + '\' badges');
    Player.findById(playerid,function(err, item){
        if (err){
            callback(err,item);
            return;
        }
        
        callback(null,item.badges||[]);
    })
};

exports.findEvents = function(playerid, callback) {
    console.log('Retrieving ' + playerid + '\' events history');
    Player.findById(playerid,function(err, item){
        if (err){
            callback(err,item);
            return;
        }
        
        callback(null,item.events||[]);
    })
};

exports.addEvent = function(player, eventType, callback) {
    console.log('Adding an event to ' + player._id + ' : ' + JSON.stringify(eventType));

    var evt = new EventModel({
        eventTypeId: eventType._id,
        playerId: player._id
    });

    player.events = player.events || [];
    player.events.push(evt);

    // Fuckin' experimental frameworks...
    // https://github.com/LearnBoost/mongoose/issues/571
    Player.update({_id:player._id}, {$set: {events: player.events}}, {upsert:true}, callback);
};

exports.addBadge = function(player,badge,callback){
    console.log('Adding a badge to ' + player._id + ' : ' + JSON.stringify(badge));

    player.badges = player.badges || [];
    player.badges.push(badge);

    // Fuckin' experimental frameworks...
    // https://github.com/LearnBoost/mongoose/issues/571
    Player.update({_id:player._id}, {$set: {badges: player.badges}}, {upsert:true}, callback);
};

exports.addReward = function(player, reward, callback){
    // just copy the pattern of exports.addEvent
};

var leaderBoardProperties = {
    score: 1,
    name: 1,
    ref: 1,
    badges: 1
};

exports.findByScore = function(callback){
    Player.find({},leaderBoardProperties,{sort:{'score':-1}},callback);
};

exports.findByNumBadges = function(callback){
      Player.aggregate(
        // project only selected fields
        { $project : leaderBoardProperties }, 
        // expand the badges array
        { $unwind : "$badges" }, 
        // then group by id and add counts
        { $group : {  _id : '$_id', numBadges : { $sum : 1 } } },
        // and sort descending
        { $sort : { 'numBadges' : -1} },
        callback
    ) 
}; 
