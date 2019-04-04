const session = require('express-session')
const mysqlStore = require('express-mysql-session')(session)

const sessionStore = new mysqlStore({
    host: 'localhost',
    user: 'root',
    password: 'xwire',
    database: 'babtizimi'
})

module.exports = session({
    secret: 'cosmicsecret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
})