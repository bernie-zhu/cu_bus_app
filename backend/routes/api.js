var express = require('express');
var mysql = require('mysql');
const { route } = require('.');
var router = express.Router();

var con = mysql.createConnection({
  host: '34.134.85.82',
  user: "hello",
  password: "1234",
  database: "uiucbuses"
});
con.connect();

// !!! Write database interactions here !!!

/* POST username/pwd */
router.post('/login', function(req, res, next) {
  var {username, pwd} = req.body;
  console.log(username);
  var query = con.query('SELECT * FROM Users WHERE Username = ? AND Password = ?', [username, pwd], function(err, results) {
    console.log(results);
    res.send({"success": results.length ? true : false});
  });
});

/* GET username/pwd */
router.post('/get_favorite_stops', function(req, res, next) {
  var {username} = req.body;
  console.log(username);
  var query = con.query('SELECT StopID FROM FavoriteStops WHERE Username = ? ORDER BY DateCreated DESC', [username], function(err, results) {
    console.log(results);
    res.send(results);
  });
});

/* PUT update pwd */
router.put('/update_pwd', function(req, res, next) {
  var {username, pwd} = req.body;
  var query = con.query('UPDATE Users SET Password = ? WHERE Username = ?', [pwd, username], function(err, results) {
    res.send("success");
  });
});

/* DELETE favorite stop given user name */
router.post('/delete_favorite_stop', function(req, res, next) {
  var {username, stopID} = req.body;
  var query = con.query('DELETE FROM FavoriteStops WHERE Username = ? and StopID = ?', [username, stopID], function(err, results) {
    res.send("success");
  });
});

/* INSERT favorite stop given user name */
router.put('/insert_favorite_stop', function(req, res, next) {
  var {username, stopID} = req.body;
  var query = con.query('INSERT INTO FavoriteStops (Username, StopID, DateCreated) VALUES(?, ?, ?)', [username, stopID, new Date().toISOString().split("T")[0]], function(err, results) {
    res.send("success");
  });
});

/* GET search stops */
router.get('/get_stops', function(req, res, next) {
  var {keyword} = req.query;
  if (!keyword) res.send([]);
  else {
    var query = con.query(`SELECT * FROM BusStop WHERE StopID LIKE "%${keyword}%" ORDER BY StopID`, function(err, results) {
      res.send(results);
    });
  }
});

/* Advance Query 1 */
router.get('/advance_query_1', function(req, res, next) {
  var query = con.query(`SELECT u.Username, r.LineID, s.StopID, b.BusID, COUNT(b.BusID) AS UsefulBusCount 
  FROM uiucbuses.Users u NATURAL JOIN uiucbuses.FavoriteRoutes r NATURAL JOIN uiucbuses.FavoriteStops s JOIN uiucbuses.Buses b ON r.LineID = b.LineID OR s.StopID = b.StopOrigin 
  GROUP BY u.Username, b.BusID, r.LineID, s.StopID ORDER BY u.Username, b.BusID`, function(err, results) {
    console.log(results);  
    res.send(results);
  });
});

/* Advance Query 2 */
router.get('/advance_query_2', function(req, res, next) {
  var query = con.query(`SELECT Username, LineID, Number, Direction, COUNT(LineID) AS NumberOfBuses
  FROM Buses b NATURAL JOIN BusLine bl NATURAL JOIN FavoriteRoutes f NATURAL JOIN
  Users u
  GROUP BY Username, LineID, Direction
  ORDER BY Username, Number, Direction`, function(err, results) {
    console.log(results);  
    res.send(results);
  });
});



module.exports = router;
