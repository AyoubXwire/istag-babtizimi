const mysql = require('mysql')

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'xwire',
    database : 'babtizimi'
})

connection.connect(() => {
    console.log('Database connected')
})

module.exports = connection