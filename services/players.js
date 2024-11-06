const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const jwt = require('jsonwebtoken');

async function getInfo(userId){
  const rows = await db.query(
    `SELECT ID, Name, Email
     FROM Player
     WHERE ID = ?
     LIMIT 1`,
    [userId]
  );

  if(rows.length > 0){
    rows[0].team = await helper.getTeam(userId, db)
  }

  const data = helper.emptyOrRows(rows[0]);

  return {
    data
  }
}


async function login(username, password, res){
  const rows = await db.query(
    `SELECT ID
   FROM Player
   WHERE Name = ? AND Password = ?`,
  [username, password]
);
  
  if (rows.length > 0) {
    const user = rows[0]
    // Generate a JWT token
    const token = jwt.sign({ userId: user.ID }, config.jwt, { expiresIn: '96h' });
    return { token, userId: user.ID  };
  } else {
    throw new Error('Invalid username or password');
  }
}

module.exports = {
  getInfo,
  login
}