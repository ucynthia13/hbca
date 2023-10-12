const sqlite3 = require('sqlite3').verbose();
const express = require('express')
const app = express();
const port = 5000;


app.use(express.json());

//database connection
const db = new sqlite3.Database('biometrics');

db.serialize(()=> {
    db.run('CREATE TABLE IF NOT EXISTS user_data(national_id INT PRIMARY_KEY NOT NULL, patient_name TEXT NOT NULL, frequent_sickness TEXT NOT NULL, body_temperature INT NOT NULL, heart_rate INT NOT NULL) ');

})

app.post('/hbca/addData', (req, res)=> {
    const { national_id, patient_name, frequent_sickness, body_temperature, heart_rate  } = req.body;

    if(national_id != null && national_id !== undefined ){
            //query to insert data into database
        const statement = db.prepare('INSERT INTO user_data (national_id, patient_name, frequent_sickness, body_temperature, heart_rate) VALUES (?, ?, ?, ?, ?)');

        try{
            statement.run(national_id, patient_name, frequent_sickness, body_temperature, heart_rate);
            statement.finalize();
    
            res.json({  message: "data registered successfully"});
        }catch(err){

        res.status(500).json({message: err.message});
        }
    }else{
        res.status(400).json({message: "national_id is required"})
    }

});

app.get('/hbca/getData', (req, res) => {
    
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


app.listen(port, ()=> {
    console.log(`listening on port ${port} ... `);
});