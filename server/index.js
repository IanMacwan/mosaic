const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const facilitiesRoute = require('./routes/facilities');

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URL
const client = new MongoClient(uri);

async function startServer() {
  try {
    await client.connect();
    const db = client.db('mosaic');

    app.use('/api/facilities', facilitiesRoute(db));

    app.listen(3000, () => console.log('✅ Server running on port 3000'));
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

startServer();
