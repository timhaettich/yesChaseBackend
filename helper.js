function emptyOrRows(rows) {
    if (!rows) {
      return [];
    }
    return rows;
  }


  async function getTeam(userId, db) {
    const rows = await db.query(
        `SELECT team.ID, type.ID AS typeID, type.Type AS typeName, opponent.ID AS opponentID, team.Balance AS teamBalance, team.TimeOut AS timeout,
        JSON_OBJECT(
            'id', card.ID,
            'description', card.Description,
            'cost', card.Cost
        ) AS card
        FROM Team AS team
        JOIN TeamType AS type ON team.Type = type.ID
        LEFT JOIN Card AS card ON team.CurrentCard = card.ID
        JOIN Player AS player ON team.ID = player.Team
        JOIN Team AS opponent ON team.Opponent = opponent.ID
        WHERE team.ID = ?
        LIMIT 1`,
        [userId]
      );
      console.error(`found team `, rows)
    if(rows.length > 0){
        rows[0].card = JSON.parse(rows[0].card)
        return rows[0]
    }
  }

  module.exports = {
    emptyOrRows,
    getTeam
  }