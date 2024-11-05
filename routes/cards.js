const express = require('express');
const router = express.Router();
const cards = require('../services/cards');

/* GET active cards */
router.get('/active', async function(req, res, next) {
  try {
    console.error(`Fetching active cards`);
    res.json(await cards.readCurrentCards());
  } catch (err) {
    console.error(`Error while getting active cars `, err.message);
    next(err);
  }
});

/* GET provide Active cards */
router.get('/provideCards', async function(req, res, next) {
  try {
    console.error(`Providing new cards`);
    res.json(await cards.provideActiveCards());
  } catch (err) {
    console.error(`Error while getting new active cars `, err.message);
    next(err);
  }
});

/* POST select card */
router.post('/select', async function(req, res, next) {
  try {
    console.error(`Team selects a card`);

    const cardId= req.body.cardId
    const userId = req.user.userId

    res.json(await cards.selectCard(cardId, userId));
  } catch (err) {
    console.error(`Error while getting active cars `, err.message);
    next(err);
  }
});


/* POST completed card */
router.post('/completed', async function(req, res, next) {
  try {
    console.error(`Team completed a card`);

    const card = req.body
    const userId = req.user.userId

    res.json(await cards.completeCard(card, userId));
  } catch (err) {
    console.error(`Error while getting active cars `, err.message);
    next(err);
  }
});

module.exports = router;