var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');
var connectionString = require(path.join(__dirname, '../', 'config'));

/**
 *  Routes to home /
 */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});


/**
 * path: /api/v1/expenses
 * operations:
 *   -  httpMethod: POST
 *      summary: Adds a new expense
 *      notes: If succed save new record expense and return the list of expense which not deleted
 */
router.post('/api/v1/expenses', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {info: req.body.info, date_expense: req.body.date_expense};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO expenses(info, date_expense) values($1, $2)", [data.info, data.date_expense]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM expenses WHERE is_deleted = false ORDER BY id ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });


    });
});

/**
 * path: /api/v1/expenses
 * operations:
 *   -  httpMethod: GET
 *      summary: Returns a new expense
 *      notes: If succed return the list of expense which not deleted
 */
router.get('/api/v1/expenses', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM expenses WHERE is_deleted = false ORDER BY id ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });

    });

});

/**
 * path: /api/v1/expenses
 * operations:
 *   -  httpMethod: PUT
 *      summary: Updates an expense record
 *      notes: If succed update a expense record and return the list of expense which not deleted
 *      parameters:
 *        - name: expense_id
 *          description: ID row of expense
 *          paramType: query
 *          required: true
 *          dataType: integer
 */
router.put('/api/v1/expenses/:expense_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.expense_id;

    // Grab data from http request
    var data = {info: req.body.info, date_expense: req.body.date_expense};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

        // SQL Query > Update Data
        client.query("UPDATE expenses SET info=($1), date_expense=($2), last_updated = now() WHERE id=($3)", [data.info, data.date_expense, id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM expenses WHERE is_deleted = false ORDER BY id ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});

/**
 * path: /api/v1/expenses
 * operations:
 *   -  httpMethod: DELETE
 *      summary: Deletes an expense record
 *      notes: If succed delete a expense record and return the list of expense which not deleted
 *      parameters:
 *        - name: expense_id
 *          description: ID row of expense
 *          paramType: query
 *          required: true
 *          dataType: integer
 */
router.delete('/api/v1/expenses/:expense_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.expense_id;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Delete Data
        client.query("UPDATE expenses SET is_deleted = true, last_updated = now() WHERE id=($1)", [id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM expenses WHERE is_deleted = false ORDER BY id ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});


module.exports = router;