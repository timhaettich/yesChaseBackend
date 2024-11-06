const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function log(longitude, latitude, userId){
  const team = await helper.getTeam(userId, db)

  //Log the GPS
  await db.query(
    `INSERT INTO GPSLog (Timestamp, Longitude, Latitude, Player, Type)
    VALUES (NOW(), ?, ?, ?, ?)`,
    [longitude, latitude, userId, team.typeID]
  );
}

async function routes() {
  const rows = await db.query(
    `SELECT player.Name,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'Timestamp', gps.Timestamp,
            'Longitude', gps.Longitude,
            'Latitude', gps.Latitude,
            'Type', gps.Type
        ) ORDER BY gps.Timestamp  -- Ensures the logs are sorted by Timestamp
    ) AS Logs
    FROM 
        Player AS player
    JOIN 
        GPSLog AS gps ON player.ID = gps.Player
    GROUP BY 
        player.Name;`
  );

  // Parse the Logs field if it's returned as a string
  const data = helper.emptyOrRows(rows).map(row => ({
    ...row,
    Logs: JSON.parse(row.Logs) // Parse the Logs string to convert it into a JSON object
  }));

  return {
    data
  };
}




module.exports = {
  log,
  routes
}