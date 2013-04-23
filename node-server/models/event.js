var dbhandler = require("../lib/dbhandler");
var mongoose = dbhandler.mongoose;
var Schema = mongoose.Schema;
var validate = require('mongoose-validator').validate;
var eventTypeSchema = require('../models/eventtype').eventTypeSchema;

var eventSchema = new Schema({
    // no need to specify id... it is automanaged by mongodb
    datetime: {
        type: Date,
        default: new Date(),
        required: true
    },
    // @TODO: event type has to be extended, we need information
    eventTypeId: {
        type: Schema.ObjectId,
        required: true
    },
    // the player is just linked... we normally retrieve by player
    playerId: {
        type: Schema.ObjectId,
        required: true
    }
}, { 
    // Prevent id duplication
    // https://github.com/LearnBoost/mongoose/issues/1137
    // http://mongoosejs.com/docs/api.html#document_Document-id
    id: false,
    // Prevent to specify later while retrieving both on findById and findAll
    // http://stackoverflow.com/questions/14767902/how-to-get-only-virtual-attributes-node-js-mongoose-mongodb
    toJSON: { virtuals: true }
});


var collectionName = 'events';
exports.Event = mongoose.model('Event', eventSchema, collectionName);
exports.eventSchema = eventSchema;

eventSchema.virtual('url').get(function () {
    return '/players/' + this.playerId + '/' + collectionName + '/' + this._id;
});