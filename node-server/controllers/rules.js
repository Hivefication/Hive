var model = require('../models/rule');

exports.list = function (req, res) {
    model.findAll(function(err, items) {
        console.log('received a callback', err, items);
        res.send(items);
    });
};

exports.view = function (req, res) {
    var id = req.params.id;
    
    model.findById(id, function(err, item) {
        res.send(item);
    })
};

exports.add = function (req, res) {
    var rule = req.body;

    model.add(rule, function(err, result) {
        if (err) {
            console.warn('Error adding rule: ' + err);
            res.send({'error': 'An error has occurred'});
        } else {
            console.log('Success: ', result);
            res.send(result);
        }
    })
};

exports.update = function (req, res) {
    var id = req.params.id;
    var rule = req.body;

    model.update(id, rule, function(err, result) {    
        if (err) {
            console.warn('Error updating rule: ' + err);
            res.send({'error': 'An error has occurred'});
        } else {
            console.log('Success: ', result);
            res.send(result);
        }
    });
};

exports.remove = function (req, res) {
    var id = req.params.id;

    model.remove(id, function(err, result) {
        if (err) {
            console.warn('Error deleting rule: ' + err);
            res.send({'error':'An error has occurred'});
        } else {
            console.log('Success: ', result);
            res.send({'success': 'removed'});
        }
    });
};

exports.routes = [
    // Rules administration
    {
        'path': '/rules',
        'route': exports.list
    },
    {
        'path': '/rules/:id',
        'route': exports.view
    },
    {
        'verb': 'post',
        'path': '/rules',
        'route': exports.add
    },
    {
        'verb': 'put',
        'path': '/rules/:id',
        'route': exports.update
    },
    {
        'verb': 'delete',
        'path': '/rules/:id',
        'route': exports.remove
    },
];