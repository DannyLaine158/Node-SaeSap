const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'usuarios'
});

connection.connect(err => {
    if (err) throw err;
    console.log("Conectado a Mysql");
});

module.exports = connection;