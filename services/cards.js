const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function readCurrentCards() {
  const rows = await db.query(
    `SELECT Card.Description, Card.Cost, ActiveCard.TimeAdded, Card.ID
FROM YesChase.ActiveCard AS ActiveCard
JOIN YesChase.Card AS Card ON ActiveCard.CardID = Card.ID;
`
  );
  const data = helper.emptyOrRows(rows);

  return {
    data
  }
}

async function provideActiveCards() {
  //Delete all current cards
  await db.query(
    `DELETE FROM ActiveCard`
  )

  //Set four new cards
  await db.query(
    `INSERT INTO ActiveCard (CardID, TimeAdded)
      SELECT ID, NOW()
      FROM Card
      ORDER BY RAND()
      LIMIT 4;`
  );
}

async function selectCard(cardId, userId) {
  console.log('CardID: ', cardId)

  //First delete the currently active card
  await db.query(
    `DELETE FROM YesChase.ActiveCard
    WHERE CardID = ?;`,
    [cardId]
  );

  //Then select a new active card
  await db.query(
    `INSERT INTO ActiveCard (CardID, TimeAdded)
    SELECT ID, NOW()
    FROM Card
    WHERE ID NOT IN (SELECT CardID FROM ActiveCard)
    ORDER BY RAND()
    LIMIT 1;`
  );

  //Then set card as the teams current card
  const team = await helper.getTeam(userId, db);
  console.log('Setting current team card', cardId, team.ID)
  await db.query(
    `UPDATE Team
    SET CurrentCard = ?
    WHERE ID = ?`,
    [cardId, team.ID]
  );
  console.log('Updating Cardlog')
  //Update the Card Log
  await db.query(
    `INSERT INTO CardLog (Timestamp, Card, Type)
    VALUES (NOW(), ?, ?)`,
    [cardId, team.ID]
  );

  return { "Status":"Ok" }
}



async function completeCard(card, user) {
  console.error(`userID`, user)
  //First delete the currently active card for the team
  const team = await helper.getTeam(user, db);

  if (team.card) {
    console.error(`TeamID`, team)
    //Remove Card
    await db.query(
      `UPDATE Team
      SET CurrentCard = NULL
      WHERE ID = ?`,
      [team.ID]
    );

    console.error(`Balance ID`, card.balance, team.ID)
    //Then give the team new coin balance
    await db.query(
      `UPDATE Team
      SET Balance = Balance + ?
      WHERE ID = ?`,
      [card.balance, team.ID]
    );
    return { Status: "OK" }
  } else {
    return []
  }
}

async function vetoCard(card, user) {
  console.error(`userID`, user)
  //First delete the currently active card for the team
  const team = await helper.getTeam(user, db);

  if (team.card) {
    console.error(`TeamID`, team)
    //Remove Card
    await db.query(
      `UPDATE Team
      SET CurrentCard = NULL
      WHERE ID = ?`,
      [team.ID]
    );

    //Then give the team new timeout
    const timeNow = new Date()
    timeNow.setMinutes(timeNow.getMinutes() + 20)

    await db.query(
      `UPDATE Team
        SET TimeOut = ?
        WHERE ID = ?`,
      [timeNow, team.ID]
    );

    return { Status: "OK" }
  } else {
    return []
  }
}

module.exports = {
  readCurrentCards,
  provideActiveCards,
  selectCard,
  completeCard,
  vetoCard
}