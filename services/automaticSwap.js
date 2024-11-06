const cron = require('node-cron');
const db = require('./db'); // Adjust the path to your database module

// Function to swap out cards based on the last set timestamp
async function swapCards() {
  try {
    // Get the current time
    const currentTime = new Date();

    // Query to find cards that have lastSet older than 1 hour
    const expiredCardsQuery = `
      SELECT ID 
      FROM ActiveCard 
      WHERE TIMESTAMPDIFF(HOUR, TimeAdded, ?) >= 1;`;

    const expiredCards = await db.query(expiredCardsQuery, [currentTime]);

    if (expiredCards.length > 0) {
      // Select all new random cards from the Card table
      const randomCardQuery = `
        SELECT ID 
        FROM Card
        WHERE ID NOT IN (SELECT CardID FROM ActiveCard)
        ORDER BY RAND();`; // Get all cards, shuffled
      
      const randomCardRows = await db.query(randomCardQuery);

      if (randomCardRows.length > 0) {
        // Update each expired card with a new random card
        for (let i = 0; i < expiredCards.length; i++) {
          const expiredCardId = expiredCards[i].ID;

          // Select a new random card for this iteration
          const newCardId = randomCardRows[i % randomCardRows.length].ID; // Cycle through random cards

          // Update the existing card in the ActiveCard table
          await db.query(
            `UPDATE ActiveCard 
             SET CardID = ?, TimeAdded = NOW() 
             WHERE ID = ?;`,
            [newCardId, expiredCardId]
          );

          console.log("Card swapped successfully. Updated ActiveCard ID:", expiredCardId, "with new CardID:", newCardId);
        }
      } else {
        console.log("No new cards available for swapping.");
      }
    } else {
      console.log("No cards need swapping at this time.");
    }
  } catch (error) {
    console.error("Error swapping cards:", error);
  }
}

// Function to swap out cards based on the last set timestamp
async function fillMissingCards() {
    try {
             
        console.log('Filling missing cards')
      const cardCount = await db.query(
        `SELECT COUNT(*) AS count FROM ActiveCard;`);
      if (cardCount[0].count < 4) {
        // Select all new random cards from the Card table
        const randomCardQuery = `
          SELECT ID 
          FROM Card
          WHERE ID NOT IN (SELECT CardID FROM ActiveCard)
          ORDER BY RAND();`; // Get all cards, shuffled
        
        const randomCardRows = await db.query(randomCardQuery);
  
        if (randomCardRows.length > 0) {
          // Update each expired card with a new random card
          for (let i = 0; i < (4 - cardCount[0].count); i++) {  
            // Select a new random card for this iteration
            const newCardId = randomCardRows[i % randomCardRows.length].ID; // Cycle through random cards
  
            // Update the existing card in the ActiveCard table
            await db.query(
              `INSERT INTO ActiveCard
               SET CardID = ?, TimeAdded = NOW()`,
              [newCardId]
            );
  
            console.log("Card refilled successfully. Updated ActiveCard ID:", newCardId);
          }
        } else {
          console.log("No new cards available for swapping.");
        }
      } else {
        console.log("No cards need refilling at this time.");
      }
    } catch (error) {
      console.error("Error swapping cards:", error);
    }
  }
  

// Schedule the task to run every minute
function scheduleCardSwaps() {
  console.log("Starting card swap scheduler...");
  cron.schedule('* * * * *', () => {
    console.log("Checking for cards to swap...");
    fillMissingCards();
    swapCards();
  });
}

// Export the schedule function
module.exports = scheduleCardSwaps;
