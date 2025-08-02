const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

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

  router.get('/:id/wait-time', async (req, res) => {
    const { id } = req.params;
    const waitTimes = db.collection('wait_times');

    try {
      const objectId = new ObjectId(id);

      const twoHoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 2);

      const recentWaits = await waitTimes
        .find({
          facility_id: objectId,
          submitted_at: { $gte: twoHoursAgo }
        })
        .toArray();

      if (recentWaits.length === 0) {
        return res.json({ average: null, count: 0 });
      }

      const total = recentWaits.reduce((sum, wt) => sum + wt.wait_minutes, 0);
      const average = total / recentWaits.length;

      res.json({
        average: Math.round(average),
        count: recentWaits.length
      });
    } catch (err) {
      console.error('❌ Error getting average wait time:', err);
      res.status(500).json({ error: 'Invalid facility ID or server error' });
    }
  });

  return router;
};