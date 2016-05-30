// var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/simple_expenses_monitor';

module.exports = connectionString;