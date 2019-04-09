const mysql = require('mysql')

let pool

pool = mysql.createPool({
    connectionLimit : 100,
    host     : 'sql7.freesqldatabase.com',
    user     : 'sql7286630',
    password : 'fjbuICKb4e',
    database : 'sql7286630',
    multipleStatements: true
})
// if(process.env === 'production') {
// } else {
//     pool = mysql.createPool({
//         connectionLimit : 100,
//         host     : 'localhost',
//         user     : 'root',
//         password : 'xwire',
//         database : 'babtizimi',
//         multipleStatements: true
//     })
// }

module.exports = pool