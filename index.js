const fs = require('fs')
const csvParser = require('csv-parser')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('biometrics.db')
const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

app.use(express.json())
app.use(cors())

db.serialize(()=> {
    db.run('CREATE TABLE IF NOT EXISTS patient_data (age INTEGER , cholesterol INTEGER , blood_pressure TEXT )');

})

//file path

const csvFilePath = 'dataset.csv'

fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', (row) => {
        db.run(
                `INSERT INTO patient_data (age, cholesterol, blood_pressure) VALUES (?,?,?)`, [row.age, row.cholesterol_level, row.blood_pressure]
        )
    .on('end', () => {
        console.log(`Data from ${csvFilePath} successfully saved to ${biometrics.db}`);
    })
    })
 

//verification

app.get('/hbca/display', (req, res) => {
    db.all('SELECT age, cholesterol, blood_pressure FROM patient_data', (err, rows) => {
        if (err) {
            res.status(500).json({ message: err.message });
        } else {
            rows.forEach(row => {
                console.log(`${row.age}, ${row.cholesterol}, ${row.blood_pressure}`);
            });
            res.json({ data: rows });
        }
    })
})


app.listen(port, ()=> {
    console.log(`listening on port ${port} ... `);
});