const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors())

//database connection
const db = new sqlite3.Database('biometrics');

db.serialize(()=> {
    db.run('CREATE TABLE IF NOT EXISTS user_data (national_id TEXT PRIMARY KEY , patient_name TEXT , frequent_sickness TEXT , body_temperature INTEGER , heart_rate INTEGER )');

})

app.post('/hbca/register', (req, res)=> {
    const { national_id, patient_name, frequent_sickness, body_temperature, heart_rate  } = req.body;
    console.log('Request body', req.body);

    if(national_id){
            // query to insert data into database
        const statement = db.prepare('INSERT INTO user_data (national_id, patient_name, frequent_sickness, body_temperature, heart_rate) VALUES (?, ?, ?, ?, ?)');

        try{
            statement.run(national_id, patient_name, frequent_sickness, body_temperature, heart_rate);
            statement.finalize();
    
            res.json({  message: "data registered successfully"});

        }catch(err){

        res.status(500).json({message: err.message}); 
        }
    }else{
        res.status(400).json({message: "national_id is required in the request"})
    }

});

app.get('/hbca/display', (req, res) => {
    
    //query for retrieving data
    db.all('SELECT * FROM user_data', (err, rows) => {
        if(err){
            //response if there is an error
            res.status(500).json({message: err.message})
        }
        rows.forEach(row => {
            console.log(`${row.national_id}, ${row.patient_name}, ${row.frequent_sickness}, ${row.body_temperature}, ${row.heart_rate}`);
        })
        res.json({ data: rows});
    });
    
});

app.get('/hbca/freq_disease', (res, req) => {
    db.all('SELECT COUNT(*) as patients FROM user_data GROUP BY frequent_data ORDER BY patients DESC LIMIT 1' , (err, rows) => {
        if(err){
            res.status(500).json({ message: err.message})
        }
        rows.forEach(row => {
            console.log(`${row.patient_name}, ${row.frequent_sickness}, ${row.body_temperature}, ${row.heart_rate}`);
        })
        res.json({ data: rows})
    })
})


app.listen(port, ()=> {
    console.log(`listening on port ${port} ... `);
});