const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

app.get("/api/message", (req, res) => {
  res.json({ message: "Sent Message." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
