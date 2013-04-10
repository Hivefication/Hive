var dbhandler = require("../lib/dbhandler");
var mongoose = dbhandler.mongoose;
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId;

var BadgeSchema = new Schema({
	// ID auto managed by mongodb
    name: {
        type: String,
    },
    icon: {
        type: String,
    }
}, {
    // Prevent id duplication
    // https://github.com/LearnBoost/mongoose/issues/1137
    // http://mongoosejs.com/docs/api.html#document_Document-id
    id: false
});

BadgeSchema.virtual('url').get(function () {
    return '/badges/' + this._id;
});

var collectionName = 'badges';

var Badge = mongoose.model('Badge', BadgeSchema, collectionName);

exports.findById = function(id, callback) {
    console.log('Retrieving badge: ' + id);
    Badge.findById(id, callback);
};

exports.findAll = function(callback) {
	console.log('Retrieving all badges');
	Badge.find({}, callback);
};

exports.add = function(badge, callback) {
    console.log('Adding badge: ' + JSON.stringify(badge));
    var badge = new Badge(badge);
    badge.save(callback);
};

exports.update = function(id, badge, callback) {
    console.log('Updating badge: ' + id);
    Badge.findByIdAndUpdate(id, badge, callback);
};

exports.remove = function(id, callback) {
    console.log('Deleting badge: ' + id);
    Badge.findByIdAndRemove(id, callback);
};