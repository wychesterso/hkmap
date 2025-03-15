const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express(); // Express.js framework
const db = new sqlite3.Database('./locations.db');

app.use(cors());
app.use(express.json());

// GET all locations
app.get('/locations', (req, res) => {
  db.all('SELECT * FROM locations', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST a new location
app.post('/locations', (req, res) => {
  const { name, district, lat, lng } = req.body;
  if (!name || !district || !lat || !lng) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  db.run('INSERT INTO locations (name, district, lat, lng) VALUES (?, ?, ?, ?)', [name, district, lat, lng], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name, district, lat, lng });
  });
});

// PUT (Update a location)
app.put('/locations/:id', (req, res) => {
  const { id } = req.params;
  const { name, district, lat, lng } = req.body;
  db.run('UPDATE locations SET name = ?, district = ?, lat = ?, lng = ? WHERE id = ?',
    [name, district, lat, lng, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Location updated' });
    }
  );
});

// DELETE a location
app.delete('/locations/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM locations WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Location deleted' });
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));