
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MyNewPassword@123',
    database: 'saltshare_db'
});

db.connect((err) => {
    if (err) {
        console.log('MySQL connection failed:', err);
    } else {
        console.log('MySQL connected successfully!');
    }
});

module.exports = db;
