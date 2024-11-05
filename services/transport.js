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
}

module.exports = {
  ride
}