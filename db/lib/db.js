// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./db-config.js');
const db = new Pool(dbParams);
db.connect();

module.exports = db;
