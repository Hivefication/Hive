var db = null;
var mongoose = require('mongoose');

// initialize just the first time
if (!db){	
	mongoose.connect('mongodb://localhost/hive');

	db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
	  console.log("DB opened!");
	});
} 

exports.mongoose = mongoose;