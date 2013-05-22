var model = require('../models/badge');
var fs = require('fs');

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
    var badge = req.body;

    model.add(badge, function(err, result) {
        if (err) {
            console.warn('Error adding badge: ' + err);
            res.send({'error': 'An error has occurred'});
        } else {
            console.log('Success: ', result);
            res.send(result);
        }
    })
};

exports.update = function (req, res) {
    var id = req.params.id;
    var badge = req.body;

    model.update(id, badge, function(err, result) {    
        if (err) {
            console.warn('Error updating badge: ' + err);
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
            console.warn('Error deleting badge: ' + err);
            res.send({'error':'An error has occurred'});
        } else {
            console.log('Success: ', result);
            res.send({'success': 'removed'});
        }
    });
};

exports.icon = function(req, res) {
    var id = req.params.id;
    
    model.findById(id, function(err, item) {
       var img = fs.readFile('./img/'+item.icon,"binary",function(error,file){
          if(error) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.write(error + "\n");
            res.end();
          } else {      
            res.writeHead(200, {"Content-Type": "image/png"});
            res.end(file,"binary");
          }
       });
    });
};

exports.routes = [
    // Badges administration
    {
        'path': '/badges',
        'route': exports.list
    },
    {
        'path': '/badges/:id',
        'route': exports.view
    },
    {
        'verb': 'post',
        'path': '/badges',
        'route': exports.add
    },
    {
        'verb': 'put',
        'path': '/badges/:id',
        'route': exports.update
    },
    {
        'verb': 'delete',
        'path': '/badges/:id',
        'route': exports.remove
    },
    {
        'path': '/badges/:id/icon',
        'route': exports.icon
    }
];