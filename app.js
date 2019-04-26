const path       = require('path')
const express    = require('express')
const passport   = require('passport')
const flash      = require('connect-flash')
const fileUpload = require('express-fileupload')
const morgan     = require('morgan')

const app = express()

// Config & middleware
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(flash())
app.use(fileUpload())
app.use(morgan('short'))

// Connect to database
global.pool = require('./config/pool')

// Session
app.use(require('./config/session'))

// Passport
require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

// Global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

// Load routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/actualites', require('./routes/actualites'))
app.use('/filieres', require('./routes/filieres'))
app.use('/admin', require('./routes/admin'))

app.get('*', (req, res) => {
    res.status(404).render('404')
})

// Listener
app.listen(process.env.PORT || 3000, () => console.log('server running..'))