var express = require('express');
var players = require('./routes/players');

function start() {
	var app = express();
 
 	app.configure(function () {
    	app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    	app.use(express.compress());
    	app.use(express.bodyParser());
	});

	app.get('/players', players.findAll);
	app.get('/players/:id', players.findById);
	app.post('/players', players.add);
	app.put('/players/:id', players.update);
	app.delete('/players/:id', players.delete);

	app.listen(8888);

	console.log('Listening on port 8888...');
}

exports.start = start;