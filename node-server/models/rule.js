var dbhandler = require("../lib/dbhandler");
var mongoose = dbhandler.mongoose;
var Schema = mongoose.Schema;
var EventTypeSchema = require('./eventtype.js').EventTypeSchema;
var ObjectId = Schema.ObjectId;

var ruleSchema = new Schema({
    // ID auto managed by mongodb
    durationInMinutes: { type: Number},
    arg: { type: String },
    eventCounter: { type: Number },
    // It's impossible to embed a single schema into another, we have to use an relational approach
    // https://github.com/LearnBoost/mongoose/issues/495
    event: { type: ObjectId, ref: 'EventType' }
}, {
    // Prevent id duplication
    // https://github.com/LearnBoost/mongoose/issues/1137
    // http://mongoosejs.com/docs/api.html#document_Document-id
    id: false,
    // Prevent to specify later while retrieving both on findById and findAll
    // http://stackoverflow.com/questions/14767902/how-to-get-only-virtual-attributes-node-js-mongoose-mongodb
    toJSON: { virtuals: true }
});

var collectionName = 'rules';

ruleSchema.virtual('url').get(function () {
    return '/' + collectionName + '/' + this._id;
});

var Rule = mongoose.model('Rule', ruleSchema, collectionName);

exports.findById = function(id, callback) {
    console.log('Retrieving rule: ' + id);
    Rule.findById(id).populate('event').exec(callback);
};

exports.findAll = function(callback) {
	console.log('Retrieving all rules');
	Rule.find({}).populate('event').exec(callback);
};

exports.add = function(rule, callback) {
    console.log('Adding rule: ' + JSON.stringify(rule));
    var rule = new Rule(rule);
    rule.save(callback);
};

exports.update = function(id, badge, callback) {
    console.log('Updating rule: ' + id);
    Rule.findByIdAndUpdate(id, badge, callback);
};

exports.remove = function(id, callback) {
    console.log('Deleting rule: ' + id);
    Rule.findByIdAndRemove(id, callback);
};

exports.ruleSchema = ruleSchema;