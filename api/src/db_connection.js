const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '127.1.0.0',
    user: 'root',
    password: '@bcdO123',
    port: '3306'
        // database: 'stiff_money'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});