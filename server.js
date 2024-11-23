console.log('Server.js is successfully loaded');

const express = require("express");
const { getBuildings } = require("./database");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Enable CORS for specific origin (your frontend)
app.use(cors({ origin: "http://127.0.0.1:5500" }));

// Parse JSON requests
app.use(express.json());

// Endpoint to fetch buildings
app.get("/buildings", (req, res) => {
    console.log("GET /buildings request received");
    res.json(getBuildings());
  });  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
