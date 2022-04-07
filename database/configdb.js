/*
Importacion de modulos
*/
var mysql = require('mysql');

const {database} = require('./keys')

const pool = mysql.createPool(database)
const { promisify } = require('util');


pool.getConnection((err, connection) => {
  if (err) {
    console.error(err)
  }

  if (connection) connection.release();
  console.log('DB is Connected');

  return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;