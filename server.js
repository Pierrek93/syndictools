console.log('Server.js is successfully loaded');

const express = require("express");
const database = require("./database");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Enable CORS for specific origin (your frontend)
app.use(cors({ origin: "http://127.0.0.1:5500" }));

// Parse JSON requests
app.use(express.json());

// Endpoint to fetch buildings list
app.get("/buildings", (req, res) => {
    console.log("GET /buildings request received");
    res.json(database.buildings);
  });  

  app.post("/buildings", (req, res) => {
    console.log("POST /buildings request received");
  
    const newBuilding = req.body;  // Get the building data from the request body
    console.log("New building data:", newBuilding);
  
    // Generate a new ID for the building (simple logic)
    const newId = database.buildings.length + 1;
    newBuilding.id = newId;  // Add the new building ID
  
    database.buildings.push(newBuilding);  // Push the new building to the database
  
    // Send back a response with the new building data
    res.status(201).json({
      message: 'Building added successfully',
      building: newBuilding
    });
  });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
