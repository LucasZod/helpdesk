const mysql = require('mysql2');

var pool = mysql.createPool({
    "user": 'root',
    "password": 'admin',
    "database": 'ged',
    "host": 'localhost',
    "port": 3306,
    "queueLimit": 0,
    "connectionLimit": 0
});

exports.pool = pool;