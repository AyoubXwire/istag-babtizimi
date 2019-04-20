const mysql = require('mysql')

let pool

if(process.env.NODE_ENV === 'production') {
    pool = mysql.createPool({
        connectionLimit : 100,
        host     : 'remotemysql.com',
        user     : 'm9jdJTXR5Q',
        password : 'r6TxyCm5Hl',
        database : 'm9jdJTXR5Q',
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