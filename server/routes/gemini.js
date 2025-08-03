const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ObjectId } = require('mongodb');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const db = req.app.get('db');
  const facilities = db.collection('facilities');
  const waitTimes = db.collection('wait_times');

  const { prompt, userLat, userLng } = req.body;

  if (!prompt || userLat === undefined || userLng === undefined) {
    return res.status(400).json({ error: 'Missing prompt or user coordinates' });
  }



  let parsed = {};
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([
      `You are an assistant that extracts structured search queries from natural language.

        Prompt: "${prompt}"

        Respond ONLY with a valid JSON object in this format:
        {
        "facility_type": "clinic" | "pharmacy" | "urgent care" | "hospital",
        "max_wait_minutes": number,
        "max_distance_km": number
        }`,
    ]);

    const text = result.response.text().replace(/```json|```/g, '').trim();
    parsed = JSON.parse(text);
  } catch (err) {
    return res.status(500).json({ error: 'Gemini parsing failed', raw: err.message });
  }

  // ✅ Robust default fallback
  let facility_type = parsed.facility_type || 'clinic';
  let max_wait_minutes = typeof parsed.max_wait_minutes === 'number' ? parsed.max_wait_minutes : 30;
  let max_distance_km = typeof parsed.max_distance_km === 'number' ? parsed.max_distance_km : 5;


  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    // 1. Aggregate recent wait times by facility
    const waitSummary = await waitTimes.aggregate([
      { $match: { submitted_at: { $gte: twoHoursAgo } } },
      {
        $group: {
          _id: '$facility_id',
          avg_wait: { $avg: '$wait_minutes' }
        }
      },
      { $match: { avg_wait: { $lte: max_wait_minutes } } }
    ]).toArray();


    const matchingFacilityIds = waitSummary.map(w => w._id);
    if (matchingFacilityIds.length === 0) {
       return res.json({ query: { facility_type, max_wait_minutes, max_distance_km }, results: [] });
    }

    // 2. Find matching facilities by type and spatial proximity
    const nearbyFacilities = await facilities.find({
      _id: { $in: matchingFacilityIds },
      type: facility_type,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [userLng, userLat]
          },
          $maxDistance: max_distance_km * 1000 // meters
        }
      }
    }).toArray();


    return res.json({
      query: { facility_type, max_wait_minutes, max_distance_km },
      count: nearbyFacilities.length,
      results: nearbyFacilities
    });
  } catch (err) {
    return res.status(500).json({ error: 'Search failed', message: err.message });
  }
});

module.exports = router;

