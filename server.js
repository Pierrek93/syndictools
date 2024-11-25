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

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(express.json());

// Endpoint to fetch data from the 'buildings' table
app.get('/buildings', (req, res) => {
  connection.query('SELECT * FROM buildings', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
      return;
    }
    res.json(results);
  });
});

// Endpoint to post buildings to the database
app.post("/buildings", (req, res) => {
  console.log(`POST /buildings request received`);

  const newBuilding = req.body; 
  console.log("New building data:", newBuilding);

  const query = 'INSERT INTO buildings (name, bce, adress) VALUES (?, ?, ?)';
  const params = [newBuilding.name, newBuilding.bce, newBuilding.adress];

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Error inserting building:', err);
      res.status(500).json({ error: 'Failed to add building to database' });
      return;
    }

    res.status(201).json({
      message: 'Building added successfully',
      building: {
        // id: newBuilding.id, 
        name: newBuilding.name, 
        bce: newBuilding.bce, 
        adress: newBuilding.adress
      } 
    });
  });
});

// Endpoint to delete a building
app.delete('/buildings', (req, res) => {
  console.log(`DELETE /building request received`);

  const toBeDeletedBuilding = req.body;
  console.log("to be deleted building:", toBeDeletedBuilding);

  const query = `DELETE FROM buildings WHERE name = ? AND bce = ?;`;
  const params = [toBeDeletedBuilding.name, toBeDeletedBuilding.bce];

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Error deleting building:', err);
      res.status(500).json({ error: 'Failed to delete building from database' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Building not found' });
    } else {
      res.status(200).json({ message: 'Building deleted successfully' });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
