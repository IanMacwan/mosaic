const express = require('express');
const router = express.Router();

module.exports = (db) => {
  const facilities = db.collection('facilities');

  router.get('/nearby', async (req, res) => {
    const { lng, lat } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ error: 'Missing lat/lng' });
    }

    try {
      const results = await facilities.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: 5000, // meters
          }
        }
      }).limit(20).toArray();

      res.json(results);
    } catch (err) {
      console.error('❌ Error fetching nearby facilities:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};