const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());

// Create a single database connection
const db = new sqlite3.Database('biometrics');

// Ensure that the database connection is opened before handling routes
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS user_data(national_id INTEGER PRIMARY KEY, patient_name TEXT, frequent_sickness TEXT, body_temperature INTEGER, heart_rate INTEGER)');
});

app.post('/hbca/addData', (req, res) => {
  const { national_id, patient_name, frequent_sickness, body_temperature, heart_rate } = req.body;

  // Use the existing database connection
  const statement = db.prepare('INSERT INTO user_data (national_id, patient_name, frequent_sickness, body_temperature, heart_rate) VALUES (?, ?, ?, ?, ?)');
  statement.run(national_id, patient_name, frequent_sickness, body_temperature, heart_rate);
  statement.finalize();

  res.json({ message: "Data registered successfully" });
});

app.get('/hbca/getData', (req, res) => {
  // Use the existing database connection
  db.all('SELECT * FROM user_data', (err, rows) => {
    if (err) {
      res.status(500).json({ message: err.message });
    }
    res.json({ data: rows });
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port} ... `);
});
