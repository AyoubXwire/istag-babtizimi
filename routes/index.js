const express  = require('express')
const router   = express.Router()

const { previewString, prettyDateTime } = require('../helpers/functions')

router.get('/', (req, res, next) => {
    let command = `SELECT id, title, created_at, content
    FROM posts WHERE pending = ? AND post_type = 1
    ORDER BY id DESC LIMIT 5;
    SELECT id, code, nom, description FROM secteurs;
    SELECT COUNT(id) AS users FROM users WHERE power = ?;
    SELECT COUNT(id) AS admins FROM users WHERE power = ?;`
    let params = [false, 1, 2]
    
    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, params, (err, rows) => {
            if(err) return res.render('error', { err })

            let posts = rows[0]
            let secteurs = rows[1]
            let nombreUtilisateurs = rows[2][0].users
            let nombreAdministrateurs = rows[3][0].admins

            posts.forEach(post => {
                post.title = previewString(post.title)
                post.created_at = prettyDateTime(post.created_at)
            })

            res.render('index', { posts, secteurs, nombreUtilisateurs, nombreAdministrateurs })
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