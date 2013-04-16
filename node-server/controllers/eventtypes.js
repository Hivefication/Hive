var model = require('../models/eventtype');

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
    var eventType = req.body;

    // do pre-processing here
    model.update(id, eventType, function(err, result) {
        // do post-processing here
        if (err){
            console.warn('Error updating an event type: ' + err);
            res.send({'error':'An error has occurred'});
        }
        else {
            console.log('Success: ',result);
            res.send(result.toJSON({ virtuals: true }));
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

/**
 * Always define the routes after the rest of functions!
 */
exports.routes = [
    // EventTypes
    {
        'path': '/eventtypes',
        'route': exports.list
    },
    {
        'path': '/eventtypes/:id',
        'route': exports.view
    },
    {
        'verb': 'post',
        'path': '/eventtypes',
        'route': exports.add
    },
    {
        'verb': 'put',
        'path': '/eventtypes/:id',
        'route': exports.update
    },
    {
        'verb': 'delete',
        'path': '/eventtypes/:id',
        'route': exports.remove
    }
];