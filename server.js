console.log('Server.js is successfully loaded');

const express = require("express");
const mysql = require('mysql2');
const cors = require("cors");
const axios = require('axios');
const confidentialInfo = require('./confidential');

const app = express();
const PORT = 3000;

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: confidentialInfo.password,  
  database: confidentialInfo.database 
});

// Connect to the MySQL server
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Enable CORS for specific origin (your frontend)
app.use(cors({ origin: "http://127.0.0.1:5500" }));

// Parse JSON requests
app.use(express.json());

// Endpoint to fetch data from the 'buildings' table
app.get('/buildings', (req, res) => {
  // SQL query to fetch all buildings from the database
  connection.query('SELECT * FROM buildings', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
      return;
    }
    res.json(results); // Send the results back to the client
  });
});

// Endpoint to post buildings to the database
app.post("/buildings", (req, res) => {
  console.log("POST /buildings request received");

  const newBuilding = req.body;  // Get the building data from the request body
  console.log("New building data:", newBuilding);

  // SQL query to insert a new building into the 'buildings' table
  const query = 'INSERT INTO buildings (id, name, bce, adress) VALUES (?, ?, ?, ?)';
  const params = [newBuilding.id, newBuilding.name, newBuilding.bce, newBuilding.adress];

  // Execute the query
  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Error inserting building:', err);
      res.status(500).json({ error: 'Failed to add building to database' });
      return;
    }

    // Send back a response with the new building data and auto-generated ID
    res.status(201).json({
      message: 'Building added successfully',
      building: { id: newBuilding.id, ...newBuilding } // Return the new building data
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
