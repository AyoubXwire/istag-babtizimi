const path     = require('path')
const express  = require('express')
const passport = require('passport')
const morgan   = require('morgan')

const app = express()

// Config & middleware
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(morgan('short'))

// Connect to database
require('./config/pool')

// Session
app.use(require('./config/session'))

// Passport
require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

// Load routes
app.use('/', require('./routes/index'))

// Listener
app.listen(process.env.PORT || 3000, () => console.log('server running..'))

/*
const command = ``
const params = []

pool.getConnection((error, connection) => {
    if(error) throw err

    connection.query(command, params, (error, rows, fields) => {
        if(error) throw err

        // code here
        connection.release()
    })
})
*/