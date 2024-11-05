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
}


module.exports = {
  swap
}