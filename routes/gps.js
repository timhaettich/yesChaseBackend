const express = require('express');
const router = express.Router();
const gps = require('../services/gps');

/* GPS Logger */
router.post('/log', async function(req, res, next) {
  try {
    const userId = req.user.userId
    const longitude = req.body.longitude
    const latitude = req.body.latitude

    res.json(await gps.log(longitude, latitude, userId));
  } catch (err) {
    console.error(`Error while logging GPS `, err.message);
    next(err);
  }
});


/* GET user routes */
router.get('/routes', async function(req, res, next) {
  try {
    res.json(await gps.routes());
  } catch (err) {
    console.error(`Error while getting active cars `, err.message);
    next(err);
  }
});

module.exports = router;