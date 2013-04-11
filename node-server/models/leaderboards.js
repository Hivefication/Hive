var dbhandler = require("../lib/dbhandler");
var mongoose = dbhandler.mongoose;
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId;
var validate = require('mongoose-validator').validate;

// https://github.com/chriso/node-validator
// https://npmjs.org/package/mongoose-validator

var leaderboardsSchema = new Schema({
	// no need to specify id... it is automanaged by mongodb
    // ObjectId can be used as a type!

    players: [
            score: {
            type: Number,
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
        }  
    ],
    
});

var collectionName = 'leaderboards';

var LeaderBoards = mongoose.model('LeaderBoards', leaderboardsSchema, collectionName);

