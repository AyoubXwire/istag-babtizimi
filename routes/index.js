const express  = require('express')
const router   = express.Router()
const bcrypt   = require('bcrypt')
const passport = require('passport')

const auth = require('../middleware/auth')
const pool = require('../config/pool')

router.get('/', (req, res) => {
    const command = `SELECT id, title, created_at, content
    FROM posts
    ORDER BY id DESC
    LIMIT 5`
    
    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, (error, rows, fields) => {
            if(error) throw error

            rows.forEach(row => {
                row.created_at = prettyDateTime(row.created_at)
            })
            connection.release()
            res.render('index', { posts: rows })
        })
    })
})

router.get('/actualites', (req, res) => {
    let command
    let params = []

    if(req.query.search) {
        command = `SELECT p.id, title, content, p.created_at, username
        FROM posts p JOIN users u ON p.user_id = u.id
        WHERE title LIKE ?
        ORDER BY p.id DESC`
        params = [`%${req.query.search}%`]
    } else {
        command = `SELECT p.id, title, content, p.created_at, username
        FROM posts p JOIN users u ON p.user_id = u.id
        ORDER BY p.id DESC`
    }

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows, fields) => {
            if(error) throw error
            
            rows.forEach(row => {
                row.content = previewString(row.content)
                row.created_at = prettyDateTime(row.created_at)
            })
            connection.release()
            res.render('actualites', { posts: rows })
        })
    })
})

router.get('/actualites/new', (req, res) => {
    res.render('editor')
})

router.post('/actualites/new', (req, res) => {
    const command = `INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)`
    const params = [req.body.title, req.body.content, req.user.id]

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows, fields) => {
            if(error) throw error

            connection.release()
            res.redirect('/actualites')
        })
    })
})

router.get('/actualite/:id', (req, res) => {
    const command = `SELECT p.id, title, content, p.created_at, username
    FROM posts p JOIN users u ON p.user_id = u.id
    WHERE p.id = ?`
    const params = [req.params.id]

    pool.getConnection((error, connection) => {
        if(error) throw err

        connection.query(command, params, (error, rows, fields) => {
            if(error) throw err

            rows[0].created_at = prettyDateTime(rows[0].created_at)
            res.render('actualite', { post: rows[0] })
            connection.release()
        })
    })
})

router.get('/filieres', (req, res) => {
    res.render('filieres')
})

router.get('/inscription', (req, res) => {
    res.render('inscription')
})

router.get('/apropos', (req, res) => {
    res.render('apropos')
})

router.get('/contact', (req, res) => {
    res.render('contact')
})

router.post('/email', (req, res) => {
    // nodemailer here
})

// Users routes *****************************************
router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/register', (req, res) => {
    bcrypt.genSalt(10)
    .then(salt => {
        bcrypt.hash(req.body.password, salt)
        .then(hash => {
            const command = `INSERT INTO users (username, password) VALUES (?, ?)`
            const params = [req.body.username, hash]

            pool.getConnection((error, connection) => {
                if(error) throw err
        
                connection.query(command, params, (error, rows, fields) => {
                    if(error) throw err
        
                    passport.authenticate('local')(req, res, () => {
                        res.redirect('/')
                    })
                    connection.release()
                })
            })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

router.get('/logout', auth, (req, res) => {
    req.logOut()
    res.redirect('/login')
})

// Functions ******************************
const prettyDateTime = (dt) => {
    const day = dt.getDate() < 10 ? `0${dt.getDate()}` : `${dt.getDate()}`
    const month = dt.getMonth() + 1 < 10 ? `0${dt.getDate()}` : `${dt.getDate()}`
    const year = dt.getFullYear()
    const hours = dt.getHours() < 10 ? `0${dt.getHours()}` : `${dt.getHours()}`
    const minutes = dt.getMinutes() < 10 ? `0${dt.getMinutes()}` : `${dt.getMinutes()}`

    return `${day}-${month}-${year} ${hours}:${minutes}`
}

const previewString = (str) => {
    const previewLength = 80

    if(str.length > previewLength) {
        return `${str.substring(0, previewLength)}...`
    } else {
        return str.substring(0, previewLength)
    }
}

module.exports = router