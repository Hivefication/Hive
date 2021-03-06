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
    },
}, { 
    // Prevent id duplication
    // https://github.com/LearnBoost/mongoose/issues/1137
    // http://mongoosejs.com/docs/api.html#document_Document-id
    id: false,
    // Prevent to specify later while retrieving both on findById and findAll
    // http://stackoverflow.com/questions/14767902/how-to-get-only-virtual-attributes-node-js-mongoose-mongodb
    toJSON: { virtuals: true }
});

var collectionName = 'eventTypes';

eventTypeSchema.virtual('url').get(function () {
    return '/' + collectionName + '/' + this._id;
});

var EventType = mongoose.model('EventType', eventTypeSchema, collectionName);

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

exports.eventTypeSchema = eventTypeSchema;