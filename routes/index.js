const express  = require('express')
const router   = express.Router()
const bcrypt   = require('bcrypt')
const passport = require('passport')

const auth = require('../middleware/auth')
const pool = require('../config/pool')

router.get('/', (req, res) => {
    let command = `SELECT id, title, created_at, content
    FROM posts ORDER BY id DESC LIMIT 5;
    SELECT id, code, nom, description FROM secteurs;`
    
    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, (error, rows, fields) => {
            if(error) throw error
            let posts = rows[0]
            let secteurs = rows[1]

            posts.forEach(post => {
                post.created_at = prettyDateTime(post.created_at)
            })

            res.render('index', { posts, secteurs })
            connection.release()
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
            let posts = rows

            posts.forEach(post => {
                post.content = previewString(post.content)
                post.created_at = prettyDateTime(post.created_at)
            })
            res.render('actualites', { posts })
            connection.release()
        })
    })
})

router.get('/actualite/new', auth, (req, res) => {
    res.render('editor')
})

router.post('/actualite/new', auth, (req, res) => {
    const command = `INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)`
    const params = [req.body.title, req.body.content, req.user.id]

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows, fields) => {
            if(error) throw error

            res.redirect('/actualites')
            connection.release()
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
            let post = rows[0]

            post.created_at = prettyDateTime(post.created_at)
            res.render('actualite', { post })
            connection.release()
        })
    })
})

router.get('/actualite/delete/:id', (req, res) => {
    const command = `DELETE FROM posts WHERE id = ?`
    const params = [req.params.id]

    pool.getConnection((error, connection) => {
        if(error) throw err

        connection.query(command, params, (error, rows, fields) => {
            if(error) throw err
            
            res.redirect('/actualites')
            connection.release()
        })
    })
})

router.get('/filieres', (req, res) => {
    let command
    let params = []
    
    if(req.query.secteur) {
        command = `SELECT id, code, nom FROM filieres WHERE id_secteur = ?`
        params = [req.query.secteur]
    } else {
        command = `SELECT id, code, nom FROM filieres`
    }

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows, fields) => {
            if(error) throw error
            let filieres = rows

            res.render('filieres', { filieres })
            connection.release()
        })
    })
})

router.get('/filiere/:id', (req, res) => {
    let command = `SELECT code, nom, description FROM filieres WHERE id = ?;
    SELECT nom FROM modules WHERE id_filiere = ?;`
    let params = [req.params.id, req.params.id]

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows, fields) => {
            if(error) throw error
            let filiere = rows[0][0]
            let modules = rows[1]
            
            res.render('filiere', { filiere, modules })
            connection.release()
        })
    })
})

router.get('/administration', (req, res) => {
    let command = `SELECT COUNT(id) AS numPosts FROM posts;
    SELECT COUNT(id) AS numUsers FROM users WHERE power = ?;
    SELECT COUNT(id) AS numAdmins FROM users WHERE power > ?;`
    let params = [1, 1]

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows, fields) => {
            if(error) throw error
            let numPosts = rows[0][0].numPosts
            let numUsers = rows[1][0].numUsers
            let numAdmins = rows[2][0].numAdmins

            res.render('administration', { numPosts, numUsers, numAdmins })
            connection.release()
        })
    })
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
        .catch(err => { throw err })
    })
    .catch(err => { throw err })
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