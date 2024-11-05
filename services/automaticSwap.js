const cron = require('node-cron');
const db = require('./db'); // Adjust the path to your database module

// Function to swap out cards based on the last set timestamp
async function swapCards() {
  try {
    // Get the current time
    const currentTime = new Date();

    // Query to find cards that have lastSet older than 1 hour
    const query = `
      SELECT ID 
      FROM ActiveCard 
      WHERE TIMESTAMPDIFF(HOUR, TimeAdded, ?) >= 1;`;
      
    const rows = await db.query(query, [currentTime]);

    if (rows.length > 0) {
      // Select a new random card from the Card table
      const randomCardQuery = `
        SELECT ID 
        FROM Card 
        ORDER BY RAND() 
        LIMIT 1;`;
        
      const randomCardRows = await db.query(randomCardQuery);

      if (randomCardRows.length > 0) {
        const newCardId = randomCardRows[0].ID;

        // Update the existing card in the ActiveCard table
        await db.query(
          `UPDATE ActiveCard 
           SET CardID = ?, TimeAdded = NOW() 
           WHERE ID = ?;`,
          [newCardId, rows[0].ID] // Assuming you want to update the first found old card
        );

        console.log("Card swapped successfully. Updated ActiveCard ID:", rows[0].ID, "with new CardID:", newCardId);
      } else {
        console.log("No new card available for swapping.");
      }
    } else {
      console.log("No cards need swapping at this time.");
    }
  } catch (error) {
    console.error("Error swapping cards:", error);
  }
}

// Schedule the task to run every minute
function scheduleCardSwaps() {
  cron.schedule('* * * * *', () => {
    console.log("Checking for cards to swap...");
    swapCards();
  });
}

// Export the schedule function
module.exports = scheduleCardSwaps;
