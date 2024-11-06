const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function ride(travelTime, travelModeId, userId){
  const team = await helper.getTeam(userId, db)

  //Get cost
  var costPerMinute = await db.query(
    `SELECT Cost
    FROM Transport
    WHERE ID = ?
    LIMIT 1;`,
    [travelModeId]
  );

  costPerMinute = costPerMinute[0].Cost;
  var price = costPerMinute * travelTime;

  //Deduct the price from the balance
  await db.query(
    `UPDATE Team
    SET Balance = Balance - ?
    WHERE ID = ?`,
    [price, team.ID]
  );

  //Log the driving
  await db.query(
    `INSERT INTO TransportLog (Timestamp, Cost, Transport, Team)
    VALUES (NOW(), ?, ?, ?)`,
    [price, travelModeId, team.ID]
  );


  const result = await db.query(
    `SELECT Balance
    FROM Team
    WHERE ID = ?
    LIMIT 1`,
    [team.ID]
  )

  const balance = result[0].Balance

  return {balance}

}

async function list() {
  const rows = await db.query(
    `SELECT ID, Name, Cost, AllowTimeout
    FROM Transport`
  );

  // Parse the Logs field if it's returned as a string
  const data = helper.emptyOrRows(rows);

  return {
    data
  };
}

module.exports = {
  ride,
  list
}