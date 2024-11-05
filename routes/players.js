const express = require('express');
const router = express.Router();
const players = require('../services/players');

var auth = require('../auth')

/* GET users */
router.get('/', auth, async function(req, res, next) {
  try {
    console.error(`Fetching player`);
    res.json(await players.getInfo(req.user.userId));
  } catch (err) {
    console.error(`Error while getting player languages `, err.message);
    next(err);
  }
});

/* login player */
router.post('/login', async function(req, res, next) {
  try {
    console.error(`Logging in player`);

    const { username, password } = req.body;

    res.json(await players.login(username, password));
  } catch (err) {
    res.status(401).send('Wrong username/password')
  }
});

module.exports = router;