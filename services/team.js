const db = require('./db');
const helper = require('../helper');

async function swap(userId){
  const team = await helper.getTeam(userId, db)

  //Update Runner Team first
  await db.query(
    `UPDATE Team
    SET CurrentCard = ?, Type = 1
    WHERE ID = ?`,
    [null, team.ID]
  );

  //Update the Chaser Team
  await db.query(
    `UPDATE Team
    SET CurrentCard = ?, Type = 2
    WHERE ID = ?`,
    [null, team.opponentID]
  );

  const timeNow = new Date()
  timeNow.setMinutes(timeNow.getMinutes() + 30)

  //Set cooldown for chaser team
    await db.query(
      `UPDATE Team
      SET TimeOut = ?
      WHERE ID = ?`,
      [timeNow, team.ID]
    );

  return {timeout:timeNow}
}

async function timeOut(userId){
  const team = await helper.getTeam(userId, db)

  await db.query(
    `SELECT ID, TimeOut
    FROM Team
    WHERE ID = ?`,
    [team.ID]
  );

  return {"Status":"Success"}
}


module.exports = {
  swap,
  timeOut
}