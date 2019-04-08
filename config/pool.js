const mysql = require('mysql')

let pool;

if(process.env === 'production') {
    pool = mysql.createPool({
        connectionLimit : 100,
        host     : 'sql7.freesqldatabase.com',
        user     : 'sql7286630',
        password : 'fjbuICKb4e',
        database : 'sql7286630',
        multipleStatements: true
    })
} else {
    pool = mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : 'xwire',
        database : 'babtizimi',
        multipleStatements: true
    })
}

module.exports = pool