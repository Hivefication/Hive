var Mongo = require('mongodb').MongoClient;
var async = require('async');

var surnames = new Array("joel", "greg", "jorge", "nicolas", "patrick", "guillaume", "naim", "stephane", "jonas", "delphine", "marie", "catherine", "fany", "jeanne", "jean", "lulu", "robert", "fabrice", "monica", "david");

var names = new Array("ducommun", "cavat", "albaladejo", "aubert", "rensch", "taillard", "beauvert", "gavillet", "monachon", "constantin", "blocher", "paul II", "von beethoven", "mozart", "rossini", "bach", "tchaikovski", "vivaldi");

var NBUSERS  = 100;
var NBBADGES = 25;
var NBBADGESMAX = 5;
var NBREPETITION = 50;

var elapsed, from;

var userNames = new Array();
var userSurnames = new Array();
for(var i = 0; i < NBUSERS; i++){
	userNames[i] = names[Math.floor((Math.random()*names.length))];
	userSurnames[i] = surnames[Math.floor((Math.random()*surnames.length))];
}

Mongo.connect("mongodb://localhost:27017/benchmarkDB", function(err, db) {
	
	if(err) { 
		return console.log(err);
	}


	var Users;
	var Badges;

	function createDatabase(callback){

		var current = 0;
		var total = 2;
		function verifEnd(){
			current++;
			if(current >= total){
				elapsed = new Date()
				var diff = elapsed.getTime() - from.getTime();
				console.log('durée : ' + diff);
				callback();
			}
		}

		db.createCollection('Users', function(err, collection) { 
			if (err) 
				console.log(err);
			else
				Users = collection;

			verifEnd();
		});
		db.createCollection('Badges', function(err, collection) {
			if (err) 
				console.log(err);
			else
				Badges = collection;

			verifEnd();
		});
	}

	function deleteData(callback){

		var current = 0;
		var total = 2;
		function verifEnd(){
			current++;
			if(current >= total){
				elapsed = new Date()
				var diff = elapsed.getTime() - from.getTime();
				console.log('durée : ' + diff);
				callback();
			}
		}

		Users.remove(function(err){
			verifEnd();
		});
		Badges.remove(function(err){
			verifEnd();
		});
	}

	function populateDatabase(callback){

		var current = 0;
		var total = NBBADGES + NBUSERS + NBUSERS * NBBADGESMAX;
		function verifEnd(){
			current++;
			if(current >= total){
				elapsed = new Date()
				var diff = elapsed.getTime() - from.getTime();
				console.log('durée : ' + diff);
				callback();
			}
		}

		for(var i = 0; i < NBBADGES; i++){
			var name = 'badge ' + i;
			Badges.insert({'idbadge':i, 'name':name}, {w:1}, function(err, result) { 
				verifEnd();
			});
		}

		for(var i = 0; i < NBUSERS; i++){
			Users.insert({idkey:i, name:userNames[i], surname:userSurnames[i], badges:[]}, {w:1}, function(err, result){
				verifEnd();
				if (err){
					console.log(err);
				}
				else{
					for(var j = 0; j<NBBADGESMAX; j++){
						var badge_id = Math.floor(Math.random()*NBBADGES);
						var badge_name = 'badge ' + badge_id;
						Users.update({idkey:result[0].idkey}, {$push:{badges:{idbadge:badge_id, name:badge_name}}}, {w:1}, function(err, result) {
							verifEnd();
						});
					}
				}
			});
		}
	}

	function queryLookup1(callback){
		
		var current = 0;
		var total = NBUSERS;
		function verifEnd(){
			current++;
			if(current >= total){
				elapsed = new Date()
				var diff = elapsed.getTime() - from.getTime();
				console.log('durée : ' + diff);
				callback();
			}
		}

		for(var i = 0; i < total; i++){
			Users.findOne({'idkey':i}, function(err, item) {
				verifEnd();
			});
		}
	}

	function queryLookup2(callback){
		
		var current = 0;
		var total = NBBADGES;
		function verifEnd(){
			current++;
			if(current >= total){
				elapsed = new Date()
				var diff = elapsed.getTime() - from.getTime();
				console.log('durée : ' + diff);
				callback();
			}
		}

		for(var i = 0; i < total; i++){
			Badges.findOne({'idbadge':i}, function(err, item) {
				verifEnd();
			});
		}
	}

	function queryLookup3(callback){

		var current = 0;
		var total = NBREPETITION;
		function verifEnd(){
			current++;
			if(current >= total){
				elapsed = new Date()
				var diff = elapsed.getTime() - from.getTime();
				console.log('durée : ' + diff);
				callback();
			}
		}
		for(var i = 0; i < total; i++){
			var stream = Users.find().stream();
			stream.on("data", function(item) {});
			stream.on("end", function(){
				verifEnd();
		    });
		}
	}

	function queryLookup4(callback){

		var current = 0;
		var total = NBBADGES;
		function verifEnd(){
			current++;
			if(current >= total){
				elapsed = new Date()
				var diff = elapsed.getTime() - from.getTime();
				console.log('durée : ' + diff);
				callback();
			}
		}
		for(var i = 0; i < total; i++){
			var stream = Users.find({badges : {$elemMatch: {idbadge:i}}}).stream();
			stream.on("data", function(item) {});
			stream.on("end", function(){
				verifEnd();
		    });
		}
	}

	function queryLookup5(callback){

		var current = 0;
		var total = NBREPETITION;
		function verifEnd(){
			current++;
			if(current >= total){
				elapsed = new Date()
				var diff = elapsed.getTime() - from.getTime();
				console.log('durée : ' + diff);
				callback();
			}
		}
		for(var i = 0; i < total; i++){
			Users.aggregate(
		        // then group by name and add counts
		        { $group : {  	_id : '$surname', 
		        				countSurname : { $sum : 1 }
		        			}},
		        // and sort descending
		        { $sort : { 'countSurname' : -1} },
		        function(err,items){
		        	if (err)
		        		console.log(err);
		        	verifEnd();
		        }
		    );
		}
	}

	function queryLookup6(callback){

		var current = 0;
		var total = NBBADGES;
		function verifEnd(){
			current++;
			if(current >= total){
				elapsed = new Date()
				var diff = elapsed.getTime() - from.getTime();
				console.log('durée : ' + diff);
				callback();
			}
		}
		for(var i = 0; i < total; i++){
			Users.aggregate(
		       	// select only those who have the badge number
		       	{ $match: { badges: {$elemMatch: {idbadge:i}}}},
		        // then group by name and add counts
		        { $group : {  	_id : '$name', 
		        				countBadgesForName : { $sum : 1 }
		        			}},
		        // and sort descending
		        { $sort : { 'countBadgesForName' : -1} },
		        function(err,items){
		        	if (err)
		        		console.log(err);
		        	verifEnd();
		        }
		    );
		}
	}

	async.series([
	    function(callback){
	        console.log('start create database');
	        from = new Date();
	        createDatabase(callback);
	    },
	    function(callback){
	        console.log('start delete existing data');
	        from = new Date();
	        deleteData(callback);
	    },
	    function(callback){
	        console.log('start populate database');
	        from = new Date();
	        populateDatabase(callback);
	    },
	    function(callback){
	        console.log('start lookup all users one by one with their badges');
	        from = new Date();
	        queryLookup1(callback);
	    },
	    function(callback){
	        console.log('start lookup all badges without join');
	        from = new Date();
	        queryLookup2(callback);
	    },
	    function(callback){
	        console.log('start lookup all entries with join');
	        from = new Date();
	        queryLookup3(callback);
	    },
	    function(callback){
	        console.log('start lookup all user that have a badge id, use join');
	        from = new Date();
	        queryLookup4(callback);
	    },
	    function(callback){
	        console.log('start lookup with an aggregate that count the number of same surnames');
	        from = new Date();
	        queryLookup5(callback);
	    },
	    function(callback){
	        console.log('start lookup with an aggregate that count the number of same names with a given badge');
	        from = new Date();
	        queryLookup6(callback);
	    }
	],
	function(err){
	    console.log('Finish');
	});

});
