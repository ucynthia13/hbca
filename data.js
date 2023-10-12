const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('biometrics');

db.all('SELECT * FROM user_data', (err, rows)=> {
    if(err){
        console.error(err.message);
        return;
    }

    rows.forEach(row => {
        console.log(`Id: ${row.national_id}, Name: ${row.patient_name}, Frequent Sickness: ${row.frequent_sickness}, Body temperature: ${row.body_temperature}, Heart rate: ${row.heart_rate} `);
    })

    db.close();
})

