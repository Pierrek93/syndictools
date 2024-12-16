console.log('Server.js is successfully loaded');

const express = require("express");
const mysql = require('mysql2');
const cors = require("cors");
const confidentialInfo = require('./js/confidential');

const app = express();
const PORT = 3000;

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

// Endpoint to fetch data from the 'buildings_info' table
app.get('/buildings_info', (req, res) => {
  const { fields, building_name } = req.query;

  const selectedFields = fields || '*';
  const buildingFilter = building_name ? `WHERE building_name = '${building_name}'` : '';

  const query = `SELECT ${selectedFields} FROM buildings_info ${buildingFilter}`;

  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
      return;
    }
    res.json(results);
  });
});

// Endpoint to post to buildings_info database
app.post("/buildings_info", (req, res) => {
  console.log(`POST /buildings_info request received`);

  const newBuilding = req.body; 
  console.log("New building data:", newBuilding);

  const query = 'INSERT INTO buildings_info (building_name, building_bce, building_address) VALUES (?, ?, ?)';
  const params = [newBuilding.name, newBuilding.bce, newBuilding.address];

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Error inserting building:', err);
      res.status(500).json({ error: 'Failed to add building to database' });
      return;
    }

    res.status(201).json({
      message: 'Building added successfully',
      building: {
        name: newBuilding.name, 
        bce: newBuilding.bce, 
        address: newBuilding.address
      } 
    });
  });
});

// Endpoint to update a building's information
app.put('/buildings_info', (req, res) => {
  const buildings = req.body; 

  console.log('Received buildings for modification: ', buildings);

  buildings.forEach(building => {
    const {
      building_id, 
      building_name, 
      building_bce, 
      building_address, 
      gas_meter, 
      electricity_meter, 
      building_year
    } = building;

    const fieldsToUpdate = {
      building_name,
      building_bce,
      building_address,
      gas_meter,
      electricity_meter,
      building_year
    };

    let query = 'UPDATE buildings_info SET ';
    const params = [];

    for (let field in fieldsToUpdate) {
      if (fieldsToUpdate[field] !== undefined) {
        query += `${field} = ?, `;
        params.push(fieldsToUpdate[field]);
      }
    }

    query = query.slice(0, -2); 

    query += ' WHERE building_id = ?';
    params.push(building_id);

    console.log('Executing query:', query);
    console.log('With parameters:', params);

    connection.query(query, params, (err, results) => {
      if (err) {
        console.error('Error updating building info:', err);
        res.status(500).json({ error: 'Failed to update building information' });
        return;
      }
    });
  });

  res.json({ message: 'Building information updated successfully' });
});

// Endpoint to delete a building
app.delete('/buildings_info', (req, res) => {
  console.log(`DELETE /buildings_info request received`);

  const toBeDeletedBuilding = req.body;
  console.log("to be deleted building:", toBeDeletedBuilding);

  const query = `DELETE FROM buildings_info WHERE building_name = ? AND building_bce = ?;`;
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
