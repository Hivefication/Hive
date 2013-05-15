var Mongo = require('mongodb').MongoClient;

var surnames = new Array("joel", "greg", "jorge", "nicolas", "patrick", "guillaume", "naim", "stephane", "jonas", "delphine", "marie", "catherine", "fany", "jeanne", "jean", "lulu", "robert", "fabrice", "monica", "david");

var names = new Array("ducommun", "cavat", "albaladejo", "aubert", "rensch", "taillard", "beauvert", "gavillet", "monachon", "constantin", "blocher", "paul II", "von beethoven", "mozart", "rossini", "bach", "tchaikovski", "vivaldi");

var NBUSERS  = 1000;
var NBBADGES = 100;
var NBBADGESMAX = 10;

var userNames = new Array();
var userSurnames = new Array();
for(var i = 0; i < NBUSERS; i++){
	userNames[i] = names[Math.floor((Math.random()*names.length)+1)];
	userSurnames[i] = surnames[Math.floor((Math.random()*surnames.length)+1)];
}

Mongo.connect("mongodb://localhost:27017/benchmarkDB", function(err, db) {
	
	if(err) { 
		return console.dir(err);
	}

	var Users = db.createCollection('Users', function(err, collection) {});
	var Badges = db.createCollection('Badges', function(err, collection) {});

	Users.remove();
	Badges.remove();

	for(var i = 0; i < NBBADGES; i++){
		var name = 'badge ' + i;
		Badges.insert({'name':name}, {w:1}, function(err, result) { });
	}

	for(var i = 0; i < NBUSERS; i++){
		Users.insert({'name':userNames[i], 'surname':userSurnames[i]}, {w:1}, function(err, result){
			if (err){
				console.log(err);
			}
			else{}
				for(var j = 0; j<Math.floor((Math.random()*NBBADGESMAX)+1); j++){
					var name = 'badge ' + j;
					Users.update({_id:result._id}, {$push:{badges:{'name':name}}}, {w:1}, function(err, result) {});
				}
			}
		});
		
	}

	// Select query
});
