const express  = require('express')
const router   = express.Router()

const pool = require('../config/pool')
const { previewString, prettyDateTime } = require('../helpers/display')

router.get('/', (req, res) => {
    let command = `SELECT id, title, created_at, content
    FROM posts WHERE pending = ?
    ORDER BY id DESC LIMIT 5;
    SELECT id, code, nom, description FROM secteurs;`
    let params = [false]
    
    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error
            let posts = rows[0]
            let secteurs = rows[1]

            posts.forEach(post => {
                post.title = previewString(post.title)
                post.created_at = prettyDateTime(post.created_at)
            })

            res.render('index', { posts, secteurs })
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

module.exports = router