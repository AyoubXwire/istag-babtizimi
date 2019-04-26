const session    = require('express-session')
const mysqlStore = require('express-mysql-session')(session)

let sessionStore

if(process.env.NODE_ENV === 'production') {
    sessionStore = new mysqlStore({
        host     : 'remotemysql.com',
        user     : 'm9jdJTXR5Q',
        password : 'r6TxyCm5Hl',
        database : 'm9jdJTXR5Q'
    })
} else {
    sessionStore = new mysqlStore({
        host     : 'localhost',
        user     : 'root',
        password : '1234',
        database : 'babtizimi'
    })
}

module.exports = session({
    secret: 'cosmicsecret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
})