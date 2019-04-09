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
const pool = require('./config/pool')

// Session
app.use(require('./config/session'))

// Passport
require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

// Global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})

// Load routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/actualites', require('./routes/actualites'))
app.use('/filieres', require('./routes/filieres'))
app.use('/administration', require('./routes/administration'))

// Listener
app.listen(process.env.PORT || 3000, () => console.log('server running..'))


let command = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER NOT NULL auto_increment,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        power INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (id)
    );

    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER NOT NULL auto_increment,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        pending BOOL DEFAULT true,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
    );

    create table IF NOT EXISTS secteurs (
        id int NOT NULL AUTO_INCREMENT,
        code varchar(255) NOT NULL,
        nom varchar(255) NOT NULL,
        description TEXT NOT NULL,
        PRIMARY KEY (id)
    );

    create table IF NOT EXISTS filieres (
        id int NOT NULL AUTO_INCREMENT,
        code varchar(255) NOT NULL,
        nom varchar(255) NOT NULL,
        description TEXT NOT NULL,
        id_secteur int NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (id_secteur) REFERENCES secteurs(id)
    );

    create table IF NOT EXISTS modules (
        id int NOT NULL AUTO_INCREMENT,
        nom varchar(255) NOT NULL,
        id_filiere int NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (id_filiere) REFERENCES filieres(id)
    );

    update users set power = 3 where username = admin;
`
    
let params = []

pool.getConnection((error, connection) => {
    if(error) throw error

    connection.query(command, params, (error, rows) => {
        if(error) throw error
        let data = rows

        // code here
        connection.release()
    })
})
