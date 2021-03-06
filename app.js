process.env.NODE_ENV = 'production'

const path        = require('path')
const express     = require('express')
const compression = require('compression')
const passport    = require('passport')
const session     = require('express-session')
const mysqlStore  = require('express-mysql-session')(session)
const flash       = require('connect-flash')
const fileUpload  = require('express-fileupload')
const http        = require('http')
const socketio    = require('socket.io')
const morgan      = require('morgan')

const app    = express()
const server = http.createServer(app)
const io     = socketio(server)

// Config & middleware
app.use(compression({
    level: 9,
    threshold: 0,
    filter: () => true
}))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(flash())
app.use(fileUpload())
app.use(morgan('dev'))

// Database
require('./config/sequelize')

// Session
app.use(session({
    secret: 'cosmicsecret',
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore({
        host     : 'localhost',
        user     : 'root',
        password : 'password',
        database : 'babtizimi'
    })
}))

// Passport
require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

// Socket
let onlineCount = 0
io.on('connection', socket => {
    socket.on('disconnect', () => {
        onlineCount = socket.client.conn.server.clientsCount
        io.emit('countUpdated', onlineCount)
    })
    
    onlineCount = socket.client.conn.server.clientsCount
    io.emit('countUpdated', onlineCount)
})

// Global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null
    res.locals.onlineCount = onlineCount
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

// Load routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/actualites', require('./routes/actualites'))
app.use('/pedagogique', require('./routes/pedagogique'))
app.use('/emplois', require('./routes/emplois'))
app.use('/filieres', require('./routes/filieres'))
app.use('/admin', require('./routes/admin'))

// 404
app.get('*', (req, res) => {
    res.status(404).render('404')
})

// Server
server.listen(3000, () => console.log(`server running in ${process.env.NODE_ENV} environment`))