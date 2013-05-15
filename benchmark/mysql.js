var mysql      = require('mysql');
var async = require('async');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'test',
  password : 'test',
  database : 'mango',
});

var surnames = new Array("joel", "greg", "jorge", "nicolas", "patrick", "guillaume", "naim", "stephane", "jonas", "delphine", "marie", "catherine", "fany", "jeanne", "jean", "lulu", "robert", "fabrice", "monica", "david");

var names = new Array("ducommun", "cavat", "alvalejo", "aubert", "rensch", "taillard", "beauvert", "gavillet", "monachon", "constantin", "blocher", "paul II", "von beethoven", "mozart", "rossini", "bach", "tchaikovski", "vivaldi");

var NBUSERS  = 1000;
var NBBADGES = 100;
var NBBADGESMAX = 10;

connection.connect();

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Creation tables
function createDatabase(callback){
    connection.query('DROP TABLE IF EXISTS T_BadgeUser;', function(err, rows, fields) {
        if (err) {
        throw err;
        }
    });

    connection.query('DROP TABLE IF EXISTS T_User;', function(err, rows, fields) {
        if (err) {
        throw err;
        }
    });
    connection.query('DROP TABLE IF EXISTS T_Badge;', function(err, rows, fields) {
        if (err) {
        throw err;
        }
    });



    var create = new Array();
    create[0] = 'CREATE  TABLE IF NOT EXISTS T_User ( \
      `idUser` INT NOT NULL AUTO_INCREMENT , \
      `name` VARCHAR(30) NULL , \
      `surname` VARCHAR(45) NULL , \
      PRIMARY KEY (`idUser`) , \
      INDEX `flkNameUser` (`name` ASC) , \
      INDEX `flkSurnameUser` (`surname` ASC) ) \
    ENGINE = InnoDB;';

    create[1] = 'CREATE  TABLE IF NOT EXISTS T_Badge ( \
      `idBadge` INT NOT NULL AUTO_INCREMENT , \
      `name` VARCHAR(30) NULL , \
      PRIMARY KEY (`idBadge`) , \
      INDEX `flkName` (`name` ASC) ) \
    ENGINE = InnoDB;';

    create[2] = 'CREATE  TABLE IF NOT EXISTS T_BadgeUser ( \
      `idBadge` INT NOT NULL , \
      `idUser` INT NOT NULL , \
      PRIMARY KEY (`idBadge`, `idUser`) , \
      INDEX `fk_T_Badge_has_T_User_T_User1` (`idUser` ASC) , \
      INDEX `fk_T_Badge_has_T_User_T_Badge` (`idBadge` ASC) , \
      CONSTRAINT `fk_T_Badge_has_T_User_T_Badge` \
        FOREIGN KEY (`idBadge` ) \
        REFERENCES `mango`.`T_Badge` (`idBadge` ) \
        ON DELETE NO ACTION \
        ON UPDATE NO ACTION, \
      CONSTRAINT `fk_T_Badge_has_T_User_T_User1` \
        FOREIGN KEY (`idUser` ) \
        REFERENCES `mango`.`T_User` (`idUser` ) \
        ON DELETE NO ACTION \
        ON UPDATE NO ACTION) \
    ENGINE = InnoDB;';

    for(var i = 0; i < create.length; i++){
        connection.query(create[i]);
    };

    for(var i = 0; i < NBBADGES; i++){
        var name = 'badge ' + i;
        connection.query('INSERT INTO T_Badge (idBadge, name) values (\"'+(i+1)+'\",\"'+name+'\");');
    }

    for(var i = 0; i < NBUSERS; i++){
        var name = names[Math.floor((Math.random()*names.length)+1)];
        var surname = surnames[Math.floor((Math.random()*surnames.length)+1)];
        connection.query('INSERT INTO T_User (idUser, name, surname) values (\"'+(i+1)+'\",\"'+name+'\",\"'+surname+'\");');
        
        var no = 0;
        for(var j = 0; j<Math.floor((Math.random()*NBBADGESMAX)+1); j++){
            no += Math.floor((Math.random()*NBBADGESMAX)+1);
            connection.query('INSERT INTO T_BadgeUser (idUser, idBadge) values (\"'+(i+1)+'\",\"'+no+'\");');
        }
    }
    
    connection.query('SELECT 1 + 1', callback);
    //callback();
}


function queryLookup(callback){
    connection.query('SELECT U.name as nameUser, U.surname as surname, B.name as namebadge FROM T_User U INNER JOIN T_BadgeUser BU ON U.idUser = BU.idUser INNER JOIN T_Badge B ON B.idBadge = BU.idBadge WHERE U.idUser = 23 ', function(err, rows, fields) {
      if (err) throw err;

      for (var i = 0; i < rows.length; i++)
        console.log(rows[i].nameUser + ' ' + rows[i].surname + ' ' + rows[i].namebadge);
        
    });
    
    connection.query('SELECT 1 + 1', callback);
}



var from, elapsed;
async.series([
    function(callback){
        console.log('start create database');
        from = new Date();
        createDatabase(callback);
    },
    function(callback){
        console.log('start lookup');
        from = new Date();
        queryLookup(callback);
    }
],
function(err, rows, fields){
    elapsed = new Date()
    var diff = elapsed.getTime() - from.getTime();
    console.log('durée create database : ' + diff);
});





//time(queryLookup(), 'queryLookup');

// http://www.sebastianseilund.com/nodejs-async-in-practice
// pour le synchrone

connection.end();








