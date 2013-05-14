var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'test',
  password : 'test',
  database : 'mango',
});

var surnames = new Array("joel", "greg", "jorge", "nicolas", "patrick", "guillaume", "naim", "stephane", "jonas", "delphine", "marie", "catherine", "fany", "jeanne", "jean", "lulu", "robert", "fabrice", "monica", "david");

var names = new Array("ducommun", "cavat", "albaladejo", "aubert", "rensch", "taillard", "beauvert", "gavillet", "monachon", "constantin", "blocher", "paul II", "von beethoven", "mozart", "rossini", "bach", "tchaikovski", "vivaldi");

var NBUSERS  = 1000;
var NBBADGES = 100;
var NBBADGESMAX = 10;

connection.connect();

connection.query('DELETE FROM T_User;', function(err, rows, fields) {
    if (err) {
    throw err;
    }
});

connection.query('DELETE FROM T_Badge;', function(err, rows, fields) {
    if (err) {
    throw err;
    }
});

for(var i = 0; i < NBBADGES; i++){
    var name = 'badge ' + i;
    connection.query('INSERT INTO T_Vadge (idBadge, name) values (\"'+(i+1)+'\",\"'+name+'\");', function(err, rows, fields) {
        if (err) {
        throw err;
        }
    });
}

for(var i = 0; i < NBUSERS; i++){
    var name = names[Math.floor((Math.random()*names.length)+1)];
    var surname = surnames[Math.floor((Math.random()*surnames.length)+1)];
    connection.query('INSERT INTO T_User (idUser, name, surname) values (\"'+(i+1)+'\",\"'+name+'\",\"'+surname+'\");', function(err, rows, fields) {
        if (err) {
        throw err;
        }
    });
    
    for(var j = 0; j<Math.floor((Math.random()*NBBADGESMAX)+1); j++){
        connection.query('INSERT INTO T_User (idUser, name, surname) values (\"'+(i+1)+'\",\"'+name+'\",\"'+surname+'\");', function(err, rows, fields) {
            if (err) {
            throw err;
            }
        });
    }
}

connection.query('SELECT name as name FROM T_User', function(err, rows, fields) {
  if (err) throw err;

  for (var i = 0; i < rows.length; i++)
    console.log(rows[i].name);
    
});

connection.end();
