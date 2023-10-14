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
    db.run('CREATE TABLE IF NOT EXISTS user_data (national_id TEXT PRIMARY KEY , patient_name TEXT , patient_email TEXT, patient_psw TEXT, frequent_sickness TEXT , body_temperature INTEGER , heart_rate INTEGER )');

})

app.post('/hbca/register', (req, res)=> {
    const { national_id, patient_name, patient_email, patient_psw, frequent_sickness, body_temperature, heart_rate  } = req.body;
    console.log('Request body', req.body);

    if(national_id){
            // query to insert data into database
        const statement = db.prepare('INSERT INTO user_data (national_id, patient_name, patient_email, patient_psw, frequent_sickness, body_temperature, heart_rate) VALUES (?, ?, ?, ?, ?, ?, ?)');

        try{
            statement.run(national_id, patient_name, patient_email, patient_psw, frequent_sickness, body_temperature, heart_rate);
            statement.finalize();
            res.json({  message: "data registered successfully"});
        }catch(err){
        res.status(500).json({message: err.message}); 
        }

    }else{
        res.status(400).json({message: "national_id is required in the request"})
    }

});

app.post('/hbca/login', (req, res) => {
    const { email, psw } = req.body;

    if(!email || !psw){
        res.status(400).json({ message: "provide credentials"})
    }

    db.all('SELECT patient_name, frequent_sickness, body_temperature, heart_rate FROM user_data WHERE patient_email = ? and patient_psw = ?', [email, psw], (err, data)=> {
        if(err){
            console.error(err.message);
        }
        if(data){
            res.status(200).json({ message: "login successful"})
        }
        res.status(401).json({ message: "invalid credentials"})
    })
})


app.get('/hbca/display', (req, res) => {
    
    //query for retrieving data
    db.all('SELECT national_id, patient_name, patient_email, frequent_sickness, body_temperature, heart_rate FROM user_data', (err, rows) => {
        if(err){
            //response if there is an error
            res.status(500).json({message: err.message})
        }

            rows.forEach(row => {
                // console.log(`${row.national_id}, ${row.patient_name}, ${row.frequent_sickness}, ${row.body_temperature}, ${row.heart_rate}`);
            })
            res.json({ data: rows});
    });
    
});

    app.get('/hbca/freq_disease', (req, res) => {
        db.all('SELECT frequent_sickness FROM user_data GROUP BY frequent_sickness HAVING COUNT(*) > 1 ' , (err, rows) => {
            if(err){
                res.status(500).json({ message: err.message});
                return;
            }

            if(rows.length === 0){
                res.json({ message: "No frequent illness"})
            }
            
            //get diseases
            const frequent_diseases = rows.map( row => row.frequent_sickness);
            
            db.all(`SELECT patient_name, frequent_sickness, body_temperature, heart_rate FROM user_data WHERE frequent_sickness IN (${frequent_diseases.map(item => '?').join(',')}) `, frequent_diseases, (err, data ) => {
                if(err){
                    res.status(500).json({ message: err.message})
                }

                data.forEach(row => {
                    console.log(`${row.patient_name}, ${row.frequent_sickness}, ${row.body_temperature}, ${row.heart_rate}`);

                })
                res.json({ data: data})
            })
        })
    })


app.listen(port, ()=> {
    console.log(`listening on port ${port} ... `);
});