var model = require('../models/reward');
var Badge = require('../models/badge');
var Rule = require('../models/rule');

exports.list = function (req, res) {
	// do pre-processing here	
	model.findAll(function(err, items) {
		console.log('Received a callback', err, items)
		// do post-processing here
		res.send(items);
	})  
};

exports.view = function (req, res) {
	var id = req.params.id;

	// do pre-processing here
	model.findById(id,function(err, item) {
		// do post-processing here
		res.send(item);
	})
};

exports.add = function (req, res) {
	var eventType = req.body;

	// do pre-processing here
	model.add(eventType,function(err, result) {
		// do post-processing here
		if (err){
			console.warn('Error adding an event type: ' + err);
			res.send({'error':'An error has occurred'});
		}
		else {
			console.log('Success: ',result);
			res.send(result);
		}
	})
};

exports.update = function (req, res) {
	var id = req.params.id;
	var reward = req.body;

	// do pre-processing here
	model.update(id, reward,function(err, result) {
		// do post-processing here
		if (err){
			console.warn('Error updating an event type: ' + err);
			res.send({'error':'An error has occurred'});
		}
		else {
			console.log('Success: ',result);
			res.send(result);
		}
	});
};

exports.remove = function (req, res) {
	var id = req.params.id;

	// do pre-processing here
	model.remove(id, function(err, result) {
		// do post-processing here
		if (err){
			console.warn('Error deleting an event type: ' + err);
			res.send({'error':'An error has occurred'});
		}
		else {
			console.log('Success: ',result);
			// ??? we should have some sort of standardized confirmation/error messages
			res.send({'success':'removed'});
		}
	});
};

exports.addRule = function(req, res) {
	var id = req.params.id;
	var rule = req.body;
	Rule.findById(rule._id, function(err, rule){
		if (err){
			console.warn('The rule does not exist: ' + err);
			res.send({'error':err});
			return;
		}
		model.addRule(id, rule, function(err){
			if(err){
				console.warn('Error linking a reward and a rule: ' + err);
				res.send({'error':'An error has occurred while linking.'});
			}
			else {
				console.log('Linked');
				res.send({'success':'linked'});
			}
		});
	});
};

exports.removeRule = function(req, res) {
	var id = req.params.id;
	var ruleid = req.params.ruleid;

	model.removeRule(id, ruleid, function(err){
		if(err){
			console.warn('Error unlinking a reward and a rule: ' + err);
			res.send({'error':'An error has occurred while unlinking.'});
		}
		else {
			console.log('Unlinked');
			res.send({'success':'deleted'});
		}
	});
};

exports.addBadge = function(req, res) {
	var id = req.params.id;
	var badge = req.body;
	Badge.findById(badge._id, function(err, badge){
		if (err){
			console.warn('The badge does not exist: ' + err);
			res.send({'error':err});
			return;
		}

		model.addBadge(id, badge, function(err){
			if(err){
				console.warn('Error linking a reward and a badge: ' + err);
				res.send({'error':'An error has occurred while linking.'});
			}
			else {
				console.log('Linked');
				res.send({'success':'linked'});
			}
		});
	});
};

exports.removeBadge = function(req, res) {
	var id = req.params.id;
	var badgeid = req.params.badgeid;

	model.removeBadge(id, badgeid, function(err){
		if(err){
			console.warn('Error unlinking a reward and a badge: ' + err);
			res.send({'error':'An error has occurred while unlinking.'});
		}
		else {
			console.log('Unlinked');
			res.send({'success':'deleted'});
		}
	});
};


/**
 * Always define the routes after the rest of functions!
 */
exports.routes = [
	// EventTypes
	{
		'path': '/rewards',
		'route': exports.list
	},
	{
		'path': '/rewards/:id',
		'route': exports.view
	},
	{
		'verb': 'post',
		'path': '/rewards',
		'route': exports.add
	},
	{
		'verb': 'put',
		'path': '/rewards/:id',
		'route': exports.update
	},
	{
		'verb': 'delete',
		'path': '/rewards/:id',
		'route': exports.remove
	},
	{
		'verb': 'post',
		'path': '/rewards/:id/rules',
		'route': exports.addRule
	},
	{
		'verb': 'delete',
		'path': '/rewards/:id/rules/:ruleid',
		'route': exports.removeRule
	},
	{
		'verb': 'post',
		'path': '/rewards/:id/badges',
		'route': exports.addBadge
	},
	{
		'verb': 'delete',
		'path': '/rewards/:id/badges/:badgeid',
		'route': exports.removeBadge
	}
];