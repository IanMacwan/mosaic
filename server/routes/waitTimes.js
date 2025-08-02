const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = (db) => {
  const waitTimes = db.collection('wait_times');

  router.post('/', async (req, res) => {
    const { facility_id, wait_minutes, confidence } = req.body;

    if (!facility_id || !wait_minutes) {
      return res.status(400).json({ error: 'Missing facility_id or wait_minutes' });
    }

    try {
      const waitTimeDoc = {
        facility_id: new ObjectId(facility_id),
        wait_minutes: parseInt(wait_minutes),
        submitted_at: new Date(),
        submitted_by_ip: req.ip || 'Anon',
        confidence: confidence || 'low'
      };

      const result = await waitTimes.insertOne(waitTimeDoc);
      res.status(201).json({ success: true, id: result.insertedId });
    } catch (err) {
      console.error('❌ Failed to insert wait time:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
