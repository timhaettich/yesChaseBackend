const mysql = require('mysql2/promise');
const config = require('../config');

// Create a pool instead of a single connection
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,   // Maximum number of connections in the pool
  queueLimit: 0          // No limit on the queue length
});

async function query(sql, params) {
  const connection = await pool.getConnection(); // Get a connection from the pool
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    connection.release(); // Release the connection back to the pool
    console.log('Connection released');
  }
}

module.exports = {
  query
};