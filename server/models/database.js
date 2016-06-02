var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/simple_expenses_monitor';

var Sequelize = require('sequelize');
var sequelize = new Sequelize('testdb', 'testuser', 'test', {
    host: 'localhost',
    port: 5342,
    dialect: 'postgres'
});

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE expenses (id SERIAL PRIMARY KEY, info VARCHAR(100) not null, date_expense DATE, time_created timestamp DEFAULT current_timestamp, last_updated timestamp DEFAULT current_timestamp, is_deleted BOOLEAN DEFAULT false)');
query.on('end', function() { client.end(); });