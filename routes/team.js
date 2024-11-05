const express = require('express');
const router = express.Router();
const team = require('../services/team');

/* GET users */
router.get('/swap', async function(req, res, next) {
  try {
    console.error(`Swapping Teams`);
    res.json(await team.swap(req.user.userId));
  } catch (err) {
    console.error(`Error while swapping teams `, err.message);
    next(err);
  }
});

module.exports = router;