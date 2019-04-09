const session    = require('express-session')
const mysqlStore = require('express-mysql-session')(session)

let sessionStore

sessionStore = new mysqlStore({
    host     : 'sql7.freesqldatabase.com',
    user     : 'sql7286630',
    password : 'fjbuICKb4e',
    database : 'sql7286630'
})
// if(process.env === 'production') {
// } else {
//     sessionStore = new mysqlStore({
//         host     : 'localhost',
//         user     : 'root',
//         password : 'xwire',
//         database : 'babtizimi'
//     })
// }

module.exports = session({
    secret: 'cosmicsecret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
})