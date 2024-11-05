const express = require('express');
const router = express.Router();
const transport = require('../services/transport');

/* login player */
router.post('/', async function(req, res, next) {
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

module.exports = router;