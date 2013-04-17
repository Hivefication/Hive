var dbhandler = require("../lib/dbhandler");
var mongoose = dbhandler.mongoose;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var validate = require('mongoose-validator').validate;
var badgeModel = require("../models/badge").badgeModel;
var ruleModel = require("../models/rule").ruleModel;

var collectionName = 'rewards';

var rewardSchema = new Schema({
	// no need to specify id... it is automanaged by mongodb
    name: {
        type: String,
        required: true,
        validate: [validate('len', 3)] // minimum 3 chars
    },
    score: {
        type: Number,
        default: 0,
        validate: [validate('isInt')]
    },
    durationInMinutes: {
        type: Number,
        default: -1,
        validate: [validate('isInt')]
    },
    deadline: {
        type: Number,
        default: -1,
        validate: [validate('isInt')]
    },
    ordered: {
        type: Boolean,
        default: false
    },
    badges: [badgeModel],
    rules: [ruleModel]
}, { 
    id: false, 
    toJSON: { virtuals: true }
});

rewardSchema.virtual('url').get(function () {
    return '/' + collectionName + '/' + this._id;
});

var Reward =  mongoose.model('Reward', rewardSchema, collectionName);

exports.findById = function(id, callback) {
    console.log('Retrieving reward: ' + id);
    Reward.findById(id,callback);
};

exports.findAll = function(callback) {
	console.log('Retrieving all rewards');
	Reward.find({},callback);
};

exports.add = function(reward, callback) {
    console.log('Adding reward: ' + JSON.stringify(reward));
    var reward = new Reward(reward);
    reward.save(callback);
};

exports.update = function(id, reward, callback) {
    console.log('Updating reward: ' + id);
    Reward.findByIdAndUpdate(id, eventType, callback);
};

exports.remove = function(id, callback) {
    console.log('Deleting reward: ' + id);
    Reward.findByIdAndRemove(id,callback);
};

exports.addRule = function(id, rule, callback) {
    console.log('Adding rule: ' + JSON.stringify(rule) + ' to reward : ' + id)
    Reward.findById(id, function(err, reward) {
        if (!err){
            reward.rules.push(rule);
            reward.save(function (err_save) {
                callback(err_save);
            });
        }
        else {
            callback(err);
        }
    });
};

exports.removeRule = function(id, ruleid, callback) {
    console.log('Releting rule: ' + ruleid + ' to reward : ' + id)
    Reward.findById(id, function(err, reward) {
        if (!err){
            reward.rules.id(ruleid).remove();
            reward.save(function (err_save) {
                callback(err_save);
            });
        }
        else {
            callback(err);
        }
    });
};

exports.addBadge = function(id, badge, callback) {
    console.log('Adding badge: ' + JSON.stringify(badge) + ' to reward : ' + id)
    Reward.findById(id, function(err, reward) {
        if (!err){
            reward.badges.push(badge);
            reward.save(function (err_save) {
                callback(err_save);
            });
        }
        else {
            callback(err);
        }
    });
};

exports.removeBadge = function(id, badgeid, callback) {
    console.log('Deleting badge: ' + badgeid + ' to reward : ' + id)
    Reward.findById(id, function(err, reward) {
        if (!err){
            reward.badges.id(badgeid).remove();
            reward.save(function (err_save) {
                callback(err_save);
            });
        }
        else {
            callback(err);
        }
    });
};

exports.rewardSchema = rewardSchema;