const express = require('express');
const router = express.Router();
const transport = require('../services/transport');

/* login player */
router.post('/ride', async function(req, res, next) {
  try {
    const userId = req.user.userId
    const travelTime = req.body.travelTime
    const travelModeId = req.body.travelModeId

    res.json(await transport.ride(travelTime, travelModeId, userId));
  } catch (err) {
    console.error(`Error while riding transport `, err.message);
    next(err);
  }
});

/* GET transport methods */
router.get('/list', async function(req, res, next) {
  try {
    res.json(await transport.list());
  } catch (err) {
    console.error(`Error while getting transport list `, err.message);
    next(err);
  }
});

module.exports = router;