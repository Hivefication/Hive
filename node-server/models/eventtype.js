var dbhandler = require("../lib/dbhandler");
var mongoose = dbhandler.mongoose;
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId;
var validate = require('mongoose-validator').validate;

var eventTypeSchema = new Schema({
	// no need to specify id... it is automanaged by mongodb
    name: {
        type: String,
        required: true,
        validate: [validate('len', 3)] // minimum 3 chars
    }
}, { 
    id: false, 
    toJSON: { virtuals: true }
});

eventTypeSchema.virtual('url').get(function () {
    return '/eventtypes/' + this._id;
});

var collectionName = 'eventTypes';

var EventType = exports.EventTypeModel = mongoose.model('EventType', eventTypeSchema, collectionName);

exports.findById = function(id, callback) {
    console.log('Retrieving event type: ' + id);
    EventType.findById(id,callback);
};

exports.findAll = function(callback) {
	console.log('Retrieving all event types');
	EventType.find({},callback);
};

exports.add = function(eventType, callback) {
    console.log('Adding event type: ' + JSON.stringify(eventType));
    var eventType = new EventType(eventType);
    eventType.save(callback);
};

exports.update = function(id, eventType, callback) {
    console.log('Updating event type: ' + id);
    EventType.findByIdAndUpdate(id, eventType, callback);
};

exports.remove = function(id, callback) {
    console.log('Deleting event type: ' + id);
    EventType.findByIdAndRemove(id,callback);
};