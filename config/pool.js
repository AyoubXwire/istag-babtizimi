const mysql = require('mysql')

let pool;

if(process.env === 'production') {
    pool = mysql.createPool({
        host     : 'sql7.freesqldatabase.com',
        user     : 'sql7286630',
        password : 'fjbuICKb4e',
        database : 'sql7286630'
    })
} else {
    pool = mysql.createPool({
        host     : 'localhost',
        user     : 'root',
        password : 'xwire',
        database : 'babtizimi'
    })
}

module.exports = pool