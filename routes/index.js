const express  = require('express')
const router   = express.Router()

const { previewString, prettyDateTime } = require('../helpers/functions')

router.get('/', (req, res, next) => {
    let command = `SELECT id, title, created_at, content
    FROM posts WHERE pending = ?
    ORDER BY id DESC LIMIT 5;
    SELECT id, code, nom, description FROM secteurs;`
    let params = [false]
    
    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, params, (err, rows) => {
            if(err) return res.render('error', { err })

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

router.get('/reglement', (req, res) => {
    res.render('reglement')
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

router.get('/empty', (req, res) => {
    res.render('empty')
})

module.exports = router